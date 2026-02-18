import { Influencer, Status, STATUSES } from '@/types/influencer';
import { formatNumber } from '@/hooks/useInfluencers';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Props {
  influencers: Influencer[];
  onSelect: (inf: Influencer) => void;
  selectedId?: string;
}

const statusColors: Record<Status, string> = {
  'Not Reviewed': 'bg-muted text-muted-foreground',
  'Shortlisted': 'bg-success/15 text-success',
  'Contacted': 'bg-info/15 text-info',
  'Rejected': 'bg-destructive/15 text-destructive',
};

export default function InfluencerTable({ influencers, onSelect, selectedId }: Props) {
  if (influencers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <p className="text-lg font-medium">No influencers found</p>
        <p className="text-sm">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-[250px]">Influencer</TableHead>
            <TableHead>Platform</TableHead>
            <TableHead>Niche</TableHead>
            <TableHead className="text-right">Followers</TableHead>
            <TableHead className="text-right">Avg Views</TableHead>
            <TableHead className="text-right">Engagement</TableHead>
            <TableHead>Country</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {influencers.map(inf => (
            <TableRow
              key={inf.id}
              className={`cursor-pointer transition-colors hover:bg-muted/30 ${selectedId === inf.id ? 'bg-primary/5' : ''}`}
              onClick={() => onSelect(inf)}
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
              <TableCell>
                <Badge variant="outline" className="text-xs">
                  {inf.platform}
                </Badge>
              </TableCell>
              <TableCell className="text-sm">{inf.niche}</TableCell>
              <TableCell className="text-right text-sm font-medium">{formatNumber(inf.followers)}</TableCell>
              <TableCell className="text-right text-sm">{formatNumber(inf.avgViews)}</TableCell>
              <TableCell className="text-right text-sm font-medium">{inf.engagementRate}%</TableCell>
              <TableCell className="text-sm">{inf.country}</TableCell>
              <TableCell>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[inf.status]}`}>
                  {inf.status}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
