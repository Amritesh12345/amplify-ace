import { Campaign, CampaignGoals as CampaignGoalsType, Influencer } from '@/types/influencer';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Target, Eye, Heart, IndianRupee } from 'lucide-react';
import { formatNumber } from '@/hooks/useInfluencers';

interface Props {
  campaign: Campaign;
  goals: CampaignGoalsType;
  getInfluencer: (id: string) => Influencer | undefined;
  onGoalsChange: (goals: CampaignGoalsType) => void;
}

export function CampaignGoalsSection({ campaign, goals, getInfluencer, onGoalsChange }: Props) {
  let estimatedBudget = 0;
  let estimatedReach = 0;
  let estimatedEngagement = 0;

  campaign.influencers.forEach(ci => {
    const inf = getInfluencer(ci.influencerId);
    if (!inf) return;
    ci.deliverables.forEach(d => {
      estimatedBudget += d.costPerUnit * d.quantity;
      const reach = inf.platform === 'YouTube'
        ? inf.avgViews * 0.80 * d.quantity
        : inf.followers * 0.25 * d.quantity;
      estimatedReach += reach;
      estimatedEngagement += Math.round(inf.avgViews * inf.engagementRate / 100) * d.quantity;
    });
  });

  const items = [
    {
      icon: Eye,
      label: 'Target Reach',
      target: goals.targetReach,
      current: Math.round(estimatedReach),
      field: 'targetReach' as const,
    },
    {
      icon: Heart,
      label: 'Target Engagement',
      target: goals.targetEngagement,
      current: Math.round(estimatedEngagement),
      field: 'targetEngagement' as const,
    },
    {
      icon: IndianRupee,
      label: 'Target Budget',
      target: goals.targetBudget,
      current: Math.round(estimatedBudget),
      field: 'targetBudget' as const,
      prefix: '₹',
    },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-4">
      {items.map(item => {
        const progress = item.target > 0 ? Math.min(100, Math.round((item.current / item.target) * 100)) : 0;
        return (
          <Card key={item.field}>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <item.icon className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm font-medium">{item.label}</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-muted-foreground">Target:</span>
                  <Input
                    type="number"
                    className="h-7 w-28 text-xs"
                    value={item.target || ''}
                    placeholder="Set target"
                    onChange={e => onGoalsChange({ ...goals, [item.field]: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    Estimated: {item.prefix || ''}{formatNumber(item.current)}
                  </span>
                  {item.target > 0 && (
                    <span className={progress >= 80 ? 'text-green-600' : progress >= 50 ? 'text-amber-600' : 'text-muted-foreground'}>
                      {progress}%
                    </span>
                  )}
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
