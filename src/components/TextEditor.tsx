"use client";

import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Sparkles, RotateCcw } from 'lucide-react';

export function TextEditor() {
  const {
    text,
    setText,
    siteConfig,
    settings,
    setKeywords,
    setIsAnalyzing,
    isAnalyzing,
    reset,
  } = useApp();

  const handleAnalyze = async () => {
    if (!text.trim()) return;

    setIsAnalyzing(true);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          internalPages: siteConfig?.pages || [],
        }),
      });

      const result = await response.json();

      if (result.success) {
        setKeywords(result.data);
      } else {
        console.error('Analysis failed:', result.error);
      }
    } catch (error) {
      console.error('Analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charCount = text.length;

  return (
    <Card className="border-slate-800 bg-gradient-to-br from-slate-900 to-slate-900/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
              <FileText className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <CardTitle className="text-lg">Content Editor</CardTitle>
              <CardDescription>Paste your English article to analyze</CardDescription>
            </div>
          </div>
          {text && (
            <Button variant="ghost" size="sm" onClick={reset}>
              <RotateCcw className="mr-1 h-4 w-4" />
              Clear
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Paste your article content here...

The tool will identify keywords and phrases that would benefit from hyperlinks, then suggest relevant internal and external links to enhance your content's SEO value."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="min-h-[250px] font-mono text-sm leading-relaxed"
          disabled={isAnalyzing}
        />

        <div className="flex items-center justify-between">
          <div className="flex gap-4 text-sm text-slate-500">
            <span>{wordCount.toLocaleString()} words</span>
            <span>{charCount.toLocaleString()} characters</span>
          </div>

          <Button
            onClick={handleAnalyze}
            disabled={!text.trim() || isAnalyzing}
            size="lg"
          >
            {isAnalyzing ? (
              <>
                <Sparkles className="mr-2 h-4 w-4 animate-pulse" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Analyze Keywords
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
