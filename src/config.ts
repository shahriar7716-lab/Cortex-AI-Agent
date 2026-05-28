import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const pcUser = os.userInfo().username;
const pcHome = os.homedir();

// সংশোধন: আসল উইন্ডোজ ডেস্কটপ প্যাথ (যেমন: C:\Users\SIMMI\Desktop)
const pcDesktop = path.join(pcHome, 'Desktop');

export const config = {
    telegramToken: process.env.TELEGRAM_BOT_TOKEN || '',
    groqApiKey: process.env.GROQ_API_KEY || '',
    geminiApiKey: process.env.GEMINI_API_KEY || '',
    activeModel: process.env.ACTIVE_MODEL || 'llama-3.3-70b-versatile',
    
    pcUser: pcUser,
    pcHome: pcHome.replace(/\\/g, '/'),
    pcDesktop: pcDesktop.replace(/\\/g, '/'), // আসল উইন্ডোজ ডেস্কটপ প্যাথ
};

export function getProvider(modelName: string): 'gemini' | 'groq' {
    if (modelName.toLowerCase().startsWith('gemini')) {
        return 'gemini';
    }
    return 'groq';
}

export function validateConfig(): void {
    if (!config.telegramToken) {
        console.warn("সতর্কবার্তা: তোমার .env ফাইলে TELEGRAM_BOT_TOKEN সেট করা নেই!");
    }
}

export function saveConfigValue(key: string, value: string): void {
    const envPath = path.resolve(process.cwd(), '.env');
    let envContent = '';
    
    if (fs.existsSync(envPath)) {
        envContent = fs.readFileSync(envPath, 'utf-8');
    }

    const regex = new RegExp(`${key}=.*`);
    if (envContent.match(regex)) {
        envContent = envContent.replace(regex, `${key}=${value}`);
    } else {
        envContent += `\n${key}=${value}`;
    }

    fs.writeFileSync(envPath, envContent.trim(), 'utf-8');
    
    if (key === 'GROQ_API_KEY') config.groqApiKey = value;
    if (key === 'GEMINI_API_KEY') config.geminiApiKey = value;
    if (key === 'ACTIVE_MODEL') config.activeModel = value;
}