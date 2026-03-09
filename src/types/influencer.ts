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

export interface CampaignDeliverable {
  type: Deliverable;
  quantity: number;
  costPerUnit: number;
}

export interface CampaignInfluencer {
  influencerId: string;
  deliverables: CampaignDeliverable[];
  status: 'Planned' | 'Contacted' | 'Confirmed';
  postDate: string;
  notes: string;
}

export type CampaignStatus = 'Draft' | 'Planning' | 'Outreach' | 'Live' | 'Completed';

export const CAMPAIGN_STATUSES: CampaignStatus[] = ['Draft', 'Planning', 'Outreach', 'Live', 'Completed'];

export interface CampaignBrief {
  objective: string;
  contentGuidelines: string;
  hashtags: string;
  postingWindow: string;
}

export interface Campaign {
  id: string;
  name: string;
  createdAt: string;
  status: CampaignStatus;
  brief: CampaignBrief;
  influencers: CampaignInfluencer[];
}

export type SubmissionType = 'creator' | 'agency';

export type PrimaryPlatform = 'YouTube' | 'Instagram' | 'Both';

export type CollaborationFormat = 'Reel' | 'Post' | 'Story' | 'Video' | 'Shorts' | 'Carousel' | 'Live';

export type PriceRange =
  | 'Under ₹5,000'
  | '₹5,000 – ₹15,000'
  | '₹15,000 – ₹50,000'
  | '₹50,000 – ₹1,00,000'
  | '₹1,00,000 – ₹3,00,000'
  | '₹3,00,000+';

export const PRICE_RANGES: PriceRange[] = [
  'Under ₹5,000', '₹5,000 – ₹15,000', '₹15,000 – ₹50,000',
  '₹50,000 – ₹1,00,000', '₹1,00,000 – ₹3,00,000', '₹3,00,000+',
];

export const COLLABORATION_FORMATS: CollaborationFormat[] = [
  'Reel', 'Post', 'Story', 'Video', 'Shorts', 'Carousel', 'Live',
];

export const PRIMARY_PLATFORMS: PrimaryPlatform[] = ['YouTube', 'Instagram', 'Both'];

export interface InfluencerSubmission {
  id: string;
  type: 'creator';
  name: string;
  primaryPlatform: PrimaryPlatform;
  youtubeUrl: string;
  instagramUrl: string;
  niches: Niche[];
  followers: number;
  avgViews: number;
  engagementRate: number;
  country: string;
  audienceCountry: string;
  language: string;
  email: string;
  phone: string;
  collaborationFormats: CollaborationFormat[];
  priceRange: PriceRange;
  bio: string;
  consentContact: boolean;
  submittedAt: string;
  reviewed: boolean;
}

export interface AgencySubmission {
  id: string;
  type: 'agency';
  agencyName: string;
  website: string;
  country: string;
  primaryMarkets: string;
  nichesCovered: Niche[];
  creatorCount: string;
  platformsCovered: PrimaryPlatform;
  contactPerson: string;
  contactEmail: string;
  phone: string;
  notableBrands: string;
  rosterLink: string;
  notes: string;
  consentContact: boolean;
  submittedAt: string;
  reviewed: boolean;
}

export type AnySubmission = InfluencerSubmission | AgencySubmission;

export const NICHES: Niche[] = [
  'Fashion', 'Tech', 'Fitness', 'Food', 'Gaming', 'Beauty', 'Education', 'Travel', 'Lifestyle', 'Music',
];

export const CREATOR_COUNT_OPTIONS = ['1–10', '11–50', '51–200', '200+'];

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
