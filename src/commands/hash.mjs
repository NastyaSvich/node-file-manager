import {getAbsolutePath} from "../utils/directory.mjs";
import {createHash} from "crypto";
import fs from "fs";
import {getErrorOperationFailed} from "../utils/error.mjs";

export const hash = (rl, pathToFile) => {
    const filePath = getAbsolutePath(pathToFile);
    const algorithm = 'sha256';
    const encoding = 'hex';
    const hash = createHash(algorithm);
    
    const readableStream  = fs.createReadStream(filePath);
    
    readableStream.on('data', (chunk) => {
        hash.update(chunk);
    });
    
    readableStream.on('end', () => {
        const hexHash = hash.digest(encoding);
        console.log(`\nHash: ${hexHash}`);
        console.log(`Hash algorithm: ${algorithm}`);
        console.log(`Hash encoding: ${encoding}`);
        rl.prompt();
    });
    
    readableStream.on('error', () => {
        getErrorOperationFailed();
        rl.prompt();
    });
}