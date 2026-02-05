import { generateDocs } from "@/lib/docs-generator/generate-docs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { readme } = await req.json();

    try {
        const docs = await generateDocs(readme);

        // store in DB / blob
        // await db.generatedDocs.create({ projectId, docs })

        return NextResponse.json(docs, { status: 201 });
    } catch (error) {
        return NextResponse.json(error, { status: 500 })
    }
}
