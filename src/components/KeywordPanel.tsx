"use client";

import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Link2, 
  ExternalLink, 
  Home, 
  ChevronRight, 
  Loader2,
  Check,
  X,
  Star
} from 'lucide-react';
import { KeywordResult, SuggestedLink, ExternalLink as ExternalLinkType } from '@/types';

interface KeywordItemProps {
  keyword: KeywordResult;
  onSelectLink: (keyword: string, link: SuggestedLink | ExternalLinkType, type: 'internal' | 'external') => void;
  isSelected: boolean;
  selectedUrl?: string;
}

function KeywordItem({ keyword, onSelectLink, isSelected, selectedUrl }: KeywordItemProps) {
  const { settings, externalLinksCache, setExternalLinksCache, setIsSearching } = useApp();
  const [expanded, setExpanded] = useState(false);
  const [loadingExternal, setLoadingExternal] = useState(false);

  const externalLinks = externalLinksCache[keyword.keyword] || [];

  const handleExpand = async () => {
    setExpanded(!expanded);

    // 如果展开且没有外链缓存，则搜索（对所有类型都搜索外链作为备选）
    if (!expanded && externalLinks.length === 0) {
      setLoadingExternal(true);
      setIsSearching(true);

      try {
        const response = await fetch('/api/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            keyword: keyword.keyword,
            preferredDomains: settings.preferredDomains,
            blacklistedDomains: settings.blacklistedDomains,
          }),
        });

        const result = await response.json();
        if (result.success) {
          setExternalLinksCache(keyword.keyword, result.data);
        }
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoadingExternal(false);
        setIsSearching(false);
      }
    }
  };

  const typeColors = {
    internal: 'internal',
    external: 'external',
    both: 'default',
  } as const;

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/30 overflow-hidden transition-all duration-200 hover:border-slate-700">
      <button
        onClick={handleExpand}
        className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-slate-800/30"
      >
        <div className="flex items-center gap-3">
          <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${
            isSelected ? 'bg-emerald-500/20' : 'bg-slate-800'
          }`}>
            {isSelected ? (
              <Check className="h-4 w-4 text-emerald-400" />
            ) : (
              <Link2 className="h-4 w-4 text-slate-400" />
            )}
          </div>
          <div>
            <span className="font-medium text-slate-200">{keyword.keyword}</span>
            <p className="text-xs text-slate-500 mt-0.5">{keyword.context}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={typeColors[keyword.type]}>{keyword.type}</Badge>
          <ChevronRight className={`h-4 w-4 text-slate-500 transition-transform ${expanded ? 'rotate-90' : ''}`} />
        </div>
      </button>

      {expanded && (
        <div className="border-t border-slate-800 bg-slate-950/50 p-4 space-y-4">
          {/* 内链建议 */}
          {keyword.suggestedLinks.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-400 uppercase tracking-wide">
                <Home className="h-3 w-3" />
                Internal Links
              </div>
              {keyword.suggestedLinks.map((link, i) => (
                <LinkOption
                  key={link.url}
                  link={link}
                  type="internal"
                  isSelected={selectedUrl === link.url}
                  onSelect={() => onSelectLink(keyword.keyword, link, 'internal')}
                />
              ))}
            </div>
          )}

          {/* 外链建议 - 对所有类型都显示 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-400 uppercase tracking-wide">
              <ExternalLink className="h-3 w-3" />
              External Links
            </div>
            {loadingExternal ? (
              <div className="flex items-center gap-2 py-4 text-slate-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                Searching...
              </div>
            ) : externalLinks.length > 0 ? (
              externalLinks.map((link, i) => (
                <LinkOption
                  key={link.url}
                  link={{
                    url: link.url,
                    title: link.title,
                    description: link.snippet,
                    type: 'external',
                    relevanceScore: 80 - i * 10,
                    isPreferred: settings.preferredDomains.some(d => link.url.includes(d)),
                  }}
                  type="external"
                  isSelected={selectedUrl === link.url}
                  onSelect={() => onSelectLink(keyword.keyword, link, 'external')}
                />
              ))
            ) : (
              <p className="text-sm text-slate-500 py-2">No external links found</p>
            )}
          </div>

          {/* 不添加链接选项 */}
          {isSelected && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSelectLink(keyword.keyword, {} as SuggestedLink, 'internal')}
              className="w-full text-slate-400 hover:text-red-400"
            >
              <X className="mr-2 h-4 w-4" />
              Remove link
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

interface LinkOptionProps {
  link: SuggestedLink;
  type: 'internal' | 'external';
  isSelected: boolean;
  onSelect: () => void;
}

function LinkOption({ link, type, isSelected, onSelect }: LinkOptionProps) {
  return (
    <button
      onClick={onSelect}
      className={`w-full rounded-lg border p-3 text-left transition-all ${
        isSelected
          ? 'border-emerald-500/50 bg-emerald-500/10'
          : 'border-slate-800 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-800/50'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-medium text-slate-200">{link.title}</p>
            {link.isPreferred && (
              <Star className="h-3 w-3 text-amber-400 shrink-0" />
            )}
          </div>
          <p className="mt-1 line-clamp-2 text-xs text-slate-500">{link.description}</p>
          <p className="mt-1 truncate text-xs text-slate-600">{link.url}</p>
        </div>
        <div className={`shrink-0 rounded-full p-1 ${
          isSelected ? 'bg-emerald-500' : 'bg-slate-800'
        }`}>
          {isSelected ? (
            <Check className="h-3 w-3 text-white" />
          ) : (
            <div className="h-3 w-3" />
          )}
        </div>
      </div>
    </button>
  );
}

export function KeywordPanel() {
  const { keywords, selectedLinks, addLink, removeLink } = useApp();

  const handleSelectLink = (
    keyword: string,
    link: SuggestedLink | ExternalLinkType,
    type: 'internal' | 'external'
  ) => {
    if (!link.url) {
      removeLink(keyword);
      return;
    }

    addLink({
      keyword,
      url: link.url,
      title: link.title,
      type,
      anchorText: keyword,
    });
  };

  if (keywords.length === 0) {
    return null;
  }

  return (
    <Card className="border-slate-800 bg-gradient-to-br from-slate-900 to-slate-900/50">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10">
            <Link2 className="h-5 w-5 text-purple-400" />
          </div>
          <div>
            <CardTitle className="text-lg">
              Keywords Found
              <Badge className="ml-2" variant="secondary">{keywords.length}</Badge>
            </CardTitle>
            <CardDescription>
              Click on each keyword to select a link • {selectedLinks.length} selected
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {keywords.map((kw) => (
            <KeywordItem
              key={kw.keyword}
              keyword={kw}
              onSelectLink={handleSelectLink}
              isSelected={selectedLinks.some(l => l.keyword === kw.keyword)}
              selectedUrl={selectedLinks.find(l => l.keyword === kw.keyword)?.url}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
