import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, FileText, MessageSquare, CheckSquare, Users, Globe, Phone, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Footer } from '@/components/Footer';
import canadaImg from '@/assets/ca.png';
import australiaImg from '@/assets/aus.png';
import ukImg from '@/assets/uk.png';
import usaImg from '@/assets/usa.png';
import studentVisaImg from '@/assets/stu_visa.jpg';
import workVisaImg from '@/assets/work_visa.jpg';
import touristVisaImg from '@/assets/tourist_visa.jpg';
import sustainableImg from '@/assets/sustainable.png';

export function Home() {
  const navigate = useNavigate();
  
  const scrollToNextSection = () => {
    const nextSection = document.querySelector('section:nth-of-type(2)');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
  
  const handleApplyNow = (visaType: string) => {
    navigate('/checklist', { state: { visaType } });
  };

  return (
    <div 
      className="min-h-screen" 
      style={{ backgroundColor: '#F1F5EB' }}
    >
      {/* Hero Section */}
      <section className="relative bg-primary overflow-hidden" style={{ backgroundColor: '#034833' }}>
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70"></div>
        <div className="container mx-auto px-4 py-20 lg:py-32 relative z-10">
          <div className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto">
            {/* Centered Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight mb-8">
                Visa Made Easy,
                <br />
                Dreams Made Possible
              </h1>
              <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center">
                <Button 
                  size="lg"
                  onClick={scrollToNextSection}
                  className="bg-secondary hover:bg-secondary/90 text-white px-8 py-4 rounded-full text-lg font-semibold group"
                  style={{ backgroundColor: '#83CD20' }}
                >
                  Get Started Today
                  <ChevronDown size={20} className="ml-2 group-hover:animate-bounce" />
                </Button>
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
      <section className="py-20 rounded-3xl mx-4 my-8">
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

      {/* Available Countries Section */}
      <section className="py-20 bg-white rounded-3xl mx-4 my-8">
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
              { country: "Canada", items: ["Express Entry", "Study Permits", "Work Permits"], image: canadaImg },
              { country: "Australia", items: ["Skilled Migration", "Student Visas", "Working Holiday"], image: australiaImg },
              { country: "United Kingdom", items: ["Tier 2 Visas", "Student Routes", "Family Visas"], image: ukImg },
              { country: "United States", items: ["H1B Visas", "F1 Student", "Tourist B1/B2"], image: usaImg }
            ].map((country, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-2xl p-6"
              >
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-6 overflow-hidden">
                  <img src={country.image} alt={country.country} className="w-full h-full object-cover" />
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

      {/* Our Services Carousel Section */}
      <section className="py-20 bg-primary rounded-3xl mx-4 my-8" style={{ backgroundColor: '#034833' }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Making Visa Dreams Around World Reality
            </h2>
            <p className="text-white/80 text-lg">Explore our comprehensive visa services</p>
          </div>

          <div className="relative">
            {/* Carousel cards */}
            <div className="flex justify-center space-x-6 flex-wrap gap-6">
              {[
                { title: "Student Visa", desc: "Academic journey guidance", image: studentVisaImg, type: "student" },
                { title: "Work Visa", desc: "Professional opportunities", image: workVisaImg, type: "work" },
                { title: "Tourist Visa", desc: "Travel and exploration", image: touristVisaImg, type: "tourist" }
              ].map((item, index) => (
                <div key={index} className="w-80 bg-white rounded-2xl p-6 shadow-lg">
                  <div className="w-full h-48 bg-gray-200 rounded-xl mb-4 overflow-hidden">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 mb-4">{item.desc}</p>
                  <Button 
                    onClick={() => handleApplyNow(item.type)}
                    className="bg-secondary hover:bg-secondary/90 text-white rounded-full w-full" 
                    style={{ backgroundColor: '#83CD20' }}
                  >
                    Apply Now
                    <ArrowRight size={16} className="ml-2" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}