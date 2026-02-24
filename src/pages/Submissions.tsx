import { useState } from 'react';
import Layout from '@/components/Layout';
import { useSubmissions, useInfluencers, formatNumber } from '@/hooks/useInfluencers';
import { InfluencerSubmission } from '@/types/influencer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { CheckCircle, XCircle, Eye, Inbox } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Submissions() {
  const { submissions, markReviewed, deleteSubmission } = useSubmissions();
  const { addInfluencer } = useInfluencers();
  const { toast } = useToast();
  const [viewing, setViewing] = useState<InfluencerSubmission | null>(null);

  const pending = submissions.filter(s => !s.reviewed);
  const reviewed = submissions.filter(s => s.reviewed);

  const approveSubmission = (sub: InfluencerSubmission) => {
    addInfluencer({
      name: sub.name,
      platform: sub.youtubeUrl ? 'YouTube' : 'Instagram',
      niche: sub.niche,
      followers: sub.followers,
      avgViews: sub.avgViews,
      engagementRate: 0,
      country: sub.country,
      language: sub.language,
      contactEmail: sub.email,
      notes: `Cost range: ${sub.costRange}. Preferences: ${sub.collaborationPreferences}`,
      status: 'Not Reviewed',
      bio: sub.bio,
      profilePhoto: '',
      platformUrl: sub.youtubeUrl || sub.instagramUrl,
      recentContent: [],
    });
    markReviewed(sub.id);
    toast({ title: 'Approved', description: `${sub.name} added to influencer database` });
    setViewing(null);
  };

  const rejectSubmission = (sub: InfluencerSubmission) => {
    markReviewed(sub.id);
    toast({ title: 'Rejected', description: `${sub.name}'s submission was rejected` });
    setViewing(null);
  };

  return (
    <Layout>
      <div className="p-6 space-y-5 overflow-auto h-full">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Inbox className="h-6 w-6 text-primary" />
            Creator Submissions
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {pending.length} pending · {reviewed.length} reviewed
          </p>
        </div>

        {pending.length === 0 && reviewed.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Inbox className="h-12 w-12 mb-3 opacity-30" />
            <p className="text-lg font-medium">No submissions yet</p>
            <p className="text-sm">Share the signup link with creators to start receiving applications</p>
          </div>
        ) : (
          <div className="border border-border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Name</TableHead>
                  <TableHead>Niche</TableHead>
                  <TableHead>Followers</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...pending, ...reviewed].map(sub => (
                  <TableRow key={sub.id}>
                    <TableCell className="font-medium text-sm">{sub.name}</TableCell>
                    <TableCell className="text-sm">{sub.niche}</TableCell>
                    <TableCell className="text-sm">{formatNumber(sub.followers)}</TableCell>
                    <TableCell className="text-sm">{sub.country}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{sub.email}</TableCell>
                    <TableCell>
                      <Badge variant={sub.reviewed ? 'secondary' : 'default'} className="text-xs">
                        {sub.reviewed ? 'Reviewed' : 'Pending'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setViewing(sub)}>
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                        {!sub.reviewed && (
                          <>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-success" onClick={() => approveSubmission(sub)}>
                              <CheckCircle className="h-3.5 w-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => rejectSubmission(sub)}>
                              <XCircle className="h-3.5 w-3.5" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Detail dialog */}
        <Dialog open={!!viewing} onOpenChange={() => setViewing(null)}>
          <DialogContent className="max-w-md">
            {viewing && (
              <>
                <DialogHeader>
                  <DialogTitle>{viewing.name}</DialogTitle>
                </DialogHeader>
                <div className="space-y-3 text-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div><span className="text-muted-foreground">Niche:</span> {viewing.niche}</div>
                    <div><span className="text-muted-foreground">Followers:</span> {formatNumber(viewing.followers)}</div>
                    <div><span className="text-muted-foreground">Avg Views:</span> {formatNumber(viewing.avgViews)}</div>
                    <div><span className="text-muted-foreground">Country:</span> {viewing.country}</div>
                    <div><span className="text-muted-foreground">Language:</span> {viewing.language}</div>
                    <div><span className="text-muted-foreground">Email:</span> {viewing.email}</div>
                  </div>
                  {viewing.youtubeUrl && <div><span className="text-muted-foreground">YouTube:</span> {viewing.youtubeUrl}</div>}
                  {viewing.instagramUrl && <div><span className="text-muted-foreground">Instagram:</span> {viewing.instagramUrl}</div>}
                  {viewing.collaborationPreferences && <div><span className="text-muted-foreground">Preferences:</span> {viewing.collaborationPreferences}</div>}
                  {viewing.costRange && <div><span className="text-muted-foreground">Cost Range:</span> {viewing.costRange}</div>}
                  {viewing.bio && <div><span className="text-muted-foreground">Bio:</span> {viewing.bio}</div>}
                </div>
                <DialogFooter>
                  {!viewing.reviewed && (
                    <>
                      <Button variant="outline" onClick={() => rejectSubmission(viewing)}>
                        <XCircle className="h-4 w-4 mr-1.5" />
                        Reject
                      </Button>
                      <Button onClick={() => approveSubmission(viewing)}>
                        <CheckCircle className="h-4 w-4 mr-1.5" />
                        Approve & Add
                      </Button>
                    </>
                  )}
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
