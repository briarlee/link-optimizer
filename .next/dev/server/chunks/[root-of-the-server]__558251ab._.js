module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/Downloads/link-optimizer/src/app/api/analyze/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$link$2d$optimizer$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/link-optimizer/node_modules/next/server.js [app-route] (ecmascript)");
;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyCOStcZT9mG4zqPUl21lm1HTPifPDb6MFo';
async function callGemini(prompt) {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            contents: [
                {
                    parts: [
                        {
                            text: prompt
                        }
                    ]
                }
            ],
            generationConfig: {
                temperature: 0.3,
                maxOutputTokens: 4096
            }
        })
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}
function matchInternalLinks(keywords, internalPages) {
    const matches = new Map();
    for (const keyword of keywords){
        const keywordLower = keyword.toLowerCase();
        const keywordWords = keywordLower.split(/\s+/);
        const suggestions = [];
        for (const page of internalPages){
            let score = 0;
            const titleLower = page.title.toLowerCase();
            const urlLower = page.url.toLowerCase();
            const descLower = page.description.toLowerCase();
            // 完整关键词匹配（高权重）
            if (titleLower.includes(keywordLower)) {
                score += 60;
            }
            // 单词级别匹配
            for (const word of keywordWords){
                if (word.length < 3) continue; // 跳过太短的词
                if (titleLower.includes(word)) {
                    score += 25;
                }
                if (urlLower.includes(word)) {
                    score += 20;
                }
                if (descLower.includes(word)) {
                    score += 15;
                }
            }
            // 页面关键词匹配
            for (const pageKeyword of page.keywords){
                const pkLower = pageKeyword.toLowerCase();
                if (pkLower.includes(keywordLower) || keywordLower.includes(pkLower)) {
                    score += 30;
                }
                // 单词匹配
                for (const word of keywordWords){
                    if (word.length >= 3 && pkLower.includes(word)) {
                        score += 15;
                    }
                }
            }
            if (score > 20) {
                suggestions.push({
                    url: page.url,
                    title: page.title,
                    description: page.description || page.url,
                    type: 'internal',
                    relevanceScore: Math.min(score, 100)
                });
            }
        }
        // 按相关性排序
        suggestions.sort((a, b)=>b.relevanceScore - a.relevanceScore);
        matches.set(keyword, suggestions.slice(0, 5)); // 增加到5个建议
    }
    return matches;
}
async function POST(request) {
    try {
        const { text, internalPages = [] } = await request.json();
        if (!text || text.trim().length === 0) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$link$2d$optimizer$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: 'Text is required'
            }, {
                status: 400
            });
        }
        // 构建提示词
        const prompt = `Analyze the following English text and identify keywords/phrases that would benefit from hyperlinks. Focus on:
1. Technical terms and concepts
2. Product/service names
3. Industry-specific terminology
4. Proper nouns (companies, places, etc.)
5. Key topics that readers might want to learn more about

For each keyword, determine if it's better suited for:
- "internal": Topics the website might have content about
- "external": General knowledge or authoritative external sources
- "both": Could benefit from either type

Return a JSON array with this exact format (no markdown, just pure JSON):
[
  {
    "keyword": "the exact phrase from the text",
    "type": "internal|external|both",
    "context": "brief explanation of why this needs a link",
    "position": approximate character position in text
  }
]

Text to analyze:
"""
${text.slice(0, 8000)}
"""

Important: 
- Only return valid JSON, no other text
- Limit to 15 most important keywords
- Keywords should be 1-4 words
- Position should be the approximate character index where this keyword first appears`;
        const geminiResponse = await callGemini(prompt);
        // 解析 JSON 响应
        let keywords = [];
        try {
            // 尝试从响应中提取 JSON
            const jsonMatch = geminiResponse.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                keywords = JSON.parse(jsonMatch[0]);
            }
        } catch (parseError) {
            console.error('Failed to parse Gemini response:', parseError);
            console.log('Raw response:', geminiResponse);
        }
        // 匹配内链
        const internalMatches = matchInternalLinks(keywords.map((k)=>k.keyword), internalPages);
        // 合并结果
        const results = keywords.map((k)=>({
                ...k,
                suggestedLinks: internalMatches.get(k.keyword) || []
            }));
        return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$link$2d$optimizer$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            data: results
        });
    } catch (error) {
        console.error('Analyze error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$link$2d$optimizer$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: error instanceof Error ? error.message : 'Analysis failed'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__558251ab._.js.map