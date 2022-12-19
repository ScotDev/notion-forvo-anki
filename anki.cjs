// import fetch from 'node-fetch';
// import * as dotenv from 'dotenv'
require('dotenv').config()
// dotenv.config()
const axios = require("axios")


const endpoint = process.env.ANKI_CONNECT_ENDPOINT
// const params = JSON.stringify({ "action": "deckNames", "version": 6 })
// const getAllDecks = async () => {
//     // https://github.com/chenlijun99/autoanki/blob/main/packages/anki-connect/src/index.ts
//     const res = await fetch(endpoint, { method: "POST" }, JSON.stringify({ "action": "deckNames", "version": 6, "request": undefined }))
//     // const body = await res.json()
//     console.log(res)
// }

// await getAllDecks()

// const response = await axios.post(
//     origin,
//     JSON.stringify({ action, version, params })
//   );

// function invoke(action, version, params = {}) {
//     return new Promise((resolve, reject) => {

//         const xhr = new XMLHttpRequest();
//         xhr.addEventListener('error', () => reject('failed to issue request'));
//         xhr.addEventListener('load', () => {
//             try {
//                 const response = JSON.parse(xhr.responseText);
//                 if (Object.getOwnPropertyNames(response).length != 2) {
//                     throw 'response has an unexpected number of fields';
//                 }
//                 if (!response.hasOwnProperty('error')) {
//                     throw 'response is missing required error field';
//                 }
//                 if (!response.hasOwnProperty('result')) {
//                     throw 'response is missing required result field';
//                 }
//                 if (response.error) {
//                     throw response.error;
//                 }
//                 resolve(response.result);
//             } catch (e) {
//                 reject(e);
//             }
//         });

//         xhr.open('POST', 'http://127.0.0.1:8765');
//         xhr.send(JSON.stringify({ action, version, params }));
//     });
// }

// invoke('createDeck', 6, { deck: 'test2' });
// const result = invoke('deckNames', 6);
// console.log(`got list of decks: ${result}`);

// const sleep = (ms = 1000) => new Promise((resolve) => {
//     setTimeout(resolve, ms)
// })

const invokeAnki = async (action, version, params = {}) => {

    try {
        // await sleep()
        const response = await axios.post(
            endpoint,
            JSON.stringify({ action, version, params })
        );
        // console.log(await response.data)
        if (response.error) {
            // Or response.data.error
            throw response.error;
        }
    } catch (error) {
        console.log(error)
    }


    // if deck doesn't exist, create it then add note?

    // json parse response text?

    // Handle errors


}


// https://reflectoring.io/nodejs-modules-imports/

module.exports = { invokeAnki };