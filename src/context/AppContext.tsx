"use client";

import { createContext, useContext, useState, ReactNode } from 'react';
import { 
  InternalPage, 
  KeywordResult, 
  SelectedLink, 
  SEOScore,
  UserSettings,
  SiteConfig,
  ExternalLink,
  SuggestedLink
} from '@/types';

interface AppState {
  // 文本内容
  text: string;
  setText: (text: string) => void;

  // 站点配置
  siteConfig: SiteConfig | null;
  setSiteConfig: (config: SiteConfig | null) => void;

  // 用户设置
  settings: UserSettings;
  setSettings: (settings: UserSettings) => void;

  // 关键词分析结果
  keywords: KeywordResult[];
  setKeywords: (keywords: KeywordResult[]) => void;

  // 选中的链接
  selectedLinks: SelectedLink[];
  addLink: (link: SelectedLink) => void;
  removeLink: (keyword: string) => void;
  updateLink: (keyword: string, link: Partial<SelectedLink>) => void;

  // SEO 评分
  seoScore: SEOScore | null;
  setSeoScore: (score: SEOScore | null) => void;

  // 加载状态
  isAnalyzing: boolean;
  setIsAnalyzing: (loading: boolean) => void;
  isScanning: boolean;
  setIsScanning: (loading: boolean) => void;
  isSearching: boolean;
  setIsSearching: (loading: boolean) => void;

  // 外链搜索结果缓存
  externalLinksCache: Record<string, ExternalLink[]>;
  setExternalLinksCache: (keyword: string, links: ExternalLink[]) => void;

  // 重置
  reset: () => void;
}

const defaultSettings: UserSettings = {
  preferredDomains: [],
  blacklistedDomains: [],
  maxInternalLinks: 10,
  maxExternalLinks: 5,
};

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [text, setText] = useState('');
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null);
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [keywords, setKeywords] = useState<KeywordResult[]>([]);
  const [selectedLinks, setSelectedLinks] = useState<SelectedLink[]>([]);
  const [seoScore, setSeoScore] = useState<SEOScore | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [externalLinksCache, setExternalLinksCacheState] = useState<Record<string, ExternalLink[]>>({});

  const addLink = (link: SelectedLink) => {
    setSelectedLinks(prev => {
      const exists = prev.find(l => l.keyword === link.keyword);
      if (exists) {
        return prev.map(l => l.keyword === link.keyword ? link : l);
      }
      return [...prev, link];
    });
  };

  const removeLink = (keyword: string) => {
    setSelectedLinks(prev => prev.filter(l => l.keyword !== keyword));
  };

  const updateLink = (keyword: string, updates: Partial<SelectedLink>) => {
    setSelectedLinks(prev => 
      prev.map(l => l.keyword === keyword ? { ...l, ...updates } : l)
    );
  };

  const setExternalLinksCache = (keyword: string, links: ExternalLink[]) => {
    setExternalLinksCacheState(prev => ({ ...prev, [keyword]: links }));
  };

  const reset = () => {
    setText('');
    setKeywords([]);
    setSelectedLinks([]);
    setSeoScore(null);
    setExternalLinksCacheState({});
  };

  return (
    <AppContext.Provider
      value={{
        text,
        setText,
        siteConfig,
        setSiteConfig,
        settings,
        setSettings,
        keywords,
        setKeywords,
        selectedLinks,
        addLink,
        removeLink,
        updateLink,
        seoScore,
        setSeoScore,
        isAnalyzing,
        setIsAnalyzing,
        isScanning,
        setIsScanning,
        isSearching,
        setIsSearching,
        externalLinksCache,
        setExternalLinksCache,
        reset,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
