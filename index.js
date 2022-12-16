#!/usr/bin/env node

// https://www.twilio.com/blog/how-to-build-a-cli-with-node-js
import chalk from "chalk";
import inquirer from "inquirer";
// https://www.npmjs.com/package/ora
import ora from "ora";
// https://www.npmjs.com/package/listr

// https://github.com/makenotion/notion-sdk-js
// import { Client } from "@notionhq/client"

let userInput;

// const sleep = (ms = 1000) => new Promise((resolve) => {
//     setTimeout(resolve, ms)
// })





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