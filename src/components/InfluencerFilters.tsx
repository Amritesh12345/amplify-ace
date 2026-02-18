import { Filters, PLATFORMS, NICHES, COUNTRIES, LANGUAGES, STATUSES, Platform, Niche } from '@/types/influencer';
import { defaultFilters } from '@/hooks/useInfluencers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { useState } from 'react';
import { formatNumber } from '@/hooks/useInfluencers';

interface Props {
  filters: Filters;
  onChange: (f: Filters) => void;
}

export default function InfluencerFilters({ filters, onChange }: Props) {
  const [expanded, setExpanded] = useState(false);

  const togglePlatform = (p: Platform) => {
    const next = filters.platforms.includes(p)
      ? filters.platforms.filter(x => x !== p)
      : [...filters.platforms, p];
    onChange({ ...filters, platforms: next });
  };

  const toggleNiche = (n: Niche) => {
    const next = filters.niches.includes(n)
      ? filters.niches.filter(x => x !== n)
      : [...filters.niches, n];
    onChange({ ...filters, niches: next });
  };

  const hasFilters = filters.platforms.length > 0 || filters.niches.length > 0 ||
    filters.country || filters.language || filters.status ||
    filters.followersMin > 0 || filters.followersMax < 10000000 ||
    filters.engagementMin > 0 || filters.engagementMax < 15 || filters.search;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search influencers..."
            value={filters.search}
            onChange={e => onChange({ ...filters, search: e.target.value })}
            className="pl-9"
          />
        </div>
        <Button
          variant={expanded ? 'default' : 'outline'}
          size="sm"
          onClick={() => setExpanded(!expanded)}
        >
          <SlidersHorizontal className="h-4 w-4 mr-1.5" />
          Filters
        </Button>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={() => onChange(defaultFilters)}>
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {expanded && (
        <div className="bg-card border border-border rounded-lg p-4 space-y-4 animate-fade-in">
          {/* Platform */}
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 block">Platform</label>
            <div className="flex gap-2">
              {PLATFORMS.map(p => (
                <Badge
                  key={p}
                  variant={filters.platforms.includes(p) ? 'default' : 'outline'}
                  className="cursor-pointer select-none"
                  onClick={() => togglePlatform(p)}
                >
                  {p}
                </Badge>
              ))}
            </div>
          </div>

          {/* Niche */}
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 block">Niche</label>
            <div className="flex flex-wrap gap-2">
              {NICHES.map(n => (
                <Badge
                  key={n}
                  variant={filters.niches.includes(n) ? 'default' : 'outline'}
                  className="cursor-pointer select-none"
                  onClick={() => toggleNiche(n)}
                >
                  {n}
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Followers range */}
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 block">
                Followers: {formatNumber(filters.followersMin)} – {formatNumber(filters.followersMax)}
              </label>
              <Slider
                min={0}
                max={10000000}
                step={10000}
                value={[filters.followersMin, filters.followersMax]}
                onValueChange={([min, max]) => onChange({ ...filters, followersMin: min, followersMax: max })}
              />
            </div>

            {/* Engagement range */}
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 block">
                Engagement: {filters.engagementMin}% – {filters.engagementMax}%
              </label>
              <Slider
                min={0}
                max={15}
                step={0.1}
                value={[filters.engagementMin, filters.engagementMax]}
                onValueChange={([min, max]) => onChange({ ...filters, engagementMin: min, engagementMax: max })}
              />
            </div>

            {/* Country */}
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 block">Country</label>
              <Select value={filters.country} onValueChange={v => onChange({ ...filters, country: v === 'all' ? '' : v })}>
                <SelectTrigger><SelectValue placeholder="All countries" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All countries</SelectItem>
                  {COUNTRIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {/* Language */}
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 block">Language</label>
              <Select value={filters.language} onValueChange={v => onChange({ ...filters, language: v === 'all' ? '' : v })}>
                <SelectTrigger><SelectValue placeholder="All languages" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All languages</SelectItem>
                  {LANGUAGES.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 block">Status</label>
            <div className="flex gap-2">
              {STATUSES.map(s => (
                <Badge
                  key={s}
                  variant={filters.status === s ? 'default' : 'outline'}
                  className="cursor-pointer select-none"
                  onClick={() => onChange({ ...filters, status: filters.status === s ? '' : s })}
                >
                  {s}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
