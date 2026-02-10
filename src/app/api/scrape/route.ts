import { NextRequest, NextResponse } from "next/server";
import { scrapeURL } from "@/services/scraper";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { url } = body as { url?: string };

        if (!url || typeof url !== "string") {
            return NextResponse.json(
                { error: "A valid URL is required" },
                { status: 400 }
            );
        }

        const scrapedData = await scrapeURL(url);
        return NextResponse.json(scrapedData);
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Failed to scrape URL";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
