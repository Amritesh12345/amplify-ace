import { useState } from 'react';
import Layout from '@/components/Layout';
import { useInfluencers, useCampaigns, formatNumber, downloadCSV } from '@/hooks/useInfluencers';
import { Influencer, CampaignInfluencer, Campaign, DELIVERABLES, Deliverable } from '@/types/influencer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Megaphone, Plus, Copy, Trash2, Download, Users, Eye, Heart, IndianRupee, Pencil } from 'lucide-react';

const DELIVERABLE_OPTIONS = ['Reel', 'Story', 'Post', 'Video', 'Shorts', 'Carousel'] as const;

interface DeliverableRow {
  type: string;
  cost: number;
  enabled: boolean;
}

interface InfluencerDeliverables {
  influencerId: string;
  deliverables: DeliverableRow[];
  notes: string;
}

export default function CampaignBuilder() {
  const { campaignReady, allInfluencers } = useInfluencers();
  const { campaigns, createCampaign, updateCampaign, deleteCampaign, duplicateCampaign } = useCampaigns();
  const [activeCampaignId, setActiveCampaignId] = useState<string | null>(campaigns[0]?.id || null);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [renameId, setRenameId] = useState<string | null>(null);
  const [renameName, setRenameName] = useState('');

  // Local deliverables state (per influencer, multiple deliverables)
  const [localDeliverables, setLocalDeliverables] = useState<Record<string, InfluencerDeliverables>>({});

  const activeCampaign = campaigns.find(c => c.id === activeCampaignId) || null;

  const getInfluencer = (id: string) => allInfluencers.find(i => i.id === id);

  const getDeliverables = (influencerId: string, inf: Influencer): DeliverableRow[] => {
    if (localDeliverables[influencerId]) return localDeliverables[influencerId].deliverables;
    const estReel = Math.round(inf.avgViews * 0.15);
    const estStory = Math.round(inf.avgViews * 0.05);
    const estYT = Math.round(inf.avgViews * 0.30);
    return [
      { type: 'Reel', cost: estReel, enabled: true },
      { type: 'Story', cost: estStory, enabled: false },
      { type: 'Video', cost: estYT, enabled: inf.platform === 'YouTube' },
    ];
  };

  const updateDeliverable = (influencerId: string, inf: Influencer, idx: number, data: Partial<DeliverableRow>) => {
    const current = getDeliverables(influencerId, inf);
    const updated = current.map((d, i) => i === idx ? { ...d, ...data } : d);
    setLocalDeliverables(prev => ({
      ...prev,
      [influencerId]: { influencerId, deliverables: updated, notes: prev[influencerId]?.notes || '' },
    }));
  };

  const handleCreate = () => {
    if (!newName.trim()) return;
    const ids = campaignReady.map(i => i.id);
    const campaign = createCampaign(newName.trim(), ids, allInfluencers);
    setActiveCampaignId(campaign.id);
    setNewName('');
    setShowCreate(false);
    setLocalDeliverables({});
  };

  // Summary calculations
  const summary = activeCampaign ? (() => {
    let totalCost = 0;
    let totalFollowers = 0;
    let totalImpressions = 0;
    let totalEngagement = 0;

    activeCampaign.influencers.forEach(ci => {
      const inf = getInfluencer(ci.influencerId);
      if (!inf) return;
      totalFollowers += inf.followers;
      const dels = getDeliverables(ci.influencerId, inf);
      dels.forEach(d => {
        if (d.enabled) {
          totalCost += d.cost;
          totalImpressions += inf.avgViews;
          totalEngagement += Math.round(inf.avgViews * inf.engagementRate / 100);
        }
      });
    });

    return {
      count: activeCampaign.influencers.length,
      totalFollowers,
      totalImpressions,
      totalEngagement,
      totalCost,
    };
  })() : null;

  const exportCampaignCSV = () => {
    if (!activeCampaign) return;
    const headers = ['Influencer', 'Platform', 'Followers', 'Deliverable', 'Cost (₹)', 'Enabled'];
    const rows: string[][] = [];
    activeCampaign.influencers.forEach(ci => {
      const inf = getInfluencer(ci.influencerId);
      if (!inf) return;
      const dels = getDeliverables(ci.influencerId, inf);
      dels.forEach(d => {
        rows.push([inf.name, inf.platform, String(inf.followers), d.type, String(d.cost), d.enabled ? 'Yes' : 'No']);
      });
    });
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    downloadCSV(csv, `${activeCampaign.name}.csv`);
  };

  const handleRename = () => {
    if (!renameId || !renameName.trim()) return;
    updateCampaign(renameId, { name: renameName.trim() });
    setRenameId(null);
    setRenameName('');
  };

  return (
    <Layout>
      <div className="p-6 space-y-5 overflow-auto h-full">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <Megaphone className="h-6 w-6 text-primary" />
              Campaign Builder
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">Plan campaigns with deliverables and live budget tracking</p>
          </div>
          <Button size="sm" onClick={() => setShowCreate(true)}>
            <Plus className="h-4 w-4 mr-1.5" /> New Campaign
          </Button>
        </div>

        {/* Campaign tabs */}
        {campaigns.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {campaigns.map(c => (
              <div key={c.id} className="flex items-center gap-1">
                <Badge variant={activeCampaignId === c.id ? 'default' : 'outline'} className="cursor-pointer select-none px-3 py-1.5" onClick={() => { setActiveCampaignId(c.id); setLocalDeliverables({}); }}>
                  {c.name}
                </Badge>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => { setRenameId(c.id); setRenameName(c.name); }}><Pencil className="h-3 w-3" /></Button>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => duplicateCampaign(c.id)}><Copy className="h-3 w-3" /></Button>
                <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => { deleteCampaign(c.id); if (activeCampaignId === c.id) setActiveCampaignId(campaigns.find(x => x.id !== c.id)?.id || null); }}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Summary cards */}
        {summary && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <SummaryCard icon={Users} label="Influencers" value={summary.count.toString()} />
            <SummaryCard icon={Users} label="Total Reach" value={formatNumber(summary.totalFollowers)} />
            <SummaryCard icon={Eye} label="Est. Impressions" value={formatNumber(summary.totalImpressions)} />
            <SummaryCard icon={Heart} label="Est. Engagements" value={formatNumber(summary.totalEngagement)} />
            <SummaryCard icon={IndianRupee} label="Total Cost" value={`₹${formatNumber(summary.totalCost)}`} />
          </div>
        )}

        {/* Campaign table with deliverables */}
        {activeCampaign && activeCampaign.influencers.length > 0 ? (
          <>
            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={exportCampaignCSV}>
                <Download className="h-4 w-4 mr-1.5" /> Export CSV
              </Button>
            </div>
            <div className="space-y-4">
              {activeCampaign.influencers.map(ci => {
                const inf = getInfluencer(ci.influencerId);
                if (!inf) return null;
                const dels = getDeliverables(ci.influencerId, inf);
                const totalForInf = dels.filter(d => d.enabled).reduce((s, d) => s + d.cost, 0);

                return (
                  <Card key={ci.influencerId}>
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 ring-2 ring-border">
                            <AvatarImage src={inf.profilePhoto} alt={inf.name} />
                            <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">{inf.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{inf.name}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <Badge variant="outline" className="text-xs">{inf.platform}</Badge>
                              <span className="text-xs text-muted-foreground">{formatNumber(inf.followers)} followers</span>
                            </div>
                          </div>
                        </div>
                        <p className="font-semibold text-sm">₹{formatNumber(totalForInf)}</p>
                      </div>

                      <div className="border border-border rounded-md overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-muted/30">
                              <TableHead className="w-10"></TableHead>
                              <TableHead>Deliverable</TableHead>
                              <TableHead>Cost (₹)</TableHead>
                              <TableHead className="text-right">Est. Views</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {dels.map((d, idx) => (
                              <TableRow key={idx} className={!d.enabled ? 'opacity-40' : ''}>
                                <TableCell>
                                  <Checkbox checked={d.enabled} onCheckedChange={v => updateDeliverable(ci.influencerId, inf, idx, { enabled: !!v })} />
                                </TableCell>
                                <TableCell className="text-sm font-medium">{d.type}</TableCell>
                                <TableCell>
                                  <Input type="number" className="h-8 w-28" value={d.cost || ''} onChange={e => updateDeliverable(ci.influencerId, inf, idx, { cost: parseInt(e.target.value) || 0 })} />
                                </TableCell>
                                <TableCell className="text-right text-sm text-muted-foreground">{formatNumber(inf.avgViews)}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </>
        ) : activeCampaign ? (
          <EmptyState text="No influencers in this campaign" sub='Mark influencers as "Planned" or "Confirmed" to include them' />
        ) : (
          <EmptyState text="No campaigns yet" sub="Create a campaign to start planning" />
        )}

        {/* Create dialog */}
        <Dialog open={showCreate} onOpenChange={setShowCreate}>
          <DialogContent className="max-w-sm">
            <DialogHeader><DialogTitle>New Campaign</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <Input placeholder="Campaign name" value={newName} onChange={e => setNewName(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleCreate()} />
              <p className="text-xs text-muted-foreground">{campaignReady.length} influencers with "Planned" or "Confirmed" status will be included.</p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
              <Button onClick={handleCreate} disabled={!newName.trim()}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Rename dialog */}
        <Dialog open={!!renameId} onOpenChange={() => setRenameId(null)}>
          <DialogContent className="max-w-sm">
            <DialogHeader><DialogTitle>Rename Campaign</DialogTitle></DialogHeader>
            <Input value={renameName} onChange={e => setRenameName(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleRename()} />
            <DialogFooter>
              <Button variant="outline" onClick={() => setRenameId(null)}>Cancel</Button>
              <Button onClick={handleRename} disabled={!renameName.trim()}>Rename</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}

function SummaryCard({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <Card>
      <CardContent className="p-4 flex items-center gap-3">
        <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="h-4 w-4 text-primary" />
        </div>
        <div>
          <p className="text-[11px] text-muted-foreground">{label}</p>
          <p className="font-semibold text-lg leading-tight">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState({ text, sub }: { text: string; sub: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
      <Megaphone className="h-12 w-12 mb-3 opacity-30" />
      <p className="text-lg font-medium">{text}</p>
      <p className="text-sm">{sub}</p>
    </div>
  );
}
