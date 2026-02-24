export type Platform = 'YouTube' | 'Instagram';

export type Niche =
  | 'Fashion'
  | 'Tech'
  | 'Fitness'
  | 'Food'
  | 'Gaming'
  | 'Beauty'
  | 'Education'
  | 'Travel'
  | 'Lifestyle'
  | 'Music';

export type Status = 'Not Reviewed' | 'Shortlisted' | 'Planned' | 'Contacted' | 'Confirmed' | 'Rejected';

export type Deliverable = 'Reel' | 'Post' | 'Video' | 'Story' | 'Carousel' | 'Short' | 'Live';

export interface Influencer {
  id: string;
  name: string;
  platform: Platform;
  niche: Niche;
  followers: number;
  avgViews: number;
  engagementRate: number;
  country: string;
  language: string;
  contactEmail: string;
  notes: string;
  status: Status;
  bio: string;
  profilePhoto: string;
  platformUrl: string;
  recentContent: string[];
}

export interface CampaignInfluencer {
  influencerId: string;
  deliverable: Deliverable;
  proposedCost: number;
  expectedViews: number;
  expectedEngagement: number;
  notes: string;
}

export interface Campaign {
  id: string;
  name: string;
  createdAt: string;
  influencers: CampaignInfluencer[];
}

export interface InfluencerSubmission {
  id: string;
  name: string;
  youtubeUrl: string;
  instagramUrl: string;
  niche: Niche;
  followers: number;
  avgViews: number;
  country: string;
  language: string;
  email: string;
  collaborationPreferences: string;
  costRange: string;
  bio: string;
  submittedAt: string;
  reviewed: boolean;
}

export const NICHES: Niche[] = [
  'Fashion', 'Tech', 'Fitness', 'Food', 'Gaming', 'Beauty', 'Education', 'Travel', 'Lifestyle', 'Music',
];

export const STATUSES: Status[] = ['Not Reviewed', 'Shortlisted', 'Planned', 'Contacted', 'Confirmed', 'Rejected'];

export const PLATFORMS: Platform[] = ['YouTube', 'Instagram'];

export const DELIVERABLES: Deliverable[] = ['Reel', 'Post', 'Video', 'Story', 'Carousel', 'Short', 'Live'];

export const COUNTRIES = [
  'India', 'United States', 'United Kingdom', 'Brazil', 'Germany', 'France', 'Japan', 'South Korea',
  'Australia', 'Canada', 'Mexico', 'Spain', 'Italy', 'Indonesia', 'Nigeria',
];

export const LANGUAGES = [
  'Hindi', 'English', 'Tamil', 'Telugu', 'Bengali', 'Marathi', 'Gujarati', 'Kannada',
  'Spanish', 'Portuguese', 'French', 'German', 'Japanese', 'Korean', 'Italian', 'Indonesian',
];

export interface Filters {
  platforms: Platform[];
  niches: Niche[];
  followersMin: number;
  followersMax: number;
  engagementMin: number;
  engagementMax: number;
  country: string;
  language: string;
  status: string;
  search: string;
}
