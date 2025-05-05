import readline from 'node:readline';
import {homedir} from 'node:os'
import {cd, ls, up} from "./commands/navigation.mjs";
import {changeDirectory, getCurrentDirectory} from "./utils/directory.mjs";
import {getErrorOperationFailed} from "./utils/error.mjs";
import {add, cat, cp, mkdir, mv, rm, rn} from "./commands/fs.mjs";

export const cli = (username) => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: '>>> ',
    });
    
    console.log(`Welcome to the File Manager, ${username}!`);
    changeDirectory(homedir());
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
                    
                default:
                    console.error('Invalid input');
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