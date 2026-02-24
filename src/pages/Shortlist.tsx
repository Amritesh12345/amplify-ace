import { useState } from 'react';
import Layout from '@/components/Layout';
import InfluencerDetail from '@/components/InfluencerDetail';
import { useInfluencers, formatNumber, exportToCSV, downloadCSV } from '@/hooks/useInfluencers';
import { Influencer, STATUSES, Status } from '@/types/influencer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Star } from 'lucide-react';

const statusColors: Record<Status, string> = {
  'Not Reviewed': 'bg-muted text-muted-foreground',
  'Shortlisted': 'bg-success/15 text-success',
  'Planned': 'bg-accent/15 text-accent',
  'Contacted': 'bg-info/15 text-info',
  'Confirmed': 'bg-success/25 text-success',
  'Rejected': 'bg-destructive/15 text-destructive',
};

export default function Shortlist() {
  const { shortlisted, updateInfluencer, deleteInfluencer } = useInfluencers();
  const [selected, setSelected] = useState<Influencer | null>(null);

  const currentSelected = selected ? shortlisted.find(i => i.id === selected.id) || null : null;

  const handleExport = () => {
    const csv = exportToCSV(shortlisted);
    downloadCSV(csv, 'shortlisted-influencers.csv');
  };

  return (
    <Layout>
      <div className="flex h-full">
        <div className="flex-1 overflow-auto">
          <div className="p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                  <Star className="h-6 w-6 text-warning" />
                  Shortlisted Influencers
                </h1>
                <p className="text-sm text-muted-foreground mt-0.5">{shortlisted.length} influencers shortlisted</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleExport} disabled={shortlisted.length === 0}>
                <Download className="h-4 w-4 mr-1.5" />
                Export CSV
              </Button>
            </div>

            {shortlisted.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                <Star className="h-12 w-12 mb-3 opacity-30" />
                <p className="text-lg font-medium">No shortlisted influencers yet</p>
                <p className="text-sm">Go to Discovery and shortlist some influencers</p>
              </div>
            ) : (
              <div className="border border-border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="w-[250px]">Influencer</TableHead>
                      <TableHead>Platform</TableHead>
                      <TableHead>Niche</TableHead>
                      <TableHead className="text-right">Followers</TableHead>
                      <TableHead className="text-right">Engagement</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {shortlisted.map(inf => (
                      <TableRow
                        key={inf.id}
                        className={`cursor-pointer transition-colors hover:bg-muted/30 ${currentSelected?.id === inf.id ? 'bg-primary/5' : ''}`}
                        onClick={() => setSelected(inf)}
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={inf.profilePhoto} alt={inf.name} />
                              <AvatarFallback className="text-xs">{inf.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{inf.name}</p>
                              <p className="text-xs text-muted-foreground">{inf.contactEmail}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell><Badge variant="outline" className="text-xs">{inf.platform}</Badge></TableCell>
                        <TableCell className="text-sm">{inf.niche}</TableCell>
                        <TableCell className="text-right text-sm font-medium">{formatNumber(inf.followers)}</TableCell>
                        <TableCell className="text-right text-sm">{inf.engagementRate}%</TableCell>
                        <TableCell className="text-sm">{inf.country}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[inf.status]}`}>
                            {inf.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground max-w-[150px] truncate">
                          {inf.notes || '—'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
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
      </div>
    </Layout>
  );
}
