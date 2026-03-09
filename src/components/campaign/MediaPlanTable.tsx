import { useState } from 'react';
import { Campaign, CampaignInfluencer, CampaignDeliverable, Influencer, DELIVERABLES } from '@/types/influencer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { CalendarIcon, Plus, Trash2, LayoutGrid } from 'lucide-react';
import { formatNumber } from '@/hooks/useInfluencers';
import { cn } from '@/lib/utils';

interface Props {
  campaign: Campaign;
  getInfluencer: (id: string) => Influencer | undefined;
  onUpdateInfluencer: (influencerId: string, data: Partial<CampaignInfluencer>) => void;
}

const infStatusColors: Record<string, string> = {
  Planned: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  Contacted: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  Confirmed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
};

export function MediaPlanTable({ campaign, getInfluencer, onUpdateInfluencer }: Props) {
  const updateDeliverable = (influencerId: string, ci: CampaignInfluencer, idx: number, data: Partial<CampaignDeliverable>) => {
    const updated = ci.deliverables.map((d, i) => i === idx ? { ...d, ...data } : d);
    onUpdateInfluencer(influencerId, { deliverables: updated });
  };

  const addDeliverable = (influencerId: string, ci: CampaignInfluencer) => {
    onUpdateInfluencer(influencerId, {
      deliverables: [...ci.deliverables, { type: 'Story', quantity: 1, costPerUnit: 0 }],
    });
  };

  const removeDeliverable = (influencerId: string, ci: CampaignInfluencer, idx: number) => {
    onUpdateInfluencer(influencerId, {
      deliverables: ci.deliverables.filter((_, i) => i !== idx),
    });
  };

  const getReach = (inf: Influencer, d: CampaignDeliverable) => {
    const base = inf.platform === 'YouTube' ? inf.avgViews * 0.80 : inf.followers * 0.25;
    return Math.round(base * d.quantity);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <LayoutGrid className="h-4 w-4 text-primary" />
          Media Plan
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="min-w-[180px]">Influencer</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead className="text-right">Followers</TableHead>
                <TableHead className="text-right">ER%</TableHead>
                <TableHead>Deliverable</TableHead>
                <TableHead className="text-center">Qty</TableHead>
                <TableHead>Cost/Unit (₹)</TableHead>
                <TableHead className="text-right">Total (₹)</TableHead>
                <TableHead className="text-right">Est. Reach</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Post Date</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaign.influencers.map(ci => {
                const inf = getInfluencer(ci.influencerId);
                if (!inf) return null;
                const rowCount = Math.max(ci.deliverables.length, 1);

                return ci.deliverables.map((d, idx) => (
                  <TableRow key={`${ci.influencerId}-${idx}`}>
                    {idx === 0 && (
                      <>
                        <TableCell rowSpan={rowCount} className="align-top">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8 ring-2 ring-border">
                              <AvatarImage src={inf.profilePhoto} alt={inf.name} />
                              <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-semibold">
                                {inf.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium">{inf.name}</span>
                          </div>
                        </TableCell>
                        <TableCell rowSpan={rowCount} className="align-top">
                          <Badge variant="outline" className="text-xs">{inf.platform}</Badge>
                        </TableCell>
                        <TableCell rowSpan={rowCount} className="text-right align-top text-sm">
                          {formatNumber(inf.followers)}
                        </TableCell>
                        <TableCell rowSpan={rowCount} className="text-right align-top text-sm">
                          {inf.engagementRate.toFixed(1)}%
                        </TableCell>
                      </>
                    )}
                    <TableCell>
                      <Select value={d.type} onValueChange={v => updateDeliverable(ci.influencerId, ci, idx, { type: v as any })}>
                        <SelectTrigger className="h-8 w-28 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {DELIVERABLES.map(dt => (
                            <SelectItem key={dt} value={dt}>{dt}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-center">
                      <Input
                        type="number"
                        min={1}
                        className="h-8 w-16 text-center text-xs"
                        value={d.quantity}
                        onChange={e => updateDeliverable(ci.influencerId, ci, idx, { quantity: Math.max(1, parseInt(e.target.value) || 1) })}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        className="h-8 w-24 text-xs"
                        value={d.costPerUnit || ''}
                        onChange={e => updateDeliverable(ci.influencerId, ci, idx, { costPerUnit: parseInt(e.target.value) || 0 })}
                      />
                    </TableCell>
                    <TableCell className="text-right text-sm font-medium">
                      ₹{formatNumber(d.costPerUnit * d.quantity)}
                    </TableCell>
                    <TableCell className="text-right text-sm text-muted-foreground">
                      {formatNumber(getReach(inf, d))}
                    </TableCell>
                    {idx === 0 && (
                      <>
                        <TableCell rowSpan={rowCount} className="align-top">
                          <Select value={ci.status} onValueChange={v => onUpdateInfluencer(ci.influencerId, { status: v as any })}>
                            <SelectTrigger className="h-8 w-28 text-xs border-0 p-0">
                              <Badge className={`${infStatusColors[ci.status]} border-0 text-xs`}>{ci.status}</Badge>
                            </SelectTrigger>
                            <SelectContent>
                              {['Planned', 'Contacted', 'Confirmed'].map(s => (
                                <SelectItem key={s} value={s}>{s}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell rowSpan={rowCount} className="align-top">
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="outline" size="sm" className={cn("h-8 w-32 text-xs justify-start", !ci.postDate && "text-muted-foreground")}>
                                <CalendarIcon className="h-3 w-3 mr-1" />
                                {ci.postDate ? format(new Date(ci.postDate), 'MMM d, yyyy') : 'Set date'}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={ci.postDate ? new Date(ci.postDate) : undefined}
                                onSelect={date => onUpdateInfluencer(ci.influencerId, { postDate: date?.toISOString() || '' })}
                                className={cn("p-3 pointer-events-auto")}
                              />
                            </PopoverContent>
                          </Popover>
                        </TableCell>
                        <TableCell rowSpan={rowCount} className="align-top">
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => addDeliverable(ci.influencerId, ci)}>
                            <Plus className="h-3 w-3" />
                          </Button>
                        </TableCell>
                      </>
                    )}
                    {idx > 0 && (
                      <TableCell>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => removeDeliverable(ci.influencerId, ci, idx)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ));
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
