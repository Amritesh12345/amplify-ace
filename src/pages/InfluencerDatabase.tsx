import { useState } from 'react';
import Layout from '@/components/Layout';
import InfluencerDetail from '@/components/InfluencerDetail';
import AddInfluencerDialog from '@/components/AddInfluencerDialog';
import ImportCSVDialog from '@/components/ImportCSVDialog';
import InfluencerTable from '@/components/InfluencerTable';
import InfluencerFilters from '@/components/InfluencerFilters';
import { useInfluencers, exportToCSV, downloadCSV } from '@/hooks/useInfluencers';
import { Influencer } from '@/types/influencer';
import { Button } from '@/components/ui/button';
import { Plus, Upload, Download, Database } from 'lucide-react';

export default function InfluencerDatabase() {
  const { influencers, allInfluencers, filters, setFilters, addInfluencer, updateInfluencer, deleteInfluencer, importInfluencers } = useInfluencers();
  const [selected, setSelected] = useState<Influencer | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showImport, setShowImport] = useState(false);

  const currentSelected = selected ? allInfluencers.find(i => i.id === selected.id) || null : null;

  const handleExport = () => {
    const csv = exportToCSV(allInfluencers);
    downloadCSV(csv, 'influencer-database.csv');
  };

  return (
    <Layout>
      <div className="flex h-full">
        <div className="flex-1 overflow-auto">
          <div className="p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                  <Database className="h-6 w-6 text-primary" />
                  Influencer Database
                </h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {influencers.length} of {allInfluencers.length} influencers
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleExport}>
                  <Download className="h-4 w-4 mr-1.5" />
                  Export
                </Button>
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

            <InfluencerFilters filters={filters} onChange={setFilters} />
            <InfluencerTable influencers={influencers} onSelect={setSelected} selectedId={currentSelected?.id} />
          </div>
        </div>

        {currentSelected && (
          <InfluencerDetail
            influencer={currentSelected}
            onClose={() => setSelected(null)}
            onUpdate={updateInfluencer}
            onDelete={deleteInfluencer}
          />
        )}

        <AddInfluencerDialog open={showAdd} onClose={() => setShowAdd(false)} onSave={addInfluencer} />
        <ImportCSVDialog open={showImport} onClose={() => setShowImport(false)} onImport={importInfluencers} />
      </div>
    </Layout>
  );
}
