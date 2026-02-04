export interface MetaMap {
    [slug: string]: string;
}

export function buildMeta(pages: {
    slug: string;
    title: string;
    parent?: string;
}[]) {
    const root: MetaMap = {};
    const nested: Record<string, MetaMap> = {};

    for (const p of pages) {
        if (!p.parent) {
            root[p.slug] = p.title;
        } else {
            if (!nested[p.parent]) nested[p.parent] = {};
            nested[p.parent][p.slug] = p.title;
        }
    }

    return {
        root,
        nested,
    };
}
