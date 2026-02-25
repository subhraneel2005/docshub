import { getAllReadmes } from "../actions/github/get-all-readme-files"

(async () => {
    console.log("TEST STARTED");
    try {
        console.log("INSIDE TRY");
        const files = await getAllReadmes("", "subhraneel2005", "daily-logs")
        console.log(`Files: ${JSON.stringify(files)}`)
    } catch (error) {
        console.log("INSIDE CATCH");
        console.error(`Error getting readme files: ${error}`)
    }
})()
