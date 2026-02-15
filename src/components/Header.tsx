"use client";

import Link from "next/link";
import { Zap } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import AuthButton from "./AuthButton";

export default function Header() {
    return (
        <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center animate-pulse-glow">
                        <Zap className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-foreground tracking-tight group-hover:text-primary transition-colors">
                            MetaAlign
                        </h1>
                        <p className="text-xs text-muted-foreground">
                            SEO Meta Tag Optimizer
                        </p>
                    </div>
                </Link>
                <div className="flex items-center gap-2">
                    <ThemeToggle />
                    <AuthButton />
                </div>
            </div>
        </header>
    );
}
