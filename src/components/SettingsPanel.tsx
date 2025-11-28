"use client";

import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Settings, Plus, X, Star, Ban, Save } from 'lucide-react';

export function SettingsPanel() {
  const { settings, setSettings } = useApp();
  const [preferredInput, setPreferredInput] = useState('');
  const [blacklistInput, setBlacklistInput] = useState('');

  const addPreferredDomain = () => {
    if (!preferredInput.trim()) return;
    if (settings.preferredDomains.length >= 5) return;
    
    const domain = preferredInput.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, '');
    if (!settings.preferredDomains.includes(domain)) {
      setSettings({
        ...settings,
        preferredDomains: [...settings.preferredDomains, domain],
      });
    }
    setPreferredInput('');
  };

  const removePreferredDomain = (domain: string) => {
    setSettings({
      ...settings,
      preferredDomains: settings.preferredDomains.filter(d => d !== domain),
    });
  };

  const addBlacklistedDomain = () => {
    if (!blacklistInput.trim()) return;
    
    const domain = blacklistInput.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, '');
    if (!settings.blacklistedDomains.includes(domain)) {
      setSettings({
        ...settings,
        blacklistedDomains: [...settings.blacklistedDomains, domain],
      });
    }
    setBlacklistInput('');
  };

  const removeBlacklistedDomain = (domain: string) => {
    setSettings({
      ...settings,
      blacklistedDomains: settings.blacklistedDomains.filter(d => d !== domain),
    });
  };

  return (
    <Card className="border-slate-800 bg-gradient-to-br from-slate-900 to-slate-900/50">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-500/10">
            <Settings className="h-5 w-5 text-slate-400" />
          </div>
          <div>
            <CardTitle className="text-lg">Link Preferences</CardTitle>
            <CardDescription>Configure preferred and blocked domains</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 偏好域名 */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-amber-400" />
            <span className="text-sm font-medium text-slate-200">Preferred Domains</span>
            <span className="text-xs text-slate-500">(max 5)</span>
          </div>
          <p className="text-xs text-slate-500">
            Links from these domains will be prioritized in search results
          </p>
          <div className="flex gap-2">
            <Input
              placeholder="example.com"
              value={preferredInput}
              onChange={(e) => setPreferredInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addPreferredDomain()}
              className="flex-1"
            />
            <Button
              variant="secondary"
              size="icon"
              onClick={addPreferredDomain}
              disabled={settings.preferredDomains.length >= 5}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {settings.preferredDomains.map((domain) => (
              <Badge key={domain} variant="default" className="gap-1 pr-1">
                <Star className="h-3 w-3" />
                {domain}
                <button
                  onClick={() => removePreferredDomain(domain)}
                  className="ml-1 rounded-full p-0.5 hover:bg-white/20"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            {settings.preferredDomains.length === 0 && (
              <span className="text-xs text-slate-600">No preferred domains set</span>
            )}
          </div>
        </div>

        {/* 黑名单域名 */}
        <div className="space-y-3 pt-4 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <Ban className="h-4 w-4 text-red-400" />
            <span className="text-sm font-medium text-slate-200">Blocked Domains</span>
          </div>
          <p className="text-xs text-slate-500">
            Links from these domains will be excluded from results
          </p>
          <div className="flex gap-2">
            <Input
              placeholder="spam-site.com"
              value={blacklistInput}
              onChange={(e) => setBlacklistInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addBlacklistedDomain()}
              className="flex-1"
            />
            <Button
              variant="secondary"
              size="icon"
              onClick={addBlacklistedDomain}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {settings.blacklistedDomains.map((domain) => (
              <Badge key={domain} variant="destructive" className="gap-1 pr-1">
                <Ban className="h-3 w-3" />
                {domain}
                <button
                  onClick={() => removeBlacklistedDomain(domain)}
                  className="ml-1 rounded-full p-0.5 hover:bg-white/20"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            {settings.blacklistedDomains.length === 0 && (
              <span className="text-xs text-slate-600">No blocked domains</span>
            )}
          </div>
        </div>

        {/* 链接数量限制 */}
        <div className="space-y-3 pt-4 border-t border-slate-800">
          <span className="text-sm font-medium text-slate-200">Link Limits</span>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs text-slate-500">Max Internal Links</label>
              <Input
                type="number"
                min={1}
                max={20}
                value={settings.maxInternalLinks}
                onChange={(e) => setSettings({
                  ...settings,
                  maxInternalLinks: parseInt(e.target.value) || 10,
                })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-slate-500">Max External Links</label>
              <Input
                type="number"
                min={1}
                max={20}
                value={settings.maxExternalLinks}
                onChange={(e) => setSettings({
                  ...settings,
                  maxExternalLinks: parseInt(e.target.value) || 5,
                })}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
