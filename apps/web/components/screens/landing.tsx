"use client"

import React, { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import {
    Terminal, Github, BookOpen, Zap, Copy, Check, Cpu, Globe,
    ArrowRight, Key, ShieldCheck, FileSearch, BrainCircuit,
    FolderDown, Files, GitBranch, TerminalIcon, FileCode, FolderPlus,
    Star
} from 'lucide-react';

// shadcn/ui imports
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Separator } from "@/components/ui/separator";
import Link from 'next/link';

// --- Types ---
type PackageManager = 'npm' | 'bun' | 'pnpm';

const COMMANDS: Record<PackageManager, string> = {
    npm: 'npm i -g @subhraneel2005/docshub',
    bun: 'bun add -g @subhraneel2005/docshub',
    pnpm: 'pnpm add -g @subhraneel2005/docshub'
};

// --- Animations ---
const containerVars: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
};

const itemVars: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    }
};

export default function DocshubLanding() {
    const [activeTab, setActiveTab] = useState<PackageManager>('npm');
    const [copied, setCopied] = useState<boolean>(false);

    const copyToClipboard = async (text: string): Promise<void> => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy!', err);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
            <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-multiply" />

            {/* Navigation */}
            <nav className="flex justify-between items-center px-6 md:px-12 py-6 border-b border-border sticky top-0 z-40 bg-background/80 backdrop-blur-md">
                <div className="flex items-center gap-4">
                    <span className="text-2xl font-bold tracking-tighter uppercase italic">Docshub</span>
                </div>
                <div className="hidden md:flex gap-4 items-center">
                    <Link href="https://github.com/subhraneel2005/docshub" target="_blank">
                        <Button variant="outline" size="sm" className="gap-0 border-primary/20 p-0 overflow-hidden group">
                            <div className="flex items-center gap-2 px-3 py-2 border-r border-primary/10 group-hover:bg-primary/5 transition-colors">
                                <Github size={14} />
                                <span className="text-[10px] uppercase tracking-widest font-bold">GitHub</span>
                            </div>
                            <div className="flex items-center gap-1.5 px-3 py-2 bg-muted/50 text-[10px] font-mono">
                                <Star fill='#e3b342' size={12} className="text-warning fill-warning" />
                                <span>2</span>
                            </div>
                        </Button>
                    </Link>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 md:px-12 py-20">
                {/* Hero & Install (Condensed for brevity, same as previous) */}
                <section className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-40">
                    <div className="lg:col-span-7">
                        <Badge variant="outline" className="mb-6 rounded-none border-destructive/30 text-destructive bg-destructive/5 px-3 py-1 uppercase tracking-widest text-[10px]">
                            Engine Active: v1.0.9
                        </Badge>
                        <motion.h1 variants={itemVars} className="text-5xl md:text-7xl italic leading-[0.9] mb-8 tracking-tigh font-semibold">
                            Generate <span className="not-italic text-primary">docs</span> from a single <span className="text-destructive">url</span>
                        </motion.h1>
                        <p className="text-lg text-muted-foreground max-w-xl mb-12">
                            The AI documentation pipeline that lives in your CLI. Authenticate, select, and generate high-fidelity docs from your GitHub repo.
                        </p>
                        <motion.div variants={itemVars} className="max-w-md">
                            <Tabs defaultValue="npm" onValueChange={(v) => setActiveTab(v as PackageManager)} className="w-full border border-border shadow-xl">
                                <TabsList className="w-full justify-start rounded-none bg-muted h-12 p-0 border-b border-border">
                                    <TabsTrigger value="npm" className="flex-1 rounded-none data-[state=active]:bg-background data-[state=active]:text-destructive text-[10px] uppercase tracking-widest">npm</TabsTrigger>
                                    <TabsTrigger value="bun" className="flex-1 rounded-none data-[state=active]:bg-background data-[state=active]:text-destructive text-[10px] uppercase tracking-widest">bun</TabsTrigger>
                                    <TabsTrigger value="pnpm" className="flex-1 rounded-none data-[state=active]:bg-background data-[state=active]:text-destructive text-[10px] uppercase tracking-widest">pnpm</TabsTrigger>
                                </TabsList>
                                <div className="p-6 bg-background flex items-center justify-between group">
                                    <div className="flex gap-4 items-center overflow-hidden">
                                        <span className="text-emerald-500 font-bold">❯</span>
                                        <code className="text-sm font-medium truncate">{COMMANDS[activeTab]}</code>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => copyToClipboard(COMMANDS[activeTab])}
                                        className="text-muted-foreground hover:text-destructive transition-colors"
                                    >
                                        {copied ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
                                    </Button>
                                </div>
                            </Tabs>
                        </motion.div>
                    </div>
                    <div className="lg:col-span-5 flex flex-col gap-4">
                        <FeatureCard icon={<ShieldCheck className="text-destructive" />} title="Secure Auth" desc="GitHub device authentication with local token encryption." />
                        <FeatureCard icon={<BrainCircuit className="text-destructive" />} title="AI Pipeline" desc="Automated planning and multi-stage content generation." />
                    </div>
                </section>

                {/* Architecture Pipeline Section */}
                <section className="mb-40">
                    <div className="mb-12">
                        <h2 className="text-3xl font-bold italic tracking-tighter uppercase">The AI Pipeline</h2>
                        <p className="text-muted-foreground text-sm">How Docshub transforms raw markdown into a structured site.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
                        <PipelineStep
                            icon={<Key />}
                            title="Handshake"
                            desc="GitHub Device Auth saves your accessToken securely in ~/.docshub/config.json."
                        />
                        <PipelineStep
                            icon={<FileSearch />}
                            title="Discovery"
                            desc="Input user/repo. We index every MD/MDX file for context selection."
                        />
                        <PipelineStep
                            icon={<BrainCircuit />}
                            title="AI Strategy"
                            desc="LLM analyzes compiled content to generate a holistic documentation plan."
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-1 mt-1">
                        <Card className="rounded-none border-border bg-muted/30">
                            <CardContent className="p-8">
                                <div className="flex gap-4 items-start">
                                    <Cpu className="text-primary mt-1" />
                                    <div>
                                        <h4 className="font-bold uppercase text-xs tracking-widest mb-2">Internal Compilation</h4>
                                        <p className="text-xs text-muted-foreground leading-relaxed">
                                            Docshub decodes and compiles selected markdown files into a high-density context string, minimizing LLM token waste while maximizing architectural understanding.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="rounded-none border-border bg-primary text-primary-foreground">
                            <CardContent className="p-8">
                                <div className="flex gap-4 items-start">
                                    <FolderDown className="mt-1" />
                                    <div>
                                        <h4 className="font-bold uppercase text-xs tracking-widest mb-2">Desktop Delivery</h4>
                                        <p className="text-xs opacity-90 leading-relaxed">
                                            Final files are written to your Desktop in a timestamped folder. Ready to be dropped into any documentation framework like Fumadocs or Mintlify.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* Deployment Blueprint: Fumadocs Example */}
                <section className="border-t border-border pt-20">
                    <div className="flex flex-col md:flex-row gap-12 items-start">
                        <div className="w-full sticky top-32 bg-background">
                            <Badge variant="outline" className="mb-4 rounded-none text-primary uppercase text-[10px]">Blueprint</Badge>
                            <h2 className="text-3xl font-bold italic tracking-tighter mb-4">Integrate with <Link href={"https://www.fumadocs.dev/"} className="text-primary underline">Fumadocs</Link></h2>
                            <p className="text-sm text-muted-foreground">Example workflow for the <code>/content/docs</code> directory.</p>
                        </div>

                        <div className="md:w-2/3 space-y-4">
                            <StepCard number="01" title="Clone Starter" icon={<GitBranch size={16} />} command="git clone https://github.com/subhraneel2005/fumadocs-starter" />
                            <StepCard number="02" title="Purge Git" icon={<TerminalIcon size={16} />} command="rm -rf .git" />
                            <Card className="rounded-none border-border bg-background shadow-sm group">
                                <div className="p-6 flex gap-6">
                                    <div className="text-2xl font-black opacity-10 group-hover:opacity-100 text-destructive">03</div>
                                    <div className="space-y-4 w-full">
                                        <div className="flex items-center gap-2">
                                            <Files size={18} className="text-primary" />
                                            <h4 className="text-[11px] font-bold uppercase tracking-widest">Paste & Hydrate</h4>
                                        </div>
                                        <p className="text-xs text-muted-foreground italic">
                                            Move your <code>docs-[timestamp]</code> content into <code>/content/docs/</code>
                                        </p>
                                        <div className="bg-muted p-4 border border-border">
                                            <div className="flex items-center gap-3 text-[10px] font-mono opacity-50"><FolderPlus size={14} /> /content/docs/</div>
                                            <div className="mt-3 flex gap-2 overflow-x-auto">
                                                <Badge variant="outline" className="rounded-none bg-background text-[10px]">index.mdx</Badge>
                                                <Badge variant="outline" className="rounded-none bg-background text-[10px]">_meta.json</Badge>
                                                <Badge variant="outline" className="rounded-none bg-background text-[10px]">architecture.mdx</Badge>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* New Section: The Universal Adaptor (Presets) */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-40"
                >
                    <Card className="rounded-none border-border bg-background overflow-hidden">
                        <div className="grid grid-cols-1 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x border-b border-border">
                            <div className="p-8 bg-muted/20">
                                <h3 className="text-xl font-bold italic tracking-tighter mb-2 underline decoration-destructive underline-offset-4">Presets</h3>
                                <p className="text-xs text-muted-foreground italic">Target any documentation engine with a single flag.</p>
                            </div>
                            <PresetItem
                                name="Fumadocs"
                                status="Native"
                                desc="Auto-generates _meta.json and directory mapping."
                            />
                            <PresetItem
                                name="Mintlify"
                                status="Beta"
                                desc="Compiles a ready-to-use mint.json configuration."
                            />
                            <PresetItem
                                name="Nextra"
                                status="Planned"
                                desc="Structured for Next.js 14 App Router docs."
                            />
                        </div>
                        <div className="bg-primary/5 p-4 flex justify-center items-center gap-4 border-t border-border">
                            <span className="text-[9px] uppercase tracking-[0.3em] font-bold opacity-40">Pro Tip: Use</span>
                            <code className="text-[10px] bg-background px-2 py-1 border border-primary/20 font-mono text-primary">
                                docshub --preset mintlify
                            </code>
                        </div>
                    </Card>
                </motion.section>
            </main>

            <footer className="mt-20 border-t border-border py-12 bg-muted/30">
                <div className="max-w-7xl mx-auto px-12 flex flex-col md:flex-row justify-between items-center gap-6 opacity-50">
                    <p className="text-[10px] uppercase tracking-[0.2em] font-medium">
                        © 2026 Docshub. Built for Engineers.
                    </p>
                    <div className="flex gap-8">
                        <a href="#" className="text-[10px] uppercase tracking-[0.2em] hover:text-destructive transition-colors underline underline-offset-4 decoration-destructive/30">Changelog</a>
                        <a href="https://x.com/subhraneeltwt" target='_blank' className="text-[10px] uppercase tracking-[0.2em] hover:text-destructive transition-colors underline underline-offset-4 decoration-destructive/30">Twitter</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}

function PresetItem({ name, status, desc }: { name: string, status: string, desc: string }) {
    return (
        <div className="p-8 hover:bg-muted/30 transition-colors group">
            <div className="flex justify-between items-center mb-4">
                <h4 className="text-[11px] font-black uppercase tracking-widest">{name}</h4>
                <Badge variant="outline" className={`rounded-none text-[8px] uppercase px-1.5 py-0 ${status === 'Native' ? 'border-emerald-500/50 text-emerald-500' :
                    status === 'Beta' ? 'border-warning/50 text-warning' : 'opacity-30'
                    }`}>
                    {status}
                </Badge>
            </div>
            <p className="text-[10px] text-muted-foreground leading-relaxed">{desc}</p>
        </div>
    );
}

// Helper Components
function PipelineStep({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
    return (
        <Card className="rounded-none border-border bg-background hover:border-primary/50 transition-colors">
            <CardHeader className="pb-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                    {React.cloneElement(icon as React.ReactElement)}
                </div>
                <CardTitle className="text-xs uppercase tracking-widest font-bold">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
            </CardContent>
        </Card>
    );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
    return (
        <Card className="rounded-none border-border bg-muted/20 hover:bg-muted/40 transition-colors border-l-4 border-l-destructive">
            <CardContent className="p-6">
                <div className="mb-3">{icon}</div>
                <h4 className="text-[11px] font-bold uppercase tracking-widest mb-1">{title}</h4>
                <p className="text-xs text-muted-foreground leading-tight">{desc}</p>
            </CardContent>
        </Card>
    );
}

function StepCard({ number, title, icon, command }: { number: string, title: string, icon: React.ReactNode, command: string }) {
    return (
        <Card className="rounded-none border-border bg-background group">
            <CardContent className="p-6 flex gap-6 items-center">
                <div className="text-2xl font-black opacity-10 text-destructive group-hover:opacity-100 transition-opacity">{number}</div>
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-primary">{icon}</span>
                        <h4 className="text-[11px] font-bold uppercase tracking-widest">{title}</h4>
                    </div>
                    <code className="text-[11px] bg-muted px-3 py-1.5 border border-border block w-fit">{command}</code>
                </div>
            </CardContent>
        </Card>
    );
}