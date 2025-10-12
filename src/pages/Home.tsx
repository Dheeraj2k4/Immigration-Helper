import { motion } from 'framer-motion';
import { ArrowRight, FileText, MessageSquare, CheckSquare, Users, Globe, Phone, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Footer } from '@/components/Footer';

export function Home() {
  return (
    <div 
      className="min-h-screen" 
      style={{ backgroundColor: '#F1F5EB' }}
    >
      {/* Hero Section */}
      <section className="relative bg-primary overflow-hidden" style={{ backgroundColor: '#034833' }}>
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70"></div>
        <div className="container mx-auto px-4 py-20 lg:py-32 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight mb-8">
                Visa Made Easy,
                <br />
                Dreams Made Possible
              </h1>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button 
                  size="lg"
                  className="bg-secondary hover:bg-secondary/90 text-white px-8 py-4 rounded-full text-lg font-semibold"
                  style={{ backgroundColor: '#83CD20' }}
                >
                  Read More
                  <ArrowRight size={20} className="ml-2" />
                </Button>
              </div>
            </motion.div>

            {/* Right Content - Abstract Illustration */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="relative">
                {/* Large circular green shape */}
                <div 
                  className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-20"
                  style={{ backgroundColor: '#83CD20' }}
                ></div>
                {/* Abstract illustration placeholder */}
                <div className="relative z-10 w-full h-96 bg-white/10 rounded-3xl flex items-center justify-center backdrop-blur-sm">
                  <span className="text-white/60 text-lg font-medium">Visa Journey Illustration</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        {/* Curved bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L1440 120L1440 0C1140 80 300 80 0 0V120Z" fill="#F1F5EB"/>
          </svg>
        </div>
      </section>

      {/* Service Highlights Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Visa Guide Card */}
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: '#034833' }}>
                <FileText className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Visa Guide</h3>
              <p className="text-gray-600">Comprehensive step-by-step guidance for your visa application process with expert insights.</p>
            </div>

            {/* AI Interview Card */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: '#83CD20' }}>
                <MessageSquare className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">AI Interview Practice</h3>
              <p className="text-gray-600">Practice visa interviews with our advanced AI simulator and boost your confidence.</p>
            </div>

            {/* Checklist Card */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: '#034833' }}>
                <CheckSquare className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Personal Checklist</h3>
              <p className="text-gray-600">Track your progress with personalized visa checklists tailored to your destination.</p>
            </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About / Why Choose Us Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left - Image placeholder */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-full h-96 bg-gray-200 rounded-3xl flex items-center justify-center">
                <span className="text-gray-500 text-lg">Success Stories Image</span>
              </div>
            </motion.div>

            {/* Right - Content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-block bg-secondary px-4 py-2 rounded-full text-white font-semibold mb-6" style={{ backgroundColor: '#83CD20' }}>
                10+ Years of Experience
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Where Visa Dreams Meet Expert Guidance
              </h2>
              <p className="text-gray-600 text-lg mb-8">
                We've helped thousands of applicants successfully navigate the visa process with our comprehensive platform and expert support.
              </p>

              {/* Feature boxes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#034833' }}>
                    <Globe className="text-white" size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Global Visa Support</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• 50+ Countries Covered</li>
                      <li>• Expert Documentation</li>
                      <li>• Success Rate 95%</li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#83CD20' }}>
                    <Users className="text-white" size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Expert Assistance</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• 24/7 Support Available</li>
                      <li>• Immigration Experts</li>
                      <li>• Personalized Guidance</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-full" style={{ backgroundColor: '#034833' }}>
                  Read More
                  <ArrowRight size={18} className="ml-2" />
                </Button>
                <Button size="lg" variant="outline" className="px-8 py-3 rounded-full">
                  <Phone size={18} className="mr-2" />
                  +1 (555) 123-4567
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Company logos */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mt-20 pt-12 border-t border-gray-200">
              <div className="flex justify-center items-center space-x-12 opacity-60">
                <div className="text-2xl font-bold text-gray-400">Segment</div>
                <div className="text-2xl font-bold text-gray-400">Splunk</div>
                <div className="text-2xl font-bold text-gray-400">HubSpot</div>
                <div className="text-2xl font-bold text-gray-400">Asana</div>
                <div className="text-2xl font-bold text-gray-400">Airtasker</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Our Services Carousel Section */}
      <section className="py-20 bg-primary" style={{ backgroundColor: '#034833' }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Making Visa Dreams Around World Reality
            </h2>
            <p className="text-white/80 text-lg">Explore our comprehensive visa services</p>
          </div>

          <div className="relative">
            {/* Carousel navigation */}
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10">
              <Button size="icon" variant="outline" className="rounded-full bg-white">
                <ChevronLeft size={20} />
              </Button>
            </div>
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10">
              <Button size="icon" variant="outline" className="rounded-full bg-white">
                <ChevronRight size={20} />
              </Button>
            </div>

            {/* Carousel cards */}
            <div className="flex space-x-6 overflow-x-auto px-12">
              {[
                { title: "Student Visa", desc: "Academic journey guidance" },
                { title: "Work Visa", desc: "Professional opportunities" },
                { title: "Tourist Visa", desc: "Travel and exploration" },
                { title: "Business Visa", desc: "Corporate travel solutions" },
                { title: "Family Visa", desc: "Reunite with loved ones" }
              ].map((item, index) => (
                <div key={index} className="min-w-80 bg-white rounded-2xl p-6 shadow-lg">
                  <div className="w-full h-48 bg-gray-200 rounded-xl mb-4 flex items-center justify-center">
                    <span className="text-gray-500">{item.title} Image</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 mb-4">{item.desc}</p>
                  <Button className="bg-secondary hover:bg-secondary/90 text-white rounded-full w-full" style={{ backgroundColor: '#83CD20' }}>
                    Apply Now
                    <ArrowRight size={16} className="ml-2" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* Available Countries Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900">
              Popular Destination Countries
            </h2>
            <div>
              <Button variant="outline" className="rounded-full">
                View More
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { country: "Canada", items: ["Express Entry", "Study Permits", "Work Permits"] },
              { country: "Australia", items: ["Skilled Migration", "Student Visas", "Working Holiday"] },
              { country: "United Kingdom", items: ["Tier 2 Visas", "Student Routes", "Family Visas"] },
              { country: "United States", items: ["H1B Visas", "F1 Student", "Tourist B1/B2"] }
            ].map((country, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-2xl p-6"
              >
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-6 text-2xl" style={{ backgroundColor: '#83CD20' }}>
                  🌍
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{country.country}</h3>
                <ul className="space-y-2">
                  {country.items.map((item, idx) => (
                    <li key={idx} className="text-gray-600 flex items-center">
                      <span className="w-2 h-2 bg-primary rounded-full mr-3" style={{ backgroundColor: '#034833' }}></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}