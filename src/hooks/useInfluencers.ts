import { useState, useCallback, useMemo } from 'react';
import { Influencer, Filters, Status, Campaign, CampaignInfluencer, InfluencerSubmission, AgencySubmission, AnySubmission } from '@/types/influencer';
import { mockInfluencers } from '@/data/mockInfluencers';

const STORAGE_KEY = 'influencer-data';
const CAMPAIGNS_KEY = 'campaigns-data';
const SUBMISSIONS_KEY = 'submissions-data';
const AGENCY_SUBMISSIONS_KEY = 'agency-submissions-data';

function loadInfluencers(): Influencer[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return mockInfluencers;
}

function saveInfluencers(data: Influencer[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function loadCampaigns(): Campaign[] {
  try {
    const stored = localStorage.getItem(CAMPAIGNS_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return [];
}

function saveCampaigns(data: Campaign[]) {
  localStorage.setItem(CAMPAIGNS_KEY, JSON.stringify(data));
}

function loadCreatorSubmissions(): InfluencerSubmission[] {
  try {
    const stored = localStorage.getItem(SUBMISSIONS_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return [];
}

function saveCreatorSubmissions(data: InfluencerSubmission[]) {
  localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(data));
}

function loadAgencySubmissions(): AgencySubmission[] {
  try {
    const stored = localStorage.getItem(AGENCY_SUBMISSIONS_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return [];
}

function saveAgencySubmissions(data: AgencySubmission[]) {
  localStorage.setItem(AGENCY_SUBMISSIONS_KEY, JSON.stringify(data));
}

export const defaultFilters: Filters = {
  platforms: [],
  niches: [],
  followersMin: 0,
  followersMax: 10000000,
  engagementMin: 0,
  engagementMax: 15,
  country: '',
  language: '',
  status: '',
  search: '',
};

export function useInfluencers() {
  const [influencers, setInfluencers] = useState<Influencer[]>(loadInfluencers);
  const [filters, setFilters] = useState<Filters>(defaultFilters);

  const update = useCallback((next: Influencer[]) => {
    setInfluencers(next);
    saveInfluencers(next);
  }, []);

  const addInfluencer = useCallback((inf: Omit<Influencer, 'id'>) => {
    const newInf: Influencer = { ...inf, id: crypto.randomUUID() };
    update([newInf, ...influencers]);
  }, [influencers, update]);

  const updateInfluencer = useCallback((id: string, data: Partial<Influencer>) => {
    update(influencers.map(i => i.id === id ? { ...i, ...data } : i));
  }, [influencers, update]);

  const deleteInfluencer = useCallback((id: string) => {
    update(influencers.filter(i => i.id !== id));
  }, [influencers, update]);

  const importInfluencers = useCallback((newOnes: Omit<Influencer, 'id'>[]) => {
    const withIds = newOnes.map(i => ({ ...i, id: crypto.randomUUID() }));
    update([...withIds, ...influencers]);
  }, [influencers, update]);

  const filtered = useMemo(() => {
    return influencers.filter(i => {
      if (filters.platforms.length && !filters.platforms.includes(i.platform)) return false;
      if (filters.niches.length && !filters.niches.includes(i.niche)) return false;
      if (i.followers < filters.followersMin || i.followers > filters.followersMax) return false;
      if (i.engagementRate < filters.engagementMin || i.engagementRate > filters.engagementMax) return false;
      if (filters.country && i.country !== filters.country) return false;
      if (filters.language && i.language !== filters.language) return false;
      if (filters.status && i.status !== filters.status) return false;
      if (filters.search) {
        const s = filters.search.toLowerCase();
        if (!i.name.toLowerCase().includes(s) && !i.niche.toLowerCase().includes(s) && !i.contactEmail.toLowerCase().includes(s)) return false;
      }
      return true;
    });
  }, [influencers, filters]);

  const shortlisted = useMemo(() => influencers.filter(i => i.status === 'Shortlisted'), [influencers]);
  const campaignReady = useMemo(() => influencers.filter(i => i.status === 'Planned' || i.status === 'Confirmed'), [influencers]);

  return {
    influencers: filtered,
    allInfluencers: influencers,
    shortlisted,
    campaignReady,
    filters,
    setFilters,
    addInfluencer,
    updateInfluencer,
    deleteInfluencer,
    importInfluencers,
  };
}

export function useCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(loadCampaigns);

  const updateAll = useCallback((next: Campaign[]) => {
    setCampaigns(next);
    saveCampaigns(next);
  }, []);

  const createCampaign = useCallback((name: string, influencerIds: string[], allInfluencers: Influencer[]) => {
    const campaignInfluencers: CampaignInfluencer[] = influencerIds.map(id => {
      const inf = allInfluencers.find(i => i.id === id);
      return {
        influencerId: id,
        deliverable: 'Reel' as const,
        proposedCost: 0,
        expectedViews: inf?.avgViews || 0,
        expectedEngagement: inf ? Math.round(inf.avgViews * inf.engagementRate / 100) : 0,
        notes: '',
      };
    });
    const campaign: Campaign = {
      id: crypto.randomUUID(),
      name,
      createdAt: new Date().toISOString(),
      influencers: campaignInfluencers,
    };
    updateAll([campaign, ...campaigns]);
    return campaign;
  }, [campaigns, updateAll]);

  const updateCampaign = useCallback((id: string, data: Partial<Campaign>) => {
    updateAll(campaigns.map(c => c.id === id ? { ...c, ...data } : c));
  }, [campaigns, updateAll]);

  const deleteCampaign = useCallback((id: string) => {
    updateAll(campaigns.filter(c => c.id !== id));
  }, [campaigns, updateAll]);

  const duplicateCampaign = useCallback((id: string) => {
    const original = campaigns.find(c => c.id === id);
    if (!original) return;
    const dup: Campaign = {
      ...original,
      id: crypto.randomUUID(),
      name: `${original.name} (Copy)`,
      createdAt: new Date().toISOString(),
    };
    updateAll([dup, ...campaigns]);
  }, [campaigns, updateAll]);

  return { campaigns, createCampaign, updateCampaign, deleteCampaign, duplicateCampaign };
}

export function useSubmissions() {
  const [creatorSubs, setCreatorSubs] = useState<InfluencerSubmission[]>(loadCreatorSubmissions);
  const [agencySubs, setAgencySubs] = useState<AgencySubmission[]>(loadAgencySubmissions);

  const updateCreators = useCallback((next: InfluencerSubmission[]) => {
    setCreatorSubs(next);
    saveCreatorSubmissions(next);
  }, []);

  const updateAgencies = useCallback((next: AgencySubmission[]) => {
    setAgencySubs(next);
    saveAgencySubmissions(next);
  }, []);

  const addCreatorSubmission = useCallback((sub: Omit<InfluencerSubmission, 'id' | 'submittedAt' | 'reviewed' | 'type'>) => {
    const newSub: InfluencerSubmission = {
      ...sub,
      type: 'creator',
      id: crypto.randomUUID(),
      submittedAt: new Date().toISOString(),
      reviewed: false,
    };
    updateCreators([newSub, ...creatorSubs]);
  }, [creatorSubs, updateCreators]);

  const addAgencySubmission = useCallback((sub: Omit<AgencySubmission, 'id' | 'submittedAt' | 'reviewed' | 'type'>) => {
    const newSub: AgencySubmission = {
      ...sub,
      type: 'agency',
      id: crypto.randomUUID(),
      submittedAt: new Date().toISOString(),
      reviewed: false,
    };
    updateAgencies([newSub, ...agencySubs]);
  }, [agencySubs, updateAgencies]);

  const markReviewed = useCallback((id: string, subType: 'creator' | 'agency') => {
    if (subType === 'creator') {
      updateCreators(creatorSubs.map(s => s.id === id ? { ...s, reviewed: true } : s));
    } else {
      updateAgencies(agencySubs.map(s => s.id === id ? { ...s, reviewed: true } : s));
    }
  }, [creatorSubs, agencySubs, updateCreators, updateAgencies]);

  const deleteSubmission = useCallback((id: string, subType: 'creator' | 'agency') => {
    if (subType === 'creator') {
      updateCreators(creatorSubs.filter(s => s.id !== id));
    } else {
      updateAgencies(agencySubs.filter(s => s.id !== id));
    }
  }, [creatorSubs, agencySubs, updateCreators, updateAgencies]);

  const allSubmissions: AnySubmission[] = useMemo(() => {
    return [...creatorSubs, ...agencySubs].sort((a, b) =>
      new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );
  }, [creatorSubs, agencySubs]);

  return {
    submissions: allSubmissions,
    creatorSubmissions: creatorSubs,
    agencySubmissions: agencySubs,
    addCreatorSubmission,
    addAgencySubmission,
    markReviewed,
    deleteSubmission,
  };
}

export function formatNumber(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return n.toString();
}

export function exportToCSV(influencers: Influencer[]): string {
  const headers = ['Name', 'Platform', 'Niche', 'Followers', 'Avg Views/Reach', 'Engagement Rate', 'Country', 'Language', 'Email', 'Status', 'Notes'];
  const rows = influencers.map(i => [
    i.name, i.platform, i.niche, i.followers, i.avgViews, i.engagementRate + '%',
    i.country, i.language, i.contactEmail, i.status, `"${i.notes.replace(/"/g, '""')}"`,
  ]);
  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}

export function downloadCSV(csv: string, filename: string) {
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function parseCSV(text: string): Omit<Influencer, 'id'>[] {
  const lines = text.split('\n').filter(l => l.trim());
  if (lines.length < 2) return [];
  
  return lines.slice(1).map(line => {
    const cols = line.split(',').map(c => c.trim().replace(/^"|"$/g, ''));
    return {
      name: cols[0] || 'Unknown',
      platform: (cols[1] as any) || 'YouTube',
      niche: (cols[2] as any) || 'Tech',
      followers: parseInt(cols[3]) || 0,
      avgViews: parseInt(cols[4]) || 0,
      engagementRate: parseFloat(cols[5]) || 0,
      country: cols[6] || 'India',
      language: cols[7] || 'English',
      contactEmail: cols[8] || '',
      status: (cols[9] as Status) || 'Not Reviewed',
      notes: cols[10] || '',
      bio: '',
      profilePhoto: '',
      platformUrl: '',
      recentContent: [],
    };
  });
}
