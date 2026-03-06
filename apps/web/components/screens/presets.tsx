"use client"

import {
    Layers,
    Github,
    Star,
    ChevronLeft,
    ArrowUpRight
} from 'lucide-react';
import Link from 'next/link';

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function PresetsPage() {
    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
            {/* Texture Layer */}
            <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-multiply" />

            {/* Navigation */}
            <nav className="flex justify-between items-center border-b border-border sticky top-0 z-40 bg-background/80 backdrop-blur-md">
                <div className='flex justify-between items-center px-6 md:px-12 py-4 md:py-6 max-w-7xl mx-auto w-full'>
                    <div className="flex items-center gap-4">
                        <Link href="/">
                            <Button variant="ghost" size="sm" className="gap-2 opacity-50 hover:opacity-100 transition-opacity">
                                <ChevronLeft size={14} /> Back
                            </Button>
                        </Link>
                    </div>

                    <div className="hidden md:flex gap-4 items-center">
                        <Link href="https://github.com/subhraneel2005/docshub" target="_blank">
                            <Button variant="outline" size="sm" className="gap-0 border-primary/20 p-0 overflow-hidden group">
                                <div className="flex items-center gap-2 px-3 py-2 border-r border-primary/10 group-hover:bg-primary/5 transition-colors text-[10px] uppercase font-bold tracking-widest text-primary">
                                    <Github size={14} /> GitHub
                                </div>
                                <div className="flex items-center gap-1.5 px-3 py-2 bg-muted/50 text-[10px] font-mono">
                                    <Star fill='yellow' size={12} className="text-warning fill-warning" /> 2
                                </div>
                            </Button>
                        </Link>
                    </div>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto px-6 py-20">
                <header className="mb-16">
                    <div className="flex items-center gap-3 mb-4">
                        <Layers className="text-primary" size={20} />
                        <span className="text-[10px] uppercase tracking-[0.4em] font-bold opacity-40 italic">Output Configurations</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold italic tracking-tighter mb-6">Target Ecosystems</h1>
                    <p className="text-muted-foreground text-lg max-w-2xl font-light leading-relaxed">
                        Docshub isn&apos;t just a generator, it&apos;s an adapter. Select a preset to auto-format metadata, frontmatter, and file structures for your favorite documentation framework.
                    </p>
                </header>

                {/* Preset Selector Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border">
                    <PresetCard
                        name="Fumadocs"
                        flag="--preset fumadocs"
                        status="Native"
                        desc="Auto-generates directory-level _meta.json and handles Next.js App Router mapping."
                        features={["Recursive _meta.json", "MDX Injection", "TOC Support"]}
                    />
                    <PresetCard
                        name="Mintlify"
                        flag="--preset mintlify"
                        status="Beta"
                        desc="Compiles a centralized mint.json and prepares file structures for the Mintlify cloud."
                        features={["Global mint.json", "Sidebar Mapping", "Static Assets"]}
                    />
                    <PresetCard
                        name="Nextra"
                        flag="--preset nextra"
                        status="Planned"
                        desc="Optimized for the Nextra Page Router and Theme-Docs standard metadata."
                        features={["Theme Mapping", "i18n Ready", "Remote MDX"]}
                    />
                    <PresetCard
                        name="Docusaurus"
                        flag="--preset docusaurus"
                        status="Planned"
                        desc="Adheres to the Docusaurus sidebar.js logic and category.json generation."
                        features={["Sidebars.js logic", "React-Native ready", "Versioning"]}
                    />
                    <PresetCard
                        name="Markdown Raw"
                        flag="--preset raw"
                        status="Stable"
                        desc="Clean, framework-agnostic MDX files for custom site implementations."
                        features={["Pure MDX", "System Tags", "Full Control"]}
                    />
                    <Link href={"/request"}>
                        <div className="bg-muted/10 p-10 flex flex-col justify-center items-center text-center space-y-4 group cursor-pointer border-dashed border-2 border-border/50 m-4">
                            <div className="w-12 h-12 rounded-full bg-background border border-border flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:border-primary transition-all">
                                <ArrowUpRight size={24} />
                            </div>
                            <h4 className="text-xs uppercase font-bold tracking-widest">Request Preset</h4>
                            <p className="text-[10px] text-muted-foreground italic leading-tight">Missing your framework? Open a proposal on GitHub.</p>
                        </div>
                    </Link>
                </div>

                <section className="mt-24 bg-primary p-12 text-primary-foreground flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="space-y-2">
                        <h3 className="text-3xl font-bold italic tracking-tighter uppercase">The One-Command Workflow</h3>
                        <p className="text-sm opacity-80 font-light italic leading-relaxed max-w-md">
                            No manual moving. Use the upcoming <code className="bg-white/10 px-1 italic">--init</code> flag to clone a starter and hydrate it with AI docs in one go.
                        </p>
                    </div>
                    <div className="bg-black/20 p-6 border border-white/10 backdrop-blur-md">
                        <code className="text-xs font-mono flex items-center gap-3">
                            <span className="text-emerald-400">❯</span> docshub --init fumadocs
                        </code>
                    </div>
                </section>
            </main>


        </div>
    );
}

function PresetCard({ name, flag, status, desc, features }: { name: string, flag: string, status: string, desc: string, features: string[] }) {
    return (
        <Card className="rounded-none border-none bg-background hover:bg-muted/20 transition-all group p-10 flex flex-col h-full">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-2xl font-bold italic tracking-tighter mb-1">{name}</h3>
                    <code className="text-[9px] font-mono text-primary opacity-60 uppercase">{flag}</code>
                </div>
                <Badge variant="outline" className={`rounded-none text-[8px] px-1.5 ${status === 'Native' ? 'border-emerald-500 text-emerald-500' :
                    status === 'Beta' ? 'border-warning text-warning' : 'opacity-40'
                    }`}>
                    {status}
                </Badge>
            </div>
            <p className="text-xs text-muted-foreground font-light leading-relaxed mb-8 italic">
                {desc}
            </p>
            <div className="mt-auto pt-6 border-t border-border/50">
                <div className="flex flex-wrap gap-2">
                    {features.map((f, i) => (
                        <span key={i} className="text-[9px] uppercase tracking-widest font-bold opacity-30 group-hover:opacity-100 transition-opacity">
                            • {f}
                        </span>
                    ))}
                </div>
            </div>
        </Card>
    );
}