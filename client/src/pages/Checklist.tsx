import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Footer } from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  Circle, 
  FileText, 
  CreditCard, 
  Camera, 
  Shield, 
  Building, 
  Plane, 
  Mail,
  Download,
  CheckSquare,
  Info,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  isChecked: boolean;
}

interface VisaType {
  id: string;
  name: string;
  items: Omit<ChecklistItem, 'isChecked'>[];
}

// Visa type data
const visaTypes: VisaType[] = [
  {
    id: 'tourist',
    name: 'Tourist Visa',
    items: [
      {
        id: 'passport',
        title: 'Passport Copy',
        description: 'Valid for at least 6 months from travel date',
        icon: FileText
      },
      {
        id: 'application',
        title: 'Visa Application Form',
        description: 'Completed and signed application form',
        icon: FileText
      },
      {
        id: 'photo',
        title: 'Recent Passport-size Photo',
        description: 'Taken within the last 6 months, white background',
        icon: Camera
      },
      {
        id: 'insurance',
        title: 'Travel Insurance',
        description: 'Coverage for medical emergencies and trip cancellation',
        icon: Shield
      },
      {
        id: 'bank',
        title: 'Bank Statement',
        description: 'Last 3 months showing sufficient funds',
        icon: CreditCard
      },
      {
        id: 'bookings',
        title: 'Flight & Hotel Bookings',
        description: 'Confirmed reservations for travel dates',
        icon: Plane
      }
    ]
  },
  {
    id: 'student',
    name: 'Student Visa',
    items: [
      {
        id: 'passport',
        title: 'Passport Copy',
        description: 'Valid for entire study period',
        icon: FileText
      },
      {
        id: 'application',
        title: 'Visa Application Form',
        description: 'Student visa specific application',
        icon: FileText
      },
      {
        id: 'photo',
        title: 'Recent Passport-size Photo',
        description: 'Taken within the last 6 months',
        icon: Camera
      },
      {
        id: 'admission',
        title: 'Letter of Admission',
        description: 'Official acceptance from educational institution',
        icon: Mail
      },
      {
        id: 'financial',
        title: 'Financial Proof',
        description: 'Bank statements, scholarship letters, or sponsor documents',
        icon: CreditCard
      },
      {
        id: 'academic',
        title: 'Academic Transcripts',
        description: 'Previous education records and certificates',
        icon: FileText
      },
      {
        id: 'health',
        title: 'Health Insurance',
        description: 'Medical coverage for study period',
        icon: Shield
      }
    ]
  },
  {
    id: 'work',
    name: 'Work Visa',
    items: [
      {
        id: 'passport',
        title: 'Passport Copy',
        description: 'Valid for entire employment period',
        icon: FileText
      },
      {
        id: 'application',
        title: 'Work Visa Application',
        description: 'Employment-specific visa form',
        icon: FileText
      },
      {
        id: 'photo',
        title: 'Recent Passport-size Photo',
        description: 'Professional quality photograph',
        icon: Camera
      },
      {
        id: 'offer',
        title: 'Job Offer Letter',
        description: 'Official employment offer from sponsor company',
        icon: Building
      },
      {
        id: 'contract',
        title: 'Employment Contract',
        description: 'Signed work agreement with terms',
        icon: FileText
      },
      {
        id: 'qualifications',
        title: 'Professional Qualifications',
        description: 'Degrees, certifications, and work experience',
        icon: FileText
      },
      {
        id: 'sponsorship',
        title: 'Sponsorship Documents',
        description: 'Company registration and sponsorship license',
        icon: Building
      }
    ]
  }
];

// Checklist Header Component
function ChecklistHeader({ progress, completedItems, totalItems }: { 
  progress: number; 
  completedItems: number; 
  totalItems: number; 
}) {
  const { t } = useTranslation();
  return (
    <div className="text-center mb-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-2">
        {t('checklist.title')}
      </h1>
      <p className="text-gray-600 mb-6">
        {t('checklist.subtitle')}
      </p>
      
      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">{t('checklist.progress')}</span>
          <span className="text-sm font-bold text-green-600">
            {Math.round(progress)}% {t('checklist.completed')}
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
          <motion.div
            style={{
              height: '12px',
              background: 'linear-gradient(to right, #22C55E, #16A34A)',
              borderRadius: '9999px',
              boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
            }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
        
        <p className="text-xs text-gray-500 mt-2">
          {completedItems} of {totalItems} documents completed
        </p>
      </div>
    </div>
  );
}

// Checklist Item Component
function ChecklistItem({ 
  item, 
  onToggle 
}: { 
  item: ChecklistItem; 
  onToggle: (id: string) => void; 
}) {
  const Icon = item.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div
        className={`flex items-start gap-4 p-4 rounded-xl border transition-all duration-200 ${
          item.isChecked 
            ? 'bg-green-50 border-green-200 shadow-sm' 
            : 'bg-white border-gray-200 hover:border-green-300 hover:shadow-md'
        }`}
      >
        <button
          onClick={() => onToggle(item.id)}
          className="flex-shrink-0 mt-1"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {item.isChecked ? (
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            ) : (
              <Circle className="w-6 h-6 text-gray-400 hover:text-green-500 transition-colors" />
            )}
          </motion.div>
        </button>
        
        <div className="flex-grow">
          <div className="flex items-center gap-2 mb-1">
            <Icon className="w-5 h-5 text-gray-600" />
            <h3 className={`font-semibold transition-colors ${
              item.isChecked ? 'text-green-800' : 'text-gray-800'
            }`}>
              {item.title}
            </h3>
          </div>
          <p className={`text-sm transition-colors ${
            item.isChecked ? 'text-green-600' : 'text-gray-600'
          }`}>
            {item.description}
          </p>
        </div>
        
        {item.isChecked && (
          <div className="flex-shrink-0 mt-1">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
            >
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// Visa Type Selector Component
function VisaTypeSelector({ 
  selectedType, 
  onTypeChange 
}: { 
  selectedType: string; 
  onTypeChange: (type: string) => void; 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const currentType = visaTypes.find(type => type.id === selectedType);
  const { t } = useTranslation();
  
  return (
    <div className="relative mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {t('checklist.selectVisa')}
      </label>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-left flex items-center justify-between hover:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
      >
        <span className="font-medium text-gray-800">
          {currentType?.name || 'Select a visa type'}
        </span>
        <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${
          isOpen ? 'rotate-180' : ''
        }`} />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
            {visaTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => {
                  onTypeChange(type.id);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-3 text-left hover:bg-green-50 transition-colors ${
                  selectedType === type.id ? 'bg-green-100 text-green-800' : 'text-gray-800'
                }`}
              >
                {type.name}
              </button>
            ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Tips Card Component
function TipsCard() {
  const tips = [
    "Double-check document expiry dates",
    "Ensure photo meets visa requirements", 
    "Keep soft copies for backup",
    "Allow extra time for processing"
  ];
  
  return (
    <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mt-8">
      <div className="flex items-center gap-2 mb-4">
        <Info className="w-5 h-5 text-green-600" />
        <h3 className="text-lg font-semibold text-green-800">
          Before You Submit ✈️
        </h3>
      </div>
      
      <ul className="space-y-2">
        {tips.map((tip, index) => (
          <li key={index} className="flex items-start gap-2 text-green-700">
            <span className="text-green-500 mt-0.5">•</span>
            <span className="text-sm">{tip}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Action Buttons Component
function ActionButtons({ 
  onDownload, 
  onMarkAllComplete, 
  allCompleted 
}: { 
  onDownload: () => void; 
  onMarkAllComplete: () => void; 
  allCompleted: boolean; 
}) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col sm:flex-row gap-4 mt-8">
      <Button
        onClick={onDownload}
        className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-full py-3 px-6 font-medium transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
      >
        <Download className="w-5 h-5 mr-2" />
        {t('checklist.downloadChecklist')}
      </Button>
      
      <Button
        onClick={onMarkAllComplete}
        variant="outline"
        disabled={allCompleted}
        className="flex-1 border-green-600 text-green-600 hover:bg-green-50 rounded-full py-3 px-6 font-medium transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50"
      >
        <CheckSquare className="w-5 h-5 mr-2" />
        {allCompleted ? t('checklist.completed') : t('checklist.resetProgress')}
      </Button>
    </div>
  );
}

// Main Checklist Component
export function Checklist() {
  const location = useLocation();
  const initialVisaType = (location.state as { visaType?: string })?.visaType || 'tourist';
  const [selectedVisaType, setSelectedVisaType] = useState(initialVisaType);
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Initialize checklist items when visa type changes
  useEffect(() => {
    const visaType = visaTypes.find(type => type.id === selectedVisaType);
    if (visaType) {
      setChecklistItems(
        visaType.items.map(item => ({ ...item, isChecked: false }))
      );
    }
  }, [selectedVisaType]);

  const toggleItem = (id: string) => {
    setChecklistItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, isChecked: !item.isChecked } : item
      )
    );
  };

  const handleDownload = () => {
    // Simulate download
    const blob = new Blob([
      `Visa Checklist - ${visaTypes.find(t => t.id === selectedVisaType)?.name}\n\n` +
      checklistItems.map(item => 
        `${item.isChecked ? '✓' : '☐'} ${item.title}\n  ${item.description}`
      ).join('\n\n')
    ], { type: 'text/plain' });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'visa-checklist.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const markAllComplete = () => {
    setChecklistItems(prev =>
      prev.map(item => ({ ...item, isChecked: true }))
    );
  };

  const completedItems = checklistItems.filter(item => item.isChecked).length;
  const totalItems = checklistItems.length;
  const progress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;
  const allCompleted = completedItems === totalItems && totalItems > 0;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f9fafb' }}>
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-green-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-40 right-10 w-32 h-32 bg-emerald-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-32 h-32 bg-green-50 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-16 max-w-4xl">
        <ChecklistHeader 
          progress={progress} 
          completedItems={completedItems} 
          totalItems={totalItems} 
        />

        <div className="bg-white rounded-2xl shadow-xl border border-green-100 p-8">
          <VisaTypeSelector 
            selectedType={selectedVisaType}
            onTypeChange={setSelectedVisaType}
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={selectedVisaType}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="space-y-4">
              {checklistItems.map((item) => (
                <ChecklistItem
                  key={item.id}
                  item={item}
                  onToggle={toggleItem}
                />
              ))}
              </div>
            </motion.div>
          </AnimatePresence>

          <TipsCard />

          <ActionButtons
            onDownload={handleDownload}
            onMarkAllComplete={markAllComplete}
            allCompleted={allCompleted}
          />
        </div>
      </div>

      <Footer />
    </div>
  );
}