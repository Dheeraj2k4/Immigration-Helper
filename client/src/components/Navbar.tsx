import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight, Home, FileText, MessageSquare, Bell, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import logoSvg from '@/assets/OBJECTS.svg';

const navigationItems = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Visa Guide', href: '/visa-guide', icon: FileText },
  { name: 'AI Interview', href: '/ai-interview', icon: MessageSquare },
  { name: 'Updates', href: '/updates', icon: Bell },
  { name: 'Checklist', href: '/checklist', icon: CreditCard },
];

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

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
                  aria-label={item.name}
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
                    <span>{item.name}</span>
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Login/Signup Button */}
          <div className="hidden md:flex">
            <Button 
              variant="secondary" 
              className="bg-secondary text-white hover:bg-secondary/90 rounded-full px-6 py-2 text-sm font-medium"
              style={{ backgroundColor: '#83CD20', fontSize: '14px' }}
            >
              Login / Signup
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
                    aria-label={item.name}
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
                      <span>{item.name}</span>
                    </span>
                  </Link>
                );
              })}
              
              {/* Mobile Login/Signup */}
              <div className="pt-4 border-t">
                <Button 
                  variant="secondary" 
                  className="w-full bg-secondary text-white hover:bg-secondary/90 rounded-full"
                  style={{ backgroundColor: '#83CD20', fontSize: '14px' }}
                >
                  Login / Signup
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