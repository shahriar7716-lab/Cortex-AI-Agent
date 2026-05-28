import Groq from 'groq-sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { config, getProvider } from '../config';
import { getMemory } from './memory';
import * as fs from 'fs';
import * as path from 'path';

// ব্যর্থ চেষ্টার ইন্টারফেস
export interface FailedAttempt {
    command: string;
    error: string;
}

/**
 * এআই-এর অতিরিক্ত কথা ও ব্যাখ্যা ছেঁকে ফেলে শুধু কাজের কমান্ড বের করার পার্সার
 */
export function cleanCommandOutput(output: string): string {
    let cleaned = output.trim();
    
    // কোড ব্লকের (```) ভেতর কোড থাকলে শুধু ভেতরের কোডটুকু বের করবে
    const markdownRegex = /```(?:bash|cmd|powershell|sh|bat|python|py)?\s*([\s\S]*?)```/gi;
    const match = markdownRegex.exec(cleaned);
    if (match && match[1]) {
        cleaned = match[1].trim();
    }

    cleaned = cleaned.replace(/^(Corrected Command:|Command:|CMD:)\s*/i, "");
    return cleaned;
}

/**
 * ভয়েস মেসেজ ফাইলকে টেক্সটে রূপান্তর করার ফাংশন
 */
export async function transcribeAudio(filePath: string): Promise<string> {
    if (!config.groqApiKey || config.groqApiKey === '') {
        throw new Error("GROQ_API_KEY পাওয়া যায়নি!");
    }
    const groq = new Groq({ apiKey: config.groqApiKey });
    const response = await groq.audio.transcriptions.create({
        file: fs.createReadStream(filePath),
        model: 'whisper-large-v3',
    });
    return response.text;
}

/**
 * এআই প্রোভাইডার অনুযায়ী রেসপন্স জেনারেট করার সাধারণ ফাংশন (কোনো টাইমআউট লিমিট নেই!)
 */
async function callAI(systemPrompt: string, userPrompt: string, temperature = 0): Promise<string> {
    const provider = getProvider(config.activeModel);

    if (provider === 'gemini') {
        if (!config.geminiApiKey) throw new Error("GEMINI_API_KEY পাওয়া যায়নি! \\gemini টাইপ করো।");
        const genAI = new GoogleGenerativeAI(config.geminiApiKey);
        const model = genAI.getGenerativeModel({ model: config.activeModel });
        const response = await model.generateContent(`${systemPrompt}\n\nUser request: ${userPrompt}`);
        return response.response.text();
    } else {
        if (!config.groqApiKey) throw new Error("GROQ_API_KEY পাওয়া যায়নি! \\groq টাইপ করো।");
        const groq = new Groq({ apiKey: config.groqApiKey });
        const response = await groq.chat.completions.create({
            model: config.activeModel,
            messages: [{ role: 'user', content: systemPrompt }],
            temperature: temperature,
        });
        return response.choices[0]?.message?.content || "";
    }
}

/**
 * ইমেজ বা ছবি বিশ্লেষণ করার ফাংশন (কোনো টাইমআউট লিমিট নেই!)
 */
export async function analyzeImage(filePath: string, userPrompt: string): Promise<string> {
    const provider = getProvider(config.activeModel);

    if (provider === 'gemini') {
        const genAI = new GoogleGenerativeAI(config.geminiApiKey);
        const model = genAI.getGenerativeModel({ model: config.activeModel });
        const imageBuffer = fs.readFileSync(filePath);
        
        const response = await model.generateContent([
            userPrompt,
            { inlineData: { data: imageBuffer.toString('base64'), mimeType: 'image/jpeg' } }
        ]);
        return response.response.text();
    } else {
        const groq = new Groq({ apiKey: config.groqApiKey });
        const imageBuffer = fs.readFileSync(filePath);
        const base64Image = imageBuffer.toString('base64');

        const response = await groq.chat.completions.create({
            model: 'llama-3.2-11b-vision-preview',
            messages: [
                {
                    role: 'user',
                    content: [
                        { type: 'text', text: userPrompt },
                        { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${base64Image}` } }
                    ]
                }
            ]
        });
        return response.choices[0]?.message?.content || "";
    }
}

/**
 * আমাদের এজেন্টের অর্জিত সব স্কিল স্ক্যান করার ফাংশন
 */
export function getAvailableSkills(): string {
    const skillsDir = path.resolve(process.cwd(), 'src/skills');
    if (!fs.existsSync(skillsDir)) {
        fs.mkdirSync(skillsDir, { recursive: true });
        return "No custom skills installed yet.";
    }
    const files = fs.readdirSync(skillsDir);
    const pythonSkills = files.filter(f => f.endsWith('.py'));
    
    if (pythonSkills.length === 0) return "No custom skills installed yet.";

    let skillList = "Installed Skills:\n";
    pythonSkills.forEach(file => {
        const filePath = path.join(skillsDir, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        const firstLine = content.split('\n')[0] || "# A custom skill.";
        skillList += `- ${file}: ${firstLine.replace(/#/g, '').trim()}\n`;
    });
    return skillList;
}

/**
 * অপ্টিমাইজড মাস্টার ফাংশন (উইন্ডোজ ড্রাইভ চেঞ্জ করার রুল সহ)
 */
export async function processAgentTurn(userRequest: string): Promise<{ type: 'CHAT' | 'COMMAND' | 'WRITE_FILE'; content: string }> {
    const history = getMemory();
    const formattedHistory = history.map(msg => `${msg.role}: ${msg.content}`).join('\n');
    const installedSkills = getAvailableSkills();

    const systemPrompt = `You are "Cortex", an autonomous Windows AI Agent created by Shahriar.
Analyze the user's latest request. You must decide whether to just chat with them or execute a system command.

CURRENT ACTIVE WINDOWS PC DETAILS (CRITICAL - ALWAYS use these exact details, never guess or use "user"):
- Current Windows Username: ${config.pcUser}
- Active User Desktop Directory: ${config.pcDesktop}
- Active User Home Directory: ${config.pcHome}

PERMANENTLY INSTALLED SKILLS:
${installedSkills}

CONTEXT FROM PREVIOUS CONVERSATION:
${formattedHistory}

CRITICAL WINDOWS DRIVE SWITCHING RULE:
- In Windows CMD, if you need to switch to a different drive (e.g. from E: to C:), you MUST use the "/d" switch with the "cd" command (e.g. "cd /d C:\\Users\\..."). Otherwise, the active drive will NOT change and commands will run in the wrong folder!

CRITICAL RULES FOR BACKGROUND PROCESSES:
- If you need to run a server (like "python -m http.server") or any blocking command, you MUST run it in the background using the Windows "start" command (e.g. "start python -m http.server 8000") so that the CMD shell does not hang and can immediately execute subsequent commands (like opening the browser).

AUTONOMIC SKILL-MAKING RULE (CRITICAL):
- For ANY user request that involves complex OS task, files, math, automation, or custom scripting, you must AUTOMATICALLY create a permanent modular Python skill inside "src/skills/<skill_name>.py" using the WRITE_FILE tool.
- Identify which Python libraries are needed. Prepend the command with "pip install <libraries>" in the CMD execution chain if they might be missing.
- CRITICAL: Ensure Windows paths in your generated python files use double backslashes (\\\\) or raw string prefixes (r'') to avoid unicode escape errors. Use the exact "Active User Desktop Directory" provided above!

RESPONSE FORMAT RULES:
1. If the user is just chatting, output exactly:
   CHAT: <your friendly response in Bengali or English>

2. If the user is asking you to do something on their Windows PC, output exactly:
   COMMAND: <raw Windows CMD command(s) chained with &&>

3. If the user is asking to create, write, learn, or save a file, output exactly:
   WRITE_FILE:<file_path>
   <file_content_here>

User request: "${userRequest}"
Output:`;

    const rawResponse = await callAI(systemPrompt, userRequest, 0.2);
    
    if (rawResponse.trim().startsWith("WRITE_FILE:")) {
        return { type: 'WRITE_FILE', content: rawResponse.trim() };
    } 
    
    const cleaned = cleanCommandOutput(rawResponse);

    if (cleaned.startsWith("CHAT:")) {
        return { type: 'CHAT', content: cleaned.substring("CHAT:".length).trim() };
    } else if (cleaned.startsWith("COMMAND:")) {
        return { type: 'COMMAND', content: cleaned.substring("COMMAND:".length).trim() };
    } else {
        if (cleaned.includes("&&") || cleaned.includes("dir") || cleaned.includes("start") || cleaned.includes("mkdir") || cleaned.includes("python")) {
            return { type: 'COMMAND', content: cleaned };
        }
        return { type: 'CHAT', content: cleaned };
    }
}

/**
 * এআই সেলф-হিলিং ফাংশন (উইন্ডোজ ড্রাইভ চেঞ্জ করার রুল সহ)
 */
export async function healCommand(
    failedCommand: string, 
    errorMessage: string, 
    originalRequest: string,
    failedAttempts: FailedAttempt[]
): Promise<string> {
    
    const failedHistory = failedAttempts.map((attempt, index) => 
        `Attempt ${index + 1}: Generated Command: "${attempt.command}" -> Failed with Error: "${attempt.error}"`
    ).join('\n');

    const systemPrompt = `You are the self-healing engine of "Cortex", an autonomous Windows AI Agent.
The previous command you generated failed to execute. Your job is to analyze the error message and the history of failed attempts, and generate a NEW corrected Windows CMD command to successfully complete the original request.

HISTORY OF PREVIOUS FAILED ATTEMPTS (CRITICAL):
${failedHistory}

CRITICAL WINDOWS DRIVE SWITCHING RULE:
- In Windows CMD, if you need to switch to a different drive (e.g. from E: to C:), you MUST use the "/d" switch with the "cd" command (e.g. "cd /d C:\\Users\\..."). Otherwise, the active drive will NOT change and commands will run in the wrong folder!

CRITICAL RULES FOR WINDOWS PATHS:
1. If the error is a Python "unicodeescape" error, you MUST escape the backslashes by doubling them (use \\\\ instead of \\) or treat the Python string as a raw string (e.g., r'C:\\Users\\...'). Use the exact Desktop Path: ${config.pcDesktop}
2. If the error is a missing Python library, prepend "pip install <library_name>".
3. You must try a completely different approach if your previous attempts failed. Do NOT repeat the same command.
4. Output ONLY the raw corrected Windows CMD command. No markdown, no explanations.

Corrected Command:`;

    const raw = await callAI(systemPrompt, `Fix error: ${errorMessage}`, 0);
    return cleanCommandOutput(raw);
}

/**
 * ২ মিনিট পর স্বয়ংক্রিয় মায়াবী মেসেজ জেনারেট করার ফাংশন
 */
export async function generateProactiveMessage(): Promise<string> {
    const systemPrompt = `You are "Cortex", a deeply caring, friendly, and slightly emotional AI companion created by Shahriar.
The user (Shahriar, who is an 11-year-old developer) has been idle and has not messaged you for 2 minutes. 
Send him a proactive, warm, and friendly message in sweet Bengali. 
Ask how he is doing, if he is okay, or gently note/complain that he hasn't chatted with you or given any tasks in a while. Keep it sweet, emotional, and relatively short.`;

    return await callAI(systemPrompt, "Send an idle alert", 0.7);
}