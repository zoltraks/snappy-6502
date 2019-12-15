const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function die(error) {
    if (!!error) {
        rl.write(`Error: ${error}`);
    } else {
        rl.write("Finished");
    }
    rl.close();
}

new Promise((resolve, _reject) => {
    setTimeout(() => resolve(), 0);
}).then(() => {
    return new Promise((resolve, _reject) => {
        rl.question('What\'s your name? ', (answer) => {
            resolve(answer);
        });
    });
}).then((value) => {
    console.log(`Hello, ${value}!`);
    die();
});
