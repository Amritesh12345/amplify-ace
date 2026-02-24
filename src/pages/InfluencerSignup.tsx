import { useState } from 'react';
import { NICHES, COUNTRIES, LANGUAGES, COLLABORATION_FORMATS, PRICE_RANGES, PRIMARY_PLATFORMS, CREATOR_COUNT_OPTIONS, Niche, PrimaryPlatform, CollaborationFormat, PriceRange, SubmissionType } from '@/types/influencer';
import { useSubmissions } from '@/hooks/useInfluencers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Send, User, Building2, X } from 'lucide-react';

export default function InfluencerSignup() {
  const { addCreatorSubmission, addAgencySubmission } = useSubmissions();
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [type, setType] = useState<SubmissionType>('creator');

  // Creator form
  const [creator, setCreator] = useState({
    name: '',
    primaryPlatform: 'YouTube' as PrimaryPlatform,
    youtubeUrl: '',
    instagramUrl: '',
    niches: [] as Niche[],
    followers: '',
    avgViews: '',
    engagementRate: '',
    country: 'India',
    audienceCountry: 'India',
    language: 'Hindi',
    email: '',
    phone: '',
    collaborationFormats: [] as CollaborationFormat[],
    priceRange: '₹5,000 – ₹15,000' as PriceRange,
    bio: '',
    consentContact: false,
  });

  // Agency form
  const [agency, setAgency] = useState({
    agencyName: '',
    website: '',
    country: 'India',
    primaryMarkets: '',
    nichesCovered: [] as Niche[],
    creatorCount: '1–10',
    platformsCovered: 'Both' as PrimaryPlatform,
    contactPerson: '',
    contactEmail: '',
    phone: '',
    notableBrands: '',
    rosterLink: '',
    notes: '',
    consentContact: false,
  });

  const setC = (key: string, val: any) => setCreator(f => ({ ...f, [key]: val }));
  const setA = (key: string, val: any) => setAgency(f => ({ ...f, [key]: val }));

  const toggleNiche = (niche: Niche, target: 'creator' | 'agency') => {
    if (target === 'creator') {
      setCreator(f => ({
        ...f,
        niches: f.niches.includes(niche) ? f.niches.filter(n => n !== niche) : [...f.niches, niche],
      }));
    } else {
      setAgency(f => ({
        ...f,
        nichesCovered: f.nichesCovered.includes(niche) ? f.nichesCovered.filter(n => n !== niche) : [...f.nichesCovered, niche],
      }));
    }
  };

  const toggleFormat = (fmt: CollaborationFormat) => {
    setCreator(f => ({
      ...f,
      collaborationFormats: f.collaborationFormats.includes(fmt) ? f.collaborationFormats.filter(c => c !== fmt) : [...f.collaborationFormats, fmt],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (type === 'creator') {
      if (!creator.name.trim() || !creator.email.trim()) {
        toast({ title: 'Error', description: 'Name and email are required', variant: 'destructive' });
        return;
      }
      addCreatorSubmission({
        ...creator,
        followers: parseInt(creator.followers) || 0,
        avgViews: parseInt(creator.avgViews) || 0,
        engagementRate: parseFloat(creator.engagementRate) || 0,
      });
    } else {
      if (!agency.agencyName.trim() || !agency.contactEmail.trim()) {
        toast({ title: 'Error', description: 'Agency name and contact email are required', variant: 'destructive' });
        return;
      }
      addAgencySubmission(agency);
    }
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
              Your profile has been submitted for review. Our team will verify and activate it in the Amplify Ace creator database.
            </p>
            <Button variant="outline" onClick={() => { setSubmitted(false); }}>
              Submit Another
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            Join Amplify Ace
          </CardTitle>
          <CardDescription>
            Apply to be listed on our platform. Brands discover creators and agencies here for campaign collaborations.
          </CardDescription>

          {/* Type selector */}
          <div className="flex justify-center gap-3 pt-4">
            <Button
              type="button"
              variant={type === 'creator' ? 'default' : 'outline'}
              onClick={() => setType('creator')}
              className="gap-2"
            >
              <User className="h-4 w-4" /> Creator
            </Button>
            <Button
              type="button"
              variant={type === 'agency' ? 'default' : 'outline'}
              onClick={() => setType('agency')}
              className="gap-2"
            >
              <Building2 className="h-4 w-4" /> Agency
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {type === 'creator' ? (
              <>
                {/* Creator fields */}
                <div>
                  <Label>Full Name *</Label>
                  <Input value={creator.name} onChange={e => setC('name', e.target.value)} placeholder="Your full name" required />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Primary Platform</Label>
                    <Select value={creator.primaryPlatform} onValueChange={v => setC('primaryPlatform', v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{PRIMARY_PLATFORMS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Contact Email *</Label>
                    <Input type="email" value={creator.email} onChange={e => setC('email', e.target.value)} placeholder="you@example.com" required />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>YouTube URL</Label>
                    <Input value={creator.youtubeUrl} onChange={e => setC('youtubeUrl', e.target.value)} placeholder="https://youtube.com/@..." />
                  </div>
                  <div>
                    <Label>Instagram URL</Label>
                    <Input value={creator.instagramUrl} onChange={e => setC('instagramUrl', e.target.value)} placeholder="https://instagram.com/..." />
                  </div>
                </div>

                <div>
                  <Label>Niches (select all that apply)</Label>
                  <div className="flex flex-wrap gap-2 mt-1.5">
                    {NICHES.map(n => (
                      <Badge
                        key={n}
                        variant={creator.niches.includes(n) ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => toggleNiche(n, 'creator')}
                      >
                        {n}
                        {creator.niches.includes(n) && <X className="h-3 w-3 ml-1" />}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label>Followers / Subscribers</Label>
                    <Input type="number" value={creator.followers} onChange={e => setC('followers', e.target.value)} placeholder="e.g. 50000" />
                  </div>
                  <div>
                    <Label>Avg Views / Reach</Label>
                    <Input type="number" value={creator.avgViews} onChange={e => setC('avgViews', e.target.value)} placeholder="e.g. 10000" />
                  </div>
                  <div>
                    <Label>Engagement Rate %</Label>
                    <Input type="number" step="0.1" value={creator.engagementRate} onChange={e => setC('engagementRate', e.target.value)} placeholder="e.g. 4.5" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label>Country</Label>
                    <Select value={creator.country} onValueChange={v => setC('country', v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{COUNTRIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Audience Country</Label>
                    <Select value={creator.audienceCountry} onValueChange={v => setC('audienceCountry', v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{COUNTRIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Language</Label>
                    <Select value={creator.language} onValueChange={v => setC('language', v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{LANGUAGES.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>WhatsApp / Phone (optional)</Label>
                  <Input value={creator.phone} onChange={e => setC('phone', e.target.value)} placeholder="+91 98765 43210" />
                </div>

                <div>
                  <Label>Collaboration Formats</Label>
                  <div className="flex flex-wrap gap-2 mt-1.5">
                    {COLLABORATION_FORMATS.map(fmt => (
                      <Badge
                        key={fmt}
                        variant={creator.collaborationFormats.includes(fmt) ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => toggleFormat(fmt)}
                      >
                        {fmt}
                        {creator.collaborationFormats.includes(fmt) && <X className="h-3 w-3 ml-1" />}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Typical Price Range</Label>
                  <Select value={creator.priceRange} onValueChange={v => setC('priceRange', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{PRICE_RANGES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Bio / About</Label>
                  <Textarea value={creator.bio} onChange={e => setC('bio', e.target.value)} placeholder="Tell brands about yourself, your content style, and audience..." rows={3} />
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox
                    id="consent-creator"
                    checked={creator.consentContact}
                    onCheckedChange={v => setC('consentContact', !!v)}
                  />
                  <Label htmlFor="consent-creator" className="text-xs text-muted-foreground cursor-pointer">
                    I agree to be contacted by brands for collaborations
                  </Label>
                </div>
              </>
            ) : (
              <>
                {/* Agency fields */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Agency Name *</Label>
                    <Input value={agency.agencyName} onChange={e => setA('agencyName', e.target.value)} placeholder="Your agency name" required />
                  </div>
                  <div>
                    <Label>Website</Label>
                    <Input value={agency.website} onChange={e => setA('website', e.target.value)} placeholder="https://youragency.com" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Country</Label>
                    <Select value={agency.country} onValueChange={v => setA('country', v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{COUNTRIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Primary Markets Served</Label>
                    <Input value={agency.primaryMarkets} onChange={e => setA('primaryMarkets', e.target.value)} placeholder="e.g. India, Southeast Asia" />
                  </div>
                </div>

                <div>
                  <Label>Niches Covered (select all that apply)</Label>
                  <div className="flex flex-wrap gap-2 mt-1.5">
                    {NICHES.map(n => (
                      <Badge
                        key={n}
                        variant={agency.nichesCovered.includes(n) ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => toggleNiche(n, 'agency')}
                      >
                        {n}
                        {agency.nichesCovered.includes(n) && <X className="h-3 w-3 ml-1" />}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Number of Creators</Label>
                    <Select value={agency.creatorCount} onValueChange={v => setA('creatorCount', v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{CREATOR_COUNT_OPTIONS.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Platforms Covered</Label>
                    <Select value={agency.platformsCovered} onValueChange={v => setA('platformsCovered', v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{PRIMARY_PLATFORMS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Contact Person *</Label>
                    <Input value={agency.contactPerson} onChange={e => setA('contactPerson', e.target.value)} placeholder="Full name" required />
                  </div>
                  <div>
                    <Label>Contact Email *</Label>
                    <Input type="email" value={agency.contactEmail} onChange={e => setA('contactEmail', e.target.value)} placeholder="contact@agency.com" required />
                  </div>
                </div>

                <div>
                  <Label>Phone / WhatsApp</Label>
                  <Input value={agency.phone} onChange={e => setA('phone', e.target.value)} placeholder="+91 98765 43210" />
                </div>

                <div>
                  <Label>Notable Brands Worked With</Label>
                  <Input value={agency.notableBrands} onChange={e => setA('notableBrands', e.target.value)} placeholder="e.g. Mamaearth, boAt, Noise" />
                </div>

                <div>
                  <Label>Creator Roster Link</Label>
                  <Input value={agency.rosterLink} onChange={e => setA('rosterLink', e.target.value)} placeholder="Google Sheet, Notion page, or website link" />
                </div>

                <div>
                  <Label>Notes</Label>
                  <Textarea value={agency.notes} onChange={e => setA('notes', e.target.value)} placeholder="Anything else you'd like us to know..." rows={3} />
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox
                    id="consent-agency"
                    checked={agency.consentContact}
                    onCheckedChange={v => setA('consentContact', !!v)}
                  />
                  <Label htmlFor="consent-agency" className="text-xs text-muted-foreground cursor-pointer">
                    I agree to be contacted by brands for collaborations
                  </Label>
                </div>
              </>
            )}

            <p className="text-[11px] text-muted-foreground">
              By submitting, you confirm the information is accurate.
            </p>

            <Button type="submit" className="w-full">
              <Send className="h-4 w-4 mr-1.5" />
              {type === 'creator' ? 'Apply to Join Amplify Ace' : 'Apply as Agency'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
