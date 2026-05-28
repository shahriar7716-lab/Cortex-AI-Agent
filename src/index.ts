import * as os from 'os';
import { validateConfig } from './config';
import { startTelegramBot } from './gateway/telegram';

async function startCortex(): Promise<void> {
    console.log("==================================================");
    console.log("               CORTEX BY SHAHRIAR                 ");
    console.log("==================================================");
    console.log("Status: Initializing AI Agent Core...");
    console.log(`OS Platform: ${os.platform()}`);
    console.log(`Node.js Version: ${process.version}`);
    console.log("--------------------------------------------------");

    // আমাদের কনফিগারেশন চেক করা
    validateConfig();

    console.log("Starting Gateways...");
    // টেলিগ্রাম বট চালু করা হচ্ছে
    startTelegramBot();
}

startCortex();