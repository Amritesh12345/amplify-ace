import { Influencer, Status, STATUSES } from '@/types/influencer';
import { formatNumber } from '@/hooks/useInfluencers';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, ExternalLink, Star, Trash2, Edit2 } from 'lucide-react';
import { useState } from 'react';

interface Props {
  influencer: Influencer;
  onClose: () => void;
  onUpdate: (id: string, data: Partial<Influencer>) => void;
  onDelete: (id: string) => void;
}

export default function InfluencerDetail({ influencer: inf, onClose, onUpdate, onDelete }: Props) {
  const [notes, setNotes] = useState(inf.notes);

  const saveNotes = () => onUpdate(inf.id, { notes });

  return (
    <div className="w-[400px] border-l border-border bg-card h-full overflow-auto animate-slide-in-right">
      <div className="sticky top-0 bg-card z-10 border-b border-border px-5 py-3 flex items-center justify-between">
        <h2 className="font-semibold text-sm">Influencer Details</h2>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-7 w-7">
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="p-5 space-y-5">
        {/* Header */}
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={inf.profilePhoto} alt={inf.name} />
            <AvatarFallback>{inf.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
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

        {/* Bio */}
        <div>
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Bio</label>
          <p className="text-sm mt-1">{inf.bio || 'No bio available'}</p>
        </div>

        {/* Platform link */}
        {inf.platformUrl && (
          <a
            href={inf.platformUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            View {inf.platform} Profile
          </a>
        )}

        {/* Metrics */}
        <div>
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 block">Metrics</label>
          <div className="grid grid-cols-2 gap-3">
            <MetricCard label="Followers" value={formatNumber(inf.followers)} />
            <MetricCard label={inf.platform === 'YouTube' ? 'Avg Views' : 'Avg Reach'} value={formatNumber(inf.avgViews)} />
            <MetricCard label="Engagement" value={`${inf.engagementRate}%`} />
            <MetricCard label="Country" value={inf.country} />
          </div>
        </div>

        {/* Recent content */}
        {inf.recentContent.length > 0 && (
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 block">Recent Content</label>
            <ul className="space-y-1.5">
              {inf.recentContent.map((c, i) => (
                <li key={i} className="text-sm bg-muted rounded-md px-3 py-1.5">{c}</li>
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
          <Textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Add notes about this influencer..."
            rows={3}
          />
          {notes !== inf.notes && (
            <Button size="sm" className="mt-2" onClick={saveNotes}>Save Notes</Button>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2 border-t border-border">
          {inf.status !== 'Shortlisted' && (
            <Button
              size="sm"
              className="flex-1"
              onClick={() => onUpdate(inf.id, { status: 'Shortlisted' })}
            >
              <Star className="h-3.5 w-3.5 mr-1.5" />
              Add to Shortlist
            </Button>
          )}
          <Button
            size="sm"
            variant="destructive"
            onClick={() => { onDelete(inf.id); onClose(); }}
          >
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
