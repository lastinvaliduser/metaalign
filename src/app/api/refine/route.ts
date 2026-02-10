import { NextRequest, NextResponse } from "next/server";
import { refineSEOData } from "@/services/ai-refiner";
import { refineWithRules } from "@/services/rule-engine";
import type { ScrapedSEOData } from "@/types";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { scrapedData, url } = body as {
            scrapedData?: ScrapedSEOData;
            url?: string;
        };

        if (!scrapedData || !url) {
            return NextResponse.json(
                { error: "scrapedData and url are required" },
                { status: 400 }
            );
        }

        // Strategy 1: Try AI refinement if a Gemini key is configured
        if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "your_gemini_api_key_here") {
            try {
                const refined = await refineSEOData(scrapedData, url);
                return NextResponse.json(refined);
            } catch (aiError) {
                console.log(
                    `[refine] AI refinement failed, falling back to rule engine:`,
                    aiError instanceof Error ? aiError.message : aiError
                );
            }
        }

        // Strategy 2: Rule-based fallback (always works, no API needed)
        const refined = refineWithRules(scrapedData, url);
        return NextResponse.json(refined);
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Failed to refine SEO data";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
