import { useState, useMemo } from 'react';
import Layout from '@/components/Layout';
import InfluencerFilters from '@/components/InfluencerFilters';
import InfluencerTable from '@/components/InfluencerTable';
import InfluencerDetail from '@/components/InfluencerDetail';
import AddInfluencerDialog from '@/components/AddInfluencerDialog';
import ImportCSVDialog from '@/components/ImportCSVDialog';
import WelcomeModal from '@/components/WelcomeModal';
import { useInfluencers, formatNumber } from '@/hooks/useInfluencers';
import { Influencer } from '@/types/influencer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Upload, Users, TrendingUp, BarChart3, Youtube, Instagram } from 'lucide-react';

type SortOption = 'engagement' | 'followers' | 'avgViews' | 'recent';

const Index = () => {
  const { influencers, filters, setFilters, addInfluencer, updateInfluencer, deleteInfluencer, importInfluencers, allInfluencers } = useInfluencers();
  const [selected, setSelected] = useState<Influencer | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [sort, setSort] = useState<SortOption>('followers');

  const currentSelected = selected ? allInfluencers.find(i => i.id === selected.id) || null : null;

  const sorted = useMemo(() => {
    const list = [...influencers];
    switch (sort) {
      case 'engagement': return list.sort((a, b) => b.engagementRate - a.engagementRate);
      case 'followers': return list.sort((a, b) => b.followers - a.followers);
      case 'avgViews': return list.sort((a, b) => b.avgViews - a.avgViews);
      default: return list;
    }
  }, [influencers, sort]);

  // Summary stats
  const stats = useMemo(() => {
    const total = allInfluencers.length;
    const avgEng = total > 0 ? (allInfluencers.reduce((s, i) => s + i.engagementRate, 0) / total).toFixed(1) : '0';
    const yt = allInfluencers.filter(i => i.platform === 'YouTube').length;
    const ig = allInfluencers.filter(i => i.platform === 'Instagram').length;
    return { total, avgEng, yt, ig };
  }, [allInfluencers]);

  return (
    <Layout>
      <WelcomeModal />
      <div className="flex h-full">
        <div className="flex-1 overflow-auto">
          <div className="p-6 space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Influencer Discovery</h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Find creators. Build influencer campaigns. Export campaign plans in minutes.
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowImport(true)}>
                  <Upload className="h-4 w-4 mr-1.5" />
                  Import CSV
                </Button>
                <Button size="sm" onClick={() => setShowAdd(true)}>
                  <Plus className="h-4 w-4 mr-1.5" />
                  Add Influencer
                </Button>
              </div>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard icon={Users} label="Total Influencers" value={stats.total.toString()} />
              <StatCard icon={TrendingUp} label="Avg Engagement" value={`${stats.avgEng}%`} />
              <StatCard icon={Youtube} label="YouTube" value={stats.yt.toString()} color="text-destructive" />
              <StatCard icon={Instagram} label="Instagram" value={stats.ig.toString()} color="text-accent" />
            </div>

            {/* Filters + Sort */}
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <InfluencerFilters filters={filters} onChange={setFilters} />
              </div>
              <Select value={sort} onValueChange={(v: SortOption) => setSort(v)}>
                <SelectTrigger className="w-44 h-9">
                  <BarChart3 className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="followers">Most Followers</SelectItem>
                  <SelectItem value="engagement">Highest Engagement</SelectItem>
                  <SelectItem value="avgViews">Highest Avg Views</SelectItem>
                  <SelectItem value="recent">Recently Added</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Count */}
            <p className="text-xs text-muted-foreground">
              Showing {sorted.length} of {allInfluencers.length} influencers
            </p>

            {/* Table */}
            <InfluencerTable
              influencers={sorted}
              onSelect={setSelected}
              selectedId={currentSelected?.id}
            />
          </div>
        </div>

        {/* Detail panel */}
        {currentSelected && (
          <InfluencerDetail
            influencer={currentSelected}
            onClose={() => setSelected(null)}
            onUpdate={updateInfluencer}
            onDelete={deleteInfluencer}
          />
        )}

        {/* Dialogs */}
        <AddInfluencerDialog open={showAdd} onClose={() => setShowAdd(false)} onSave={addInfluencer} />
        <ImportCSVDialog open={showImport} onClose={() => setShowImport(false)} onImport={importInfluencers} />
      </div>
    </Layout>
  );
};

function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: string; color?: string }) {
  return (
    <Card>
      <CardContent className="p-4 flex items-center gap-3">
        <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <Icon className={`h-4 w-4 ${color || 'text-primary'}`} />
        </div>
        <div>
          <p className="text-[11px] text-muted-foreground">{label}</p>
          <p className="font-semibold text-lg leading-tight">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default Index;
