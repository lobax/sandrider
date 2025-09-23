import { mkdirSync, writeFileSync, rmSync, existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import { findFiles, findFilesWithHashes } from './index.mjs'

const __filename = fileURLToPath(import.meta.url); 
const __dirname = join(__filename, '..');
const baseDir = join(__dirname, 'test_dir');

describe('Find all matching files with a particular hash', (t) => {
    before(() => setup(baseDir));
    after(() => cleanup(baseDir));

    it('Should find all target-file.txt with matching hash', async () => { 
        const hashes = [
            '852d2584f081863e91399ff453d89a3a0ec89971e3eb5bef130eb6bcfb157709',
            'fbeea59b3ed41cf6a2b0d2adc1896d0f964ca3a11006d76728ff00c195c6bc79',
            'a61510216e0fea6547428ce4dae7f2cf50ef4e3c5fa7b67a4a876cdb2316c11f'
        ];
        const expectedFiles = [ 
            join(baseDir, 'target-file.txt'),
            join(baseDir, 'dir', 'target-file.txt'),
            join(baseDir, 'dir', 'nested', 'target-file.txt'),

        ];
        const foundFiles = (await findFilesWithHashes(baseDir, 'target-file.txt', hashes))
            .map((fileHash) => fileHash.filePath); 
        assert.deepStrictEqual(foundFiles.sort(), expectedFiles.sort());
    });
});

describe('Find all matching files', (t) => {
    before(() => setup(baseDir));
    after(() => cleanup(baseDir));

    it('Should find all target-file.txt', () => { 
        const expectedFiles = [ 
            join(baseDir, 'target-file.txt'),
            join(baseDir, 'dir', 'target-file.txt'),
            join(baseDir, 'dir', 'nested', 'target-file.txt'),

        ];
        const foundFiles = findFiles(baseDir, 'target-file.txt'); 
        assert.deepStrictEqual(foundFiles.sort(), expectedFiles.sort());
    });

    it('Should find all deep-nested-file.txt', () => { 
        const expectedFiles = [ 
            join(baseDir, 'dir', 'nested', 'deep-nested-file.txt'),

        ];
        const foundFiles = findFiles(baseDir, 'deep-nested-file.txt'); 
        assert.deepStrictEqual(foundFiles.sort(), expectedFiles.sort());
    });

    it('Should not find any missing-file.txt', () => { 
        const expectedFiles = [] 
        const foundFiles = findFiles(baseDir, 'missing-file.txt');
        assert.deepStrictEqual(foundFiles.sort(), expectedFiles.sort());
    });
});

function setup(baseDir) {
    const dir = join(baseDir, 'dir');
    const nested = join(dir, 'nested');
    if (!existsSync(nested)) { 
        mkdirSync(nested, { recursive: true });
    }
    
    writeFileSync(join(baseDir, 'target-file.txt'), 'File in root');
    writeFileSync(join(baseDir, 'other-file.txt'), 'File in root');
    writeFileSync(join(dir, 'target-file.txt'), 'File in dir');
    writeFileSync(join(dir, 'other-file.txt'), 'File in dir');
    writeFileSync(join(nested, 'target-file.txt'), 'File in subdir');
    writeFileSync(join(nested, 'deep-nested-file.txt'), 'File in subdir');
}

function cleanup(baseDir) {
    rmSync(baseDir, { recursive: true, force: true }); 
}

