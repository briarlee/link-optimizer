"use client";

import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Globe, Scan, Check, X, Trash2, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';

export function SiteScanner() {
  const { siteConfig, setSiteConfig, isScanning, setIsScanning } = useApp();
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const [showAllPages, setShowAllPages] = useState(false);

  const handleScan = async () => {
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    // 验证 URL
    try {
      new URL(url);
    } catch {
      setError('Please enter a valid URL');
      return;
    }

    setError('');
    setIsScanning(true);
    setProgress(10);

    try {
      // 模拟进度
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 5, 90));
      }, 2000);

      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, maxPages: 500 }),
      });

      clearInterval(progressInterval);
      setProgress(100);

      const result = await response.json();

      if (result.success) {
        setSiteConfig(result.data);
      } else {
        setError(result.error || 'Scan failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsScanning(false);
      setTimeout(() => setProgress(0), 500);
    }
  };

  const handleClear = () => {
    setSiteConfig(null);
    setUrl('');
    setShowAllPages(false);
  };

  const displayedPages = showAllPages 
    ? siteConfig?.pages || [] 
    : (siteConfig?.pages || []).slice(0, 10);

  const remainingCount = (siteConfig?.pages.length || 0) - 10;

  return (
    <Card className="border-slate-800 bg-gradient-to-br from-slate-900 to-slate-900/50">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
            <Globe className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <CardTitle className="text-lg">Internal Links Database</CardTitle>
            <CardDescription>Scan your website to build internal link suggestions</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!siteConfig ? (
          <>
            <div className="flex gap-2">
              <Input
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={isScanning}
                className="flex-1"
              />
              <Button
                onClick={handleScan}
                disabled={isScanning}
                className="min-w-[100px]"
              >
                {isScanning ? (
                  <>
                    <Scan className="h-4 w-4 animate-spin" />
                    Scanning
                  </>
                ) : (
                  <>
                    <Scan className="h-4 w-4" />
                    Scan
                  </>
                )}
              </Button>
            </div>

            {isScanning && (
              <div className="space-y-2">
                <Progress value={progress} />
                <p className="text-xs text-slate-500">Scanning pages... This may take a few minutes for large sites.</p>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">
                <X className="h-4 w-4" />
                {error}
              </div>
            )}
          </>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-emerald-400" />
                <span className="font-medium text-slate-200">{siteConfig.domain}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleClear}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="internal">
                {siteConfig.pages.length} pages indexed
              </Badge>
              <Badge variant="secondary">
                Last scan: {new Date(siteConfig.lastScanned!).toLocaleDateString()}
              </Badge>
            </div>

            <div className="max-h-[400px] overflow-y-auto rounded-lg border border-slate-800 bg-slate-950/50">
              {displayedPages.map((page, i) => (
                <div
                  key={page.url}
                  className="flex items-center justify-between border-b border-slate-800 px-3 py-2 last:border-0 hover:bg-slate-800/30"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-slate-300">{page.title}</p>
                    <p className="truncate text-xs text-slate-500">{page.url}</p>
                  </div>
                  <a
                    href={page.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-slate-500 hover:text-slate-300"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              ))}
            </div>

            {siteConfig.pages.length > 10 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAllPages(!showAllPages)}
                className="w-full text-slate-400"
              >
                {showAllPages ? (
                  <>
                    <ChevronUp className="mr-2 h-4 w-4" />
                    Show less
                  </>
                ) : (
                  <>
                    <ChevronDown className="mr-2 h-4 w-4" />
                    Show all {siteConfig.pages.length} pages (+{remainingCount} more)
                  </>
                )}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
