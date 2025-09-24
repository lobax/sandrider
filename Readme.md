# Sandrider - A Shai-Hulud Malware Detector

Detects any instances of the [Shai-Hulud](https://socket.dev/blog/ongoing-supply-chain-attack-targets-crowdstrike-npm-packages) supply chain attack against NPM packages. 

It recursively scans any provided folder for clear cut indicators of compromise. The script is meant to be **small**, easily **auditable** and useable in **CI pipelines**.
Since the attack targets the NPM infrastructure, the script is written in ES6. 

## Usage
- `node index.mjs` - Scans the current working directory for Shai-Hulud
- `node index.mjs [path]` - Scans [path] for Shai-Hulud

The script can be run as a standalone executable in *nix systems:
- `./index.mjs` - Scans the current working directory for Shai-Hulud
- `./index.mjs [path]` - Scans [path] for Shai-Hulud

## How it works
New packages continue to be identified as this worm spreads. By focusing on the hash rather than package versions, this script can identify future infections and spread.

Currently, the most reliable way to identify compromise is to check for any `bundle.js` with the following sha256 hashes:

- de0e25a3e6c1e1e5998b306b7141b3dc4c0088da9d7bb47c1c00c91e6e4f85d6
- 81d2a004a1bca6ef87a1caf7d0e0b355ad1764238e40ff6d1b1cb77ad4f595c3
- 83a650ce44b2a9854802a7fb4c202877815274c129af49e6c2d1d5d5d55c501e
- 4b2399646573bb737c4969563303d8ee2e9ddbd1b271f1ca9e35ea78062538db
- dc67467a39b70d1cd4c1f7f7a459b35058163592f4a9e8fb4dffcbba98ef210c
- 46faab8ab153fae6e80e7cca38eab363075bb524edd79e42269217a083628f09
- b74caeaa75e077c99f7d44f46daaf9796a3be43ecf24f2a1fd381844669da777

## Limitations

These 7 hashes correspond to the 7 known versions of Shai-Hulud known to be in circulation. Any potential new version with a different hash will not be detectable. 
If more versions surface, then this script will modified to reflect that. 
