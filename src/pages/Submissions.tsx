import { useState } from 'react';
import Layout from '@/components/Layout';
import { useSubmissions, useInfluencers, formatNumber } from '@/hooks/useInfluencers';
import { AnySubmission, InfluencerSubmission, AgencySubmission } from '@/types/influencer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { CheckCircle, XCircle, Eye, Inbox, User, Building2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

function isCreator(sub: AnySubmission): sub is InfluencerSubmission {
  return sub.type === 'creator';
}

function isAgency(sub: AnySubmission): sub is AgencySubmission {
  return sub.type === 'agency';
}

export default function Submissions() {
  const { submissions, markReviewed } = useSubmissions();
  const { addInfluencer } = useInfluencers();
  const { toast } = useToast();
  const [viewing, setViewing] = useState<AnySubmission | null>(null);
  const [filter, setFilter] = useState<'all' | 'creator' | 'agency'>('all');

  const displayed = filter === 'all' ? submissions : submissions.filter(s => s.type === filter);
  const pending = displayed.filter(s => !s.reviewed);
  const reviewed = displayed.filter(s => s.reviewed);

  const getName = (sub: AnySubmission) => isCreator(sub) ? sub.name : sub.agencyName;
  const getEmail = (sub: AnySubmission) => isCreator(sub) ? sub.email : sub.contactEmail;
  const getCountry = (sub: AnySubmission) => sub.country;

  const approveSubmission = (sub: AnySubmission) => {
    if (isCreator(sub)) {
      addInfluencer({
        name: sub.name,
        platform: sub.primaryPlatform === 'Both' ? 'YouTube' : sub.primaryPlatform,
        niche: sub.niches[0] || 'Tech',
        followers: sub.followers,
        avgViews: sub.avgViews,
        engagementRate: sub.engagementRate,
        country: sub.country,
        language: sub.language,
        contactEmail: sub.email,
        notes: `Price: ${sub.priceRange}. Formats: ${sub.collaborationFormats.join(', ')}`,
        status: 'Not Reviewed',
        bio: sub.bio,
        profilePhoto: '',
        platformUrl: sub.youtubeUrl || sub.instagramUrl,
        recentContent: [],
      });
      toast({ title: 'Approved', description: `${sub.name} added to influencer database` });
    } else {
      toast({ title: 'Approved', description: `${sub.agencyName} agency application approved` });
    }
    markReviewed(sub.id, sub.type);
    setViewing(null);
  };

  const rejectSubmission = (sub: AnySubmission) => {
    markReviewed(sub.id, sub.type);
    toast({ title: 'Rejected', description: `${getName(sub)}'s submission was rejected` });
    setViewing(null);
  };

  return (
    <Layout>
      <div className="p-6 space-y-5 overflow-auto h-full">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <Inbox className="h-6 w-6 text-primary" />
              Submissions
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {pending.length} pending · {reviewed.length} reviewed
            </p>
          </div>
          <div className="flex gap-1.5">
            {(['all', 'creator', 'agency'] as const).map(f => (
              <Button key={f} size="sm" variant={filter === f ? 'default' : 'outline'} onClick={() => setFilter(f)}>
                {f === 'all' ? 'All' : f === 'creator' ? 'Creators' : 'Agencies'}
              </Button>
            ))}
          </div>
        </div>

        {displayed.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Inbox className="h-12 w-12 mb-3 opacity-30" />
            <p className="text-lg font-medium">No submissions yet</p>
            <p className="text-sm">Share the signup link with creators and agencies to start receiving applications</p>
          </div>
        ) : (
          <div className="border border-border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...pending, ...reviewed].map(sub => (
                  <TableRow key={sub.id}>
                    <TableCell className="font-medium text-sm">{getName(sub)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs gap-1">
                        {isCreator(sub) ? <User className="h-3 w-3" /> : <Building2 className="h-3 w-3" />}
                        {isCreator(sub) ? 'Creator' : 'Agency'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{getCountry(sub)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{getEmail(sub)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(sub.submittedAt).toLocaleDateString()}
                    </TableCell>
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
                  <DialogTitle className="flex items-center gap-2">
                    {isCreator(viewing) ? <User className="h-5 w-5" /> : <Building2 className="h-5 w-5" />}
                    {getName(viewing)}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-3 text-sm">
                  {isCreator(viewing) ? (
                    <>
                      <div className="grid grid-cols-2 gap-2">
                        <div><span className="text-muted-foreground">Platform:</span> {viewing.primaryPlatform}</div>
                        <div><span className="text-muted-foreground">Followers:</span> {formatNumber(viewing.followers)}</div>
                        <div><span className="text-muted-foreground">Avg Views:</span> {formatNumber(viewing.avgViews)}</div>
                        <div><span className="text-muted-foreground">Engagement:</span> {viewing.engagementRate}%</div>
                        <div><span className="text-muted-foreground">Country:</span> {viewing.country}</div>
                        <div><span className="text-muted-foreground">Audience:</span> {viewing.audienceCountry}</div>
                        <div><span className="text-muted-foreground">Language:</span> {viewing.language}</div>
                        <div><span className="text-muted-foreground">Email:</span> {viewing.email}</div>
                      </div>
                      {viewing.niches.length > 0 && (
                        <div><span className="text-muted-foreground">Niches:</span> {viewing.niches.join(', ')}</div>
                      )}
                      {viewing.youtubeUrl && <div><span className="text-muted-foreground">YouTube:</span> {viewing.youtubeUrl}</div>}
                      {viewing.instagramUrl && <div><span className="text-muted-foreground">Instagram:</span> {viewing.instagramUrl}</div>}
                      {viewing.collaborationFormats.length > 0 && (
                        <div><span className="text-muted-foreground">Formats:</span> {viewing.collaborationFormats.join(', ')}</div>
                      )}
                      <div><span className="text-muted-foreground">Price Range:</span> {viewing.priceRange}</div>
                      {viewing.phone && <div><span className="text-muted-foreground">Phone:</span> {viewing.phone}</div>}
                      {viewing.bio && <div><span className="text-muted-foreground">Bio:</span> {viewing.bio}</div>}
                    </>
                  ) : (
                    <>
                      <div className="grid grid-cols-2 gap-2">
                        <div><span className="text-muted-foreground">Country:</span> {viewing.country}</div>
                        <div><span className="text-muted-foreground">Markets:</span> {viewing.primaryMarkets}</div>
                        <div><span className="text-muted-foreground">Creators:</span> {viewing.creatorCount}</div>
                        <div><span className="text-muted-foreground">Platforms:</span> {viewing.platformsCovered}</div>
                        <div><span className="text-muted-foreground">Contact:</span> {viewing.contactPerson}</div>
                        <div><span className="text-muted-foreground">Email:</span> {viewing.contactEmail}</div>
                      </div>
                      {viewing.website && <div><span className="text-muted-foreground">Website:</span> {viewing.website}</div>}
                      {viewing.nichesCovered.length > 0 && (
                        <div><span className="text-muted-foreground">Niches:</span> {viewing.nichesCovered.join(', ')}</div>
                      )}
                      {viewing.notableBrands && <div><span className="text-muted-foreground">Brands:</span> {viewing.notableBrands}</div>}
                      {viewing.rosterLink && <div><span className="text-muted-foreground">Roster:</span> {viewing.rosterLink}</div>}
                      {viewing.phone && <div><span className="text-muted-foreground">Phone:</span> {viewing.phone}</div>}
                      {viewing.notes && <div><span className="text-muted-foreground">Notes:</span> {viewing.notes}</div>}
                    </>
                  )}
                </div>
                <DialogFooter>
                  {!viewing.reviewed && (
                    <>
                      <Button variant="outline" onClick={() => rejectSubmission(viewing)}>
                        <XCircle className="h-4 w-4 mr-1.5" /> Reject
                      </Button>
                      <Button onClick={() => approveSubmission(viewing)}>
                        <CheckCircle className="h-4 w-4 mr-1.5" /> Approve
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
