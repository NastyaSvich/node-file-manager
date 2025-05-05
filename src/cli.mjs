import readline from 'readline';
import os from 'os'
import {cd, ls, up} from "./commands/navigation.mjs";
import {changeDirectory, getCurrentDirectory} from "./utils/directory.mjs";
import {getErrorOperationFailed} from "./utils/error.mjs";
import {add, cat, cp, mkdir, mv, rm, rn} from "./commands/fs.mjs";
import {osArchitecture, osCpus, osEOL, osHomedir, osUsername} from "./commands/os.mjs";
import {hash} from "./commands/hash.mjs";
import {compress, decompress} from "./commands/archive.mjs";

export const cli = (username) => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: '>>> ',
    });
    
    console.log(`Welcome to the File Manager, ${username}!`);
    changeDirectory(os.homedir());
    printCurrentDirectory();
    
    rl.prompt();
    
    rl.on('line', async (line) => {
        const [baseCommand, ...args] = line.trim().split(' ');

        try {
            switch (baseCommand) {
                case '.exit':
                    exit(rl, username);
                    break;
                    
                // navigation
                case 'up':
                    up();
                    break;
                case 'cd':
                    await cd(args.join(' '));
                    break;
                case 'ls':
                    await ls();
                    break;
                    
                // file-system
                case 'cat':
                    cat(rl, args.join(' '));
                    break;
                case 'add':
                    await add(args.join(' '));
                    break;
                case 'mkdir':
                    await mkdir(args.join(' '));
                    break;
                case 'rn':
                    await rn(args[0], args[1]);
                    break;
                case 'cp':
                    await cp(args[0], args[1]);
                    break;
                case 'mv':
                    await mv(args[0], args[1]);
                    break;
                case 'rm':
                    await rm(args.join(' '));
                    break;
                    
                // operating system
                case ('os'):
                    switch (args[0]) {
                        case '--EOL':
                            osEOL();
                            break;
                        case '--cpus':
                            osCpus();
                            break;
                        case '--homedir':
                            osHomedir();
                            break;
                        case '--username':
                            osUsername();
                            break;
                        case '--architecture':
                            osArchitecture();
                            break;
                        default: console.error('Invalid input');
                    }
                    break;
    
                // hash
                case 'hash':
                    hash(rl, args.join(' '));
                    break;
    
                // compress
                case 'compress':
                    await compress(args[0], args[1]);
                    break;
    
                // decompress
                case 'decompress':
                    await decompress(args[0], args[1]);
                    break;
                    
                default: console.error('Invalid input');
            }
        } catch {
            getErrorOperationFailed();
        } finally {
            printCurrentDirectory();
            rl.prompt();
        }
    });
    
    rl.on('SIGINT', () => {
        exit(rl, username);
    });
}

const exit = (rl, username) => {
    console.log(`\nThank you for using File Manager, ${username}, goodbye!`);
    rl.close();
    process.exit(0);
}

const printCurrentDirectory = () => {
    console.log(`\nYou are currently in ${getCurrentDirectory()}`);
}