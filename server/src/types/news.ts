export interface Article {
  source_id?: string;
  source_name?: string;
  source_url?: string;
  source_icon?: string;
  source_priority?: number;
  creator?: string[] | null;
  title: string;
  link: string;
  description: string | null;
  content?: string | null;
  pubDate?: string;
  image_url?: string | null;
  video_url?: string | null;
  // Backwards compatibility with old format
  source?: {
    id: string | null;
    name: string;
  };
  author?: string | null;
  url?: string;
  urlToImage?: string | null;
  publishedAt?: string;
}

export interface NewsResponse {
  status: string;
  totalResults: number;
  articles: Article[];
}

export interface NewsApiResponse {
  status: 'success' | 'error';
  totalResults?: number;
  results?: Article[];
  nextPage?: string;
  // Legacy fields
  code?: string;
  message?: string;
  articles?: Article[];
}

export enum NewsCategory {
  IMMIGRATION_POLICY = 'Immigration Policy',
  STUDENT_VISAS = 'Student Visas',
  WORK_VISAS = 'Work Visas',
  PR_CITIZENSHIP = 'PR & Citizenship',
  ALERTS_DEADLINES = 'Alerts & Deadlines',
  OTHER = 'Other'
}

export enum Country {
  US = 'US',
  CANADA = 'Canada',
  UK = 'UK',
  UNKNOWN = 'Unknown'
}

export interface CategorizedArticle extends Article {
  category: NewsCategory;
  country: Country;
  relevanceScore: number;
}
