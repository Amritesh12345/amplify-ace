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

export type Status = 'Not Reviewed' | 'Shortlisted' | 'Contacted' | 'Rejected';

export interface Influencer {
  id: string;
  name: string;
  platform: Platform;
  niche: Niche;
  followers: number;
  avgViews: number; // avg views for YT, avg reach for IG
  engagementRate: number; // percentage
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

export const NICHES: Niche[] = [
  'Fashion', 'Tech', 'Fitness', 'Food', 'Gaming', 'Beauty', 'Education', 'Travel', 'Lifestyle', 'Music',
];

export const STATUSES: Status[] = ['Not Reviewed', 'Shortlisted', 'Contacted', 'Rejected'];

export const PLATFORMS: Platform[] = ['YouTube', 'Instagram'];

export const COUNTRIES = [
  'United States', 'United Kingdom', 'India', 'Brazil', 'Germany', 'France', 'Japan', 'South Korea',
  'Australia', 'Canada', 'Mexico', 'Spain', 'Italy', 'Indonesia', 'Nigeria',
];

export const LANGUAGES = [
  'English', 'Spanish', 'Portuguese', 'Hindi', 'French', 'German', 'Japanese', 'Korean', 'Italian', 'Indonesian',
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
