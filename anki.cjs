// import fetch from 'node-fetch';
// import * as dotenv from 'dotenv'
require('dotenv').config()
var XMLHttpRequest = require('xhr2');
// dotenv.config()

const endpoint = process.env.ANKI_CONNECT_ENDPOINT
// const params = JSON.stringify({ "action": "deckNames", "version": 6 })
const getAllDecks = async () => {
    // https://github.com/chenlijun99/autoanki/blob/main/packages/anki-connect/src/index.ts
    const res = await fetch(endpoint, { method: "POST" }, JSON.stringify({ "action": "deckNames", "version": 6, "request": undefined }))
    // const body = await res.json()
    console.log(res)
}

// await getAllDecks()

// const response = await axios.post(
//     origin,
//     JSON.stringify({ action, version, params })
//   );

function invoke(action, version, params = {}) {
    return new Promise((resolve, reject) => {

        const xhr = new XMLHttpRequest();
        xhr.addEventListener('error', () => reject('failed to issue request'));
        xhr.addEventListener('load', () => {
            try {
                const response = JSON.parse(xhr.responseText);
                if (Object.getOwnPropertyNames(response).length != 2) {
                    throw 'response has an unexpected number of fields';
                }
                if (!response.hasOwnProperty('error')) {
                    throw 'response is missing required error field';
                }
                if (!response.hasOwnProperty('result')) {
                    throw 'response is missing required result field';
                }
                if (response.error) {
                    throw response.error;
                }
                resolve(response.result);
            } catch (e) {
                reject(e);
            }
        });

        xhr.open('POST', 'http://127.0.0.1:8765');
        xhr.send(JSON.stringify({ action, version, params }));
    });
}

invoke('createDeck', 6, { deck: 'test1' });
const result = invoke('deckNames', 6);
console.log(`got list of decks: ${result}`);

function invokeAxios(action, version, params = {}) {

}


// try it in axios (already installed)

// https://reflectoring.io/nodejs-modules-imports/