import { useState } from 'react';
import { Influencer, PLATFORMS, NICHES, COUNTRIES, LANGUAGES, STATUSES, Platform, Niche, Status } from '@/types/influencer';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (inf: Omit<Influencer, 'id'>) => void;
  initial?: Influencer;
}

export default function AddInfluencerDialog({ open, onClose, onSave, initial }: Props) {
  const [form, setForm] = useState({
    name: initial?.name || '',
    platform: initial?.platform || 'YouTube' as Platform,
    niche: initial?.niche || 'Tech' as Niche,
    followers: initial?.followers?.toString() || '',
    avgViews: initial?.avgViews?.toString() || '',
    engagementRate: initial?.engagementRate?.toString() || '',
    country: initial?.country || 'United States',
    language: initial?.language || 'English',
    contactEmail: initial?.contactEmail || '',
    notes: initial?.notes || '',
    status: initial?.status || 'Not Reviewed' as Status,
    bio: initial?.bio || '',
    profilePhoto: initial?.profilePhoto || '',
    platformUrl: initial?.platformUrl || '',
  });

  const set = (key: string, val: string) => setForm(f => ({ ...f, [key]: val }));

  const handleSave = () => {
    onSave({
      ...form,
      followers: parseInt(form.followers) || 0,
      avgViews: parseInt(form.avgViews) || 0,
      engagementRate: parseFloat(form.engagementRate) || 0,
      recentContent: [],
    } as Omit<Influencer, 'id'>);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>{initial ? 'Edit Influencer' : 'Add Influencer'}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <Label>Name</Label>
            <Input value={form.name} onChange={e => set('name', e.target.value)} />
          </div>
          <div>
            <Label>Platform</Label>
            <Select value={form.platform} onValueChange={v => set('platform', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {PLATFORMS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Niche</Label>
            <Select value={form.niche} onValueChange={v => set('niche', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {NICHES.map(n => <SelectItem key={n} value={n}>{n}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Followers</Label>
            <Input type="number" value={form.followers} onChange={e => set('followers', e.target.value)} />
          </div>
          <div>
            <Label>Avg Views / Reach</Label>
            <Input type="number" value={form.avgViews} onChange={e => set('avgViews', e.target.value)} />
          </div>
          <div>
            <Label>Engagement Rate (%)</Label>
            <Input type="number" step="0.1" value={form.engagementRate} onChange={e => set('engagementRate', e.target.value)} />
          </div>
          <div>
            <Label>Country</Label>
            <Select value={form.country} onValueChange={v => set('country', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {COUNTRIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Language</Label>
            <Select value={form.language} onValueChange={v => set('language', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {LANGUAGES.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Status</Label>
            <Select value={form.status} onValueChange={v => set('status', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-2">
            <Label>Email</Label>
            <Input type="email" value={form.contactEmail} onChange={e => set('contactEmail', e.target.value)} />
          </div>
          <div className="col-span-2">
            <Label>Profile Photo URL</Label>
            <Input value={form.profilePhoto} onChange={e => set('profilePhoto', e.target.value)} />
          </div>
          <div className="col-span-2">
            <Label>Platform URL</Label>
            <Input value={form.platformUrl} onChange={e => set('platformUrl', e.target.value)} />
          </div>
          <div className="col-span-2">
            <Label>Bio</Label>
            <Textarea value={form.bio} onChange={e => set('bio', e.target.value)} rows={2} />
          </div>
          <div className="col-span-2">
            <Label>Notes</Label>
            <Textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={2} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={!form.name}>{initial ? 'Save' : 'Add'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
