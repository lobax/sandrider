import { readdirSync } from 'fs';
import { join } from 'path';

/** 
 * Search for files with a specified name in a directory and its subdirectories
 * @param {string} baseDir - The directory to search in
 * @param {string} targetFileName - The filename to search for
 * @returns {Array<string>} - A list of file paths that match the specified file name
 */
export const findFiles = (baseDir, targetFileName) => { 
    const results = [];
    const stack = [baseDir]; 

    while (stack.length > 0) {
        const currentDir = stack.pop();
        try { 
            const entries = readdirSync(currentDir, { withFileTypes: true });
            for (const entry of entries) { 
                const path = join(currentDir, entry.name);
                if (entry.isDirectory()) {
                    stack.push(path);
                }
                else if (entry.isFile() && entry.name === targetFileName) {
                    results.push(path); 
                }
            }
        } catch (err) {
            console.error(`Error accessing ${currentDir}:`, err);
        }
    }

    return results;
}
