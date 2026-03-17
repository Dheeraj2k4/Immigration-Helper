import axios, { AxiosError } from 'axios';
import { NewsApiResponse, Article, CategorizedArticle, NewsCategory, Country } from '../types/news';
import { processArticles, filterByCountry, filterByCategory } from '../utils/newsFilter';

const NEWS_API_KEY = 'pub_590d52cc4630485aaeef2581a404ba93';
const NEWS_API_BASE_URL = 'https://newsdata.io/api/1';

interface NewsServiceOptions {
  page?: string;
  pageSize?: number;
  country?: Country;
  category?: NewsCategory;
}

/**
 * Fetches immigration-related articles from News API
 * Articles are filtered for visa, passport, and immigration news from the last month
 */
export const newsService = {
  /**
   * Get immigration, visa, and passport related articles with filtering and categorization
   */
  async getImmigrationNews(options: NewsServiceOptions = {}): Promise<CategorizedArticle[]> {
    try {
      const {
        pageSize = 50,
        country,
        category
      } = options;

      // Simpler search query for immigration-related articles (NewsData.io has limits on query complexity)
      // Using OR logic with fewer keywords for better results
      const searchQuery = 'visa OR immigration OR passport';

      const response = await axios.get<NewsApiResponse>(
        `${NEWS_API_BASE_URL}/news`,
        {
          params: {
            apikey: NEWS_API_KEY,
            q: searchQuery,
            language: 'en',
            size: Math.min(pageSize, 50),
            category: 'politics,domestic' // Add categories to get more results
            // Note: page parameter only used with nextPage token from previous response
          }
        }
      );

      console.log('NewsData API Response:', {
        status: response.data.status,
        resultsCount: response.data.results?.length || 0,
        hasResults: !!response.data.results,
        totalResults: response.data.totalResults,
        nextPage: response.data.nextPage,
        fullResponse: JSON.stringify(response.data).substring(0, 500)
      });

      if (response.data.status !== 'success') {
        console.error('API returned non-success status:', response.data);
        throw new Error(response.data.message || 'Failed to fetch news');
      }

      if (!response.data.results || response.data.results.length === 0) {
        console.warn('⚠️ No results from NewsData API. Possible reasons:');
        console.warn('  1. Free tier daily limit reached (200 requests/day)');
        console.warn('  2. No articles matching query in last 48 hours');
        console.warn('  3. Query too restrictive');
        console.warn('  Check: https://newsdata.io/dashboard for API usage');
        return [];
      }

      // Process articles: filter, categorize, deduplicate, and sort
      console.log('About to process articles, count:', response.data.results.length);
      let processed: CategorizedArticle[];
      try {
        processed = processArticles(response.data.results || []);
        console.log('Successfully processed articles, count:', processed.length);
      } catch (processError) {
        console.error('Error processing articles:', processError);
        throw new Error(`Failed to process articles: ${processError instanceof Error ? processError.message : 'Unknown error'}`);
      }

      // Apply country filter if specified
      if (country) {
        processed = filterByCountry(processed, country);
      }

      // Apply category filter if specified
      if (category) {
        processed = filterByCategory(processed, category);
      }

      // Return requested page size
      const startIndex = 0;
      const endIndex = Math.min(pageSize, processed.length);
      return processed.slice(startIndex, endIndex);
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('News API Error Details:', {
        message: axiosError.message,
        response: axiosError.response?.data,
        status: axiosError.response?.status
      });
      throw new Error(`Failed to fetch immigration news: ${axiosError.message}`);
    }
  },

  /**
   * Search for specific immigration-related articles
   */
  async searchImmigrationNews(
    searchTerm: string,
    options: NewsServiceOptions = {}
  ): Promise<Article[]> {
    try {
      const {
        pageSize = 50,
        country,
        category
      } = options;

      // Simpler combined search query with OR logic
      const query = `${searchTerm} OR visa OR immigration`;

      const response = await axios.get<NewsApiResponse>(
        `${NEWS_API_BASE_URL}/news`,
        {
          params: {
            apikey: NEWS_API_KEY,
            q: query,
            language: 'en',
            size: Math.min(pageSize, 50),
            category: 'politics,domestic'
            // Note: page parameter only used with nextPage token from previous response
          }
        }
      );

      if (response.data.status !== 'success') {
        throw new Error(response.data.message || 'Failed to fetch search results');
      }

      // Process and filter articles
      let processed = processArticles(response.data.results || []);

      if (country) {
        processed = filterByCountry(processed, country);
      }

      if (category) {
        processed = filterByCategory(processed, category);
      }

      return processed.slice(0, Math.min(pageSize, processed.length));
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('News API Error:', axiosError.message);
      throw new Error(`Failed to search immigration news: ${axiosError.message}`);
    }
  },

  /**
   * Get top immigration headlines
   */
  async getTopImmigrationHeadlines(options: NewsServiceOptions = {}): Promise<Article[]> {
    try {
      const {
        pageSize = 20,
        country,
        category
      } = options;

      const response = await axios.get<NewsApiResponse>(
        `${NEWS_API_BASE_URL}/news`,
        {
          params: {
            apikey: NEWS_API_KEY,
            q: 'visa OR immigration OR passport',
            language: 'en',
            size: Math.min(pageSize, 50),
            category: 'politics,domestic'
          }
        }
      );

      if (response.data.status !== 'success') {
        throw new Error(response.data.message || 'Failed to fetch headlines');
      }

      // Process and filter
      let processed = processArticles(response.data.results || []);

      if (country) {
        processed = filterByCountry(processed, country);
      }

      if (category) {
        processed = filterByCategory(processed, category);
      }

      return processed.slice(0, Math.min(pageSize, processed.length));
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('News API Error:', axiosError.message);
      throw new Error(`Failed to fetch immigration headlines: ${axiosError.message}`);
    }
  }
};
