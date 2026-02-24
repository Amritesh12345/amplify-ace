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
import { Megaphone, Plus, Copy, Trash2, Download, Users, Eye, Heart, IndianRupee, Pencil } from 'lucide-react';

export default function CampaignBuilder() {
  const { campaignReady, allInfluencers } = useInfluencers();
  const { campaigns, createCampaign, updateCampaign, deleteCampaign, duplicateCampaign } = useCampaigns();
  const [activeCampaignId, setActiveCampaignId] = useState<string | null>(campaigns[0]?.id || null);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [renameId, setRenameId] = useState<string | null>(null);
  const [renameName, setRenameName] = useState('');

  const activeCampaign = campaigns.find(c => c.id === activeCampaignId) || null;

  const handleCreate = () => {
    if (!newName.trim()) return;
    const ids = campaignReady.map(i => i.id);
    const campaign = createCampaign(newName.trim(), ids, allInfluencers);
    setActiveCampaignId(campaign.id);
    setNewName('');
    setShowCreate(false);
  };

  const updateRow = (campaignId: string, influencerId: string, data: Partial<CampaignInfluencer>) => {
    const campaign = campaigns.find(c => c.id === campaignId);
    if (!campaign) return;
    const updatedInfs = campaign.influencers.map(ci =>
      ci.influencerId === influencerId ? { ...ci, ...data } : ci
    );
    updateCampaign(campaignId, { influencers: updatedInfs });
  };

  const getInfluencer = (id: string) => allInfluencers.find(i => i.id === id);

  const summary = activeCampaign ? {
    count: activeCampaign.influencers.length,
    totalFollowers: activeCampaign.influencers.reduce((sum, ci) => {
      const inf = getInfluencer(ci.influencerId);
      return sum + (inf?.followers || 0);
    }, 0),
    totalImpressions: activeCampaign.influencers.reduce((sum, ci) => sum + ci.expectedViews, 0),
    totalEngagement: activeCampaign.influencers.reduce((sum, ci) => sum + ci.expectedEngagement, 0),
    totalCost: activeCampaign.influencers.reduce((sum, ci) => sum + ci.proposedCost, 0),
  } : null;

  const exportCampaignCSV = () => {
    if (!activeCampaign) return;
    const headers = ['Influencer', 'Platform', 'Followers', 'Deliverable', 'Cost (₹)', 'Expected Views', 'Expected Engagement', 'Notes'];
    const rows = activeCampaign.influencers.map(ci => {
      const inf = getInfluencer(ci.influencerId);
      return [
        inf?.name || 'Unknown', inf?.platform || '', inf?.followers || 0,
        ci.deliverable, ci.proposedCost, ci.expectedViews, ci.expectedEngagement,
        `"${ci.notes.replace(/"/g, '""')}"`,
      ];
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
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <Megaphone className="h-6 w-6 text-primary" />
              Campaign Builder
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Plan campaigns with your shortlisted influencers
            </p>
          </div>
          <Button size="sm" onClick={() => setShowCreate(true)}>
            <Plus className="h-4 w-4 mr-1.5" />
            New Campaign
          </Button>
        </div>

        {/* Campaign tabs */}
        {campaigns.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {campaigns.map(c => (
              <div key={c.id} className="flex items-center gap-1">
                <Badge
                  variant={activeCampaignId === c.id ? 'default' : 'outline'}
                  className="cursor-pointer select-none px-3 py-1.5"
                  onClick={() => setActiveCampaignId(c.id)}
                >
                  {c.name}
                </Badge>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => { setRenameId(c.id); setRenameName(c.name); }}>
                  <Pencil className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => duplicateCampaign(c.id)}>
                  <Copy className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => {
                  deleteCampaign(c.id);
                  if (activeCampaignId === c.id) setActiveCampaignId(campaigns.find(x => x.id !== c.id)?.id || null);
                }}>
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

        {/* Campaign table */}
        {activeCampaign && activeCampaign.influencers.length > 0 ? (
          <>
            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={exportCampaignCSV}>
                <Download className="h-4 w-4 mr-1.5" />
                Export CSV
              </Button>
            </div>
            <div className="border border-border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-[220px]">Influencer</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead>Followers</TableHead>
                    <TableHead>Deliverable</TableHead>
                    <TableHead>Cost (₹)</TableHead>
                    <TableHead>Expected Views</TableHead>
                    <TableHead>Expected Engagement</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeCampaign.influencers.map(ci => {
                    const inf = getInfluencer(ci.influencerId);
                    if (!inf) return null;
                    return (
                      <TableRow key={ci.influencerId}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={inf.profilePhoto} alt={inf.name} />
                              <AvatarFallback className="text-xs">{inf.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{inf.name}</p>
                              <p className="text-xs text-muted-foreground">{inf.niche}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell><Badge variant="outline" className="text-xs">{inf.platform}</Badge></TableCell>
                        <TableCell className="text-sm">{formatNumber(inf.followers)}</TableCell>
                        <TableCell>
                          <Select value={ci.deliverable} onValueChange={(v: Deliverable) => updateRow(activeCampaign.id, ci.influencerId, { deliverable: v })}>
                            <SelectTrigger className="h-8 w-28"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {DELIVERABLES.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            className="h-8 w-28"
                            value={ci.proposedCost || ''}
                            onChange={e => updateRow(activeCampaign.id, ci.influencerId, { proposedCost: parseInt(e.target.value) || 0 })}
                            placeholder="0"
                          />
                        </TableCell>
                        <TableCell className="text-sm">{formatNumber(ci.expectedViews)}</TableCell>
                        <TableCell className="text-sm">{formatNumber(ci.expectedEngagement)}</TableCell>
                        <TableCell>
                          <Input
                            className="h-8 w-36"
                            value={ci.notes}
                            onChange={e => updateRow(activeCampaign.id, ci.influencerId, { notes: e.target.value })}
                            placeholder="Add note..."
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </>
        ) : activeCampaign ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Megaphone className="h-12 w-12 mb-3 opacity-30" />
            <p className="text-lg font-medium">No influencers in this campaign</p>
            <p className="text-sm">Mark influencers as "Planned" or "Confirmed" to include them</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Megaphone className="h-12 w-12 mb-3 opacity-30" />
            <p className="text-lg font-medium">No campaigns yet</p>
            <p className="text-sm">Create a campaign to start planning</p>
          </div>
        )}

        {/* Create campaign dialog */}
        <Dialog open={showCreate} onOpenChange={setShowCreate}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>New Campaign</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <Input
                placeholder="Campaign name"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleCreate()}
              />
              <p className="text-xs text-muted-foreground">
                {campaignReady.length} influencers with "Planned" or "Confirmed" status will be included.
              </p>
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
            <DialogHeader>
              <DialogTitle>Rename Campaign</DialogTitle>
            </DialogHeader>
            <Input
              value={renameName}
              onChange={e => setRenameName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleRename()}
            />
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
