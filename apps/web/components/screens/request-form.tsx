"use client"

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Send,
    MessageSquare,
    GitPullRequest,
    Lightbulb,
    Bug,
    ChevronLeft,
    Github,
    Star,
    Terminal,
    Activity
} from 'lucide-react';
import Link from 'next/link';

// shadcn/ui
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export default function RequestPage() {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
        // Logic to redirect to GitHub issues or handle via API
    };

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
                        <Separator orientation="vertical" className="h-6" />
                    </div>

                    <div className="hidden md:flex gap-4 items-center">
                        <Link href="https://github.com/subhraneel2005/docshub" target="_blank">
                            <Button variant="outline" size="sm" className="gap-0 border-primary/20 p-0 overflow-hidden group">
                                <div className="flex items-center gap-2 px-3 py-2 border-r border-primary/10 group-hover:bg-primary/5 transition-colors text-[10px] uppercase font-bold tracking-widest text-primary">
                                    <Github size={14} /> GitHub
                                </div>
                                <div className="flex items-center gap-1.5 px-3 py-2 bg-muted/50 text-[10px] font-mono font-bold">
                                    <Star fill='yellow' size={12} className="text-warning fill-warning" /> 2
                                </div>
                            </Button>
                        </Link>
                    </div>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto px-6 py-20">
                <header className="mb-16">
                    <div className="flex items-center gap-3 mb-4">
                        <Activity className="text-destructive animate-pulse" size={18} />
                        <span className="text-[10px] uppercase tracking-[0.4em] font-bold opacity-40 italic font-mono">Input_Required_for_Iteration</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold italic tracking-tighter mb-6">Feedback Loop</h1>
                    <p className="text-muted-foreground text-lg max-w-2xl font-light leading-relaxed">
                        The Docshub engine evolves based on user telemetry. Request new presets, report logic anomalies, or suggest architectural enhancements below.
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left Side: The Form */}
                    <div className="lg:col-span-7">
                        {!submitted ? (
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="type" className="text-[10px] uppercase tracking-widest font-bold opacity-50">Request Type</Label>
                                            <Select defaultValue="feature">
                                                <SelectTrigger className="rounded-none border-border bg-muted/20 focus:ring-primary">
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-none border-border">
                                                    <SelectItem value="preset">New Preset</SelectItem>
                                                    <SelectItem value="feature">Feature Request</SelectItem>
                                                    <SelectItem value="bug">Bug Report</SelectItem>
                                                    <SelectItem value="llm">LLM Provider Request</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="github" className="text-[10px] uppercase tracking-widest font-bold opacity-50">GitHub Username</Label>
                                            <Input id="github" placeholder="@username" className="rounded-none border-border bg-muted/20 focus-visible:ring-primary" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="title" className="text-[10px] uppercase tracking-widest font-bold opacity-50">Subject Title</Label>
                                        <Input id="title" placeholder="Brief description of the request" className="rounded-none border-border bg-muted/20 focus-visible:ring-primary" />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="description" className="text-[10px] uppercase tracking-widest font-bold opacity-50">Detailed Specification</Label>
                                        <Textarea
                                            id="description"
                                            placeholder="Explain the logic, the expected behavior, or the documentation framework structure..."
                                            className="rounded-none border-border bg-muted/20 min-h-[150px] focus-visible:ring-primary resize-none"
                                        />
                                    </div>
                                </div>

                                <Button type="submit" className="w-full rounded-none h-14 bg-primary text-primary-foreground hover:bg-primary/90 font-bold uppercase tracking-widest">
                                    Send <Send className="ml-2" size={16} />
                                </Button>
                            </form>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="h-[400px] border border-dashed border-primary/30 flex flex-col items-center justify-center text-center p-8 bg-primary/5"
                            >
                                <Terminal className="text-primary mb-4" size={40} />
                                <h3 className="text-xl font-bold uppercase tracking-widest mb-2 italic text-primary">Data Logged</h3>
                                <p className="text-xs text-muted-foreground italic mb-6">Your request has been serialized and sent to the development queue.</p>
                                <Button variant="outline" onClick={() => setSubmitted(false)} className="rounded-none border-primary/20 hover:bg-primary hover:text-primary-foreground uppercase text-[10px] tracking-widest">
                                    New Entry
                                </Button>
                            </motion.div>
                        )}
                    </div>

                    {/* Right Side: Context / Links */}
                    <div className="lg:col-span-5 space-y-6">
                        <Card className="rounded-none border-border bg-muted/30">
                            <CardHeader>
                                <CardTitle className="text-xs uppercase tracking-widest font-bold">Direct Channels</CardTitle>
                                <CardDescription className="text-[11px] font-light italic leading-relaxed">
                                    For high-priority issues, we recommend opening a pull request or issue directly on the source repository.
                                </CardDescription>
                            </CardHeader>
                            <Separator />
                            <CardContent className="space-y-4 pt-4">
                                <Link href="https://github.com/subhraneel2005/docshub/issues/new" target="_blank" className="flex items-center justify-between p-3 border border-border bg-background hover:bg-muted/50 transition-colors group">
                                    <div className="flex items-center gap-3">
                                        <GitPullRequest size={16} className="text-primary" />
                                        <span className="text-[11px] font-bold uppercase tracking-widest">GitHub Issues</span>
                                    </div>
                                    <ArrowUpRight size={14} className="opacity-30 group-hover:opacity-100 transition-opacity" />
                                </Link>
                                <div className="p-4 border border-border bg-primary/5 space-y-2">
                                    <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-widest">
                                        <Lightbulb size={12} /> Proposing a Preset?
                                    </div>
                                    <p className="text-[10px] text-muted-foreground leading-relaxed italic">
                                        Please include a link to the framework&apos;s documentation structure (e.g., how they handle navigation JSON or frontmatter).
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main >

            <footer className="mt-20 border-t border-border py-12 bg-muted/30 opacity-40 text-center">
                <p className="text-[10px] uppercase tracking-[0.5em] font-black italic">Docshub Feedback Protocol v1.0.0</p>
            </footer>
        </div >
    );
}

function ArrowUpRight({ size, className }: { size: number, className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M7 7h10v10" /><path d="M7 17 17 7" />
        </svg>
    );
}