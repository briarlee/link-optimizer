"use client";

import { useState, useEffect, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  FileCode, 
  Copy, 
  Check, 
  Download,
  AlertCircle,
  TrendingUp,
  Link2,
  Gauge,
  Home,
  ExternalLink
} from 'lucide-react';
import { SEOScore } from '@/types';

export function OutputPreview() {
  const { text, selectedLinks, seoScore, setSeoScore } = useApp();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('preview');

  // 生成优化后的 Markdown
  const optimizedMarkdown = useMemo(() => {
    if (!text || selectedLinks.length === 0) return text;

    let result = text;
    
    // 按位置从后往前替换，避免位置偏移
    const sortedLinks = [...selectedLinks].sort((a, b) => {
      const posA = text.toLowerCase().indexOf(a.keyword.toLowerCase());
      const posB = text.toLowerCase().indexOf(b.keyword.toLowerCase());
      return posB - posA;
    });

    for (const link of sortedLinks) {
      const regex = new RegExp(`\\b(${escapeRegex(link.keyword)})\\b`, 'gi');
      const replacement = `[${link.anchorText}](${link.url})`;
      result = result.replace(regex, replacement);
    }

    return result;
  }, [text, selectedLinks]);

  // 生成带脚注的 Markdown
  const markdownWithFootnotes = useMemo(() => {
    if (!text || selectedLinks.length === 0) return text;

    let result = text;
    const footnotes: string[] = [];

    const sortedLinks = [...selectedLinks].sort((a, b) => {
      const posA = text.toLowerCase().indexOf(a.keyword.toLowerCase());
      const posB = text.toLowerCase().indexOf(b.keyword.toLowerCase());
      return posB - posA;
    });

    sortedLinks.forEach((link, index) => {
      const footnoteNum = sortedLinks.length - index;
      const regex = new RegExp(`\\b(${escapeRegex(link.keyword)})\\b`, 'gi');
      result = result.replace(regex, `[${link.anchorText}][${footnoteNum}]`);
      footnotes.unshift(`[${footnoteNum}]: ${link.url} "${link.title}"`);
    });

    return result + '\n\n' + footnotes.join('\n');
  }, [text, selectedLinks]);

  // 计算 SEO 分数
  useEffect(() => {
    if (selectedLinks.length === 0) {
      setSeoScore(null);
      return;
    }

    const calculateScore = async () => {
      try {
        const response = await fetch('/api/score', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, selectedLinks }),
        });

        const result = await response.json();
        if (result.success) {
          setSeoScore(result.data);
        }
      } catch (error) {
        console.error('Score calculation error:', error);
      }
    };

    calculateScore();
  }, [text, selectedLinks, setSeoScore]);

  const handleCopy = async (content: string) => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!text || selectedLinks.length === 0) {
    return null;
  }

  const internalCount = selectedLinks.filter(l => l.type === 'internal').length;
  const externalCount = selectedLinks.filter(l => l.type === 'external').length;

  return (
    <Card className="border-slate-800 bg-gradient-to-br from-slate-900 to-slate-900/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10">
              <FileCode className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <CardTitle className="text-lg">Optimized Output</CardTitle>
              <CardDescription>
                <span className="inline-flex items-center gap-4">
                  <span className="inline-flex items-center gap-1">
                    <Home className="h-3 w-3" />
                    {internalCount} internal
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <ExternalLink className="h-3 w-3" />
                    {externalCount} external
                  </span>
                </span>
              </CardDescription>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleCopy(optimizedMarkdown)}
            >
              {copied ? (
                <Check className="mr-1 h-4 w-4" />
              ) : (
                <Copy className="mr-1 h-4 w-4" />
              )}
              {copied ? 'Copied!' : 'Copy'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDownload(optimizedMarkdown, 'optimized-article.md')}
            >
              <Download className="mr-1 h-4 w-4" />
              Download
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* SEO 评分 */}
        {seoScore && <SEOScorePanel score={seoScore} />}

        {/* 输出预览 */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full">
            <TabsTrigger value="preview" className="flex-1">Preview</TabsTrigger>
            <TabsTrigger value="markdown" className="flex-1">Markdown</TabsTrigger>
            <TabsTrigger value="footnotes" className="flex-1">With Footnotes</TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="mt-4">
            <div 
              className="prose prose-invert prose-sm max-w-none rounded-lg border border-slate-800 bg-slate-950/50 p-4 max-h-[400px] overflow-y-auto"
              dangerouslySetInnerHTML={{ 
                __html: markdownToHtml(optimizedMarkdown) 
              }}
            />
          </TabsContent>

          <TabsContent value="markdown" className="mt-4">
            <div className="relative">
              <pre className="rounded-lg border border-slate-800 bg-slate-950/50 p-4 text-sm text-slate-300 max-h-[400px] overflow-auto font-mono whitespace-pre-wrap">
                {optimizedMarkdown}
              </pre>
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-2"
                onClick={() => handleCopy(optimizedMarkdown)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="footnotes" className="mt-4">
            <div className="relative">
              <pre className="rounded-lg border border-slate-800 bg-slate-950/50 p-4 text-sm text-slate-300 max-h-[400px] overflow-auto font-mono whitespace-pre-wrap">
                {markdownWithFootnotes}
              </pre>
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-2"
                onClick={() => handleCopy(markdownWithFootnotes)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function SEOScorePanel({ score }: { score: SEOScore }) {
  const getScoreColor = (value: number) => {
    if (value >= 80) return 'text-emerald-400';
    if (value >= 60) return 'text-amber-400';
    return 'text-red-400';
  };

  const getProgressColor = (value: number) => {
    if (value >= 80) return 'bg-emerald-500';
    if (value >= 60) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/30 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Gauge className="h-5 w-5 text-slate-400" />
          <span className="font-medium text-slate-200">SEO Score</span>
        </div>
        <div className={`text-2xl font-bold ${getScoreColor(score.overall)}`}>
          {score.overall}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <ScoreItem 
          label="Link Density" 
          value={score.linkDensity} 
          icon={<Link2 className="h-4 w-4" />}
        />
        <ScoreItem 
          label="Anchor Diversity" 
          value={score.anchorDiversity}
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <ScoreItem 
          label="Internal/External" 
          value={score.internalExternalRatio}
          icon={<Home className="h-4 w-4" />}
        />
      </div>

      {score.suggestions.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-slate-800">
          {score.suggestions.map((suggestion, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-slate-400">
              <AlertCircle className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ScoreItem({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1 text-xs text-slate-500">
        {icon}
        {label}
      </div>
      <Progress value={value} className="h-1.5" />
      <div className="text-xs text-slate-400 text-right">{value}%</div>
    </div>
  );
}

// 工具函数
function escapeRegex(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function markdownToHtml(markdown: string): string {
  return markdown
    // 链接
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-emerald-400 hover:text-emerald-300 underline" target="_blank" rel="noopener">$1</a>')
    // 段落
    .replace(/\n\n/g, '</p><p>')
    .replace(/^/, '<p>')
    .replace(/$/, '</p>');
}
