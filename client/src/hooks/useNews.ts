import { useState, useEffect, useMemo, useCallback } from 'react';

export const NewsCategory = {
  IMMIGRATION_POLICY: 'Immigration Policy',
  STUDENT_VISAS: 'Student Visas',
  WORK_VISAS: 'Work Visas',
  PR_CITIZENSHIP: 'PR & Citizenship',
  ALERTS_DEADLINES: 'Alerts & Deadlines',
  OTHER: 'Other'
} as const;

export type NewsCategory = typeof NewsCategory[keyof typeof NewsCategory];

export const Country = {
  US: 'US',
  CANADA: 'Canada',
  UK: 'UK',
  UNKNOWN: 'Unknown'
} as const;

export type Country = typeof Country[keyof typeof Country];

export interface Article {
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
  category: NewsCategory;
  country: Country;
  relevanceScore: number;
}

export interface UseNewsResult {
  articles: Article[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

// Simple cache with 5 minute expiry
const cache = new Map<string, { data: Article[]; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

function getCacheKey(endpoint: string, params: Record<string, any>): string {
  return `${endpoint}_${JSON.stringify(params)}`;
}

function getFromCache(key: string): Article[] | null {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  cache.delete(key);
  return null;
}

function setCache(key: string, data: Article[]): void {
  cache.set(key, { data, timestamp: Date.now() });
}

/**
 * Hook to fetch immigration-related news articles with optional filtering
 */
export const useImmigrationNews = (
  page: number = 1, 
  pageSize: number = 20,
  country?: Country,
  category?: NewsCategory
): UseNewsResult => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  const cacheKey = useMemo(() => 
    getCacheKey('immigration', { page, pageSize, country, category }),
    [page, pageSize, country, category]
  );

  useEffect(() => {
    const fetchNews = async () => {
      // Check cache first
      const cached = getFromCache(cacheKey);
      if (cached) {
        setArticles(cached);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams({
          page: page.toString(),
          pageSize: pageSize.toString(),
          sortBy: 'publishedAt'
        });

        if (country) params.append('country', country);
        if (category) params.append('category', category);

        const response = await fetch(`/api/news/immigration?${params}`);

        if (!response.ok) {
          throw new Error('Failed to fetch news');
        }

        const data = await response.json();
        const fetchedArticles = data.data.articles || [];
        
        setArticles(fetchedArticles);
        setCache(cacheKey, fetchedArticles);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [page, pageSize, country, category, cacheKey, refetchTrigger]);

  const refetch = () => setRefetchTrigger(prev => prev + 1);

  return { articles, loading, error, refetch };
};

/**
 * Hook to search immigration-related news
 */
export const useSearchImmigrationNews = (searchQuery: string, page: number = 1): UseNewsResult => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setArticles([]);
      setLoading(false);
      return;
    }

    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `/api/news/search?q=${encodeURIComponent(searchQuery)}&page=${page}&sortBy=publishedAt`
        );

        if (!response.ok) {
          throw new Error('Failed to search news');
        }

        const data = await response.json();
        setArticles(data.data.articles || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [searchQuery, page]);

  const refetch = useCallback(() => {
    setLoading(true);
    setError(null);
    
    fetch(`/api/news/search?q=${encodeURIComponent(searchQuery)}&page=${page}&sortBy=publishedAt`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to search news');
        }
        return response.json();
      })
      .then(data => {
        setArticles(data.data.articles || []);
        setLoading(false);
      })
      .catch(err => {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setArticles([]);
        setLoading(false);
      });
  }, [searchQuery, page]);

  return { articles, loading, error, refetch };
};

/**
 * Hook to fetch top immigration headlines
 */
export const useTopImmigrationHeadlines = (
  pageSize: number = 10,
  country?: Country,
  category?: NewsCategory
): UseNewsResult => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  const cacheKey = useMemo(() => 
    getCacheKey('headlines', { pageSize, country, category }),
    [pageSize, country, category]
  );

  useEffect(() => {
    const fetchHeadlines = async () => {
      const cached = getFromCache(cacheKey);
      if (cached) {
        setArticles(cached);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams({ pageSize: pageSize.toString() });
        if (country) params.append('country', country);
        if (category) params.append('category', category);

        const response = await fetch(`/api/news/top-headlines?${params}`);

        if (!response.ok) {
          throw new Error('Failed to fetch headlines');
        }

        const data = await response.json();
        const fetchedArticles = data.data.articles || [];
        
        setArticles(fetchedArticles);
        setCache(cacheKey, fetchedArticles);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHeadlines();
  }, [pageSize, country, category, cacheKey, refetchTrigger]);

  const refetch = () => setRefetchTrigger(prev => prev + 1);

  return { articles, loading, error, refetch };
};
