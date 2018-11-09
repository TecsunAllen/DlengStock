const host = '127.0.0.1';
const port = 9001;
const ws = new WebSocket(`ws://${host}:${port}`);
const { spawn } = require('child_process');

ws.on('open', () => {
    ws.send('command server connected!');
});

ws.on('message', (data) => {
    const parsedData = JSON.parse(data);
    switch (parsedData.type) {
        case 'command':
            execute(parsedData.commandArray);
            break;
        default:
            break;
    }
});


function execute(commandArray) {
    const program = commandArray.shift();
    const commandExector = spawn(program, commandArray);

    commandExector.stdout.on('data', (data) => {
        const message = uint8ArrayToString(data);
        ws.send({
            success: true,
            message
        });
    });


    commandExector.stderr.on('data', (data) => {
        const message = uint8ArrayToString(data);
        ws.send({
            success: true,
            message
        });
    });

    commandExector.on('close', (code) => {
        ws.send({
            success: false,
            message: `error code:${code}`
        });
    });
}


function uint8ArrayToString(fileData) {
    let dataString = '';
    for (let i = 0; i < fileData.length; i++)
        dataString += String.fromCharCode(fileData[i]);
    return dataString;
}


