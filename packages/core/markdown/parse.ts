// readme string → mdast tree
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import { unified } from "unified"
import type { Root } from "mdast"

export async function parse(readme: string) {
    if (!readme) {
        throw new Error("readme not found")
    }

    try {
        const tree = await unified()
            .use(remarkParse)
            .use(remarkGfm)
            .parse(readme) as Root

        return tree;

    } catch (err) {
        throw new Error("internal parsing error" + { error: String(err) })
    }
}