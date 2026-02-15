"use client";

import { useState, useEffect, useCallback } from "react";
import {
    Search,
    Sparkles,
    Globe,
    AlertTriangle,
    CheckCircle2,
    XCircle,
    Clock,
    Trash2,
    ChevronDown,
    ChevronUp,
    Copy,
    Check,
    Loader2,
    ImageIcon,
    Type,
    FileText,
    Shield,
    BarChart3,
    Tag,
    LinkIcon,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import type {
    ScrapedSEOData,
    RefinedSEOResult,
    AnalysisRecord,
    OptimizedVariation,
} from "@/types";
import { getHistory, saveRecord, clearHistory } from "@/lib/storage";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

// ─── Tag Status Evaluation ───────────────────────────────────────────────────

type TagSeverity = "missing" | "too-short" | "too-long" | "good";

function evaluateTitle(value: string | null): { severity: TagSeverity; label: string } {
    if (!value) return { severity: "missing", label: "Missing" };
    if (value.length < 20) return { severity: "too-short", label: `Too Short (${value.length}/60)` };
    if (value.length > 60) return { severity: "too-long", label: `Too Long (${value.length}/60)` };
    return { severity: "good", label: `Good (${value.length}/60)` };
}

function evaluateDescription(value: string | null): { severity: TagSeverity; label: string } {
    if (!value) return { severity: "missing", label: "Missing" };
    if (value.length < 50) return { severity: "too-short", label: `Too Short (${value.length}/160)` };
    if (value.length > 160) return { severity: "too-long", label: `Too Long (${value.length}/160)` };
    return { severity: "good", label: `Good (${value.length}/160)` };
}

function evaluateOgImage(value: string | null): { severity: TagSeverity; label: string } {
    if (!value) return { severity: "missing", label: "Missing" };
    return { severity: "good", label: "Present" };
}

const severityColors: Record<TagSeverity, string> = {
    missing: "bg-red-500/10 text-red-400 border-red-500/20",
    "too-short": "bg-amber-500/10 text-amber-400 border-amber-500/20",
    "too-long": "bg-amber-500/10 text-amber-400 border-amber-500/20",
    good: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
};

const severityIcons: Record<TagSeverity, typeof CheckCircle2> = {
    missing: XCircle,
    "too-short": AlertTriangle,
    "too-long": AlertTriangle,
    good: CheckCircle2,
};

// ─── Copy Button ─────────────────────────────────────────────────────────────

function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);
    const handleCopy = async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <button
            onClick={handleCopy}
            className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200"
            title="Copy to clipboard"
        >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
    );
}

// ─── Badge ───────────────────────────────────────────────────────────────────

function SeverityBadge({ severity, label }: { severity: TagSeverity; label: string }) {
    const Icon = severityIcons[severity];
    return (
        <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${severityColors[severity]}`}
        >
            <Icon className="w-3 h-3" />
            {label}
        </span>
    );
}

// ─── Current Tags Card ───────────────────────────────────────────────────────

function CurrentTagsCard({ data }: { data: ScrapedSEOData }) {
    const titleEval = evaluateTitle(data.title);
    const descEval = evaluateDescription(data.metaDescription);
    const ogEval = evaluateOgImage(data.ogImage);

    const tags = [
        { icon: Type, label: "Title", value: data.title, eval: titleEval },
        { icon: FileText, label: "Meta Description", value: data.metaDescription, eval: descEval },
        { icon: ImageIcon, label: "OG Image", value: data.ogImage, eval: ogEval },
    ];

    return (
        <div className="glass rounded-xl p-6 animate-fade-in">
            <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Globe className="w-5 h-5 text-primary" />
                </div>
                <div>
                    <h3 className="text-sm font-semibold text-foreground">Current Tags</h3>
                    <p className="text-xs text-muted-foreground">Extracted from the page</p>
                </div>
            </div>
            <div className="space-y-4">
                {tags.map(({ icon: TagIcon, label, value, eval: ev }) => (
                    <div
                        key={label}
                        className="rounded-lg bg-muted/40 p-4 border border-border/50 hover:border-primary/20 transition-colors duration-300"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <TagIcon className="w-4 h-4 text-muted-foreground" />
                                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                    {label}
                                </span>
                            </div>
                            <SeverityBadge severity={ev.severity} label={ev.label} />
                        </div>
                        <div className="flex items-start gap-2">
                            <p
                                className={`text-sm flex-1 ${value ? "text-foreground" : "text-muted-foreground italic"
                                    }`}
                            >
                                {value || "Not found on page"}
                            </p>
                            {value && <CopyButton text={value} />}
                        </div>
                    </div>
                ))}
            </div>
            {/* Extra signals */}
            {(data.h1 || data.canonical) && (
                <div className="mt-4 pt-4 border-t border-border/50">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                        Additional Signals
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-muted-foreground">
                        {data.h1 && (
                            <div className="truncate">
                                <span className="text-foreground/60">H1:</span>{" "}
                                <span className="text-foreground/80">{data.h1}</span>
                            </div>
                        )}
                        {data.canonical && (
                            <div className="truncate">
                                <span className="text-foreground/60">Canonical:</span>{" "}
                                <span className="text-foreground/80">{data.canonical}</span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── Optimized Variation Card ────────────────────────────────────────────────

function VariationCard({
    variation,
    index,
}: {
    variation: OptimizedVariation;
    index: number;
}) {
    const angles = ["Keyword-Focused", "Benefit-Driven", "Action-Oriented"];
    const colors = [
        "from-indigo-500 to-purple-500",
        "from-emerald-500 to-cyan-500",
        "from-amber-500 to-orange-500",
    ];

    return (
        <div className="glass rounded-xl p-6 animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
            <div className="flex items-center gap-3 mb-5">
                <div
                    className={`w-9 h-9 rounded-lg bg-gradient-to-br ${colors[index]} flex items-center justify-center`}
                >
                    <span className="text-white text-sm font-bold">{index + 1}</span>
                </div>
                <div>
                    <h4 className="text-sm font-semibold text-foreground">{angles[index]}</h4>
                    <p className="text-xs text-muted-foreground">Optimized variation</p>
                </div>
            </div>
            <div className="space-y-4">
                {/* Title */}
                <div className="rounded-lg bg-muted/40 p-4 border border-border/50">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <Type className="w-4 h-4 text-muted-foreground" />
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                Title
                            </span>
                        </div>
                        <span
                            className={`text-xs font-medium ${variation.title.length <= 60 ? "text-emerald-400" : "text-amber-400"
                                }`}
                        >
                            {variation.title.length}/60
                        </span>
                    </div>
                    <div className="flex items-start gap-2">
                        <p className="text-sm text-foreground flex-1">{variation.title}</p>
                        <CopyButton text={variation.title} />
                    </div>
                </div>
                {/* Meta Description */}
                <div className="rounded-lg bg-muted/40 p-4 border border-border/50">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-muted-foreground" />
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                Meta Description
                            </span>
                        </div>
                        <span
                            className={`text-xs font-medium ${variation.metaDescription.length <= 160 ? "text-emerald-400" : "text-amber-400"
                                }`}
                        >
                            {variation.metaDescription.length}/160
                        </span>
                    </div>
                    <div className="flex items-start gap-2">
                        <p className="text-sm text-foreground flex-1">{variation.metaDescription}</p>
                        <CopyButton text={variation.metaDescription} />
                    </div>
                </div>
                {/* OG Image Suggestion */}
                <div className="rounded-lg bg-muted/40 p-4 border border-border/50">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <ImageIcon className="w-4 h-4 text-muted-foreground" />
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                OG Image Suggestion
                            </span>
                        </div>
                    </div>
                    <div className="flex items-start gap-2">
                        <p className="text-sm text-foreground/80 italic flex-1">
                            {variation.ogImageSuggestion}
                        </p>
                        <CopyButton text={variation.ogImageSuggestion} />
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Loading Skeleton ────────────────────────────────────────────────────────

function AnalysisSkeleton({ stage }: { stage: "scraping" | "refining" }) {
    return (
        <div className="space-y-6 animate-fade-in">
            <div className="glass rounded-xl p-6">
                <div className="flex items-center gap-3 mb-5">
                    <div className="w-9 h-9 rounded-lg animate-shimmer" />
                    <div className="space-y-2">
                        <div className="h-4 w-28 rounded animate-shimmer" />
                        <div className="h-3 w-40 rounded animate-shimmer" />
                    </div>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    {stage === "scraping"
                        ? "Crawling page and extracting meta tags…"
                        : "AI is generating optimized variations…"}
                </div>
                <div className="space-y-3 mt-5">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-20 rounded-lg animate-shimmer" />
                    ))}
                </div>
            </div>
        </div>
    );
}

// ─── History Sidebar ─────────────────────────────────────────────────────────

function HistorySidebar({
    history,
    onSelect,
    onClear,
    activeId,
}: {
    history: AnalysisRecord[];
    onSelect: (record: AnalysisRecord) => void;
    onClear: () => void;
    activeId?: string;
}) {
    if (history.length === 0) return null;

    return (
        <div className="glass rounded-xl p-5 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <h3 className="text-sm font-semibold text-foreground">Recent Analyses</h3>
                </div>
                <button
                    onClick={onClear}
                    className="p-1.5 rounded-md text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                    title="Clear history"
                >
                    <Trash2 className="w-3.5 h-3.5" />
                </button>
            </div>
            <div className="space-y-1.5 max-h-[400px] overflow-y-auto">
                {history.map((record) => (
                    <button
                        key={record.id}
                        onClick={() => onSelect(record)}
                        className={`w-full text-left p-3 rounded-lg text-sm transition-all duration-200 ${activeId === record.id
                            ? "bg-primary/10 border border-primary/20 text-foreground"
                            : "hover:bg-muted/60 text-muted-foreground hover:text-foreground border border-transparent"
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            <Globe className="w-3.5 h-3.5 flex-shrink-0" />
                            <span className="truncate font-medium">{new URL(record.url).hostname}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 ml-5.5">
                            {new Date(record.scrapedAt).toLocaleDateString(undefined, {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </p>
                    </button>
                ))}
            </div>
        </div>
    );
}

// ─── Main Dashboard ──────────────────────────────────────────────────────────

export default function AnalysisDashboard() {
    const [url, setUrl] = useState("");
    const [currentRecord, setCurrentRecord] = useState<AnalysisRecord | null>(null);
    const [history, setHistory] = useState<AnalysisRecord[]>([]);
    const [showReasoning, setShowReasoning] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const searchParams = useSearchParams();
    const [user, setUser] = useState<User | null>(null);

    // Check auth state on mount
    useEffect(() => {
        const checkUser = async () => {
            const { data } = await supabase.auth.getUser();
            setUser(data.user);
            if (data.user) {
                setHistory(getHistory());
            } else {
                setHistory([]);
            }
        };
        checkUser();

        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                setHistory(getHistory());
            } else {
                setHistory([]);
            }
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    const isLoading =
        currentRecord?.status === "scraping" || currentRecord?.status === "refining";

    const handleAnalyze = useCallback(async (urlToAnalyze?: string) => {
        const targetUrl = urlToAnalyze || url;
        if (!targetUrl.trim() || isLoading) return;

        // Update URL param without reloading
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.set("url", targetUrl.trim());
        window.history.pushState({}, "", newUrl.toString());

        setError(null);
        setShowReasoning(false);

        const id = crypto.randomUUID();
        const record: AnalysisRecord = {
            id,
            url: targetUrl.trim(),
            scrapedAt: new Date().toISOString(),
            original: {
                url: targetUrl.trim(),
                title: null,
                metaDescription: null,
                ogImage: null,
                ogTitle: null,
                ogDescription: null,
                canonical: null,
                h1: null,
            },
            refined: null,
            status: "scraping",
        };

        setCurrentRecord(record);

        try {
            // Step 1: Scrape
            const scrapeRes = await fetch("/api/scrape", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url: targetUrl.trim() }),
            });

            if (!scrapeRes.ok) {
                const errData = await scrapeRes.json();
                throw new Error(errData.error || "Scraping failed");
            }

            const scrapedData: ScrapedSEOData = await scrapeRes.json();
            record.original = scrapedData;
            record.url = scrapedData.url;
            record.status = "refining";
            setCurrentRecord({ ...record });

            // Step 2: Refine
            const refineRes = await fetch("/api/refine", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ scrapedData, url: scrapedData.url }),
            });

            if (!refineRes.ok) {
                const errData = await refineRes.json();
                throw new Error(errData.error || "AI refinement failed");
            }

            const refined: RefinedSEOResult = await refineRes.json();
            record.refined = refined;
            record.status = "complete";
            setCurrentRecord({ ...record });
            setCurrentRecord({ ...record });
            if (user) {
                saveRecord(record);
                setHistory(getHistory());
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : "Analysis failed";
            record.status = "error";
            record.error = message;
            setCurrentRecord({ ...record });
            setError(message);
            setCurrentRecord({ ...record });
            setError(message);
            if (user) {
                saveRecord(record);
                setHistory(getHistory());
            }
        }
    }, [url, isLoading, user]);

    // Handle URL query param on mount
    useEffect(() => {
        const urlParam = searchParams.get("url");
        if (urlParam && !currentRecord) {
            setUrl(urlParam);
            handleAnalyze(urlParam);
        }
    }, [searchParams, handleAnalyze, currentRecord]);

    const handleSelectHistory = useCallback((record: AnalysisRecord) => {
        setCurrentRecord(record);
        setUrl(record.url);
        setError(record.error || null);
        setShowReasoning(false);
    }, []);

    const handleClearHistory = useCallback(() => {
        clearHistory();
        setHistory([]);
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") handleAnalyze();
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            {/* ── Search Bar ── */}
            <div className="max-w-3xl mx-auto mb-10">
                <div className="text-center mb-8 animate-fade-in">
                    <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3 tracking-tight">
                        Optimize Your{" "}
                        <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                            SEO Tags
                        </span>
                    </h2>
                    <p className="text-muted-foreground text-sm sm:text-base max-w-md mx-auto">
                        Enter any URL to analyze its meta tags and get AI-powered optimization suggestions.
                    </p>
                </div>
                <div className="relative group animate-fade-in" style={{ animationDelay: "100ms" }}>
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/20 to-accent/20 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
                    <div className="relative flex items-center gap-2 glass rounded-2xl p-2">
                        <div className="flex items-center gap-2 pl-3 flex-1">
                            <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                            <input
                                type="url"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Enter a URL to analyze (e.g. example.com)"
                                className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground/60 text-sm focus:outline-none py-2"
                                disabled={isLoading}
                                id="url-input"
                            />
                        </div>
                        <button
                            onClick={() => handleAnalyze()}
                            disabled={!url.trim() || isLoading}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-accent text-primary-foreground text-sm font-medium hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-lg hover:shadow-primary/20"
                            id="analyze-button"
                        >
                            {isLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Sparkles className="w-4 h-4" />
                            )}
                            {isLoading ? "Analyzing…" : "Analyze"}
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Error Alert ── */}
            {error && (
                <div className="max-w-3xl mx-auto mb-8 animate-fade-in">
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
                        <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium">Analysis Failed</p>
                            <p className="text-xs mt-1 text-red-400/80">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Content Grid ── */}
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Main results */}
                <div className="flex-1 min-w-0">
                    {/* Loading state */}
                    {isLoading && (
                        <AnalysisSkeleton
                            stage={currentRecord?.status === "scraping" ? "scraping" : "refining"}
                        />
                    )}

                    {/* Results */}
                    {currentRecord && !isLoading && currentRecord.status !== "error" && (
                        <div className="space-y-6">
                            {/* Current tags */}
                            <CurrentTagsCard data={currentRecord.original} />

                            {/* Optimized variations */}
                            {currentRecord.refined && (
                                <>
                                    <div className="flex items-center gap-3 mt-8 mb-4 animate-fade-in">
                                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                                            <Sparkles className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-semibold text-foreground">
                                                AI Optimized Variations
                                            </h3>
                                            <p className="text-xs text-muted-foreground">
                                                3 optimization strategies
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                                        {currentRecord.refined.variations.map(
                                            (variation: OptimizedVariation, idx: number) => (
                                                <VariationCard key={idx} variation={variation} index={idx} />
                                            )
                                        )}
                                    </div>

                                    {/* Reasoning */}
                                    {currentRecord.refined.reasoning && (
                                        <div className="glass rounded-xl overflow-hidden animate-fade-in mt-4">
                                            <button
                                                onClick={() => setShowReasoning(!showReasoning)}
                                                className="w-full flex items-center justify-between p-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
                                            >
                                                <span className="font-medium">AI Reasoning</span>
                                                {showReasoning ? (
                                                    <ChevronUp className="w-4 h-4" />
                                                ) : (
                                                    <ChevronDown className="w-4 h-4" />
                                                )}
                                            </button>
                                            {showReasoning && (
                                                <div className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-border/50 pt-3">
                                                    {currentRecord.refined.reasoning}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Share Results */}
                                    <div className="glass rounded-xl p-4 animate-fade-in mt-4">
                                        <button
                                            onClick={() => {
                                                const text = `Check out this SEO analysis for ${new URL(currentRecord.url).hostname}:\n${window.location.href}`;
                                                navigator.clipboard.writeText(text);
                                            }}
                                            className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-primary hover:text-foreground transition-colors"
                                        >
                                            {/* <Share2 className="w-4 h-4" /> */}
                                            <LinkIcon className="w-4 h-4" />
                                            Share Analysis Link
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* Empty state */}
                    {!currentRecord && !isLoading && (
                        <div className="text-center py-20 animate-fade-in">
                            <div className="w-16 h-16 rounded-2xl bg-muted/60 flex items-center justify-center mx-auto mb-5">
                                <Globe className="w-8 h-8 text-muted-foreground/50" />
                            </div>
                            <h3 className="text-lg font-semibold text-foreground/80 mb-2">
                                No analysis yet
                            </h3>
                            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                                Enter a URL above to scrape its SEO meta tags and get AI-powered
                                optimization suggestions.
                            </p>
                        </div>
                    )}
                </div>

                {/* History sidebar */}
                <div className="lg:w-72 flex-shrink-0">
                    {user ? (
                        <HistorySidebar
                            history={history}
                            onSelect={handleSelectHistory}
                            onClear={handleClearHistory}
                            activeId={currentRecord?.id}
                        />
                    ) : (
                        <div className="glass rounded-xl p-6 text-center">
                            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                                <Clock className="w-5 h-5 text-muted-foreground" />
                            </div>
                            <h3 className="text-sm font-semibold mb-1">Save your history</h3>
                            <p className="text-xs text-muted-foreground mb-3">
                                Login to automatically save your analysis history and access it later.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* ── SEO Explainer Section ── */}
            <section className="max-w-3xl mx-auto mt-16 mb-8 animate-fade-in">
                <h2 className="text-xl font-bold text-foreground mb-6 text-center">
                    Why SEO Meta Tags Matter
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="glass rounded-xl p-5">
                        <div className="w-9 h-9 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-3">
                            <BarChart3 className="w-5 h-5 text-indigo-400" />
                        </div>
                        <h3 className="text-sm font-semibold text-foreground mb-1">Higher Rankings</h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            Optimized title and description tags help search engines understand your content, improving your position in search results.
                        </p>
                    </div>
                    <div className="glass rounded-xl p-5">
                        <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-3">
                            <Tag className="w-5 h-5 text-emerald-400" />
                        </div>
                        <h3 className="text-sm font-semibold text-foreground mb-1">Better Click-Through</h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            Compelling meta descriptions and OG images make your links stand out on Google and social media, driving more clicks.
                        </p>
                    </div>
                    <div className="glass rounded-xl p-5">
                        <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center mb-3">
                            <Shield className="w-5 h-5 text-amber-400" />
                        </div>
                        <h3 className="text-sm font-semibold text-foreground mb-1">Social Sharing</h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            Proper Open Graph tags ensure your content looks professional when shared on Twitter, LinkedIn, and Facebook.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
