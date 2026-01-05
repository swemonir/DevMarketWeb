export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  verified: boolean;
  role: 'user' | 'admin';
}
export interface Project {
  id: string;
  title: string;
  description: string;
  fullDescription?: string;
  thumbnail: string;
  images?: string[];
  category: 'AI Tools' | 'Productivity' | 'Social' | 'Entertainment' | 'Education';
  profession: 'Developer' | 'Designer' | 'Student' | 'Marketer' | 'Freelancer';
  platform: 'Web' | 'Mobile';
  tags: string[];
  status: 'Draft' | 'Pending' | 'Approved';
  verified: boolean;
  websiteUrl?: string;
  appStoreUrl?: string;
  playStoreUrl?: string;
  authorId: string;
  authorName: string;
  createdAt: string;
}
export interface MarketplaceItem extends Project {
  price: number;
  currency: string;
  sellerVerified: boolean;
  contactEmail?: string;
  whatsapp?: string;
  type: 'Web App' | 'Mobile App' | 'Source Code';
}
export type AuthMode = 'login' | 'signup';