import * as fs from 'fs';
import * as path from 'path';

// সংশোধন: আমরা ডেটা ফাইলটির নাম পরিবর্তন করে cache_storage.json নামে রুট ফোল্ডারে রাখছি
const cacheFilePath = path.resolve(process.cwd(), 'cache_storage.json');

// ক্যাশ রিড করার ফাংশন
export function getCache(): Record<string, string> {
    if (!fs.existsSync(cacheFilePath)) {
        return {};
    }
    try {
        const data = fs.readFileSync(cacheFilePath, 'utf-8');
        return JSON.parse(data) as Record<string, string>;
    } catch (err) {
        return {};
    }
}

// ক্যাশ রাইট করার ফাংশন
export function saveCache(cache: Record<string, string>): void {
    try {
        fs.writeFileSync(cacheFilePath, JSON.stringify(cache, null, 2), 'utf-8');
    } catch (err) {
        console.error("ক্যাশ সেভ করতে সমস্যা হয়েছে:", err);
    }
}

// ক্যাশ থেকে কমান্ড চেক করার ফাংশন
export function getCachedCommand(request: string): string | null {
    const cache = getCache();
    return cache[request.toLowerCase().trim()] || null;
}

// ক্যাশ ফাইলে নতুন সফল কমান্ড মুখস্থ করার ফাংশন
export function addCommandToCache(request: string, command: string): void {
    const cache = getCache();
    cache[request.toLowerCase().trim()] = command;
    saveCache(cache);
}