// https://github.com/mucsi96/forvo
import fetch from 'node-fetch';
import * as dotenv from 'dotenv'
import fs from 'fs'
import path from "path"
dotenv.config()
// require('dotenv').config()

let targetLangWord;

export const getAudio = async (targetLangWord) => {
    const res = await fetch(`https://apifree.forvo.com/key/${process.env.FORVO_KEY}/format/json/action/word-pronunciations/word/${targetLangWord}/language/ru`)
    const data = await res.json()
    // console.log(data.items)
    let mp3URI;
    if (data.items.length > 0) {
        mp3URI = data.items[0].pathmp3
    } else {
        mp3URI = null;
    }

    // console.log(mp3URI)

    return mp3URI;
}

const dirname = path.resolve()
// const dir = path.join(dirname, "/audio")
const dir = "C:/Users/Callum/Downloads/audio"
const file = fs.createWriteStream(`${dir}/${targetLangWord}.mp3`);

export const downloadAudioFile = async (targetLangWord) => {
    const target = await getData(targetLangWord)
    console.log(targetLangWord)
    // sync is fine for such a short script. If script is expanded to download many files at once I can explore the async
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir)
    }

    // https://www.digitalocean.com/community/tutorials/how-to-work-with-files-using-streams-in-node-js
    if (!target) {
        console.log("No audio available")
        return;
    }
    await fetch(target, function (response) {
        response.pipe(file)
        // .on("finish", () => {
        //     console.log("hgrgwrg")
        // })

        // after download completed close filestream
        // file.on("finish", () => {
        //     file.close(() => {
        //         console.log(`Download of ${targetLangWord} completed`);
        //     });

        // });
    });
}


// await new Promise(resolve =>
//     request(url)
//       .pipe(fs.createWriteStream(filename))
//       .on('finish', resolve));



// module.exports = { downloadAudioFile }