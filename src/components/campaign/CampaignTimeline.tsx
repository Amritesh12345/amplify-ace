import { Campaign, Influencer } from '@/types/influencer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { CalendarDays } from 'lucide-react';
import { format } from 'date-fns';

interface Props {
  campaign: Campaign;
  getInfluencer: (id: string) => Influencer | undefined;
}

export function CampaignTimeline({ campaign, getInfluencer }: Props) {
  const scheduled = campaign.influencers
    .filter(ci => ci.postDate)
    .map(ci => ({ ...ci, inf: getInfluencer(ci.influencerId) }))
    .filter(ci => ci.inf)
    .sort((a, b) => new Date(a.postDate).getTime() - new Date(b.postDate).getTime());

  if (scheduled.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-primary" />
            Campaign Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-6">Set post dates in the media plan to see the timeline</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-primary" />
          Campaign Timeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative pl-6 space-y-4">
          <div className="absolute left-2.5 top-2 bottom-2 w-px bg-border" />
          {scheduled.map(ci => (
            <div key={ci.influencerId} className="relative flex items-center gap-3">
              <div className="absolute -left-3.5 h-3 w-3 rounded-full bg-primary border-2 border-background" />
              <div className="flex items-center gap-3 flex-1 rounded-lg border bg-card p-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={ci.inf!.profilePhoto} />
                  <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-semibold">
                    {ci.inf!.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{ci.inf!.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    {ci.deliverables.map((d, i) => (
                      <Badge key={i} variant="outline" className="text-[10px]">
                        {d.quantity}× {d.type}
                      </Badge>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground whitespace-nowrap">
                  {format(new Date(ci.postDate), 'MMM d, yyyy')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
