# Cortex BY SHAHRIAR - User Manual & Guide 🧠🖥️
**A Premium, Self-Learning Autonomous AI Agent for Windows**
*Created by Shahriar Islam (2026)* | Developer Age: 11 Years Old

---

## 🇧🇩 ১. বাংলা নির্দেশিকা (Bengali User Manual)

**Cortex BY SHAHRIAR**-এ আপনাকে স্বাগতম! এটি একটি অত্যন্ত শক্তিশালী এবং স্বয়ংক্রিয় এআই উইন্ডোজ অ্যাসিস্ট্যান্ট। আপনি বিশ্বের যেকোনো প্রান্ত থেকে আপনার মোবাইল ফোনের টেলিগ্রাম (Telegram) অ্যাপ দিয়ে সরাসরি আপনার ঘরের কম্পিউটারকে নিয়ন্ত্রণ করতে পারবেন, মাউস নাড়াতে পারবেন, যেকোনো জটিল কাজ যেমন ছবি বা ভিডিও এডিটিং করতে পারবেন এবং ভয়েস ও ছবির মাধ্যমে কম্পিউটারের সাথে সরাসরি আড্ডা দিতে পারবেন।

### পিসির নূন্যতম যোগ্যতা (System Requirements)
* **অপারেটিং সিস্টেম:** Windows 10 অথবা Windows 11 (64-bit)
* **প্রয়োজনীয় রানটাইম:** Python v3.10+ ইনস্টল করা থাকতে হবে এবং ইনস্টল করার সময় অবশ্যই **"Add Python to PATH"** বক্সে টিক মার্ক দিতে হবে।
* **ইন্টারনেট সংযোগ:** পিসিতে সার্বক্ষণিক ইন্টারনেট কানেকশন থাকতে হবে।

---

### কুইক স্টার্ট ও সেটআপ গাইড (Quick Start & Setup)

সফটওয়্যারটি প্রথমবার চালু করার জন্য নিচের ৫টি অত্যন্ত সহজ ধাপ অনুসরণ করুন:

#### ধাপ ১: আপনার নিজস্ব টেলিগ্রাম বট তৈরি করুন
১. আপনার মোবাইলের টেলিগ্রাম অ্যাপটি খুলে সার্চ বারে গিয়ে খুঁজুন **`@BotFather`**।
২. চ্যাট শুরু করতে স্টার্ট চেপে লিখুন: `/newbot`।
৩. বটটির একটি সুন্দর নাম দিন (যেমন: `MyCortexBot`) এবং একটি ইউজারনেম দিন যার শেষে `bot` লেখা থাকবে (যেমন: `my_cortex_bot`)।
৪. বটটি তৈরি হয়ে গেলে BotFather আপনাকে একটি গোপন টোকেন (API Token) দেবে, যা দেখতে এমন হবে: `7823948234:AAHe...`। এই টোকেনটি কপি করে রাখুন।

#### ধাপ ২: ফাইল কনফিগারেশন করা
১. আপনার কেনা **Cortex** জিপ ফাইলটি আনজিপ করুন। এর ভেতরে আপনি দুটি ফাইল পাবেন: **`cortex.exe`** এবং **`.env`**।
২. আপনার এডিটর বা সাধারণ Notepad দিয়ে **`.env`** ফাইলটি ওপেন করুন।
৩. সেখানে `TELEGRAM_BOT_TOKEN=` লাইনের পাশে আপনার কপি করা টেলিগ্রাম টোকেনটি বসিয়ে ফাইলটি সেভ (Ctrl + S) করে দিন।
   *উদাহরণ:*
   ```env
   TELEGRAM_BOT_TOKEN=7823948234:AAHeyourtokenhere

ধাপ ৩: ソフトওয়্যারটি রান করা

১. এখন জাস্ট cortex.exe ফাইলটির ওপর ডাবল-ক্লিক করুন। ব্যাকগ্রাউন্ডে একটি কালো
স্ক্রিন ওপেন হবে এবং লেখা উঠবে: [Cortex] টেলিগ্রাম গেটওয়ে সফলভাবে চালু
হয়েছে!। ২. আপনার উইন্ডোজের স্ক্রিন বা মনিটরটি আপনি চাইলে এখন বন্ধ বা
স্লিপ মোডে রাখতে পারেন, শুধু সিপিইউ অন এবং ইন্টারনেট কানেক্টেড থাকলেই
হবে।

ধাপ ৪: এআই ব্রেন (API Keys) রিমোটলি সেটআপ করা

এখন থেকে আপনার পিসির সামনে বসার আর কোনো প্রয়োজন নেই! আপনার মোবাইলটি হাতে নিয়ে
টেলিগ্রামে আপনার তৈরি করা বটের চ্যাটে যান এবং স্টার্ট (Start) বাটনে ক্লিক
করুন। নিচে ৩টি কম্যান্ড পাঠিয়ে আপনার এআই ব্রেন কনফিগার করুন:

১. গ্রক কী সেটআপ: টেলিগ্রাম চ্যাটে লিখুন \groq এবং এন্টার দিন। বট আপনার কাছে কী
চাইলে Groq (console.groq.com থেকে সম্পূর্ণ ফ্রিতে নেওয়া যায়) এপিআই কী-টি
চ্যাটে পাঠিয়ে দিন। ২. জেমিনি কী সেটআপ (ভিশন ছবির জন্য): চ্যাটে লিখুন
\gemini এবং এন্টার দিন। একইভাবে গুগল জেমিনি এপিআই কী-টি চ্যাটে পাঠিয়ে দিন। ৩.
মডেল পরিবর্তন করা: এআই ব্রেন হিসেবে গ্রক সেট করতে মেসেজে লিখুন:
\llama-3.3-70b-versatile (এটি ৩ সেকেন্ডের মধ্যে অত্যন্ত দ্রুত উত্তর দেবে)।

কীভাবে ব্যবহার করবেন? (How to Command)

বট সেটআপ শেষ! এখন আপনি সাধারণ ভাষায় মোবাইল থেকে যেকোনো কাজ করতে বলতে পারেন:

  - আড্ডা ও সাধারণ প্রশ্ন: "হেই কর্টেক্স, তুমি কেমন আছ? এবং আজ ঢাকার আবহাওয়া
    কেমন?"
  - উইন্ডোজ অ্যাপ ওপেন করা: "আমার পিসিতে গুগল ক্রোম এবং নোটপ্যাড অ্যাপ দুটি ওপেন
    করো"
  - ছবি দেখে চেনা (Vision): চ্যাটে যেকোনো একটি ছবি আপলোড করে ক্যাপশনে বাংলায়
    লেখো: "এই ছবিতে কী কী লাল রঙের জিনিস আছে তা বলো।"
  - মাউস কার্সার রিয়েল-টাইমে কন্ট্রোল করা: "মাউসটি স্ক্রিনের ৫০০, ৫০০ পিক্সেল
    পজিশনে নিয়ে ডাবল ক্লিক করো" (এটির জন্য আপনার পিসিতে pip install
    pyautogui ইনস্টল থাকতে হবে)।

নতুন স্কিল নিজে নিজে শেখানো (Dynamic Skills Engine)

আপনি Cortex-কে দিয়ে যেকোনো জটিল কাজ করানোর জন্য স্থায়ী Skill বা টুলস তৈরি করে
নিতে পারেন। যেমন বটকে টেলিগ্রামে জাস্ট বাংলায় বলুন:

"src/skills/create_image.py নামে একটি নতুন স্কিল তৈরি করো যা দিয়ে ফাঁকা কালারড
ইমেজ তৈরি করা যায়। এটার জন্য পাইথনের pillow লাইব্রেরি দরকার হবে।"

আমাদের Cortex ব্যাকগ্রাউন্ডে পাইথন ফাইল তৈরি করে স্কিলটি আজীবনের জন্য শিখে নেবে।
পরবর্তীতে আপনি তাকে বললেই সে ওই ফোল্ডারের ফাইলটি ব্যবহার করে আপনার কাজ কয়েক
সেকেন্ডে করে দেবে!

🇺🇸 ২. English User Manual

Welcome to Cortex BY SHAHRIAR! This is a state-of-the-art autonomous AI
Assistant for Windows. It allows you to control your PC remotely from anywhere
in the world using Telegram messages, voice memos, and images.

System Requirements

  - OS: Windows 10 or Windows 11 (64-bit)
  - Required Runtime: Python v3.10+ installed and added to your Windows PATH
    (make sure to check the "Add Python to PATH" box during Python
    installation).
  - Internet: Constant active internet connection on the host PC.

Step-by-Step Setup Guide

Follow these 5 simple steps to get started:

Step 1: Create your Telegram Bot

1.  Open Telegram and search for @BotFather.
2.  Start the chat and send /newbot.
3.  Choose a name (e.g., MyCortexBot) and a unique username ending in bot (e.g.,
    my_cortex_bot).
4.  Copy the HTTP API Token provided by BotFather (e.g., 7823948234:AAHe...).

Step 2: Configure files

1.  Extract the purchased Cortex zip file. You will find cortex.exe and a .env
    file.
2.  Open the .env file with Notepad.
3.  Paste your Telegram Bot Token after TELEGRAM_BOT_TOKEN= and save the file.
    Example: TELEGRAM_BOT_TOKEN=7823948234:AAHeyourtokenhere

Step 3: Run the software

1.  Double-click the cortex.exe file. A terminal will open displaying: [Cortex]
    Telegram Gateway successfully launched!.
2.  You can turn off your monitor; as long as the PC is on and connected to the
    internet, Cortex will listen.

Step 4: Configure your AI Keys remotely

Go to your Telegram Bot on your mobile phone, click START, and send these
commands:

  - \groq : When prompted, send your Groq API Key.
  - \gemini : When prompted, send your Google Gemini API Key.
  - \llama-3.3-70b-versatile : Sets the default high-speed Llama 3.3 model.

Commands & Global Summaries (Quick Translations)

🇪🇸 Español (Spanish)

Cortex BY SHAHRIAR es un Agente de IA autónomo para Windows. Controla tu PC
desde cualquier lugar a través de Telegram.

  - Inicio rápido: Configure .env con su token de Telegram, ejecute cortex.exe y
    envíe comandos en español.
  - Comandos: Escriba \gemini o \groq para configurar sus claves de API de IA
    directamente desde su teléfono.

🇨🇳 中文 (Mandarin)

Cortex BY SHAHRIAR 是一个自主运行的 Windows AI 智能体。允许您随时随地通过 Telegram 远程控制您的电脑。

  - 快速启动: 在 .env 文件中配置您的 Telegram 令牌，双击运行 cortex.exe。
  - 快捷命令: 在 Telegram 中发送 \gemini 或 \groq 配置您的 AI API 密钥。

🇸🇦 العربية (Arabic)

هو وكيل ذكاء اصطناعي مستقل لنظام التشغيل ويندوز. يتيح لك التحكم في جهاز
الكمبيوتر الخاص بك عن بُعد عبر تليجرام. Cortex BY SHAHRIAR

  - بدء سريع: قم بتهيئة ملف .env الخاص بك، وافتح ملف cortex.exe وأرسل الأوامر.

🇮🇳 हिन्दी (Hindi)

Cortex BY SHAHRIAR विंडोज के लिए एक शक्तिशाली एआई एजेंट है। यह आपको टेलीग्राम के
माध्यम से अपने पीसी को रिमोटली नियंत्रित करने की अनुमति देता.

  - क्विक स्टार्ट: अपने टेलीग्राम टोकन के साथ .env फ़ाइल सेट करें, cortex.exe
    चलाएं और कमांड भेजें।