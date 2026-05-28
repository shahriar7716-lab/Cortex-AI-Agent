import { Telegraf } from 'telegraf';
import { config, saveConfigValue, getProvider } from '../config';
import { runCommand } from '../execution/shell';
import { processAgentTurn, transcribeAudio, analyzeImage, healCommand, generateProactiveMessage, FailedAttempt } from '../core/agent';
import { addMessageToMemory } from '../core/memory';
import { getCachedCommand, addCommandToCache } from '../core/cache';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

let waitingForApiKey: 'groq' | 'gemini' | null = null;

// প্রো-অ্যাক্টিভ টাইমার ট্র্যাকিং ভ্যারিয়েবলস
let lastMessageTime = Date.now();
let isIdleAlertSent = false;
let activeChatId: number | null = null;

export function startTelegramBot(): void {
    if (!config.telegramToken) {
        console.error("[Cortex] ভুল: .env ফাইলে TELEGRAM_BOT_TOKEN পাওয়া যায়নি!");
        return;
    }

    const bot = new Telegraf(config.telegramToken);

    bot.start((ctx) => {
        activeChatId = ctx.chat.id;
        lastMessageTime = Date.now();
        isIdleAlertSent = false;
        ctx.reply("Cortex BY SHAHRIAR সক্রিয় হয়েছে!\n\nমডেল পরিবর্তন করতে টাইপ করো: `\\<model_name>` (যেমন: `\\gemini-1.5-flash`)\nএপিআই কী সেট করতে লেখো: `\\gemini` অথবা `\\groq`", { parse_mode: 'Markdown' });
    });

    // মেসেজ প্রসেস করার মাস্টার ফাংশন (৩ বারের সেলফ-হিলিং লুপ ও সেফ-ফেল রাইটিং সহ!)
    async function handleUserRequest(ctx: any, userRequest: string) {
        activeChatId = ctx.chat.id;
        lastMessageTime = Date.now(); // টাইমার রিসেট
        isIdleAlertSent = false;

        try {
            const cachedCommand = getCachedCommand(userRequest);
            
            if (cachedCommand) {
                await ctx.reply("⚡ মেমোরি (ক্যাশ) থেকে কমান্ড পাওয়া গেছে! এআই সার্ভার কল না করে সরাসরি ০ সেকেন্ডে রান করা হচ্ছে...");
                let output = "";
                
                if (cachedCommand.startsWith("WRITE_FILE:")) {
                    const lines = cachedCommand.split("\n");
                    const filePathRaw = lines[0].substring("WRITE_FILE:".length).trim();
                    const homeDir = os.homedir();
                    let filePath = filePathRaw.replace(/%USERPROFILE%/g, homeDir);
                    filePath = filePath.replace(/%TEMP%/g, os.tmpdir());
                    let fileContent = lines.slice(1).join("\n");
                    fileContent = fileContent.replace(/```(?:python|py|javascript|js|bash|cmd|sh|powershell)?/gi, "");
                    fileContent = fileContent.trim();
                    fs.writeFileSync(filePath, fileContent, "utf-8");
                    await ctx.reply(`✅ ফাইল তৈরি হয়েছে: \`${filePathRaw}\``, { parse_mode: 'Markdown' });
                } else {
                    await ctx.reply(`🖥️ রানিং কমান্ড (মেমোরি থেকে):\n\n${cachedCommand}`);
                    output = await runCommand(cachedCommand);
                }

                const safeOutput = output.substring(0, 3000) || "(সম্পন্ন হয়েছে)";
                addMessageToMemory('user', userRequest);
                addMessageToMemory('assistant', cachedCommand);
                await ctx.reply(`✅ সম্পন্ন হয়েছে!\n\`\`\`\n${safeOutput}\n\`\`\``, { parse_mode: 'Markdown' });
                return;
            }

            await ctx.reply("🧠 চিন্তা করছি...");
            const result = await processAgentTurn(userRequest);
            console.log(`[Cortex] রাউটার ও ডিসিশন টাইপ: ${result.type}`);

            if (result.type === 'CHAT') {
                addMessageToMemory('user', userRequest);
                addMessageToMemory('assistant', result.content);
                await ctx.reply(result.content);
            } 
            else if (result.type === 'WRITE_FILE') {
                const lines = result.content.split("\n");
                const filePathRaw = lines[0].substring("WRITE_FILE:".length).trim();
                const homeDir = os.homedir();
                let filePath = filePathRaw.replace(/%USERPROFILE%/g, homeDir);
                filePath = filePath.replace(/%TEMP%/g, os.tmpdir());

                let fileContent = lines.slice(1).join("\n");
                fileContent = fileContent.replace(/```(?:python|py|javascript|js|bash|cmd|sh|powershell)?/gi, "");
                fileContent = fileContent.trim();

                try {
                    fs.writeFileSync(filePath, fileContent, "utf-8");
                } catch (writeError: any) {
                    if (writeError.code === 'EPERM') {
                        console.warn("[Cortex] পারমিশন এরর! ব্যক্তিগত ডেক্সটপে ফাইল রাইট করা হচ্ছে...");
                        const fileName = path.basename(filePath);
                        filePath = path.join(homeDir, 'Desktop', fileName);
                        fs.writeFileSync(filePath, fileContent, "utf-8");
                    } else {
                        throw writeError;
                    }
                }
                
                addCommandToCache(userRequest, result.content);

                addMessageToMemory('user', userRequest);
                addMessageToMemory('assistant', `Wrote file to ${filePathRaw}`);
                await ctx.reply(`✅ সফলভাবে ফাইল তৈরি হয়েছে!\nফাইল লোকেশন: \`${filePath}\``, { parse_mode: 'Markdown' });
                
                if (userRequest.toLowerCase().includes("open") || userRequest.includes("ওপেন")) {
                    await runCommand(`start "" "${filePath}"`);
                }
            } 
            else if (result.type === 'COMMAND') {
                let currentCommand = result.content;
                let attempts = 0;
                let success = false;
                let output = "";
                const failedAttempts: FailedAttempt[] = []; 

                while (!success) {
                    try {
                        if (currentCommand === "DANGEROUS") {
                            await ctx.reply("⚠️ এই অনুরোধটি ক্ষতিকর হতে পারে।");
                            return;
                        }

                        await ctx.reply(`🖥️ রানিং কমান্ড (চেষ্টা ${attempts + 1}):\n\n${currentCommand}`);
                        output = await runCommand(currentCommand);
                        success = true; // সফল হলেই কেবল লুপ ভাঙবে!
                        
                        addCommandToCache(userRequest, currentCommand);
                    } catch (error: any) {
                        attempts++;
                        console.error(`[Cortex] চেষ্টা ${attempts} ব্যর্থ হয়েছে:`, error);
                        const errorMsg = error.message || String(error);

                        if (errorMsg.includes("TelegramError") || errorMsg.includes("Bad Request") || errorMsg.includes("parse")) {
                            await ctx.reply(`❌ টেলিগ্রামের নিজস্ব এরর ঘটেছে, লুপ বন্ধ করা হচ্ছে। সর্বশেষ এরর:\n${errorMsg}`);
                            return;
                        }

                        await ctx.reply(`⚠️ ত্রুটি ধরা পড়েছে (চেষ্টা ${attempts}): \`${errorMsg.substring(0, 150)}\`...\n\nCortex নিজে থেকেই এটি সমাধান করার চেষ্টা করছে...`);
                        
                        failedAttempts.push({ command: currentCommand, error: errorMsg });

                        currentCommand = await healCommand(currentCommand, errorMsg, userRequest, failedAttempts);
                    }
                }

                const safeOutput = output.substring(0, 3000) || "(সম্পন্ন হয়েছে)";
                addMessageToMemory('user', userRequest);
                addMessageToMemory('assistant', currentCommand);
                await ctx.reply(`✅ সম্পন্ন হয়েছে!\n\`\`\`\n${safeOutput}\n\`\`\``, { parse_mode: 'Markdown' });
            }
        } catch (error: any) {
            console.error(error);
            const errorMsg = error.message || String(error);
            const safeErrorMsg = errorMsg.substring(0, 3000);
            
            if (errorMsg.includes("429") || errorMsg.includes("limit") || errorMsg.includes("API_KEY") || errorMsg.includes("API key") || errorMsg.includes("notFound") || errorMsg.includes("not found")) {
                const currentProvider = getProvider(config.activeModel);
                await ctx.reply(`⚠️ তোমার ${currentProvider.toUpperCase()} API কী-এর লিমিট শেষ বা কাজ করছে না!\nনতুন কী দেওয়ার জন্য চ্যাটে টাইপ করো: \\${currentProvider}`);
            } else {
                await ctx.reply(`❌ ব্যর্থ হয়েছে:\n\`\`\`\n${safeErrorMsg}\n\`\`\``, { parse_mode: 'Markdown' });
            }
        }
    }

    bot.on('text', (ctx) => {
        const text = ctx.message.text.trim();
        activeChatId = ctx.chat.id;
        lastMessageTime = Date.now();
        isIdleAlertSent = false;

        if (waitingForApiKey) {
            const provider = waitingForApiKey;
            waitingForApiKey = null;
            
            if (provider === 'gemini') {
                saveConfigValue('GEMINI_API_KEY', text);
                ctx.reply("✅ Gemini API Key সেভ হয়েছে!");
            } else {
                saveConfigValue('GROQ_API_KEY', text);
                ctx.reply("✅ Groq API Key সেভ হয়েছে!");
            }
            return;
        }

        if (text.startsWith('\\')) {
            const cmdName = text.substring(1).toLowerCase();

            if (cmdName === 'code') {
                const codingMenu = `💻 *Cortex Advanced Coding Mode* 💻\n\n` +
                    `আমাদের এই প্রজেক্টের কোডিং অ্যাসিস্ট্যান্ট দিয়ে আপনি নিচের কাজগুলো আপনার কম্পিউটারে রিয়েল-টাইমে করতে পারবেন:\n\n` +
                    `১. 🛠️ *স্বয়ংক্রিয় ফাইল রাইটার:* কোনো কোটেশন এরর ছাড়াই ডাইরেক্ট ডেস্কটপে HTML, Python বা Text ফাইল বানিয়ে সেভ করতে পারবেন।\n` +
                    `২. 🔄 *ডায়নামিক স্কিল মেকার:* এআই-কে নিজে নিজেই নতুন ক্ষমতা তৈরি করতে বলতে পারেন (যেমন: কিউআর জেনারেটর, ইমেজ এডিটর), যা সে আজীবন ক্যাশে মনে রাখবে।\n` +
                    `৩. ⚙️ *স্বয়ংক্রিয় সেলф-হিলিং লুপ:* কোডে বা রান টাইমে কোনো ভুল থাকলে এআই নিজেই এরর মেসেজ পড়ে নিজে থেকে তা সংশোধন করে পুনরায় রান করবে!\n` +
                    `৪. ⚡ *কমান্ড ক্যাশিং:* একবার কোনো কাজ সফল হলে এআই তা মুখস্থ করে রাখবে এবং পরের বার ০ সেকেন্ডে এআই কল ছাড়াই সরাসরি রান করবে।\n\n` +
                    `💡 *গুগল জেমিনি মডেল সাজেশন:*\n` +
                    `কোডিংয়ের সেরা বুদ্ধিমত্তা ও পারফরম্যান্সের জন্য গুগল জেমিনি ব্যবহার করা সাজেস্টেড। জেমিনির ফ্রি টায়ার সক্রিয় করতে চ্যাটে নিচের কম্যান্ডটি পাঠিয়ে দিন:\n\n` +
                    `\`\\gemini-1.5-flash\`\n\n` +
                    `*(Sujested: এটি জেমিনির সবচেয়ে সাশ্রয়ী মডেল এবং প্রতিদিন ২০টি ফ্রি রিকোয়েস্ট দেয়)*\n\n` +
                    `অথবা আপনি যদি অন্য কোনো জেমিনি মডেল যেমন \`\\gemini-1.5-pro\` ব্যবহার করতে চান, তাও চ্যাটে টাইপ করে পাঠাতে পারেন।`;

                ctx.reply(codingMenu, { parse_mode: 'Markdown' });
                return;
            }

            if (cmdName === 'gemini') {
                waitingForApiKey = 'gemini';
                ctx.reply("🔑 জেমিনি এপিআই কী (Gemini API Key) লিখে পাঠাও:");
                return;
            }
            if (cmdName === 'groq') {
                waitingForApiKey = 'groq';
                ctx.reply("🔑 গ্রক এপিআই কী (Groq API Key) লিখে পাঠাও:");
                return;
            }

            if (cmdName.startsWith('gemini-') || cmdName.startsWith('llama-') || cmdName.startsWith('mixtral-')) {
                saveConfigValue('ACTIVE_MODEL', cmdName);
                const provider = getProvider(cmdName);
                ctx.reply(`🔄 সফলভাবে মডেল পরিবর্তন করে **${cmdName}** (${provider === 'gemini' ? 'Google Gemini' : 'Groq'}) সেট করা হয়েছে!`, { parse_mode: 'Markdown' });
                return;
            }

            ctx.reply("❌ অজানা কম্যান্ড! সঠিক উদাহরণ: `\\gemini-1.5-flash` অথবা `\\gemini`।", { parse_mode: 'Markdown' });
            return;
        }

        (async () => {
            await handleUserRequest(ctx, text);
        })().catch(err => console.error("Fatal background text error:", err));
    });

    bot.on('voice', (ctx) => {
        activeChatId = ctx.chat.id;
        lastMessageTime = Date.now();
        isIdleAlertSent = false;

        ctx.reply("🎙️ ভয়েস মেসেজ প্রসেস করা হচ্ছে...");
        const voice = ctx.message.voice;
        
        const tempDir = path.resolve(process.cwd(), 'temp');
        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
        const tempFilePath = path.resolve(tempDir, `voice_${Date.now()}.ogg`);

        (async () => {
            try {
                const fileLink = await ctx.telegram.getFileLink(voice.file_id);
                const response = await fetch(fileLink.href, { signal: AbortSignal.timeout(15000) });
                const arrayBuffer = await response.arrayBuffer();
                fs.writeFileSync(tempFilePath, Buffer.from(arrayBuffer));

                const text = await transcribeAudio(tempFilePath);
                await ctx.reply(`🗣️ ভয়েস ট্রান্সক্রিপশন: "${text}"`);

                await handleUserRequest(ctx, text);
            } catch (error: any) {
                console.error("ভয়েস প্রসেসিং এরর:", error);
                await ctx.reply(`❌ ভয়েস প্রসেস করতে ব্যর্থ: ${error.message || error}`);
            } finally {
                if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);
            }
        })().catch(err => console.error("Fatal background voice error:", err));
    });

    bot.on('photo', (ctx) => {
        activeChatId = ctx.chat.id;
        lastMessageTime = Date.now();
        isIdleAlertSent = false;

        ctx.reply("📸 ছবি পাওয়া গেছে, বিশ্লেষণ করা হচ্ছে...");
        const photoArray = ctx.message.photo;
        const photo = photoArray[photoArray.length - 1];
        const userCaption = ctx.message.caption || "describe this image";
        
        const tempDir = path.resolve(process.cwd(), 'temp');
        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
        const tempFilePath = path.resolve(tempDir, `image_${Date.now()}.jpg`);

        (async () => {
            try {
                const fileLink = await ctx.telegram.getFileLink(photo.file_id);
                const response = await fetch(fileLink.href, { signal: AbortSignal.timeout(15000) });
                const arrayBuffer = await response.arrayBuffer();
                fs.writeFileSync(tempFilePath, Buffer.from(arrayBuffer));

                const description = await analyzeImage(tempFilePath, userCaption);
                await ctx.reply(`👁️ এআই পর্যবেক্ষণ:\n\n${description}`);
            } catch (error: any) {
                console.error("ফটো প্রসেসিং এরর:", error);
                await ctx.reply(`❌ ছবি বিশ্লেষণ করতে ব্যর্থ: ${error.message || error}`);
            } finally {
                if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);
            }
        })().catch(err => console.error("Fatal background photo error:", err));
    });

    // ৪. ২ মিনিটের ইন-অ্যাক্টিভ প্রো-অ্যাক্টিভ টাইমার (Heartbeat Check)
    setInterval(async () => {
        if (!activeChatId) return;

        const idleTime = Date.now() - lastMessageTime;
        if (idleTime >= 120000 && !isIdleAlertSent) {
            isIdleAlertSent = true; 
            console.log("[Cortex] ২ মিনিট নিষ্ক্রিয়তা ধরা পড়েছে! প্রো-অ্যাক্টিভ মেসেজ পাঠানো হচ্ছে...");
            
            try {
                const emotionalMessage = await generateProactiveMessage();
                await bot.telegram.sendMessage(activeChatId, emotionalMessage);
            } catch (err) {
                console.error("প্রো-অ্যাক্টিভ মেসেজ পাঠাতে ব্যর্থ:", err);
            }
        }
    }, 10000); 

    bot.launch()
        .then(() => console.log("[Cortex] টেলিগ্রাম গেটওয়ে সফলভাবে চালু হয়েছে!"))
        .catch((err) => console.error("[Cortex] বট চালু করতে সমস্যা হয়েছে:", err));

    process.once('SIGINT', () => bot.stop('SIGINT'));
    process.once('SIGTERM', () => bot.stop('SIGTERM'));
}