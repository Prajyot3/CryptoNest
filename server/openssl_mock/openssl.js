const fs = require('fs');
const crypto = require('crypto');

const args = process.argv.slice(2);
const command = args[0];

try {
    if (command === 'genrsa') {
        const outFileIndex = args.indexOf('-out');
        const outFile = args[outFileIndex + 1];
        const { privateKey } = crypto.generateKeyPairSync('rsa', {
            modulusLength: 2048,
            privateKeyEncoding: { type: 'pkcs1', format: 'pem' }
        });
        fs.writeFileSync(outFile, privateKey);
    } else if (command === 'rsa') {
        const inFile = args[args.indexOf('-in') + 1];
        const outFile = args[args.indexOf('-out') + 1];
        const privateKey = fs.readFileSync(inFile, 'utf8');
        const key = crypto.createPrivateKey(privateKey);
        const pubKey = crypto.createPublicKey(key);
        const publicKey = pubKey.export({ type: 'spki', format: 'pem' });
        fs.writeFileSync(outFile, publicKey);
    } else if (command === 'pkeyutl') {
        const isEncrypt = args.includes('-encrypt');
        const isDecrypt = args.includes('-decrypt');
        const inKey = args[args.indexOf('-inkey') + 1];
        const inFile = args[args.indexOf('-in') + 1];
        const outFile = args[args.indexOf('-out') + 1];

        if (isEncrypt) {
            const publicKey = fs.readFileSync(inKey, 'utf8');
            const data = fs.readFileSync(inFile);
            const encrypted = crypto.publicEncrypt({
                key: publicKey,
                padding: crypto.constants.RSA_PKCS1_PADDING
            }, data);
            fs.writeFileSync(outFile, encrypted);
        } else if (isDecrypt) {
            const privateKey = fs.readFileSync(inKey, 'utf8');
            const data = fs.readFileSync(inFile);
            const decrypted = crypto.privateDecrypt({
                key: privateKey,
                padding: crypto.constants.RSA_PKCS1_PADDING
            }, data);
            fs.writeFileSync(outFile, decrypted);
        }
    }
} catch (error) {
    console.error('Mock OpenSSL Error:', error.message);
    process.exit(1);
}
