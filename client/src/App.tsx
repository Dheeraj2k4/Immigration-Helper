import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { Home } from '@/pages/Home';
import { VisaGuide } from '@/pages/VisaGuide';
import { AIInterview } from '@/pages/AIInterview';
import { Updates } from '@/pages/Updates';
import { Checklist } from '@/pages/Checklist';

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/visa-guide" element={<VisaGuide />} />
          <Route path="/ai-interview" element={<AIInterview />} />
          <Route path="/updates" element={<Updates />} />
          <Route path="/checklist" element={<Checklist />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
