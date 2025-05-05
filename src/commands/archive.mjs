import {basename, resolve, extname} from "path";
import {pipeline} from "stream/promises";
import fs from "fs";
import zlib from "zlib";
import {getAbsolutePath} from "../utils/directory.mjs";
import {getErrorOperationFailed} from "../utils/error.mjs";

export const compress = async (pathToFile, pathToDestination) => {
    const sourceFilePath = getAbsolutePath(pathToFile);
    const fileName = basename(sourceFilePath);
    const compressedFilePath = resolve(getAbsolutePath(pathToDestination), `${fileName}.gz`);

    try {
        await pipeline(
            fs.createReadStream(sourceFilePath),
            zlib.createBrotliCompress(),
            fs.createWriteStream(compressedFilePath),
        );
        
        console.log("Successfully compressed!");
    } catch {
        getErrorOperationFailed();
    }
};

export const decompress = async (pathToFile, pathToDestination) => {
    const sourceFilePath = getAbsolutePath(pathToFile);
    const fileName = basename(sourceFilePath, extname(sourceFilePath));
    const decompressedFilePath = resolve(getAbsolutePath(pathToDestination), fileName);
    
    try {
        await pipeline(
            fs.createReadStream(sourceFilePath),
            zlib.createBrotliDecompress(),
            fs.createWriteStream(decompressedFilePath),
        );
    
        console.log("Successfully decompressed!");
    } catch {
        getErrorOperationFailed();
    }
};