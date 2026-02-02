import { Article, CategorizedArticle, NewsCategory, Country } from '../types/news';

/**
 * Normalize NewsData.io article format to common format
 */
function normalizeArticle(article: Article): Article {
  return {
    ...article,
    source: article.source || {
      id: article.source_id || null,
      name: article.source_name || 'Unknown'
    },
    author: article.author || (article.creator && article.creator.length > 0 ? article.creator[0] : null),
    url: article.url || article.link,
    urlToImage: article.urlToImage || article.image_url || null,
    publishedAt: article.publishedAt || article.pubDate || new Date().toISOString(),
    content: article.content || null
  };
}

// Immigration-related keywords for filtering
const IMMIGRATION_KEYWORDS = [
  'visa', 'immigration', 'immigrant', 'work permit', 'student visa',
  'permanent residence', 'pr', 'citizenship', 'green card', 'h-1b',
  'h1b', 'skilled worker', 'work visa', 'tourist visa', 'passport',
  'deportation', 'asylum', 'refugee', 'border', 'migration',
  'residence permit', 'naturalization', 'travel document'
];

// Exclude keywords (political/crime/unrelated)
const EXCLUDE_KEYWORDS = [
  'murder', 'rape', 'terrorist', 'bombing', 'election',
  'campaign', 'political party', 'stock market', 'cryptocurrency',
  'bitcoin', 'nft', 'celebrity', 'entertainment'
];

// Category keywords
const CATEGORY_KEYWORDS = {
  [NewsCategory.IMMIGRATION_POLICY]: [
    'policy', 'law', 'regulation', 'reform', 'legislation',
    'bill', 'congress', 'parliament', 'government', 'executive order'
  ],
  [NewsCategory.STUDENT_VISAS]: [
    'student', 'university', 'college', 'study', 'f-1',
    'student visa', 'education', 'opt', 'cpt', 'international student'
  ],
  [NewsCategory.WORK_VISAS]: [
    'work', 'employment', 'job', 'h-1b', 'h1b', 'l-1',
    'work permit', 'labor', 'skilled worker', 'worker', 'employer'
  ],
  [NewsCategory.PR_CITIZENSHIP]: [
    'green card', 'permanent residence', 'pr', 'citizenship',
    'naturalization', 'permanent resident', 'citizen'
  ],
  [NewsCategory.ALERTS_DEADLINES]: [
    'deadline', 'alert', 'urgent', 'closing', 'expires',
    'last date', 'application closing', 'warning', 'reminder'
  ]
};

// Country keywords
const COUNTRY_KEYWORDS = {
  [Country.US]: ['usa', 'u.s.', 'united states', 'america', 'american'],
  [Country.CANADA]: ['canada', 'canadian', 'toronto', 'vancouver', 'ottawa'],
  [Country.UK]: ['uk', 'u.k.', 'united kingdom', 'britain', 'british', 'london']
};

/**
 * Check if article is relevant to immigration
 */
export function isRelevantArticle(article: Article): boolean {
  const text = `${article.title} ${article.description || ''}`.toLowerCase();
  
  // Only exclude obvious non-immigration content
  const hasExcludeKeyword = EXCLUDE_KEYWORDS.some(keyword => 
    text.includes(keyword.toLowerCase())
  );
  
  return !hasExcludeKeyword;
}

/**
 * Categorize article based on content
 */
export function categorizeArticle(article: Article): NewsCategory {
  const text = `${article.title} ${article.description || ''}`.toLowerCase();
  
  let maxScore = 0;
  let bestCategory = NewsCategory.OTHER;
  
  // Check each category and count matching keywords
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    const score = keywords.filter(keyword => 
      text.includes(keyword.toLowerCase())
    ).length;
    
    if (score > maxScore) {
      maxScore = score;
      bestCategory = category as NewsCategory;
    }
  }
  
  return bestCategory;
}

/**
 * Detect country from article content
 */
export function detectCountry(article: Article): Country {
  const text = `${article.title} ${article.description || ''} ${article.content || ''}`.toLowerCase();
  
  for (const [country, keywords] of Object.entries(COUNTRY_KEYWORDS)) {
    if (keywords.some(keyword => text.includes(keyword.toLowerCase()))) {
      return country as Country;
    }
  }
  
  return Country.UNKNOWN;
}

/**
 * Calculate relevance score (0-100)
 */
export function calculateRelevanceScore(article: Article): number {
  const text = `${article.title} ${article.description || ''}`.toLowerCase();
  let score = 0;
  
  // More immigration keywords = higher score
  const matchCount = IMMIGRATION_KEYWORDS.filter(keyword => 
    text.includes(keyword.toLowerCase())
  ).length;
  
  score = Math.min(matchCount * 15, 100);
  
  // Boost score if title contains immigration keyword
  if (IMMIGRATION_KEYWORDS.some(keyword => article.title.toLowerCase().includes(keyword))) {
    score = Math.min(score + 20, 100);
  }
  
  return score;
}

/**
 * Filter and categorize articles
 */
export function processArticles(articles: Article[]): CategorizedArticle[] {
  const normalized = articles.map(normalizeArticle);
  
  const processed: CategorizedArticle[] = normalized
    .filter(isRelevantArticle)
    .map(article => ({
      ...article,
      category: categorizeArticle(article),
      country: detectCountry(article),
      relevanceScore: calculateRelevanceScore(article)
    }));
  
  // Remove duplicates based on title similarity
  const unique = removeDuplicates(processed);
  
  // Sort by relevance score and date
  return unique.sort((a, b) => {
    // First by relevance score
    if (b.relevanceScore !== a.relevanceScore) {
      return b.relevanceScore - a.relevanceScore;
    }
    // Then by date (most recent first)
    const dateB = new Date(b.publishedAt || 0).getTime();
    const dateA = new Date(a.publishedAt || 0).getTime();
    return dateB - dateA;
  });
}

/**
 * Remove duplicate articles based on title similarity
 */
function removeDuplicates(articles: CategorizedArticle[]): CategorizedArticle[] {
  const seen = new Set<string>();
  const unique: CategorizedArticle[] = [];
  
  for (const article of articles) {
    // Create a normalized title for comparison
    const normalizedTitle = article.title
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .trim();
    
    if (!seen.has(normalizedTitle)) {
      seen.add(normalizedTitle);
      unique.push(article);
    }
  }
  
  return unique;
}

/**
 * Filter articles by country
 */
export function filterByCountry(
  articles: CategorizedArticle[],
  country: Country
): CategorizedArticle[] {
  if (country === Country.UNKNOWN) return articles;
  return articles.filter(article => article.country === country);
}

/**
 * Filter articles by category
 */
export function filterByCategory(
  articles: CategorizedArticle[],
  category: NewsCategory
): CategorizedArticle[] {
  return articles.filter(article => article.category === category);
}
