import { useState } from 'react';
import Layout from '@/components/Layout';
import { useInfluencers, useCampaigns, formatNumber, downloadCSV } from '@/hooks/useInfluencers';
import { CampaignInfluencer, CampaignStatus } from '@/types/influencer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { CampaignOverview } from '@/components/campaign/CampaignOverview';
import { MediaPlanTable } from '@/components/campaign/MediaPlanTable';
import { CampaignBriefEditor } from '@/components/campaign/CampaignBriefEditor';
import { CampaignTimeline } from '@/components/campaign/CampaignTimeline';
import { CampaignGoalsSection } from '@/components/campaign/CampaignGoals';
import { Megaphone, Plus, Copy, Trash2, Download, Pencil } from 'lucide-react';

export default function CampaignBuilder() {
  const { campaignReady, allInfluencers } = useInfluencers();
  const { campaigns, createCampaign, updateCampaign, deleteCampaign, duplicateCampaign } = useCampaigns();
  const [activeCampaignId, setActiveCampaignId] = useState<string | null>(campaigns[0]?.id || null);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [renameId, setRenameId] = useState<string | null>(null);
  const [renameName, setRenameName] = useState('');

  const activeCampaign = campaigns.find(c => c.id === activeCampaignId) || null;
  const getInfluencer = (id: string) => allInfluencers.find(i => i.id === id);

  const handleCreate = () => {
    if (!newName.trim()) return;
    const ids = campaignReady.map(i => i.id);
    const campaign = createCampaign(newName.trim(), ids, allInfluencers);
    setActiveCampaignId(campaign.id);
    setNewName('');
    setShowCreate(false);
  };

  const handleRename = () => {
    if (!renameId || !renameName.trim()) return;
    updateCampaign(renameId, { name: renameName.trim() });
    setRenameId(null);
    setRenameName('');
  };

  const handleUpdateInfluencer = (influencerId: string, data: Partial<CampaignInfluencer>) => {
    if (!activeCampaign) return;
    updateCampaign(activeCampaign.id, {
      influencers: activeCampaign.influencers.map(ci =>
        ci.influencerId === influencerId ? { ...ci, ...data } : ci
      ),
    });
  };

  const exportCampaignCSV = () => {
    if (!activeCampaign) return;
    const headers = ['Influencer', 'Platform', 'Followers', 'Deliverable', 'Qty', 'Cost/Unit (₹)', 'Total (₹)', 'Status', 'Post Date'];
    const rows: string[][] = [];
    activeCampaign.influencers.forEach(ci => {
      const inf = getInfluencer(ci.influencerId);
      if (!inf) return;
      ci.deliverables.forEach(d => {
        rows.push([inf.name, inf.platform, String(inf.followers), d.type, String(d.quantity), String(d.costPerUnit), String(d.costPerUnit * d.quantity), ci.status, ci.postDate || '']);
      });
    });
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    downloadCSV(csv, `${activeCampaign.name}.csv`);
  };

  return (
    <Layout>
      <div className="p-6 space-y-5 overflow-auto h-full">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <Megaphone className="h-6 w-6 text-primary" />
              Campaign Planner
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">Plan campaigns with deliverables, timelines, and live budget tracking</p>
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
                <Badge variant={activeCampaignId === c.id ? 'default' : 'outline'} className="cursor-pointer select-none px-3 py-1.5" onClick={() => setActiveCampaignId(c.id)}>
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

        {activeCampaign && activeCampaign.influencers.length > 0 ? (
          <div className="space-y-5">
            <CampaignOverview
              campaign={activeCampaign}
              getInfluencer={getInfluencer}
              onStatusChange={status => updateCampaign(activeCampaign.id, { status })}
            />

            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={exportCampaignCSV}>
                <Download className="h-4 w-4 mr-1.5" /> Export CSV
              </Button>
            </div>

            <MediaPlanTable
              campaign={activeCampaign}
              getInfluencer={getInfluencer}
              onUpdateInfluencer={handleUpdateInfluencer}
            />

            <div className="grid lg:grid-cols-2 gap-5">
              <CampaignBriefEditor
                brief={activeCampaign.brief}
                onChange={brief => updateCampaign(activeCampaign.id, { brief })}
              />
              <CampaignTimeline
                campaign={activeCampaign}
                getInfluencer={getInfluencer}
              />
            </div>
          </div>
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

function EmptyState({ text, sub }: { text: string; sub: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
      <Megaphone className="h-12 w-12 mb-3 opacity-30" />
      <p className="text-lg font-medium">{text}</p>
      <p className="text-sm">{sub}</p>
    </div>
  );
}
