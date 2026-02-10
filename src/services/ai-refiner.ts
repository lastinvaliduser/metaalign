import { GoogleGenerativeAI } from "@google/generative-ai";
import type { ScrapedSEOData, RefinedSEOResult, OptimizedVariation } from "@/types";

const SYSTEM_PROMPT = `You are an expert Technical SEO consultant. Given the current SEO meta tags of a webpage, generate 3 optimized variations. Follow these rules strictly:

1. Title tags MUST be ≤60 characters. Include the primary keyword near the start.
2. Meta descriptions MUST be ≤160 characters. Include a clear call-to-action.
3. For og:image, provide a descriptive suggestion for what the image should contain.
4. Each variation should take a different angle (e.g., keyword-focused, benefit-driven, action-oriented).
5. If a tag is missing, create it from scratch based on the page content signals.

Respond ONLY with valid JSON in this exact format:
{
  "variations": [
    {
      "title": "...",
      "metaDescription": "...",
      "ogImageSuggestion": "..."
    }
  ],
  "reasoning": "Brief explanation of your optimization strategy"
}`;

export async function refineSEOData(
    scrapedData: ScrapedSEOData,
    url: string
): Promise<RefinedSEOResult> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error("GEMINI_API_KEY is not configured. Add it to .env.local to enable AI refinement.");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
        generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1000,
            responseMimeType: "application/json",
        },
    });

    const userPrompt = buildUserPrompt(scrapedData, url);
    const fullPrompt = `${SYSTEM_PROMPT}\n\n${userPrompt}`;

    const result = await model.generateContent(fullPrompt);
    const content = result.response.text();

    if (!content) {
        throw new Error("No response received from AI model");
    }

    const parsed = JSON.parse(content) as {
        variations: OptimizedVariation[];
        reasoning: string;
    };

    if (!parsed.variations || !Array.isArray(parsed.variations) || parsed.variations.length === 0) {
        throw new Error("Invalid AI response: missing variations array");
    }

    return {
        original: scrapedData,
        variations: parsed.variations.slice(0, 3),
        reasoning: parsed.reasoning || "No reasoning provided.",
    };
}

function buildUserPrompt(data: ScrapedSEOData, url: string): string {
    const lines = [
        `URL: ${url}`,
        ``,
        `Current SEO Tags:`,
        `- Title: ${data.title ?? "⚠️ MISSING"}`,
        `- Meta Description: ${data.metaDescription ?? "⚠️ MISSING"}`,
        `- OG Image: ${data.ogImage ?? "⚠️ MISSING"}`,
        ``,
        `Additional Page Signals:`,
        `- OG Title: ${data.ogTitle ?? "Not set"}`,
        `- OG Description: ${data.ogDescription ?? "Not set"}`,
        `- H1: ${data.h1 ?? "Not found"}`,
        `- Canonical: ${data.canonical ?? "Not set"}`,
        ``,
        `Generate 3 optimized variations of the title, meta description, and og:image suggestion.`,
    ];
    return lines.join("\n");
}
