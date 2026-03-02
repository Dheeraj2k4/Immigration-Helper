import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight, Home, FileText, MessageSquare, Bell, CreditCard, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import logoSvg from '@/assets/OBJECTS.svg';
import { useTranslation } from 'react-i18next';

const navigationItems = [
  { name: 'nav.home', href: '/', icon: Home },
  { name: 'nav.visaGuide', href: '/visa-guide', icon: FileText },
  { name: 'nav.aiInterview', href: '/ai-interview', icon: MessageSquare },
  { name: 'nav.updates', href: '/updates', icon: Bell },
  { name: 'nav.checklist', href: '/checklist', icon: CreditCard },
];

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
  { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
];

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const location = useLocation();
  const { t, i18n } = useTranslation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleLangMenu = () => setIsLangMenuOpen(!isLangMenuOpen);

  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem('language', langCode);
    setIsLangMenuOpen(false);
  };

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2"
            aria-label="RouteX Home"
          >
            <img 
              src={logoSvg} 
              alt="RouteX Logo" 
              className="h-8 w-8"
            />
            <span 
              className="text-2xl font-bold text-primary"
              style={{ fontSize: '32px' }}
            >
              RouteX
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1" role="navigation">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className="relative px-4 py-2 text-[15px] font-medium text-primary hover:text-primary/80 transition-colors"
                  aria-label={t(item.name)}
                >
                  {/* Animated background pill */}
                  {isActive && (
                    <motion.span
                      layoutId="activeTab"
                      style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundColor: '#034833',
                        borderRadius: '9999px'
                      }}
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 35,
                        mass: 0.8
                      }}
                    />
                  )}
                  
                  {/* Icon and text */}
                  <span className={cn(
                    "relative z-10 flex items-center space-x-1 transition-colors",
                    isActive ? "text-white" : "text-primary"
                  )}>
                    <Icon size={16} />
                    <span>{t(item.name)}</span>
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Language Switcher & Login/Signup Button */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={toggleLangMenu}
                className="flex items-center space-x-2 px-3 py-2 rounded-full border border-primary/20 hover:bg-accent transition-colors"
                aria-label="Change language"
              >
                <Globe size={18} className="text-primary" />
                <span className="text-sm font-medium text-primary">{currentLanguage.flag}</span>
              </button>

              {/* Language Dropdown */}
              <AnimatePresence>
                {isLangMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code)}
                        className={cn(
                          "w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors flex items-center space-x-3",
                          i18n.language === lang.code && "bg-gray-50"
                        )}
                      >
                        <span className="text-xl">{lang.flag}</span>
                        <span className="text-sm font-medium text-gray-700">{lang.name}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Button 
              variant="secondary" 
              className="bg-secondary text-white hover:bg-secondary/90 rounded-full px-6 py-2 text-sm font-medium"
              style={{ backgroundColor: '#83CD20', fontSize: '14px' }}
            >
              {t('nav.loginSignup')}
              <ArrowRight size={16} className="ml-1" />
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-md text-primary hover:bg-accent"
            aria-label="Toggle mobile menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <div className="md:hidden border-t bg-background">
            <nav className="container mx-auto px-4 py-4 space-y-2" role="navigation">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="relative flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors text-[15px]"
                    aria-label={t(item.name)}
                  >
                    {/* Animated background for mobile */}
                    {isActive && (
                      <motion.span
                        layoutId="activeMobileTab"
                        style={{
                          position: 'absolute',
                          inset: 0,
                          backgroundColor: '#034833',
                          borderRadius: '6px'
                        }}
                        initial={false}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30
                        }}
                      />
                    )}
                    
                    {/* Icon and text */}
                    <span className={cn(
                      "relative z-10 flex items-center space-x-3 transition-colors",
                      isActive ? "text-white" : "text-primary hover:text-primary/80"
                    )}>
                      <Icon size={18} />
                      <span>{t(item.name)}</span>
                    </span>
                  </Link>
                );
              })}
              
              {/* Mobile Language Switcher */}
              <div className="pt-4 border-t">
                <div className="text-xs font-semibold text-gray-500 mb-2 px-3">Language</div>
                <div className="space-y-1">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className={cn(
                        "w-full px-3 py-2 rounded-md text-left hover:bg-accent transition-colors flex items-center space-x-3",
                        i18n.language === lang.code && "bg-accent"
                      )}
                    >
                      <span className="text-xl">{lang.flag}</span>
                      <span className="text-sm font-medium text-primary">{lang.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Mobile Login/Signup */}
              <div className="pt-4 border-t">
                <Button 
                  variant="secondary" 
                  className="w-full bg-secondary text-white hover:bg-secondary/90 rounded-full"
                  style={{ backgroundColor: '#83CD20', fontSize: '14px' }}
                >
                  {t('nav.loginSignup')}
                  <ArrowRight size={16} className="ml-1" />
                </Button>
              </div>
            </nav>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
}