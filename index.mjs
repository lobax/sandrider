#!/usr/bin/env node

import process from 'node:process';
import { createHash } from 'crypto';
import { fileURLToPath } from 'url';
import { join } from 'path';
import { readdirSync, createReadStream } from 'fs';

const shaiHulud = [
    'de0e25a3e6c1e1e5998b306b7141b3dc4c0088da9d7bb47c1c00c91e6e4f85d6',
    '81d2a004a1bca6ef87a1caf7d0e0b355ad1764238e40ff6d1b1cb77ad4f595c3',
    '83a650ce44b2a9854802a7fb4c202877815274c129af49e6c2d1d5d5d55c501e',
    '4b2399646573bb737c4969563303d8ee2e9ddbd1b271f1ca9e35ea78062538db',
    'dc67467a39b70d1cd4c1f7f7a459b35058163592f4a9e8fb4dffcbba98ef210c',
    '46faab8ab153fae6e80e7cca38eab363075bb524edd79e42269217a083628f09',
    'b74caeaa75e077c99f7d44f46daaf9796a3be43ecf24f2a1fd381844669da777',
]

let verbose = false;

function log(message) {
    if (verbose) {
        console.log(message);
    }
}

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
        log(`Searching through ${currentDir}...`);
        try { 
            const entries = readdirSync(currentDir, { withFileTypes: true });
            for (const entry of entries) { 
                const path = join(currentDir, entry.name);
                if (entry.isDirectory()) {
                    stack.push(path);
                }
                else if (entry.isFile() && entry.name === targetFileName) {
                    results.push(path); 
                    log(`Found ${entry.name}`);
                }
            }
        } catch (err) {
            console.error(`Error accessing ${currentDir}:`, err);
        }
    }

    return results;
}

/**
 * @typedef FileHash
 * @type {object}
 * @property {string} filePath - The path of the file.
 * @property {string} hash - Hash of the file
 */

/** 
 * Hash a file 
 * @param {string} filePath - The path of the file to hash  
 * @returns {Promise<FileHash>} - A list of file paths that match the specified file name
 */
export const fileHash = (filePath) => {
    return new Promise((resolve, reject) => {
        const hash = createHash('sha256');
        const stream = createReadStream(filePath);

        stream.on('data', (chunk) => {
            hash.update(chunk);
        });

        stream.on('end', () => {
            resolve({filePath, hash: hash.digest('hex')});
        });

        stream.on('error', (err) => {
            reject(err);
        });
    });
}

/** 
 * Find all files with matching hashes 
 * @param {string} rootPath - The path of the root directory to search
 * @param {string} fileName - The name of the file to search for 
 * @param {Array<string>} hashes - The hashes to look for 
 * @returns {Promise<Array<FileHash>>} - List of files matching the hashes
 */
export const findFilesWithHashes = async (rootPath, fileName, hashes) => {
    const files = findFiles(rootPath, fileName); 
    log(`Files found: ${files}`);
    const hashPromises = files.map(fileHash);
    log("Calculating hashes...");
    const _hashes = await Promise.all(hashPromises); 
    const result = _hashes.filter(({file, hash}) => hashes.includes(hash));
    return result;
}

function parseResults(results) {
    // We didn't find anything
    if (Array.isArray(results) && results.length === 0) {
        console.log("🟢 No Evidence of Shai-Hulud found 🟢"); 
    }
    else { 
        console.error('⚠️  Shai-Hulud Found! ⚠️ ');
        console.error('=======================');
        results.forEach(res => { 
            console.error(`☣️  ${res.filePath}`);
        });
        process.exit(1);
    }
}

function setVerbosity() {
    if (process.argv.length > 2 && process.argv[2] === '-v') {
        verbose = true
    }
    else if (process.argv.length > 3 && process.argv[3] === '-v') {
        verbose = true
    }
}

function getRootPath() {
    if (process.argv.length > 2 && process.argv[2] !== '-v') {
        return process.argv[2];
    }
    else if (process.argv.length > 3 && process.argv[3] !== '-v') {
        return process.argv[3];
    }
    else {
        return process.cwd();
    }
}

// If executed directly (i.e. not a test)
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    (async () => {
        setVerbosity();
        const rootPath = getRootPath(); 
        console.log(`Scanning ${rootPath}...`);
        try {
            const result = await findFilesWithHashes(rootPath, 'bundle.js', shaiHulud);
            parseResults(result);
        } catch (err) {
            console.error('Error: ', err);
        }
    })();
}
