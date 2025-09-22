import process from 'node:process';
import { createHash } from 'crypto';
import { createReadStream } from 'fs';
import { findFiles } from './src/findFiles.mjs'
import { join } from 'path';

const shaiHulud = [
    'de0e25a3e6c1e1e5998b306b7141b3dc4c0088da9d7bb47c1c00c91e6e4f85d6',
    '81d2a004a1bca6ef87a1caf7d0e0b355ad1764238e40ff6d1b1cb77ad4f595c3',
    '83a650ce44b2a9854802a7fb4c202877815274c129af49e6c2d1d5d5d55c501e',
    '4b2399646573bb737c4969563303d8ee2e9ddbd1b271f1ca9e35ea78062538db',
    'dc67467a39b70d1cd4c1f7f7a459b35058163592f4a9e8fb4dffcbba98ef210c',
    '46faab8ab153fae6e80e7cca38eab363075bb524edd79e42269217a083628f09',
    'b74caeaa75e077c99f7d44f46daaf9796a3be43ecf24f2a1fd381844669da777',
]


function fileHash(filePath) {
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

function parseResults(results) {
    // We didn't find anything
    if (Array.isArray(results) && results.length === 0) {
        console.log("🟢 No Evidence of Shai Hulud found 🟢"); 
    }
    else { 
        console.error('⚠️  Shai Hulud Found! ⚠️ ');
        console.error('=======================');
        results.forEach(res => { 
            console.error(`☣️  ${res.filePath}`);
        });
        process.exit(1);
    }

}

(async () => {
    let rootPath = process.argv.length > 2 ? process.argv[2] : process.cwd(); 
    console.log(rootPath)
    try {
        const bundles = findFiles(rootPath, 'bundle.js'); 
        const hashPromises = bundles.map(fileHash);
        const hashes = await Promise.all(hashPromises); 
        const result = hashes.filter(({file, hash}) => shaiHulud.includes(hash));
        parseResults(result); 
    } catch(err) {
        console.error('Error: ', err);
    }
})();
