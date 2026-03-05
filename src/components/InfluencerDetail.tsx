import { Influencer, Status, STATUSES } from '@/types/influencer';
import { formatNumber } from '@/hooks/useInfluencers';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { X, ExternalLink, Star, Trash2, IndianRupee, Target, TrendingUp } from 'lucide-react';
import { useState } from 'react';

interface Props {
  influencer: Influencer;
  onClose: () => void;
  onUpdate: (id: string, data: Partial<Influencer>) => void;
  onDelete: (id: string) => void;
}

function calcFitScore(inf: Influencer): number {
  let score = 0;
  // Engagement weight (max 35)
  score += Math.min(inf.engagementRate * 4, 35);
  // Followers weight (max 25)
  if (inf.followers >= 1000000) score += 25;
  else if (inf.followers >= 500000) score += 20;
  else if (inf.followers >= 100000) score += 15;
  else if (inf.followers >= 10000) score += 10;
  else score += 5;
  // Avg views relative to followers (max 25)
  const viewRatio = inf.followers > 0 ? inf.avgViews / inf.followers : 0;
  score += Math.min(viewRatio * 100, 25);
  // Content availability (max 15)
  score += Math.min(inf.recentContent.length * 5, 15);
  return Math.min(Math.round(score), 100);
}

function fitColor(score: number): string {
  if (score >= 75) return 'text-success';
  if (score >= 50) return 'text-info';
  if (score >= 30) return 'text-warning';
  return 'text-destructive';
}

export default function InfluencerDetail({ influencer: inf, onClose, onUpdate, onDelete }: Props) {
  const [notes, setNotes] = useState(inf.notes);
  const fitScore = calcFitScore(inf);
  const estReelPrice = Math.round(inf.avgViews * 0.15);
  const estYTPrice = Math.round(inf.avgViews * 0.30);

  const saveNotes = () => onUpdate(inf.id, { notes });

  return (
    <div className="w-[420px] border-l border-border bg-card h-full overflow-auto animate-slide-in-right">
      <div className="sticky top-0 bg-card z-10 border-b border-border px-5 py-3 flex items-center justify-between">
        <h2 className="font-semibold text-sm">Influencer Details</h2>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-7 w-7">
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="p-5 space-y-5">
        {/* Header */}
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16 ring-2 ring-border">
            <AvatarImage src={inf.profilePhoto} alt={inf.name} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">{inf.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg leading-tight">{inf.name}</h3>
            <p className="text-sm text-muted-foreground">{inf.contactEmail}</p>
            <div className="flex gap-1.5 mt-1.5">
              <Badge variant="outline" className="text-xs">{inf.platform}</Badge>
              <Badge variant="secondary" className="text-xs">{inf.niche}</Badge>
            </div>
          </div>
        </div>

        {/* Campaign Fit Score */}
        <Card className="border-2 border-dashed">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-14 w-14 rounded-full border-4 border-current flex items-center justify-center shrink-0" style={{ color: `hsl(var(--${fitScore >= 75 ? 'success' : fitScore >= 50 ? 'info' : 'warning'}))` }}>
              <span className={`text-lg font-bold ${fitColor(fitScore)}`}>{fitScore}</span>
            </div>
            <div>
              <p className="font-semibold text-sm flex items-center gap-1.5">
                <Target className="h-3.5 w-3.5 text-primary" />
                Campaign Fit Score
              </p>
              <p className="text-xs text-muted-foreground">Based on engagement, reach, and content quality</p>
            </div>
          </CardContent>
        </Card>

        {/* Bio */}
        <div>
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Bio</label>
          <p className="text-sm mt-1">{inf.bio || 'No bio available'}</p>
        </div>

        {/* Platform link */}
        {inf.platformUrl && (
          <a href={inf.platformUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline">
            <ExternalLink className="h-3.5 w-3.5" /> View {inf.platform} Profile
          </a>
        )}

        {/* Metrics */}
        <div>
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 block">Profile Overview</label>
          <div className="grid grid-cols-2 gap-3">
            <MetricCard label="Followers" value={formatNumber(inf.followers)} />
            <MetricCard label="Avg Views" value={formatNumber(inf.avgViews)} />
            <MetricCard label="Engagement" value={`${inf.engagementRate}%`} />
            <MetricCard label="Est. Reach" value={formatNumber(Math.round(inf.avgViews * 1.3))} />
          </div>
        </div>

        {/* Audience Insights */}
        <div>
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 block">Audience Insights</label>
          <div className="grid grid-cols-2 gap-3">
            <MetricCard label="Top Country" value={inf.country} />
            <MetricCard label="Language" value={inf.language} />
          </div>
        </div>

        {/* Pricing Estimator */}
        <div>
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 block flex items-center gap-1.5">
            <IndianRupee className="h-3 w-3" /> Estimated Pricing
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-muted/50 rounded-md px-3 py-2">
              <p className="text-[11px] text-muted-foreground">Reel / Post</p>
              <p className="font-semibold text-sm">₹{formatNumber(estReelPrice)}</p>
            </div>
            <div className="bg-muted/50 rounded-md px-3 py-2">
              <p className="text-[11px] text-muted-foreground">YouTube Integration</p>
              <p className="font-semibold text-sm">₹{formatNumber(estYTPrice)}</p>
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground mt-1.5">
            Estimates: Reel = avg views × ₹0.15 · YT = avg views × ₹0.30
          </p>
        </div>

        {/* Recent content */}
        {inf.recentContent.length > 0 && (
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 block">Recent Content</label>
            <ul className="space-y-1.5">
              {inf.recentContent.map((c, i) => (
                <li key={i} className="text-sm bg-muted rounded-md px-3 py-2 flex items-center gap-2">
                  <TrendingUp className="h-3 w-3 text-muted-foreground shrink-0" />
                  {c}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Status */}
        <div>
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 block">Status</label>
          <Select value={inf.status} onValueChange={(v: Status) => onUpdate(inf.id, { status: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* Notes */}
        <div>
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 block">Notes</label>
          <Textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Add notes about this influencer..." rows={3} />
          {notes !== inf.notes && (
            <Button size="sm" className="mt-2" onClick={saveNotes}>Save Notes</Button>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2 border-t border-border">
          {inf.status !== 'Shortlisted' && inf.status !== 'Planned' && inf.status !== 'Confirmed' && (
            <Button size="sm" className="flex-1" onClick={() => onUpdate(inf.id, { status: 'Shortlisted' })}>
              <Star className="h-3.5 w-3.5 mr-1.5" /> Shortlist
            </Button>
          )}
          {inf.status === 'Shortlisted' && (
            <Button size="sm" variant="secondary" className="flex-1" onClick={() => onUpdate(inf.id, { status: 'Planned' })}>
              Plan for Campaign
            </Button>
          )}
          <Button size="sm" variant="destructive" onClick={() => { onDelete(inf.id); onClose(); }}>
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-muted/50 rounded-md px-3 py-2">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="font-semibold text-sm">{value}</p>
    </div>
  );
}
