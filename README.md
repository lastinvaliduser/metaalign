# MetaAlign - Technical SEO Meta Tag Analyzer & Optimizer
> **Free SEO Meta Tag Analyzer & Optimizer**  
> Analyze any website's SEO meta tags instantly. Get AI-powered optimization suggestions for title, description, and Open Graph tags.

MetaAlign is a powerful, free tool designed to help developers and content creators optimize their website's SEO visibility. It scrapes your current meta tags, identifies issues, and uses Google's Gemini AI to generate optimized variations that drive more clicks.

## ✨ Features

- **🚀 Instant Analysis**: Scrape any URL to see how it looks on Google and social media.
- **🤖 AI Optimization**: Generate 3 unique variations (Keyword-Focused, Benefit-Driven, Action-Oriented) using Gemini AI.
- **🛡️ Smart Fallback**: built-in rule-based engine ensures you get suggestions even without an API key.
- **⚡ Serverless Ready**: Optimized for Vercel with rate limiting and efficient scraping strategies.
- **📊 History Tracking**: Automatically saves your recent analyses locally for quick access.
- **🎨 Modern UI**: Beautiful, responsive interface built with Tailwind CSS v4.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **AI**: [Google Gemini](https://ai.google.dev/) (via `@google/generative-ai`)
- **Backend/Auth**: [Supabase](https://supabase.com/)
- **Scraping**: [Cheerio](https://cheerio.js.org/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

Follow these steps to run MetaAlign locally.

### Prerequisites

- Node.js 18+ installed
- A Google Gemini API Key
- A Supabase Project (URL and Anon Key)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/lastinvaliduser/metaalign.git
   cd metaalign
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   Create a `.env.local` file in the root directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the app.

## 📖 API Reference

MetaAlign exposes two main API endpoints.

### 1. Scrape URL
Extracts raw meta tags from a given URL.

- **Endpoint**: `POST /api/scrape`
- **Body**:
  ```json
  { "url": "https://example.com" }
  ```
- **Response**:
  ```json
  {
    "url": "https://example.com",
    "title": "Example Domain",
    "metaDescription": null,
    "ogImage": null,
    ...
  }
  ```

### 2. Refine Tags
Generates optimized variations based on scraped data.

- **Endpoint**: `POST /api/refine`
- **Body**:
  ```json
  {
    "url": "https://example.com",
    "scrapedData": { ... }
  }
  ```
- **Response**:
  ```json
  {
    "original": { ... },
    "variations": [
      {
        "title": "Optimized Title 1",
        "metaDescription": "Optimized Description 1...",
        "ogImageSuggestion": "Description of image..."
      },
      ...
    ],
    "reasoning": "AI explanation..."
  }
  ```

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

