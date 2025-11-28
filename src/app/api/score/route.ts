import { NextRequest, NextResponse } from 'next/server';
import { SEOScore, SelectedLink } from '@/types';

interface ScoreInput {
  text: string;
  selectedLinks: SelectedLink[];
}

function calculateSEOScore(input: ScoreInput): SEOScore {
  const { text, selectedLinks } = input;
  const wordCount = text.split(/\s+/).length;
  const suggestions: string[] = [];

  // 1. 链接密度评分 (理想: 每300-500字1个链接)
  const totalLinks = selectedLinks.length;
  const idealLinksMin = Math.floor(wordCount / 500);
  const idealLinksMax = Math.ceil(wordCount / 300);
  
  let linkDensity = 100;
  if (totalLinks < idealLinksMin) {
    linkDensity = Math.max(50, 100 - (idealLinksMin - totalLinks) * 15);
    suggestions.push(`Consider adding ${idealLinksMin - totalLinks} more links. Current density is low.`);
  } else if (totalLinks > idealLinksMax) {
    linkDensity = Math.max(40, 100 - (totalLinks - idealLinksMax) * 10);
    suggestions.push(`You have ${totalLinks - idealLinksMax} more links than recommended. Consider removing some.`);
  }

  // 2. 锚文本多样性评分
  const anchorTexts = selectedLinks.map(l => l.anchorText.toLowerCase());
  const uniqueAnchors = new Set(anchorTexts);
  const anchorDiversity = anchorTexts.length > 0 
    ? Math.round((uniqueAnchors.size / anchorTexts.length) * 100)
    : 100;
  
  if (anchorDiversity < 70) {
    suggestions.push('Try to use more diverse anchor texts. Avoid repeating the same phrases.');
  }

  // 3. 内外链比例评分 (理想: 内链略多于外链)
  const internalLinks = selectedLinks.filter(l => l.type === 'internal').length;
  const externalLinks = selectedLinks.filter(l => l.type === 'external').length;
  
  let internalExternalRatio = 100;
  if (totalLinks > 0) {
    const ratio = internalLinks / totalLinks;
    if (ratio < 0.3) {
      internalExternalRatio = 60;
      suggestions.push('Add more internal links to improve site navigation and SEO.');
    } else if (ratio > 0.8) {
      internalExternalRatio = 70;
      suggestions.push('Consider adding external links to authoritative sources for credibility.');
    } else if (ratio >= 0.4 && ratio <= 0.6) {
      internalExternalRatio = 100;
    } else {
      internalExternalRatio = 85;
    }
  }

  // 4. 额外检查
  // 检查是否有重复链接
  const urls = selectedLinks.map(l => l.url);
  const uniqueUrls = new Set(urls);
  if (uniqueUrls.size < urls.length) {
    suggestions.push('Avoid linking to the same URL multiple times.');
  }

  // 检查锚文本长度
  const longAnchors = anchorTexts.filter(a => a.split(/\s+/).length > 5);
  if (longAnchors.length > 0) {
    suggestions.push('Some anchor texts are too long. Keep them under 5 words for better UX.');
  }

  // 计算总分
  const overall = Math.round(
    (linkDensity * 0.35) + 
    (anchorDiversity * 0.25) + 
    (internalExternalRatio * 0.4)
  );

  return {
    overall,
    linkDensity,
    anchorDiversity,
    internalExternalRatio,
    suggestions,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const score = calculateSEOScore(body);

    return NextResponse.json({
      success: true,
      data: score,
    });
  } catch (error) {
    console.error('Score calculation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to calculate score' },
      { status: 500 }
    );
  }
}
