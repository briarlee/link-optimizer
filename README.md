# Link Optimizer Pro

AI-powered internal and external link optimization tool for content marketing.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)

## Features

- 🔍 **Site Scanner** - Crawl your website to build internal link database
- 🤖 **AI Analysis** - Gemini AI identifies linkable keywords
- 🔗 **Smart Matching** - Match internal pages & find quality external links
- 📊 **SEO Scoring** - Real-time scores with optimization tips
- ⚙️ **Preferences** - Set preferred domains & blacklist
- 📋 **Export** - Markdown / Markdown with footnotes

## Quick Start

### 1. Clone

```bash
git clone https://github.com/YOUR_USERNAME/link-optimizer.git
cd link-optimizer
npm install
```

### 2. Configure

Copy `.env.example` to `.env.local` and fill in your API keys:

```env
GEMINI_API_KEY=your_gemini_key
GOOGLE_SEARCH_API_KEY=your_search_key
GOOGLE_SEARCH_ENGINE_ID=your_engine_id
```

### 3. Get API Keys

| Service | URL | Free Tier |
|---------|-----|-----------|
| Gemini API | [aistudio.google.com](https://aistudio.google.com/apikey) | 60 req/min |
| Google Search API | [console.cloud.google.com](https://console.cloud.google.com/) | 100 req/day |
| Search Engine ID | [programmablesearchengine.google.com](https://programmablesearchengine.google.com/) | Free |

### 4. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/link-optimizer&env=GEMINI_API_KEY,GOOGLE_SEARCH_API_KEY,GOOGLE_SEARCH_ENGINE_ID)

1. Click the button above or import from GitHub
2. Add environment variables
3. Deploy!

## Usage

1. **Scan Site** (optional) - Enter your website URL to build internal link database
2. **Paste Content** - Add your article in the Editor tab
3. **Analyze** - AI identifies keywords needing links
4. **Select Links** - Choose internal or external links for each keyword
5. **Export** - Copy optimized Markdown

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- Google Gemini API
- Google Custom Search API

## License

MIT
