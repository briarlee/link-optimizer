// 内链页面信息
export interface InternalPage {
  url: string;
  title: string;
  description: string;
  keywords: string[];
  lastScanned?: string;
}

// 外链信息
export interface ExternalLink {
  url: string;
  title: string;
  snippet: string;
  source: string;
}

// 关键词分析结果
export interface KeywordResult {
  keyword: string;
  type: 'internal' | 'external' | 'both';
  context: string;
  position: number;
  suggestedLinks: SuggestedLink[];
}

// 建议链接
export interface SuggestedLink {
  url: string;
  title: string;
  description: string;
  type: 'internal' | 'external';
  relevanceScore: number;
  isPreferred?: boolean;
}

// 站点配置
export interface SiteConfig {
  domain: string;
  pages: InternalPage[];
  lastScanned?: string;
}

// 用户设置
export interface UserSettings {
  preferredDomains: string[];
  blacklistedDomains: string[];
  siteConfig?: SiteConfig;
  maxInternalLinks: number;
  maxExternalLinks: number;
}

// SEO 评分
export interface SEOScore {
  overall: number;
  linkDensity: number;
  anchorDiversity: number;
  internalExternalRatio: number;
  suggestions: string[];
}

// 优化结果
export interface OptimizationResult {
  originalText: string;
  optimizedMarkdown: string;
  keywords: KeywordResult[];
  selectedLinks: SelectedLink[];
  seoScore: SEOScore;
}

// 选中的链接
export interface SelectedLink {
  keyword: string;
  url: string;
  title: string;
  type: 'internal' | 'external';
  anchorText: string;
}

// API 响应
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
