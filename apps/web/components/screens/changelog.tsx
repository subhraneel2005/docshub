"use client"

import React from 'react';
import {
    History,
    Sparkles,
    Box,
    Github,
    Star,
    ChevronLeft,
    ExternalLink
} from 'lucide-react';
import Link from 'next/link';

// shadcn/ui
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function ChangelogPage() {
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
                                <div className="flex items-center gap-2 px-3 py-2 border-r border-primary/10 group-hover:bg-primary/5 transition-colors text-[10px] uppercase font-bold tracking-widest">
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

            <main className="max-w-5xl mx-auto px-6 py-20">
                <header className="mb-24 text-center">
                    <Badge variant="outline" className="mb-6 rounded-none border-primary/30 text-primary uppercase tracking-[0.3em] text-[10px] px-4">
                        Project Evolution
                    </Badge>
                    <h1 className="text-4xl md:text-6xl font-bold italic tracking-tighter mb-6">Changelog</h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-light italic">
                        The architectural log of Docshub—from terminal handshake to multi-provider AI intelligence.
                    </p>
                </header>

                <div className="relative space-y-1">
                    {/* Centered Vertical Line */}
                    <div className="absolute left-[17px] md:left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2" />

                    {/* FUTURE / UPCOMING */}
                    <div className="pt-10 pb-20">
                        <div className="relative z-10 flex justify-center mb-16">
                            <Badge className="rounded-none bg-destructive text-destructive-foreground px-6 py-1.5 text-[10px] uppercase tracking-[0.4em] font-black shadow-lg">
                                Incoming Features
                            </Badge>
                        </div>

                        <div className="space-y-24">
                            <ChangelogEntry
                                version="v1.1.2"
                                date="Q2 2026"
                                title="The Multi-LLM Engine"
                                status="Open"
                                issue="#17"
                                issueLink="https://github.com/subhraneel2005/docshub/issues/17"
                                items={[
                                    "OpenRouter Integration: Support for Anthropic, Mistral, and DeepSeek.",
                                    "Hot-Reload Keys: Update AI providers without CLI restarts.",
                                    "Token Estimator: Real-time cost preview before generation."
                                ]}
                                icon={<Sparkles className="text-primary" size={18} />}
                                side="left"
                            />

                            <ChangelogEntry
                                version="v1.1.0"
                                date="Q2 2026"
                                title="Universal Presets"
                                status="Open"
                                issue="#16"
                                issueLink="https://github.com/subhraneel2005/docshub/issues/16"
                                items={[
                                    "Mintlify Blueprint: Auto-generation of mint.json mapping.",
                                    "Nextra/Docusaurus: Target-specific frontmatter injection.",
                                    "Framework Flag: Use docshub --preset to toggle architectures."
                                ]}
                                icon={<Box className="text-primary" size={18} />}
                                side="right"
                            />
                        </div>
                    </div>

                    {/* RECENTLY COMPLETED */}
                    <div className="pt-10">
                        <div className="relative z-10 flex justify-center mb-16">
                            <Badge variant="outline" className="rounded-none border-border bg-muted text-muted-foreground px-6 py-1.5 text-[10px] uppercase tracking-[0.4em] font-bold">
                                Stable Core
                            </Badge>
                        </div>

                        <div className="space-y-24">
                            <ChangelogEntry
                                version="v1.0.9"
                                date="March 2026"
                                title="Initial Handshake"
                                status="Stable"
                                items={[
                                    "GitHub Device Auth: Direct terminal-to-browser OAuth flow.",
                                    "Context Encoding: Optimized compilation of MDX for AI consumption.",
                                    "Secure Local State: Config encryption in ~/.docshub/config.json.",
                                    "File Picker UI: Interactive multi-select repository scanner."
                                ]}
                                icon={<History className="text-muted-foreground" size={18} />}
                                side="left"
                            />
                        </div>
                    </div>
                </div>
            </main>

            <footer className="mt-40 border-t border-border py-20 bg-muted/20">
                <div className="max-w-4xl mx-auto px-6 text-center space-y-4">
                    <p className="text-[10px] uppercase tracking-[0.5em] font-black opacity-30 italic">Transmission_End</p>
                </div>
            </footer>
        </div>
    );
}

interface EntryProps {
    version: string;
    date: string;
    title: string;
    items: string[];
    icon: React.ReactNode;
    side: 'left' | 'right';
    status?: string;
    issue?: string;
    issueLink?: string;
}

function ChangelogEntry({ version, date, title, items, icon, side, status, issue, issueLink }: EntryProps) {
    return (
        <div className={`flex flex-col md:flex-row items-center justify-between w-full relative ${side === 'right' ? 'md:flex-row-reverse' : ''}`}>
            {/* Horizontal Connector Line (Desktop Only) */}
            <div className="hidden md:block absolute top-1/2 left-1/2 w-1/2 h-px bg-border -translate-y-1/2 -z-0"
                style={{ [side === 'left' ? 'right' : 'left']: '50%' }} />

            <div className="hidden md:block w-[42%]" />

            {/* Timeline Dot */}
            <div className="z-20 flex items-center justify-center w-10 h-10 rounded-full bg-background border-2 border-border shadow-md shrink-0 relative">
                {icon}
            </div>

            <div className={`w-full md:w-[42%] mt-6 md:mt-0 z-10`}>
                <Card className="rounded-none border-border bg-background shadow-sm hover:border-primary/30 transition-all duration-300">
                    <div className="p-1.5 bg-muted/30 border-b border-border flex justify-between items-center px-4">
                        <span className="text-[9px] font-mono font-bold text-muted-foreground/60 tracking-wider">{date}</span>
                        <div className="flex gap-3 items-center">
                            {issue && issueLink && (
                                <Link href={issueLink} target="_blank" className="flex items-center gap-1 text-[9px] font-mono text-primary hover:underline group/link">
                                    {issue} <ExternalLink size={8} className="group-hover/link:translate-x-0.5 transition-transform" />
                                </Link>
                            )}
                            <span className={`text-[8px] uppercase font-black tracking-[0.15em] ${status === 'Open' ? 'text-destructive' : 'text-emerald-500'}`}>
                                {status}
                            </span>
                        </div>
                    </div>
                    <CardContent className="p-6">
                        <div className={`flex items-center gap-3 mb-5 flex-wrap ${side === 'left' ? 'md:flex-row-reverse' : 'flex-row'}`}>
                            <h3 className="text-xl font-bold italic tracking-tighter">{title}</h3>
                            <Badge variant="outline" className="rounded-none text-[9px] font-mono px-2 py-0 h-5 border-border/50">{version}</Badge>
                        </div>
                        <ul className="space-y-4">
                            {items.map((item, i) => (
                                <li key={i} className={`flex items-start gap-3 text-xs text-muted-foreground leading-relaxed ${side === 'left' ? 'md:flex-row-reverse md:text-right' : ''}`}>
                                    <span className="font-light">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}