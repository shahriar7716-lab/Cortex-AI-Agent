import { exec } from 'child_process';

/**
 * উইন্ডোজ কমান্ড প্রম্পটে (CMD) কমান্ড রান করার ফাংশন
 * এটি কমান্ডের রেজাল্ট বা আউটপুট রিটার্ন করবে
 */
export function runCommand(command: string): Promise<string> {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(`Error: ${error.message}`);
                return;
            }
            if (stderr) {
                resolve(stderr);
                return;
            }
            resolve(stdout);
        });
    });
}