import { NextRequest, NextResponse } from 'next/server';
import { InternalPage, KeywordResult, SuggestedLink } from '@/types';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyCOStcZT9mG4zqPUl21lm1HTPifPDb6MFo';

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
}

async function callGemini(prompt: string): Promise<string> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 4096,
        },
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
  }

  const data: GeminiResponse = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

function matchInternalLinks(keywords: string[], internalPages: InternalPage[]): Map<string, SuggestedLink[]> {
  const matches = new Map<string, SuggestedLink[]>();

  for (const keyword of keywords) {
    const keywordLower = keyword.toLowerCase();
    const keywordWords = keywordLower.split(/\s+/);
    const suggestions: SuggestedLink[] = [];

    for (const page of internalPages) {
      let score = 0;
      const titleLower = page.title.toLowerCase();
      const urlLower = page.url.toLowerCase();
      const descLower = page.description.toLowerCase();

      // 完整关键词匹配（高权重）
      if (titleLower.includes(keywordLower)) {
        score += 60;
      }

      // 单词级别匹配
      for (const word of keywordWords) {
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
      for (const pageKeyword of page.keywords) {
        const pkLower = pageKeyword.toLowerCase();
        if (pkLower.includes(keywordLower) || keywordLower.includes(pkLower)) {
          score += 30;
        }
        // 单词匹配
        for (const word of keywordWords) {
          if (word.length >= 3 && pkLower.includes(word)) {
            score += 15;
          }
        }
      }

      if (score > 20) { // 降低阈值
        suggestions.push({
          url: page.url,
          title: page.title,
          description: page.description || page.url,
          type: 'internal',
          relevanceScore: Math.min(score, 100),
        });
      }
    }

    // 按相关性排序
    suggestions.sort((a, b) => b.relevanceScore - a.relevanceScore);
    matches.set(keyword, suggestions.slice(0, 5)); // 增加到5个建议
  }

  return matches;
}

export async function POST(request: NextRequest) {
  try {
    const { text, internalPages = [] } = await request.json();

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Text is required' },
        { status: 400 }
      );
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
    let keywords: KeywordResult[] = [];
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
    const internalMatches = matchInternalLinks(
      keywords.map(k => k.keyword),
      internalPages
    );

    // 合并结果
    const results: KeywordResult[] = keywords.map(k => ({
      ...k,
      suggestedLinks: internalMatches.get(k.keyword) || [],
    }));

    return NextResponse.json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.error('Analyze error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Analysis failed' },
      { status: 500 }
    );
  }
}
