import {resolve, basename} from "path";
import {getAbsolutePath, getPrevDirectory} from "../utils/directory.mjs";
import fs from 'node:fs/promises'
import {getErrorOperationFailed} from "../utils/error.mjs";
import {createReadStream, createWriteStream} from "fs";
import {pipeline} from "node:stream/promises";

export const cat = (rl, path) => {
    const absolutePath = getAbsolutePath(path);
    const readableStream  = createReadStream(absolutePath, {encoding: "utf-8"});
    
    readableStream.pipe(process.stdout);
    
    readableStream.on('end', () => {
        console.log('\n ---------- File reading finished ----------');
        rl.prompt();
    });
    
    readableStream.on('error', () => {
        getErrorOperationFailed();
        rl.prompt();
    });
}

export const add = async (fileName) => {
    const filePath = getAbsolutePath(fileName);
    await fs.writeFile(filePath, '', { flag: 'wx' });
    console.log('File created successfully!');
}

export const mkdir = async (dirName) => {
    const dirPath = getAbsolutePath(dirName);
    try {
        await fs.mkdir(dirPath);
        console.log('Directory created successfully!');
    } catch {
        getErrorOperationFailed();
    }
}

export const rn = async (pathToFile, newFileName) => {
    const absoluteOldPath = getAbsolutePath(pathToFile)
    const path = getPrevDirectory(absoluteOldPath);
    const absoluteNewPath = resolve(path, newFileName);
    try {
        await fs.rename(absoluteOldPath, absoluteNewPath);
        console.log('File renamed successfully!');
    } catch {
        getErrorOperationFailed();
    }
}

export const cp = async (pathToFile, pathToNewDir) => {
    await copyFile(pathToFile, pathToNewDir, () => {
        console.log('File copied successfully!')
    });
}

export const mv = async (pathToFile, pathToNewDir) => {
    await copyFile(pathToFile, pathToNewDir, async () => {
        await fs.unlink(getAbsolutePath(pathToFile));
        console.log('File moved successfully!');
    });
}

export const rm = async (pathToFile) => {
    try {
        await fs.unlink(getAbsolutePath(pathToFile));
        console.log('File deleted successfully!');
    } catch {
        getErrorOperationFailed();
    }
}

async function copyFile(pathToFile, pathToNewDir, handlerAfterCP) {
    const absoluteOldPath = getAbsolutePath(pathToFile);
    const fileName = basename(absoluteOldPath);
    const absoluteNewPath = resolve(pathToNewDir, fileName);
    
    try {
        await pipeline(
            createReadStream(absoluteOldPath),
            createWriteStream(absoluteNewPath),
        );
        
        await handlerAfterCP();
    } catch {
        getErrorOperationFailed();
    }
}