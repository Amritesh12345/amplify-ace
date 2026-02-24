import { useState } from 'react';
import { NICHES, COUNTRIES, LANGUAGES, Niche } from '@/types/influencer';
import { useSubmissions } from '@/hooks/useInfluencers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Send } from 'lucide-react';

export default function InfluencerSignup() {
  const { addSubmission } = useSubmissions();
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    name: '',
    youtubeUrl: '',
    instagramUrl: '',
    niche: 'Tech' as Niche,
    followers: '',
    avgViews: '',
    country: 'India',
    language: 'Hindi',
    email: '',
    collaborationPreferences: '',
    costRange: '',
    bio: '',
  });

  const set = (key: string, val: string) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      toast({ title: 'Error', description: 'Name and email are required', variant: 'destructive' });
      return;
    }
    addSubmission({
      ...form,
      followers: parseInt(form.followers) || 0,
      avgViews: parseInt(form.avgViews) || 0,
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="max-w-md w-full text-center">
          <CardContent className="p-8 space-y-4">
            <Sparkles className="h-12 w-12 mx-auto text-primary" />
            <h2 className="text-xl font-bold">Profile Submitted!</h2>
            <p className="text-sm text-muted-foreground">
              Thanks for your interest! Our team will review your profile and get back to you soon.
            </p>
            <Button variant="outline" onClick={() => { setSubmitted(false); setForm({ name: '', youtubeUrl: '', instagramUrl: '', niche: 'Tech', followers: '', avgViews: '', country: 'India', language: 'Hindi', email: '', collaborationPreferences: '', costRange: '', bio: '' }); }}>
              Submit Another
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="max-w-lg w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            Join as a Creator
          </CardTitle>
          <CardDescription>
            Submit your profile to be listed on our influencer platform. Our team will review and approve your application.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Name *</Label>
              <Input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Your full name" required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>YouTube URL</Label>
                <Input value={form.youtubeUrl} onChange={e => set('youtubeUrl', e.target.value)} placeholder="https://youtube.com/@..." />
              </div>
              <div>
                <Label>Instagram URL</Label>
                <Input value={form.instagramUrl} onChange={e => set('instagramUrl', e.target.value)} placeholder="https://instagram.com/..." />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Niche</Label>
                <Select value={form.niche} onValueChange={v => set('niche', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{NICHES.map(n => <SelectItem key={n} value={n}>{n}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Followers / Subscribers</Label>
                <Input type="number" value={form.followers} onChange={e => set('followers', e.target.value)} placeholder="e.g. 50000" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Avg Views / Reach</Label>
                <Input type="number" value={form.avgViews} onChange={e => set('avgViews', e.target.value)} placeholder="e.g. 10000" />
              </div>
              <div>
                <Label>Country</Label>
                <Select value={form.country} onValueChange={v => set('country', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{COUNTRIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Language</Label>
                <Select value={form.language} onValueChange={v => set('language', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{LANGUAGES.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Email *</Label>
                <Input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="you@example.com" required />
              </div>
            </div>
            <div>
              <Label>Collaboration Preferences</Label>
              <Input value={form.collaborationPreferences} onChange={e => set('collaborationPreferences', e.target.value)} placeholder="e.g. Reels, product reviews, sponsored posts" />
            </div>
            <div>
              <Label>Typical Cost Range (₹)</Label>
              <Input value={form.costRange} onChange={e => set('costRange', e.target.value)} placeholder="e.g. ₹5,000 – ₹25,000 per reel" />
            </div>
            <div>
              <Label>Bio</Label>
              <Textarea value={form.bio} onChange={e => set('bio', e.target.value)} placeholder="Tell brands about yourself..." rows={3} />
            </div>
            <Button type="submit" className="w-full">
              <Send className="h-4 w-4 mr-1.5" />
              Submit Profile
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
