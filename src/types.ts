export interface ScrapedSEOData {
    url: string;
    title: string | null;
    metaDescription: string | null;
    ogImage: string | null;
    ogTitle: string | null;
    ogDescription: string | null;
    canonical: string | null;
    h1: string | null;
}

export interface OptimizedVariation {
    title: string;
    metaDescription: string;
    ogImageSuggestion: string;
}

export interface RefinedSEOResult {
    original: ScrapedSEOData;
    variations: OptimizedVariation[];
    reasoning: string;
}

export interface AnalysisRecord {
    id: string;
    url: string;
    scrapedAt: string;
    original: ScrapedSEOData;
    refined: RefinedSEOResult | null;
    status: "scraping" | "refining" | "complete" | "error";
    error?: string;
}
