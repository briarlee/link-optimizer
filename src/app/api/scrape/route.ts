import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { InternalPage } from '@/types';

// 爬取单个页面
async function scrapePage(url: string): Promise<InternalPage | null> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; LinkOptimizer/1.0)',
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) return null;

    const html = await response.text();
    const $ = cheerio.load(html);

    // 提取页面信息
    const title = $('title').text().trim() || 
                  $('meta[property="og:title"]').attr('content') || 
                  $('h1').first().text().trim() || 
                  url;

    const description = $('meta[name="description"]').attr('content') ||
                       $('meta[property="og:description"]').attr('content') ||
                       $('p').first().text().trim().slice(0, 200) ||
                       '';

    // 提取关键词
    const metaKeywords = $('meta[name="keywords"]').attr('content') || '';
    const h1Text = $('h1').map((_, el) => $(el).text().trim()).get();
    const h2Text = $('h2').map((_, el) => $(el).text().trim()).get().slice(0, 5);
    
    const keywords = [
      ...metaKeywords.split(',').map(k => k.trim()).filter(Boolean),
      ...h1Text,
      ...h2Text,
    ].filter((k, i, arr) => arr.indexOf(k) === i).slice(0, 10);

    return {
      url,
      title,
      description,
      keywords,
      lastScanned: new Date().toISOString(),
    };
  } catch (error) {
    console.error(`Error scraping ${url}:`, error);
    return null;
  }
}

// 从页面中提取所有内部链接
async function extractInternalLinks(url: string, domain: string): Promise<string[]> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; LinkOptimizer/1.0)',
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) return [];

    const html = await response.text();
    const $ = cheerio.load(html);
    const links: string[] = [];

    $('a[href]').each((_, el) => {
      const href = $(el).attr('href');
      if (!href) return;

      let absoluteUrl: string;
      try {
        absoluteUrl = new URL(href, url).href;
      } catch {
        return;
      }

      // 只保留同域名的链接
      if (absoluteUrl.includes(domain) && 
          !absoluteUrl.includes('#') &&
          !absoluteUrl.match(/\.(jpg|jpeg|png|gif|pdf|zip|css|js)$/i)) {
        links.push(absoluteUrl);
      }
    });

    return [...new Set(links)];
  } catch (error) {
    console.error(`Error extracting links from ${url}:`, error);
    return [];
  }
}

export async function POST(request: NextRequest) {
  try {
    const { url, maxPages = 500 } = await request.json();

    if (!url) {
      return NextResponse.json(
        { success: false, error: 'URL is required' },
        { status: 400 }
      );
    }

    // 解析域名
    let domain: string;
    try {
      const urlObj = new URL(url);
      domain = urlObj.hostname;
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid URL' },
        { status: 400 }
      );
    }

    const visited = new Set<string>();
    const toVisit = [url];
    const pages: InternalPage[] = [];

    // 广度优先爬取
    while (toVisit.length > 0 && pages.length < maxPages) {
      const currentUrl = toVisit.shift()!;
      
      if (visited.has(currentUrl)) continue;
      visited.add(currentUrl);

      // 爬取页面
      const pageInfo = await scrapePage(currentUrl);
      if (pageInfo) {
        pages.push(pageInfo);

        // 提取更多链接
        if (pages.length < maxPages) {
          const newLinks = await extractInternalLinks(currentUrl, domain);
          for (const link of newLinks) {
            if (!visited.has(link) && !toVisit.includes(link)) {
              toVisit.push(link);
            }
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        domain,
        pages,
        totalPages: pages.length,
        lastScanned: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Scrape error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to scrape website' },
      { status: 500 }
    );
  }
}
