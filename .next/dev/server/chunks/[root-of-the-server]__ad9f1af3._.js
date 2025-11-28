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
"[project]/Downloads/link-optimizer/src/app/api/search/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST,
    "PUT",
    ()=>PUT
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$link$2d$optimizer$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/link-optimizer/node_modules/next/server.js [app-route] (ecmascript)");
;
const GOOGLE_API_KEY = process.env.GOOGLE_SEARCH_API_KEY || 'AIzaSyCncGGmUfqzZGbZ9YnZfPg_6_-2zx8Ch10';
const SEARCH_ENGINE_ID = process.env.GOOGLE_SEARCH_ENGINE_ID || '';
async function searchGoogle(query, preferredDomains = [], blacklistedDomains = []) {
    // 如果没有配置 Search Engine ID，使用备用方案
    if (!SEARCH_ENGINE_ID) {
        return generateFallbackLinks(query);
    }
    try {
        const url = new URL('https://www.googleapis.com/customsearch/v1');
        url.searchParams.set('key', GOOGLE_API_KEY);
        url.searchParams.set('cx', SEARCH_ENGINE_ID);
        url.searchParams.set('q', query);
        url.searchParams.set('num', '10');
        const response = await fetch(url.toString());
        if (!response.ok) {
            console.error('Google Search API error:', await response.text());
            return generateFallbackLinks(query);
        }
        const data = await response.json();
        if (!data.items || data.items.length === 0) {
            return generateFallbackLinks(query);
        }
        // 过滤黑名单
        let results = data.items.filter((item)=>!blacklistedDomains.some((domain)=>item.link.includes(domain)));
        // 优先排序偏好域名
        results.sort((a, b)=>{
            const aPreferred = preferredDomains.some((d)=>a.link.includes(d)) ? -1 : 0;
            const bPreferred = preferredDomains.some((d)=>b.link.includes(d)) ? -1 : 0;
            return aPreferred - bPreferred;
        });
        return results.slice(0, 5).map((item)=>({
                url: item.link,
                title: item.title,
                snippet: item.snippet,
                source: item.displayLink
            }));
    } catch (error) {
        console.error('Search error:', error);
        return generateFallbackLinks(query);
    }
}
// 备用方案：生成基于关键词的权威网站链接
function generateFallbackLinks(query) {
    const queryLower = query.toLowerCase();
    const links = [];
    // 教育相关
    if (queryLower.includes('education') || queryLower.includes('learning') || queryLower.includes('montessori') || queryLower.includes('preschool') || queryLower.includes('kindergarten') || queryLower.includes('child')) {
        links.push({
            url: `https://en.wikipedia.org/wiki/${encodeURIComponent(query.replace(/\s+/g, '_'))}`,
            title: `${query} - Wikipedia`,
            snippet: `Learn more about ${query} on Wikipedia, the free encyclopedia.`,
            source: 'wikipedia.org'
        }, {
            url: `https://www.naeyc.org/search?search=${encodeURIComponent(query)}`,
            title: `${query} - NAEYC`,
            snippet: `Resources about ${query} from the National Association for the Education of Young Children.`,
            source: 'naeyc.org'
        });
    }
    // 安全/认证相关
    if (queryLower.includes('safety') || queryLower.includes('certification') || queryLower.includes('standard') || queryLower.includes('regulation')) {
        links.push({
            url: `https://www.cpsc.gov/Safety-Education`,
            title: 'Safety Education - CPSC',
            snippet: 'Consumer Product Safety Commission safety resources and guidelines.',
            source: 'cpsc.gov'
        });
    }
    // 通用 Wikipedia 链接
    if (links.length === 0) {
        links.push({
            url: `https://en.wikipedia.org/wiki/${encodeURIComponent(query.replace(/\s+/g, '_'))}`,
            title: `${query} - Wikipedia`,
            snippet: `Learn more about ${query} on Wikipedia.`,
            source: 'wikipedia.org'
        });
    }
    // 添加 Google Scholar 链接
    links.push({
        url: `https://scholar.google.com/scholar?q=${encodeURIComponent(query)}`,
        title: `${query} - Google Scholar`,
        snippet: `Academic articles and research about ${query}.`,
        source: 'scholar.google.com'
    });
    return links;
}
async function POST(request) {
    try {
        const { keyword, preferredDomains = [], blacklistedDomains = [] } = await request.json();
        if (!keyword) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$link$2d$optimizer$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: 'Keyword is required'
            }, {
                status: 400
            });
        }
        const links = await searchGoogle(keyword, preferredDomains, blacklistedDomains);
        return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$link$2d$optimizer$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            data: links
        });
    } catch (error) {
        console.error('Search route error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$link$2d$optimizer$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: 'Search failed'
        }, {
            status: 500
        });
    }
}
async function PUT(request) {
    try {
        const { keywords, preferredDomains = [], blacklistedDomains = [] } = await request.json();
        if (!keywords || !Array.isArray(keywords)) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$link$2d$optimizer$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: 'Keywords array is required'
            }, {
                status: 400
            });
        }
        const results = {};
        // 串行搜索避免 API 限制
        for (const keyword of keywords.slice(0, 10)){
            results[keyword] = await searchGoogle(keyword, preferredDomains, blacklistedDomains);
            // 添加小延迟避免触发 rate limit
            await new Promise((resolve)=>setTimeout(resolve, 200));
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$link$2d$optimizer$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            data: results
        });
    } catch (error) {
        console.error('Batch search error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$link$2d$optimizer$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: 'Batch search failed'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__ad9f1af3._.js.map