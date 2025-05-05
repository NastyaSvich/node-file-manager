import {resolve} from "path";
import {changeDirectory, getCurrentDirectory, getPrevDirectory} from "../utils/directory.mjs";
import fs from 'node:fs/promises'
import {getErrorOperationFailed} from "../utils/error.mjs";

export const up = () => {
    const currentDir = getCurrentDirectory();
    const parentDir = getPrevDirectory(currentDir);
    
    if (parentDir !== currentDir) {
        changeDirectory(parentDir);
    }
}

export const ls = async () => {
    const currentDir = getCurrentDirectory();
    const dirs = await fs.readdir(currentDir);
    
    const dirsInfo = await Promise.all(
        dirs.map(async (dir) => {
            const absolutePath = resolve(currentDir, dir);
            const stats = await fs.stat(absolutePath);
            return {
                name: dir,
                type: stats.isDirectory() ? 'directory' : 'file',
            };
        })
    );
    
    console.table(sortDirectory(dirsInfo));
}

export const cd = async (path) => {
    const absolutePath = resolve(getCurrentDirectory(), path);
    const stats = await fs.stat(absolutePath);
    if (!stats.isDirectory()) {
        getErrorOperationFailed();
    }
    changeDirectory(absolutePath);
}

function sortDirectory(dir) {
    return dir.sort((a, b) => {
        if (a.type !== b.type) {
            return a.type === 'directory' ? -1 : 1;
        }
        return a.name.localeCompare(b.name);
    });
}