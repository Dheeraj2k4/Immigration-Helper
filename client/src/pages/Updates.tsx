import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Calendar, ExternalLink, Loader2, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Footer } from '@/components/Footer';
import { useImmigrationNews, useTopImmigrationHeadlines, NewsCategory, Country } from '@/hooks/useNews';

export function Updates() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<Country | undefined>();
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory | undefined>();
  
  const { articles, loading, error } = useImmigrationNews(1, 10, selectedCountry, selectedCategory);
  const { articles: topHeadlines } = useTopImmigrationHeadlines(3);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const featuredArticle = articles[0];
  const otherArticles = articles.slice(1);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-black mb-2">Latest Updates</h1>
            <p className="text-gray-600">Stay informed with the latest visa policy and regulation updates</p>
            
            {/* Filters */}
            <div className="flex flex-wrap gap-4 mt-6">
              <div className="flex items-center gap-2">
                <Filter size={18} className="text-gray-600" />
                <select
                  value={selectedCountry || ''}
                  onChange={(e) => setSelectedCountry(e.target.value ? e.target.value as Country : undefined)}
                  className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">All Countries</option>
                  <option value={Country.US}>United States</option>
                  <option value={Country.CANADA}>Canada</option>
                  <option value={Country.UK}>United Kingdom</option>
                </select>
              </div>
              
              <select
                value={selectedCategory || ''}
                onChange={(e) => setSelectedCategory(e.target.value ? e.target.value as NewsCategory : undefined)}
                className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">All Categories</option>
                <option value={NewsCategory.IMMIGRATION_POLICY}>Immigration Policy</option>
                <option value={NewsCategory.STUDENT_VISAS}>Student Visas</option>
                <option value={NewsCategory.WORK_VISAS}>Work Visas</option>
                <option value={NewsCategory.PR_CITIZENSHIP}>PR & Citizenship</option>
                <option value={NewsCategory.ALERTS_DEADLINES}>Alerts & Deadlines</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area - Left Column */}
          <div className="lg:col-span-2">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <p className="text-red-600">{error}</p>
              </div>
            ) : !featuredArticle ? (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                <p className="text-gray-600">No news articles found</p>
              </div>
            ) : (
              <>
                {/* Featured News Card */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <article className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
                    {/* Featured Image */}
                    <div className="w-full h-80 bg-gray-200 relative overflow-hidden">
                      {featuredArticle.urlToImage ? (
                        <img
                          src={featuredArticle.urlToImage}
                          alt={featuredArticle.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 flex items-center justify-center">
                          <span className="text-gray-500 text-lg">Immigration News</span>
                        </div>
                      )}
                    </div>

                    {/* Article Content */}
                    <div className="p-8">
                      {/* Metadata Row */}
                      <div className="flex flex-wrap items-center gap-4 mb-6 text-sm">
                        {featuredArticle.source.name && (
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-700">{featuredArticle.source.name}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Calendar size={16} />
                          <span>{formatDate(featuredArticle.publishedAt)}</span>
                        </div>
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          {featuredArticle.category}
                        </span>
                        {featuredArticle.country !== Country.UNKNOWN && (
                          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                            {featuredArticle.country}
                          </span>
                        )}
                      </div>

                      {/* Headline */}
                      <h2 className="text-3xl font-bold text-black mb-4 leading-tight">
                        {featuredArticle.title}
                      </h2>

                      {/* Summary */}
                      <p className="text-lg leading-relaxed mb-6" style={{ color: '#727272' }}>
                        {featuredArticle.description || featuredArticle.content?.substring(0, 200) || 'No description available'}
                      </p>

                      {/* Learn More Button */}
                      <Button
                        onClick={() => window.open(featuredArticle.url, '_blank')}
                        className="bg-secondary hover:bg-secondary/90 text-white font-semibold px-6 py-3 rounded-lg flex items-center space-x-2"
                        style={{ backgroundColor: '#83CD20' }}
                      >
                        <span>Read Full Article</span>
                        <ExternalLink size={18} />
                      </Button>
                    </div>
                  </article>
                </motion.div>

                {/* Other Articles List */}
                {otherArticles.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-black mb-4">More Updates</h3>
                    {otherArticles.map((article, index) => (
                      <motion.article
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 * index }}
                        className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                        onClick={() => window.open(article.url, '_blank')}
                      >
                        <div className="flex gap-4 p-4">
                          {article.urlToImage && (
                            <div className="w-32 h-24 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                              <img
                                src={article.urlToImage}
                                alt={article.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="flex gap-2 mb-2">
                              <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                                {article.category}
                              </span>
                              {article.country !== Country.UNKNOWN && (
                                <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded text-xs font-medium">
                                  {article.country}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500 mb-1">{formatDate(article.publishedAt)}</p>
                            <h4 className="text-lg font-semibold text-black mb-2 leading-tight">
                              {article.title}
                            </h4>
                            {article.description && (
                              <p className="text-sm text-gray-600 line-clamp-2">
                                {article.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </motion.article>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Sidebar - Right Column */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="space-y-6">
            {/* Search Section */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-black mb-4">Search Here</h3>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search updates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-12 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                <Search 
                  size={20} 
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
              </div>
            </div>

            {/* Popular Posts Section */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold mb-6" style={{ color: '#034833' }}>
                Top Headlines
              </h3>
              <div className="space-y-4">
                {topHeadlines.map((article, index) => (
                  <div
                    key={index}
                    className="flex space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                    onClick={() => window.open(article.url, '_blank')}
                  >
                    {article.urlToImage ? (
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                        <img
                          src={article.urlToImage}
                          alt={article.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center">
                        <span className="text-xs text-gray-500">IMG</span>
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 mb-1">{formatDate(article.publishedAt)}</p>
                      <h4 className="text-sm font-medium text-black leading-tight line-clamp-2">
                        {article.title}
                      </h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Categories Section */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-black mb-6">Categories</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                  <span className="text-gray-700">Student Visas</span>
                  <span className="text-sm text-gray-500">(12)</span>
                </div>
                <div className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                  <span className="text-gray-700">Work Permits</span>
                  <span className="text-sm text-gray-500">(8)</span>
                </div>
                <div className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                  <span className="text-gray-700">Travel Documents</span>
                  <span className="text-sm text-gray-500">(6)</span>
                </div>
                <div className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                  <span className="text-gray-700">Policy Changes</span>
                  <span className="text-sm text-gray-500">(15)</span>
                </div>
                <div className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                  <span className="text-gray-700">Application Tips</span>
                  <span className="text-sm text-gray-500">(9)</span>
                </div>
                <div className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                  <span className="text-gray-700">Country Updates</span>
                  <span className="text-sm text-gray-500">(11)</span>
                </div>
              </div>
            </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}