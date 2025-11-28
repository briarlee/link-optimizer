"use client";

import { SiteScanner } from "@/components/SiteScanner";
import { TextEditor } from "@/components/TextEditor";
import { KeywordPanel } from "@/components/KeywordPanel";
import { OutputPreview } from "@/components/OutputPreview";
import { SettingsPanel } from "@/components/SettingsPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Link2, 
  Sparkles, 
  Settings, 
  FileText,
  Globe,
  Zap,
  Target,
  BarChart3
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/25">
                <Link2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-100">Link Optimizer Pro</h1>
                <p className="text-xs text-slate-500">AI-Powered Link Management</p>
              </div>
            </div>
            <nav className="flex items-center gap-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg px-3 py-2 text-sm text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-200"
              >
                GitHub
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-sm text-emerald-400">
              <Sparkles className="h-4 w-4" />
              AI-Powered Link Optimization
            </div>
            <h2 className="mb-4 text-4xl font-bold tracking-tight text-slate-100 sm:text-5xl">
              Optimize Your Content Links
              <br />
              <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Internal & External
              </span>
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-slate-400">
              Scan your website for internal links, analyze your content with AI,
              and get intelligent link suggestions to boost your SEO.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <FeatureCard
              icon={<Globe className="h-5 w-5" />}
              title="Site Scanner"
              description="Auto-crawl your website to build an internal link database"
              color="blue"
            />
            <FeatureCard
              icon={<Sparkles className="h-5 w-5" />}
              title="AI Analysis"
              description="Gemini AI identifies keywords that need links"
              color="purple"
            />
            <FeatureCard
              icon={<Target className="h-5 w-5" />}
              title="Smart Matching"
              description="Match internal pages and find quality external links"
              color="emerald"
            />
            <FeatureCard
              icon={<BarChart3 className="h-5 w-5" />}
              title="SEO Scoring"
              description="Get real-time SEO scores and optimization tips"
              color="amber"
            />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Tabs defaultValue="editor" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
            <TabsTrigger value="editor" className="gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Editor</span>
            </TabsTrigger>
            <TabsTrigger value="scanner" className="gap-2">
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline">Site Scanner</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="editor" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-6">
                <TextEditor />
                <KeywordPanel />
              </div>
              <div className="space-y-6">
                <OutputPreview />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="scanner">
            <div className="mx-auto max-w-2xl">
              <SiteScanner />
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <div className="mx-auto max-w-2xl">
              <SettingsPanel />
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-slate-500">
              Built for West Shore Furniture content optimization
            </p>
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <span>Powered by Gemini AI</span>
              <span>•</span>
              <span>Google Search API</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: "blue" | "purple" | "emerald" | "amber";
}

function FeatureCard({ icon, title, description, color }: FeatureCardProps) {
  const colors = {
    blue: "from-blue-500/10 to-blue-500/5 border-blue-500/20 text-blue-400",
    purple: "from-purple-500/10 to-purple-500/5 border-purple-500/20 text-purple-400",
    emerald: "from-emerald-500/10 to-emerald-500/5 border-emerald-500/20 text-emerald-400",
    amber: "from-amber-500/10 to-amber-500/5 border-amber-500/20 text-amber-400",
  };

  return (
    <div className={`rounded-2xl border bg-gradient-to-br p-5 ${colors[color]}`}>
      <div className="mb-3">{icon}</div>
      <h3 className="mb-1 font-semibold text-slate-200">{title}</h3>
      <p className="text-sm text-slate-400">{description}</p>
    </div>
  );
}
