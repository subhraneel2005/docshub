import { getMdContent } from "../actions/github/get-md-content"

(async () => {
    try {
        const content = await getMdContent({
            token: "",
            owner: "subhraneel2005",
            repo: "daily-logs",
            path: "gsoc-stuff.mdx"
        })

        console.log(`MD content: ${JSON.stringify(content, null, 2)}`);

    } catch (error) {
        console.error(`Error getting md content: ${error}`)
    }
})()