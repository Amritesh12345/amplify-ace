import { CampaignBrief } from '@/types/influencer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { FileText } from 'lucide-react';

interface Props {
  brief: CampaignBrief;
  onChange: (brief: CampaignBrief) => void;
}

export function CampaignBriefEditor({ brief, onChange }: Props) {
  const update = (field: keyof CampaignBrief, value: string) => {
    onChange({ ...brief, [field]: value });
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary" />
          Campaign Brief
        </CardTitle>
      </CardHeader>
      <CardContent className="grid md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs">Campaign Objective</Label>
          <Textarea
            placeholder="Describe the campaign goal..."
            value={brief.objective}
            onChange={e => update('objective', e.target.value)}
            className="min-h-[80px]"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Target Audience</Label>
          <Textarea
            placeholder="Who is the ideal audience? Demographics, interests..."
            value={brief.targetAudience || ''}
            onChange={e => update('targetAudience', e.target.value)}
            className="min-h-[80px]"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Content Theme / Concept</Label>
          <Textarea
            placeholder="Campaign theme, creative direction, mood..."
            value={brief.contentTheme || ''}
            onChange={e => update('contentTheme', e.target.value)}
            className="min-h-[80px]"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Content Guidelines</Label>
          <Textarea
            placeholder="Key messaging, do's and don'ts..."
            value={brief.contentGuidelines}
            onChange={e => update('contentGuidelines', e.target.value)}
            className="min-h-[80px]"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Hashtags</Label>
          <Input
            placeholder="#AmplifyAce #BrandCollab"
            value={brief.hashtags}
            onChange={e => update('hashtags', e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Posting Window</Label>
          <Input
            placeholder="e.g. March 15-25, 2026"
            value={brief.postingWindow}
            onChange={e => update('postingWindow', e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
