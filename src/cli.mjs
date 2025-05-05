import readline from 'node:readline';

export const cli = (username) => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: '>>> ',
    });

    console.log(`Welcome to the File Manager, ${username}!`);
    
    rl.prompt();

    rl.on('line', (line) => {
        const trimmed = line.trim();

        switch (trimmed) {
            case 'exit':
                rl.close();
                break;
            case 'hello':
                console.log('Привет!');
                break;
            default:
                console.log(`Неизвестная команда: ${trimmed}`);
        }

        rl.prompt();
    }).on('close', () => {
        console.log('Консоль завершена.');
        process.exit(0);
    });
}