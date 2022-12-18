#!/usr/bin/env node

// https://www.twilio.com/blog/how-to-build-a-cli-with-node-js
import chalk from "chalk";
import inquirer from "inquirer";
// https://www.npmjs.com/package/ora
import ora from "ora";
// https://www.npmjs.com/package/listr

// https://github.com/makenotion/notion-sdk-js
// import { Client } from "@notionhq/client"

import { getVocabItemsFromNotion, updateAnkiStatusInNotion } from "./notion.cjs";
import { invokeAnki } from "./anki.cjs";
import { downloadAudioFile, getData } from "./forvo.js"

let userInput;

// const sleep = (ms = 1000) => new Promise((resolve) => {
//     setTimeout(resolve, ms)
// })

// Worry about user input later

// 0. Ensure Anki is running first

// 1. loop through all notion entries where added to anki = false (no)
const data = await getVocabItemsFromNotion()

// console.log("Called from index", data)

// 2. Download all audio files if they exist

const downloadAudio = async () => {
    data.forEach(item => {
        console.log("Downloading")
        downloadAudioFile(item.target).then(() => {
            console.log(`${item.target} finished download`)
        })
    });
}

// 3. Add a new card to anki deck with entries and audio file attached



// should be async I think idk
const addCards = () => {
    // let audioURI;
    console.log(`${data.length} new items found, card creation initiated:`)
    data.forEach(item => {
        console.log(`Finding audio for ${item.target}...`)
        getData(item.target).then((mp3URI) => {
            console.log(`Creating card for ${item.target}...`)
            invokeAnki('addNote', 6, {
                "note": {
                    deckName: 'testDeck', modelName: "Basic",
                    "fields": {
                        "Front": `${item.target} `,
                        "Back": `${item.english}`
                    },
                    // Does not handle if no audio file availiable
                    "audio": [{
                        "url": `${mp3URI}`,
                        // "path": "audio",
                        "filename": `_${item.target}.mp3`,
                        // "filename": `${item.target}.mp3`,
                        "fields": [
                            "Front"
                        ]
                    }],
                },
            })
        }).then(() => {
            // Only do this if no error

            updateAnkiStatusInNotion(item)
        })


    })

}

addCards()


// 4. Add inquirer + chalk + ora
// TO-DO: If anki deck does not exist, create one. Give user better summary of what the result was, how many were added etc


// async function getInput() {
//     const response = await inquirer.prompt({
//         name: "userRes",
//         type: "input",
//         message: "Input here please"
//     })
//     // const testLog = 'Test input here');

//     // await sleep()

//     userInput = response.userRes
//     console.log(chalk.blue(`${userInput}`))
// }

// await getInput()


// https://foosoft.net/projects/anki-connect/ addNote function
// https://api.forvo.com/plans-and-pricing/

// ask user which Notion db they want to access
// Needs to check notion db for items that have "added to anki" = false and word.length >= 1
// For each item not already added to anki then find forvo audio (if exists)
// Then addNote to Anki with audio
// Finally if success then update db to say added to anki true

// TO DO: Add settings stored to settings.json accessible from cmd line