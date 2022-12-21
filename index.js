#!/usr/bin/env node

// https://www.twilio.com/blog/how-to-build-a-cli-with-node-js
import chalk from "chalk";
import inquirer from "inquirer";
// https://www.npmjs.com/package/ora
// import ora from "ora";
import { createSpinner } from 'nanospinner'
// https://www.npmjs.com/package/listr

// https://github.com/makenotion/notion-sdk-js
// import { Client } from "@notionhq/client"

import { getVocabItemsFromNotion, updateAnkiStatusInNotion } from "./notion.cjs";
import { invokeAnki } from "./anki.cjs";
import { getAudio } from "./forvo.js"
import { isRunning } from "./isRunning.cjs";



const sleep = (ms = 500) => new Promise((resolve) => {
    setTimeout(resolve, ms)
})

const spinner = createSpinner()
const checkIsRunning = async () => {
    isRunning('anki.exe', (status) => {
        // console.log(status); // true|false
        // return status;
        if (!status) {
            console.log(chalk.red("Anki must be running with anki-connect add-on"))
            return process.exit(0)
        }
    })
}



// 0. Ensure Anki is running first
async function getUserInput() {

    const response = await inquirer.prompt({
        name: "question_1",
        type: "list",
        message: "Notion-anki multi-tool (beta)\n Which service would you like to run?\n",
        choices: [
            "Create new cards from notion database",
            "Quit"
        ]
    })


    return handleResponse(response.question_1);
}

const handleResponse = async (res) => {
    if (res === "Create new cards from notion database") {
        spinner.start({ text: "Connecting to notion...\n", color: "magenta" })
        const data = await getVocabItemsFromNotion()
        await sleep()
        spinner.success({ text: `${data.length} new items retrieved from notion\n` })
        addCards(data)
        // spinner.clear()
    } else if (res === "Quit?") {
        spinner.warn({ text: ' Quitting...', color: 'yellow' })
        // console.log(chalk.yellow("Quitting..."))
        await sleep()
        return process.exit(0)
    }
    else {
        spinner.error({ text: 'Error, exiting script...', color: 'red' })
        await sleep()
        return process.exit(0)
    }
}


// 0.5 Ask user if they want to generate translations or just create flashcards
// 1. loop through all notion entries where added to anki = false (no)



// 2. Download all audio files if they exist

// const downloadAudio = async () => {
//     data.forEach(item => {
//         console.log("Downloading")
//         downloadAudioFile(item.target).then(() => {
//             console.log(`${item.target} finished download`)
//         })
//     });
// }

// 3. Add a new card to anki deck with entries and audio file attached



// should be async I think idk
const addCards = async (data) => {

    if (!data.length > 0) {
        console.log(chalk.yellow("No new items found"))
        return;
    }

    console.log(chalk.green(`${data.length} new items found, card creation started...`))



    // data.forEach(item => {

    //     getAudio(item.target).then((mp3URI) => {
    //         spinner.start({ text: `Finding audio for ${item.target}...` })
    //         if (mp3URI) {
    //             spinner.success({ text: `Audio found for ${item.target}` })
    //         } else {
    //             spinner.error({ text: `Audio for ${item.target} not found` })
    //             // This is crude, should not kill process completely. Should just skip item. 
    //             // Will fix when queue system implemented
    //             throw "No audio found."
    //         }

    //         spinner.start({ text: `Creating card for ${item.target}...` })

    //         // Anki seems to get overwhelmed if more than 5 or so items are added in quick succession. 
    //         // Queue system is necessary - use pop/push to add to a queue. Then loop over queue with timeout of 1 secondf and do this
    //         //  let queue = [];
    //         // queue.push(2);         // queue is now [2]
    //         // queue.push(5);         // queue is now [2, 5]
    //         // var i = queue.shift(); // queue is now [5]
    //         // alert(i);              

    //         invokeAnki('addNote', 6, {
    //             "note": {
    //                 deckName: 'RussianTest', modelName: "Basic",
    //                 "fields": {
    //                     // Final whitespace is intentional to separate audio button from text
    //                     "Front": `${item.target} (${item.gender}) `,
    //                     "Back": `${item.english}`
    //                 },
    //                 // Does not handle if no audio file availiable
    //                 "audio": [{
    //                     "url": `${mp3URI}`,
    //                     // "path": "audio",
    //                     "filename": `_${item.target}.mp3`,
    //                     // "filename": `${item.target}.mp3`,
    //                     "fields": [
    //                         "Front"
    //                     ]
    //                 }],
    //             },
    //         }).then(() => {
    //             spinner.success({ text: `Card created for ${item.target}` })
    //             // console.log("Anki ran")
    //             spinner.success({ text: `${item.target} added to Anki` })
    //         }).then(() => {
    //             // Only do this if no error
    //             updateAnkiStatusInNotion(item)
    //             spinner.success({ text: `${item.target} status updated in notion` })
    //         })
    //     }).catch(error => {
    //         console.log(error, "Service terminated")
    //         sleep()
    //         process.exit(1)
    //     })
    // })
    // Anki-connect does not seem to cope with more that 6 items in quick succession. 
    // Workaround for now is to change forEach to for lo0p with sleep delay.
    // I am aware this isn't ideal, and a promise-based forEach loop is better.
    // https://stackoverflow.com/questions/45498873/add-a-delay-after-executing-each-iteration-with-foreach-loop
    // Will implement something like this when my brain is not dead from the flu.
    // This works for now.
    for (let i = 0; i < data.length; i++) {
        await sleep()
        getAudio(data[i].target).then((mp3URI) => {
            const currentItem = data[i]
            spinner.start({ text: `Finding audio for ${currentItem.target}...` })
            if (mp3URI) {
                spinner.success({ text: "Audio found for " + chalk.magenta(`${currentItem.target}`) })
            } else {
                spinner.error({ text: `Audio for ${currentItem.target} not found` })
                // This is crude, should not kill process completely. Should just skip item. 
                // Will fix when queue system implemented
                throw "No audio found."
            }

            spinner.start({ text: "Creating card for " + chalk.magenta(`${currentItem.target}...`) })

            // Anki seems to get overwhelmed if more than 5 or so items are added in quick succession. 
            // Queue system is necessary - use pop/push to add to a queue. Then loop over queue with timeout of 1 secondf and do this
            //  let queue = [];
            // queue.push(2);         // queue is now [2]
            // queue.push(5);         // queue is now [2, 5]
            // var i = queue.shift(); // queue is now [5]
            // alert(i);              

            invokeAnki('addNote', 6, {
                "note": {
                    deckName: 'RussianTest', modelName: "Basic",
                    "fields": {
                        // Final whitespace is intentional to separate audio button from text
                        "Front": `${currentItem.target} (${currentItem.gender}) `,
                        "Back": `${currentItem.english}`
                    },
                    // Does not handle if no audio file availiable
                    "audio": [{
                        "url": `${mp3URI}`,
                        // "path": "audio",
                        "filename": `_${currentItem.target}.mp3`,
                        // "filename": `${item.target}.mp3`,
                        "fields": [
                            "Front"
                        ]
                    }],
                },
            }).then(() => {
                spinner.success({ text: "Card created for " + chalk.magenta(`${currentItem.target}`) })
                // console.log("Anki ran")
                spinner.success({ text: chalk.magenta(`${currentItem.target}` + " added to Anki") })
            }).then(() => {
                // Only do this if no error
                updateAnkiStatusInNotion(currentItem)
                spinner.success({ text: chalk.magenta(`${currentItem.target}`) + " status updated in notion" })
            })
        }).catch(error => {
            console.log(error, "Service terminated")
            sleep()
            process.exit(1)
        })
        // console.log(`for loop ${i}`)
    }

}

// if (isAnkiRunning) {
// addCards()
// } else {
//     console.log("Anki must be running with anki-connect add-on")
// }
await checkIsRunning()


await getUserInput()



// 4. Add inquirer + chalk + ora
// TO-DO: If anki deck does not exist, create one. Give user better summary of what the result was, how many were added etc


// if user types exit then quit
// process.exit(0)


// https://foosoft.net/projects/anki-connect/ addNote function
// https://api.forvo.com/plans-and-pricing/

// ask user which Notion db they want to access
// Needs to check notion db for items that have "added to anki" = false and word.length >= 1
// For each item not already added to anki then find forvo audio (if exists)
// Then addNote to Anki with audio
// Finally if success then update db to say added to anki true

// TO DO: Add settings stored to settings.json accessible from cmd line