import { mkdirSync, writeFileSync, rmSync, existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import { findFiles } from './findFiles.mjs'

const __filename = fileURLToPath(import.meta.url); 
const __dirname = join(__filename, '..');

describe('Find all matching files', (t) => {
    const baseDir = join(__dirname, 'test_dir');

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

