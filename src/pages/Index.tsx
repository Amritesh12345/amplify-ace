import { useState } from 'react';
import Layout from '@/components/Layout';
import InfluencerFilters from '@/components/InfluencerFilters';
import InfluencerTable from '@/components/InfluencerTable';
import InfluencerDetail from '@/components/InfluencerDetail';
import AddInfluencerDialog from '@/components/AddInfluencerDialog';
import ImportCSVDialog from '@/components/ImportCSVDialog';
import { useInfluencers } from '@/hooks/useInfluencers';
import { Influencer } from '@/types/influencer';
import { Button } from '@/components/ui/button';
import { Plus, Upload, Users } from 'lucide-react';

const Index = () => {
  const { influencers, filters, setFilters, addInfluencer, updateInfluencer, deleteInfluencer, importInfluencers, allInfluencers } = useInfluencers();
  const [selected, setSelected] = useState<Influencer | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showImport, setShowImport] = useState(false);

  // Keep selected in sync with updates
  const currentSelected = selected ? allInfluencers.find(i => i.id === selected.id) || null : null;

  return (
    <Layout>
      <div className="flex h-full">
        <div className="flex-1 overflow-auto">
          <div className="p-6 space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Influencer Discovery</h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {influencers.length} of {allInfluencers.length} influencers
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

            {/* Filters */}
            <InfluencerFilters filters={filters} onChange={setFilters} />

            {/* Table */}
            <InfluencerTable
              influencers={influencers}
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

export default Index;
