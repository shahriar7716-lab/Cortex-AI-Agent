import * as fs from 'fs';
import * as path from 'path';

// পরিবর্তন: আমরা নাম পরিবর্তন করে history.json করে রুট ফোল্ডারে রাখছি
const memoryFilePath = path.resolve(process.cwd(), 'history.json');

interface MemoryMessage {
    role: 'user' | 'assistant';
    content: string;
}

// মেমোরি ফাইল থেকে হিস্ট্রি রিড করার ফাংশন
export function getMemory(): MemoryMessage[] {
    if (!fs.existsSync(memoryFilePath)) {
        return [];
    }
    try {
        const data = fs.readFileSync(memoryFilePath, 'utf-8');
        return JSON.parse(data) as MemoryMessage[];
    } catch (err) {
        return [];
    }
}

// মেমোরি ফাইলে হিস্ট্রি রাইট করার ফাংশন
export function saveMemory(history: MemoryMessage[]): void {
    try {
        const cappedHistory = history.slice(-10);
        fs.writeFileSync(memoryFilePath, JSON.stringify(cappedHistory, null, 2), 'utf-8');
    } catch (err) {
        console.error("মেমোরি সেভ করতে সমস্যা হয়েছে:", err);
    }
}

// নতুন মেসেজ মেমোরিতে যোগ করার ফাংশন
export function addMessageToMemory(role: 'user' | 'assistant', content: string): void {
    const history = getMemory();
    history.push({ role, content });
    saveMemory(history);
}