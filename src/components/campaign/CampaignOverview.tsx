import { Campaign, CampaignStatus, CAMPAIGN_STATUSES } from '@/types/influencer';
import { Influencer } from '@/types/influencer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Eye, Heart, IndianRupee, TrendingUp, BarChart3 } from 'lucide-react';
import { formatNumber } from '@/hooks/useInfluencers';

interface Props {
  campaign: Campaign;
  getInfluencer: (id: string) => Influencer | undefined;
  onStatusChange: (status: CampaignStatus) => void;
}

const statusColors: Record<CampaignStatus, string> = {
  Draft: 'bg-muted text-muted-foreground',
  Planning: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  Outreach: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  Live: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  Completed: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
};

export function CampaignOverview({ campaign, getInfluencer, onStatusChange }: Props) {
  let totalBudget = 0;
  let totalReach = 0;
  let totalEngagement = 0;
  let totalFollowers = 0;

  campaign.influencers.forEach(ci => {
    const inf = getInfluencer(ci.influencerId);
    if (!inf) return;
    totalFollowers += inf.followers;
    ci.deliverables.forEach(d => {
      totalBudget += d.costPerUnit * d.quantity;
      const reach = inf.platform === 'YouTube'
        ? inf.avgViews * 0.80 * d.quantity
        : inf.followers * 0.25 * d.quantity;
      totalReach += reach;
      totalEngagement += Math.round(inf.avgViews * inf.engagementRate / 100) * d.quantity;
    });
  });

  const avgCPM = totalReach > 0 ? (totalBudget / totalReach) * 1000 : 0;
  const avgER = campaign.influencers.length > 0
    ? campaign.influencers.reduce((sum, ci) => {
        const inf = getInfluencer(ci.influencerId);
        return sum + (inf?.engagementRate || 0);
      }, 0) / campaign.influencers.length
    : 0;

  const metrics = [
    { icon: Users, label: 'Influencers', value: campaign.influencers.length.toString() },
    { icon: IndianRupee, label: 'Total Budget', value: `₹${formatNumber(totalBudget)}` },
    { icon: Eye, label: 'Est. Reach', value: formatNumber(Math.round(totalReach)) },
    { icon: Heart, label: 'Est. Engagement', value: formatNumber(Math.round(totalEngagement)) },
    { icon: TrendingUp, label: 'Avg CPM', value: `₹${avgCPM.toFixed(0)}` },
    { icon: BarChart3, label: 'Avg ER', value: `${avgER.toFixed(1)}%` },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <h2 className="text-xl font-bold">{campaign.name}</h2>
        <Select value={campaign.status} onValueChange={v => onStatusChange(v as CampaignStatus)}>
          <SelectTrigger className="w-36 h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CAMPAIGN_STATUSES.map(s => (
              <SelectItem key={s} value={s}>
                <Badge className={`${statusColors[s]} border-0 text-xs`}>{s}</Badge>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {metrics.map(m => (
          <Card key={m.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <m.icon className="h-4 w-4 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] text-muted-foreground truncate">{m.label}</p>
                <p className="font-semibold text-lg leading-tight">{m.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
