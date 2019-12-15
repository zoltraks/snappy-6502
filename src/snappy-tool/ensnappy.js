/**
 * Snappy compression tool
 */

const fs = require("fs");
const readline = require('readline');
const snappy = require('snappy');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let state = {};

function die(error) {
    if (!!error) {
        rl.write(`Error: ${error}`);
    } else {
        rl.write('Finished');
    }
    //rl.write('\r\n');
    rl.close();
}

new Promise((resolve, _reject) => {
    setTimeout(() => resolve(), 0);
}).then(() => {
    return new Promise((resolve) => {
        if (2 < process.argv.length) {
            resolve(process.argv[2]);
        } else {
            rl.question('File to compress: ', (answer) => {
                resolve(answer);
            });
        }
    });
}).then((value) => {
    console.log(`Input file: ${value}`);
    return fs.promises.readFile(value);
}).then((result) => {
    if (0 == result.length) {
        return die('Empty input (no data)');
    }
    state.uncompressedSize = 0 + result.length;
    return new Promise((resolve, reject) => {
        snappy.compress(result, (err, compressed) => {
            if (!!err) {
                reject(err);
            } else {
                resolve(compressed);
            }
        });
    });
}).then((result) => {
    if (0 == result.length) {
        return die('Empty output (no data)');
    }
    state.compressedSize = 0 + result.length;
    state.compressedBuffer = result;
    return new Promise((resolve) => {
        if (3 < process.argv.length) {
            resolve(process.argv[3]);
        } else {
            rl.question('File to save: ', (answer) => {
                resolve(answer);
            });
        }
    });
}).then((result) => {
    state.outputFile = result;
    return fs.promises.writeFile(result, state.compressedBuffer, (err) => {
        if (!!err) {
            reject(err);
        }
        else {
            resolve();
        }
    });
}).then((result) => {
    state.sizeDifference = state.uncompressedSize - state.compressedSize;
    console.log(`File ${state.outputFile} written, saved ${state.sizeDifference} bytes of ${state.uncompressedSize}`);
    die();
}).catch((error) => {
    return die(error);
});
