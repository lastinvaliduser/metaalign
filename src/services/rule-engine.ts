import type { ScrapedSEOData, RefinedSEOResult, OptimizedVariation } from "@/types";

/**
 * Rule-based SEO optimizer — works locally without any API key.
 * Generates 3 optimized variations using proven SEO best practices.
 */
export function refineWithRules(
    scrapedData: ScrapedSEOData,
    url: string
): RefinedSEOResult {
    const domain = extractDomain(url);
    const pageKeyword = extractKeyword(scrapedData);
    const brandName = extractBrand(domain);

    const variations: OptimizedVariation[] = [
        buildKeywordFocused(scrapedData, pageKeyword, brandName),
        buildBenefitDriven(scrapedData, pageKeyword, brandName),
        buildActionOriented(scrapedData, pageKeyword, brandName),
    ];

    const issues = identifyIssues(scrapedData);

    return {
        original: scrapedData,
        variations,
        reasoning: `Rule-based optimization (no API key required). ${issues.length} issue${issues.length !== 1 ? "s" : ""} found: ${issues.join("; ") || "None — tags look solid."}`,
    };
}

// ─── Variation Builders ──────────────────────────────────────────────────────

function buildKeywordFocused(
    data: ScrapedSEOData,
    keyword: string,
    brand: string
): OptimizedVariation {
    const title = truncate(
        keyword
            ? `${capitalize(keyword)} — ${brand} | Official Guide`
            : `${brand} — Official Website`,
        60
    );

    const desc = truncate(
        keyword
            ? `Discover everything about ${keyword}. ${brand} offers expert insights, guides, and resources. Learn more today.`
            : `Visit ${brand} for expert content, resources, and guides. Explore our website today.`,
        160
    );

    return {
        title,
        metaDescription: desc,
        ogImageSuggestion: `Clean hero image featuring "${keyword || brand}" as large heading text with brand colors on a professional background.`,
    };
}

function buildBenefitDriven(
    data: ScrapedSEOData,
    keyword: string,
    brand: string
): OptimizedVariation {
    const benefit = keyword ? `about ${keyword}` : "";
    const title = truncate(
        keyword
            ? `Learn ${capitalize(keyword)} — Expert Tips & Resources`
            : `${brand} — Your Trusted Resource`,
        60
    );

    const desc = truncate(
        `Get the latest insights ${benefit} from ${brand}. Trusted by thousands. Start exploring our curated content now.`,
        160
    );

    return {
        title,
        metaDescription: desc,
        ogImageSuggestion: `Benefits-focused infographic showing key value propositions ${benefit} with ${brand} branding.`,
    };
}

function buildActionOriented(
    data: ScrapedSEOData,
    keyword: string,
    brand: string
): OptimizedVariation {
    const title = truncate(
        keyword
            ? `${capitalize(keyword)} — Get Started with ${brand}`
            : `Get Started with ${brand} Today`,
        60
    );

    const desc = truncate(
        keyword
            ? `Ready to master ${keyword}? ${brand} has everything you need. Start now — it's free.`
            : `Explore what ${brand} has to offer. Get started today — discover expert resources and insights.`,
        160
    );

    return {
        title,
        metaDescription: desc,
        ogImageSuggestion: `Bold call-to-action graphic with "Get Started" button, ${keyword || brand} text, and energetic brand colors.`,
    };
}

// ─── Utilities ───────────────────────────────────────────────────────────────

function extractDomain(url: string): string {
    try {
        return new URL(url).hostname.replace(/^www\./, "");
    } catch {
        return url;
    }
}

function extractBrand(domain: string): string {
    // "example.com" → "Example"
    const name = domain.split(".")[0] || domain;
    return capitalize(name);
}

function extractKeyword(data: ScrapedSEOData): string {
    // Best signal: H1 > Title > OG Title > OG Description (first phrase)
    const raw = data.h1 || data.title || data.ogTitle || "";
    // Clean up: remove brand suffixes like " | Brand" or " - Brand"
    return raw
        .replace(/\s*[|–—-]\s*.{1,30}$/, "")
        .trim()
        .toLowerCase()
        .slice(0, 50);
}

function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function truncate(str: string, max: number): string {
    if (str.length <= max) return str;
    return str.slice(0, max - 1).replace(/\s+\S*$/, "") + "…";
}

function identifyIssues(data: ScrapedSEOData): string[] {
    const issues: string[] = [];

    if (!data.title) issues.push("Missing title tag");
    else if (data.title.length > 60) issues.push(`Title too long (${data.title.length}/60 chars)`);
    else if (data.title.length < 20) issues.push(`Title too short (${data.title.length}/60 chars)`);

    if (!data.metaDescription) issues.push("Missing meta description");
    else if (data.metaDescription.length > 160)
        issues.push(`Description too long (${data.metaDescription.length}/160 chars)`);
    else if (data.metaDescription.length < 50)
        issues.push(`Description too short (${data.metaDescription.length}/160 chars)`);

    if (!data.ogImage) issues.push("Missing og:image tag");
    if (!data.ogTitle) issues.push("Missing og:title tag");
    if (!data.ogDescription) issues.push("Missing og:description tag");
    if (!data.canonical) issues.push("Missing canonical URL");

    return issues;
}
