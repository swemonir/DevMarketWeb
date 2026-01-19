export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  verified: boolean;
  role: 'user' | 'admin' | 'buyer' | 'seller';
  interests?: string[];
}
export interface Project {
  _id: string;
  basicInfo: {
    title: string;
    description: string;
    category: string;
    tags: string[];
  };
  platform: {
    type: string;
  };
  marketplace: {
    price: number;
    soldTo?: string | null;
    soldAt?: string | null;
    isForSale: boolean;
    deliveryTime?: number; // Added as it was in previous request
  };
  metadata: {
    submissionDate: string;
    status: string;
    rejectionReason?: string | null;
    reviewedAt?: string | null;
    version: string;
  };
  media: {
    thumbnail: string | null;
    screenshots: string[];
  };
  owner: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  reviewedBy?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectSubmission {
  basicInfo: {
    title: string;
    description: string;
    category: string;
    tags: string[];
  };
  platform: {
    type: string;
    urls: {
      website?: string;
      appStore?: string;
      playStore?: string;
    };
  };
  marketplace: {
    isForSale: boolean;
    price: number;
    contact: {
      email: string;
      whatsapp?: string;
    };
  };
  media?: {
    thumbnail?: string | null;
    screenshots?: string[];
  };
}
export interface MarketplaceItem {
  _id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  deliveryTime?: number;
  owner: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  status: string;
  media: string[];
  isForSale: boolean;
  createdAt: string;
  updatedAt: string;
  sellerVerified?: boolean; // Keep for UI compatibility if needed
}

export interface MarketplaceResponse {
  success: boolean;
  count: number;
  total: number;
  totalPages: number;
  currentPage: number;
  data: MarketplaceItem[];
}

export interface DiscoverResponse {
  success: boolean;
  count: number;
  total: number;
  totalPages: number;
  currentPage: number;
  data: Project[];
}

export type AuthMode = 'login' | 'signup';