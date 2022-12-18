const { Client } = require("@notionhq/client")
require('dotenv').config()

const notion = new Client({
    auth: process.env.NOTION_ACCESS_TOKEN
})
const databaseId = process.env.NOTION_VOCAB_DB_ID;
// async function notionTest() {
//     // const listUsersResponse = await notion.users.list({})
//     // console.log(listUsersResponse)

//     const response = await notion.databases.retrieve({ database_id: databaseId });
//     console.log(response.properties);
// }

// notionTest()
// console.log(process.env.NOTION_VOCAB_DB_ID)

// https://github.com/makenotion/notion-sdk-js/blob/main/examples/notion-github-sync/index.js

const lang = "Russian" // This will be retrieved first when looking for db

async function getVocabItemsFromNotion() {
    const items = []
    const newVocabItems = []
    let cursor = undefined
    while (true) {
        const { results, next_cursor } = await notion.databases.query({
            database_id: databaseId,
            start_cursor: cursor,
        })
        items.push(...results)
        if (!next_cursor) {
            break
        }
        cursor = next_cursor
    }
    console.log(`${items.length} items successfully fetched from notion.`)
    // console.log(items)

    for (const item of items) {
        if (item.properties["Added to Anki"].status.name === "No" && item.properties["Word in target lang"].title.length >= 1) {
            // console.log(lang, item.properties["Word in target lang"].title[0].plain_text, ":", item.properties["Word in English"].rollup.array[0].title[0].plain_text)
            newVocabItems.push({ pageID: item.id, target: item.properties["Word in target lang"].title[0].plain_text, english: item.properties["Word in English"].rollup.array[0].title[0].plain_text })
        }

    }
    // currently only console.logs them - should return array of values 
    console.log("new items:", newVocabItems)
    return newVocabItems;

}


const updateAnkiStatusInNotion = async (itemToUpdate) => {
    // const itemsToUpdate = await getVocabItemsFromNotion()
    if (!itemToUpdate) {
        return;
    }
    // for (const item of itemsToUpdate) {
    await notion.pages.update({
        page_id: itemToUpdate.pageID,
        properties: {
            "Added to Anki": {
                status: {
                    name: "Yes"
                }
            }
        }

    })
    // }
    console.log(`Updated Anki status for  ${itemToUpdate.target}`)
}


module.exports = { getVocabItemsFromNotion, updateAnkiStatusInNotion };