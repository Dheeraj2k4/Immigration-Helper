import { motion } from 'framer-motion';
import { Search, User, Calendar, MessageSquare, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Footer } from '@/components/Footer';

export function Updates() {
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
          </div>
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area - Left Column */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* Featured News Card */}
              <article className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Featured Image */}
              <div className="w-full h-80 bg-gray-200 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 flex items-center justify-center">
                  <span className="text-gray-500 text-lg">Featured News Image</span>
                </div>
              </div>

              {/* Article Content */}
              <div className="p-8">
                {/* Metadata Row */}
                <div className="flex items-center space-x-6 mb-6 text-sm" style={{ color: '#111214' }}>
                  <div className="flex items-center space-x-2">
                    <User size={16} />
                    <span>By admin</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar size={16} />
                    <span>October 19, 2024</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MessageSquare size={16} />
                    <span>Comments (05)</span>
                  </div>
                </div>

                {/* Headline */}
                <h2 className="text-3xl font-bold text-black mb-4 leading-tight">
                  New Visa Policy Changes Announced for International Students
                </h2>

                {/* Summary */}
                <p className="text-lg leading-relaxed mb-6" style={{ color: '#727272' }}>
                  The latest updates to international student visa policies include streamlined application processes, 
                  extended validity periods, and new documentation requirements. These changes aim to make the visa 
                  application process more efficient and accessible for students worldwide.
                </p>

                {/* Learn More Button */}
                <Button 
                  className="bg-secondary hover:bg-secondary/90 text-white font-semibold px-6 py-3 rounded-lg flex items-center space-x-2"
                  style={{ backgroundColor: '#83CD20' }}
                >
                  <span>Learn More</span>
                  <ArrowRight size={18} />
                </Button>
              </div>
            </article>
            </motion.div>
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
                Popular Posts
              </h3>
              <div className="space-y-4">
                {/* Popular Post 1 */}
                <div className="flex space-x-3">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center">
                    <span className="text-xs text-gray-500">IMG</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-1">October 15, 2024</p>
                    <h4 className="text-sm font-medium text-black leading-tight">
                      Student Visa Processing Times Reduced by 30%
                    </h4>
                  </div>
                </div>

                {/* Popular Post 2 */}
                <div className="flex space-x-3">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center">
                    <span className="text-xs text-gray-500">IMG</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-1">October 12, 2024</p>
                    <h4 className="text-sm font-medium text-black leading-tight">
                      New Digital Visa Application Platform Launched
                    </h4>
                  </div>
                </div>

                {/* Popular Post 3 */}
                <div className="flex space-x-3">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center">
                    <span className="text-xs text-gray-500">IMG</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-1">October 10, 2024</p>
                    <h4 className="text-sm font-medium text-black leading-tight">
                      Work Visa Requirements Updated for Tech Professionals
                    </h4>
                  </div>
                </div>
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