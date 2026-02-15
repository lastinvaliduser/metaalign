import * as cheerio from "cheerio";
import type { ScrapedSEOData } from "@/types";

/**
 * Serverless-compatible scraper.
 *  Strategy 1: Standard fetch with browser-like headers
 *  Strategy 2: Retry with Googlebot User-Agent (many sites serve full HTML to bots)
 *  Strategy 3: Minimal fetch with Accept: text/html only
 */
export async function scrapeURL(url: string): Promise<ScrapedSEOData> {
    const normalizedUrl = normalizeUrl(url);

    // ── Strategy 1: Standard browser headers ──────────────────────────
    try {
        const result = await fetchAndParse(normalizedUrl, {
            "User-Agent":
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            Accept:
                "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
            "Cache-Control": "no-cache",
        });

        if (result.title || result.metaDescription || result.ogImage) {
            return result;
        }
        console.log("[scraper] Standard fetch returned no useful tags — trying Googlebot UA");
    } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.log(`[scraper] Standard fetch failed (${msg}) — trying Googlebot UA`);
    }

    // ── Strategy 2: Googlebot User-Agent ──────────────────────────────
    try {
        const result = await fetchAndParse(normalizedUrl, {
            "User-Agent":
                "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
            Accept: "text/html",
        });

        if (result.title || result.metaDescription || result.ogImage) {
            return result;
        }
        console.log("[scraper] Googlebot fetch returned no useful tags — trying minimal fetch");
    } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.log(`[scraper] Googlebot fetch failed (${msg}) — trying minimal fetch`);
    }

    // ── Strategy 3: Minimal fetch (last resort) ───────────────────────
    try {
        return await fetchAndParse(normalizedUrl, {
            "User-Agent": "MetaAlign/1.0",
            Accept: "text/html",
        });
    } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        throw new Error(`All scraping strategies failed for ${normalizedUrl}: ${msg}`);
    }
}

// ─── Fetch + Parse ───────────────────────────────────────────────────────────

async function fetchAndParse(
    url: string,
    headers: Record<string, string>
): Promise<ScrapedSEOData> {
    const response = await fetch(url, {
        headers,
        redirect: "follow",
        signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
        throw new Error(`HTTP ${response.status} ${response.statusText}`);
    }

    const contentType = response.headers.get("content-type") || "";
    if (
        !contentType.includes("text/html") &&
        !contentType.includes("application/xhtml")
    ) {
        throw new Error(`Not HTML (got ${contentType})`);
    }

    const html = await response.text();
    return parseHTML(html, url);
}

// ─── HTML Parser ─────────────────────────────────────────────────────────────

function parseHTML(html: string, url: string): ScrapedSEOData {
    const $ = cheerio.load(html);

    return {
        url,
        title: $("title").first().text().trim() || null,
        metaDescription:
            $('meta[name="description"]').attr("content")?.trim() || null,
        ogImage:
            $('meta[property="og:image"]').attr("content")?.trim() || null,
        ogTitle:
            $('meta[property="og:title"]').attr("content")?.trim() || null,
        ogDescription:
            $('meta[property="og:description"]').attr("content")?.trim() || null,
        canonical:
            $('link[rel="canonical"]').attr("href")?.trim() || null,
        h1: $("h1").first().text().trim() || null,
    };
}

// ─── URL Normalizer ──────────────────────────────────────────────────────────

function normalizeUrl(url: string): string {
    let normalized = url.trim();
    if (!/^https?:\/\//i.test(normalized)) {
        normalized = `https://${normalized}`;
    }
    new URL(normalized); // validate
    return normalized;
}
