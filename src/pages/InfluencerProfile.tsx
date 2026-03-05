import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useInfluencers, formatNumber } from '@/hooks/useInfluencers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  ArrowLeft, ArrowRight, ChevronLeft, Star, Heart, MessageCircle, Eye, Calendar,
  Users, TrendingUp, BarChart3, Globe, Languages, Youtube, Instagram, Plus, ExternalLink,
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import {
  generateFollowerGrowth, generateViewsPerPost, generateEngagementTrend,
  generateAudienceData, audienceGender, audienceAge, generateRecentPosts,
  calculateCampaignFitScore,
} from '@/data/mockAnalytics';

const NOTES_KEY = 'influencer-notes';

function loadNotes(): Record<string, string[]> {
  try { const s = localStorage.getItem(NOTES_KEY); return s ? JSON.parse(s) : {}; } catch { return {}; }
}
function saveNotes(n: Record<string, string[]>) { localStorage.setItem(NOTES_KEY, JSON.stringify(n)); }

export default function InfluencerProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { allInfluencers, updateInfluencer } = useInfluencers();

  const currentIndex = allInfluencers.findIndex(i => i.id === id);
  const influencer = currentIndex >= 0 ? allInfluencers[currentIndex] : null;

  const [allNotes, setAllNotes] = useState(loadNotes);
  const [newNote, setNewNote] = useState('');
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [editPrices, setEditPrices] = useState<Record<string, number>>({});

  const notes = id ? allNotes[id] || [] : [];

  const inf = influencer;
  const fitScore = inf ? calculateCampaignFitScore(inf) : 0;
  const followerGrowth = useMemo(() => inf ? generateFollowerGrowth(inf.followers) : [], [inf?.followers]);
  const viewsPerPost = useMemo(() => inf ? generateViewsPerPost(inf.avgViews) : [], [inf?.avgViews]);
  const engagementTrend = useMemo(() => inf ? generateEngagementTrend(inf.engagementRate) : [], [inf?.engagementRate]);
  const audienceCountries = useMemo(() => inf ? generateAudienceData(inf.country) : [], [inf?.country]);
  const recentPosts = useMemo(() => inf ? generateRecentPosts(inf.recentContent, inf.avgViews) : [], [inf?.recentContent, inf?.avgViews]);

  if (!inf) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center space-y-3">
            <p className="text-lg font-medium text-muted-foreground">Influencer not found</p>
            <Button variant="outline" onClick={() => navigate('/')}>
              <ChevronLeft className="h-4 w-4 mr-1" /> Back to Discovery
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const reelPrice = editPrices.reel ?? Math.round(inf.avgViews * 0.15);
  const storyPrice = editPrices.story ?? Math.round(inf.avgViews * 0.06);
  const ytPrice = editPrices.yt ?? Math.round(inf.avgViews * 0.30);

  const addNote = () => {
    if (!newNote.trim() || !id) return;
    const updated = { ...allNotes, [id]: [newNote.trim(), ...notes] };
    setAllNotes(updated);
    saveNotes(updated);
    setNewNote('');
  };

  const fitLabels = [];
  if (inf.engagementRate >= 5) fitLabels.push('High Engagement');
  if (inf.recentContent.length >= 3) fitLabels.push('Consistent Posting');
  if (inf.engagementRate >= 3 && inf.avgViews >= 50000) fitLabels.push('Brand Friendly Content');

  const engLabel = inf.engagementRate >= 7 ? 'High' : inf.engagementRate >= 4 ? 'Medium' : 'Low';
  const engColor = inf.engagementRate >= 7 ? 'bg-success/15 text-success' : inf.engagementRate >= 4 ? 'bg-info/15 text-info' : 'bg-warning/15 text-warning';

  return (
    <Layout>
      <div className="overflow-auto h-full">
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
              <ChevronLeft className="h-4 w-4 mr-1" /> Back to Discovery
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={currentIndex <= 0}
                onClick={() => navigate(`/influencer/${allInfluencers[currentIndex - 1]?.id}`)}>
                <ArrowLeft className="h-4 w-4 mr-1" /> Previous
              </Button>
              <Button variant="outline" size="sm" disabled={currentIndex >= allInfluencers.length - 1}
                onClick={() => navigate(`/influencer/${allInfluencers[currentIndex + 1]?.id}`)}>
                Next <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>

          {/* Header Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <Avatar className="h-24 w-24 ring-4 ring-border shrink-0">
                  <AvatarImage src={inf.profilePhoto} alt={inf.name} />
                  <AvatarFallback className="text-2xl bg-primary/10 text-primary font-bold">
                    {inf.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between flex-wrap gap-3">
                    <div>
                      <h1 className="text-2xl font-bold">{inf.name}</h1>
                      <p className="text-sm text-muted-foreground mt-1">{inf.bio}</p>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <Badge className={inf.platform === 'YouTube' ? 'bg-destructive/15 text-destructive border-0' : 'bg-accent/15 text-accent border-0'}>
                          {inf.platform === 'YouTube' ? <Youtube className="h-3 w-3 mr-1" /> : <Instagram className="h-3 w-3 mr-1" />}
                          {inf.platform}
                        </Badge>
                        <Badge variant="outline">{inf.niche}</Badge>
                        <Badge variant="outline"><Globe className="h-3 w-3 mr-1" />{inf.country}</Badge>
                        <Badge variant="outline"><Languages className="h-3 w-3 mr-1" />{inf.language}</Badge>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${engColor}`}>
                          {engLabel} Engagement
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => updateInfluencer(inf.id, { status: 'Shortlisted' })}>
                        <Star className="h-4 w-4 mr-1" /> Add to Shortlist
                      </Button>
                      <Button size="sm" onClick={() => { updateInfluencer(inf.id, { status: 'Planned' }); navigate('/campaign'); }}>
                        <Plus className="h-4 w-4 mr-1" /> Add to Campaign
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stat Cards */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-6">
                <MiniStat icon={Users} label="Followers" value={formatNumber(inf.followers)} />
                <MiniStat icon={Eye} label="Avg Views" value={formatNumber(inf.avgViews)} />
                <MiniStat icon={TrendingUp} label="Engagement" value={`${inf.engagementRate}%`} />
                <MiniStat icon={BarChart3} label="Est. Reach" value={formatNumber(Math.round(inf.avgViews * 1.3))} />
                <MiniStat icon={Star} label="Est. Price/Post" value={`₹${formatNumber(Math.round(inf.avgViews * 0.15))}`} />
              </div>
            </CardContent>
          </Card>

          {/* Audience Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Top Audience Countries</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {audienceCountries.map(c => (
                  <div key={c.name} className="flex items-center justify-between text-sm">
                    <span>{c.name}</span>
                    <div className="flex items-center gap-2 w-1/2">
                      <Progress value={c.pct} className="h-2 flex-1" />
                      <span className="text-xs text-muted-foreground w-8 text-right">{c.pct}%</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Gender Distribution</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={audienceGender} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={65} label={({ name, value }) => `${name} ${value}%`}>
                      {audienceGender.map((e, i) => <Cell key={i} fill={e.fill} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Age Groups</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={audienceAge}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="group" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="pct" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Performance Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Follower Growth</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={followerGrowth}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => formatNumber(v)} />
                    <Tooltip formatter={(v: number) => formatNumber(v)} />
                    <Line type="monotone" dataKey="followers" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Views Per Post (Last 10)</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={viewsPerPost}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="post" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => formatNumber(v)} />
                    <Tooltip formatter={(v: number) => formatNumber(v)} />
                    <Bar dataKey="views" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Engagement Trend</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={engagementTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} domain={[0, 'auto']} />
                    <Tooltip formatter={(v: number) => `${v}%`} />
                    <Line type="monotone" dataKey="rate" stroke="hsl(var(--chart-3))" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Recent Content */}
          <Card>
            <CardHeader><CardTitle className="text-sm font-semibold">Recent Content</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {recentPosts.map(post => (
                  <div key={post.id} className="cursor-pointer group" onClick={() => setSelectedPost(post)}>
                    <div className="relative rounded-lg overflow-hidden aspect-video bg-muted">
                      <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </div>
                    <p className="text-xs font-medium mt-1.5 truncate">{post.title}</p>
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-0.5">
                      <span className="flex items-center gap-0.5"><Eye className="h-2.5 w-2.5" />{formatNumber(post.views)}</span>
                      <span className="flex items-center gap-0.5"><Heart className="h-2.5 w-2.5" />{formatNumber(post.likes)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Campaign Fit + Pricing + Notes */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Campaign Fit Score */}
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Campaign Fit Score</CardTitle></CardHeader>
              <CardContent className="flex flex-col items-center space-y-4">
                <div className="relative h-28 w-28">
                  <svg className="h-28 w-28 -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
                    <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--chart-1))" strokeWidth="8"
                      strokeDasharray={`${fitScore * 2.64} 264`} strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold">{fitScore}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 justify-center">
                  {fitLabels.map(l => (
                    <Badge key={l} variant="outline" className="text-[10px]">{l}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Collaboration Pricing</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <PriceRow label="Instagram Reel" value={reelPrice} onChange={v => setEditPrices(p => ({ ...p, reel: v }))} />
                <PriceRow label="Instagram Story" value={storyPrice} onChange={v => setEditPrices(p => ({ ...p, story: v }))} />
                <PriceRow label="YouTube Integration" value={ytPrice} onChange={v => setEditPrices(p => ({ ...p, yt: v }))} />
                <Button size="sm" className="w-full mt-2" onClick={() => { updateInfluencer(inf.id, { status: 'Planned' }); navigate('/campaign'); }}>
                  <Plus className="h-3.5 w-3.5 mr-1" /> Add deliverable to campaign
                </Button>
              </CardContent>
            </Card>

            {/* Notes / CRM */}
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Team Notes</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-2">
                  <Textarea value={newNote} onChange={e => setNewNote(e.target.value)} placeholder="Add a note..." className="min-h-[60px] text-sm" />
                </div>
                <Button size="sm" onClick={addNote} disabled={!newNote.trim()} className="w-full">Add Note</Button>
                {notes.length > 0 && (
                  <div className="space-y-2 max-h-40 overflow-auto">
                    {notes.map((n, i) => (
                      <div key={i} className="text-sm bg-muted/50 rounded-md px-3 py-2">{n}</div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Post Detail Modal */}
      <Dialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{selectedPost?.title}</DialogTitle></DialogHeader>
          {selectedPost && (
            <div className="space-y-3">
              <img src={selectedPost.thumbnail} alt={selectedPost.title} className="w-full rounded-lg" />
              <div className="grid grid-cols-3 gap-3 text-center">
                <div><p className="text-lg font-semibold">{formatNumber(selectedPost.views)}</p><p className="text-xs text-muted-foreground">Views</p></div>
                <div><p className="text-lg font-semibold">{formatNumber(selectedPost.likes)}</p><p className="text-xs text-muted-foreground">Likes</p></div>
                <div><p className="text-lg font-semibold">{formatNumber(selectedPost.comments)}</p><p className="text-xs text-muted-foreground">Comments</p></div>
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" /> Published {new Date(selectedPost.publishDate).toLocaleDateString()}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
}

function MiniStat({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="bg-muted/40 rounded-lg p-3 text-center">
      <Icon className="h-4 w-4 mx-auto text-primary mb-1" />
      <p className="text-lg font-bold">{value}</p>
      <p className="text-[10px] text-muted-foreground">{label}</p>
    </div>
  );
}

function PriceRow({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-sm">{label}</span>
      <div className="flex items-center gap-1">
        <span className="text-xs text-muted-foreground">₹</span>
        <Input type="number" value={value} onChange={e => onChange(Number(e.target.value))}
          className="w-24 h-8 text-sm text-right" />
      </div>
    </div>
  );
}
