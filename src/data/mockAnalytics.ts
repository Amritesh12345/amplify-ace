// Generate deterministic mock analytics data for influencer profiles

export function generateFollowerGrowth(currentFollowers: number) {
  const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
  const data = [];
  let followers = Math.round(currentFollowers * 0.72);
  for (const month of months) {
    followers = Math.round(followers * (1 + 0.03 + Math.random() * 0.04));
    data.push({ month, followers });
  }
  data[data.length - 1].followers = currentFollowers;
  return data;
}

export function generateViewsPerPost(avgViews: number) {
  return Array.from({ length: 10 }, (_, i) => ({
    post: `Post ${i + 1}`,
    views: Math.round(avgViews * (0.6 + Math.random() * 0.8)),
  }));
}

export function generateEngagementTrend(engagementRate: number) {
  const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
  return months.map(month => ({
    month,
    rate: parseFloat((engagementRate * (0.8 + Math.random() * 0.4)).toFixed(1)),
  }));
}

export function generateAudienceData(country: string) {
  const countries: Record<string, { name: string; pct: number }[]> = {
    India: [
      { name: 'India', pct: 68 }, { name: 'United States', pct: 12 },
      { name: 'United Kingdom', pct: 7 }, { name: 'Canada', pct: 5 }, { name: 'Other', pct: 8 },
    ],
    'United States': [
      { name: 'United States', pct: 55 }, { name: 'United Kingdom', pct: 14 },
      { name: 'Canada', pct: 12 }, { name: 'Australia', pct: 8 }, { name: 'Other', pct: 11 },
    ],
  };
  return countries[country] || [
    { name: country, pct: 52 }, { name: 'United States', pct: 15 },
    { name: 'India', pct: 12 }, { name: 'United Kingdom', pct: 9 }, { name: 'Other', pct: 12 },
  ];
}

export const audienceGender = [
  { name: 'Male', value: 58, fill: 'hsl(var(--chart-1))' },
  { name: 'Female', value: 38, fill: 'hsl(var(--chart-2))' },
  { name: 'Other', value: 4, fill: 'hsl(var(--chart-3))' },
];

export const audienceAge = [
  { group: '13-17', pct: 8 },
  { group: '18-24', pct: 34 },
  { group: '25-34', pct: 32 },
  { group: '35-44', pct: 16 },
  { group: '45+', pct: 10 },
];

export function generateRecentPosts(recentContent: string[], avgViews: number) {
  const thumbs = [
    'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=300&h=200&fit=crop',
    'https://images.unsplash.com/photo-1526498460520-4c246339dccb?w=300&h=200&fit=crop',
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=300&h=200&fit=crop',
    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=300&h=200&fit=crop',
    'https://images.unsplash.com/photo-1542744094-24638eff58bb?w=300&h=200&fit=crop',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop',
  ];
  const titles = recentContent.length >= 6 ? recentContent : [
    ...recentContent,
    ...Array.from({ length: 6 - recentContent.length }, (_, i) => `Content ${i + 1}`),
  ];
  return titles.slice(0, 6).map((title, i) => {
    const views = Math.round(avgViews * (0.5 + Math.random() * 1));
    return {
      id: `post-${i}`,
      title,
      thumbnail: thumbs[i % thumbs.length],
      views,
      likes: Math.round(views * (0.03 + Math.random() * 0.05)),
      comments: Math.round(views * (0.002 + Math.random() * 0.005)),
      publishDate: new Date(Date.now() - (i * 7 + Math.random() * 5) * 86400000).toISOString(),
    };
  });
}

export function calculateCampaignFitScore(inf: { engagementRate: number; avgViews: number; followers: number; recentContent: string[] }): number {
  let score = 0;
  // Engagement (0-35)
  score += Math.min(35, inf.engagementRate * 4.5);
  // Avg views relative to followers (0-25)
  const viewRatio = inf.followers > 0 ? inf.avgViews / inf.followers : 0;
  score += Math.min(25, viewRatio * 100);
  // Follower base (0-20)
  if (inf.followers >= 1000000) score += 20;
  else if (inf.followers >= 500000) score += 16;
  else if (inf.followers >= 100000) score += 12;
  else if (inf.followers >= 10000) score += 8;
  else score += 4;
  // Content consistency (0-20)
  score += Math.min(20, inf.recentContent.length * 6.7);
  return Math.min(100, Math.round(score));
}
