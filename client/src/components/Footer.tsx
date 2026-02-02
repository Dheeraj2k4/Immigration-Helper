import { Link } from 'react-router-dom';
import logoSvg from '@/assets/OBJECTS.svg';
import mapSvg from '@/assets/map.svg';

export function Footer() {
  return (
    <footer 
      className="mt-16 relative"
      style={{
        backgroundColor: '#034833'
      }}
    >
      {/* Map SVG overlay - placed over color */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url(${mapSvg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      ></div>
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <img 
                src={logoSvg} 
                alt="RouteX Logo" 
                className="h-8 w-8"
              />
              <span className="text-2xl font-bold text-white">RouteX</span>
            </div>
            <p className="text-white text-sm opacity-90">
              Making visa applications simple and accessible for everyone.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-white mb-3">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="text-white opacity-80 hover:text-white hover:opacity-100 transition-opacity">About Us</Link></li>
              <li><Link to="/contact" className="text-white opacity-80 hover:text-white hover:opacity-100 transition-opacity">Contact</Link></li>
              <li><Link to="/faq" className="text-white opacity-80 hover:text-white hover:opacity-100 transition-opacity">FAQ</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-white mb-3">Services</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/visa-guide" className="text-white opacity-80 hover:text-white hover:opacity-100 transition-opacity">Visa Guide</Link></li>
              <li><Link to="/ai-interview" className="text-white opacity-80 hover:text-white hover:opacity-100 transition-opacity">AI Interview</Link></li>
              <li><Link to="/plans" className="text-white opacity-80 hover:text-white hover:opacity-100 transition-opacity">Plans</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-white mb-3">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-white opacity-80 hover:text-white hover:opacity-100 transition-opacity">Terms of Service</a></li>
              <li><a href="#" className="text-white opacity-80 hover:text-white hover:opacity-100 transition-opacity">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white border-opacity-20 mt-8 pt-8 text-center">
          <p className="text-white text-sm opacity-80">
            © 2024 RouteX. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}