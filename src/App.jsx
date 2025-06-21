import { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Allows for dynamic content loading without refresh

// Components
import HamburgerMenu from './components/HamburgerMenu';
import StaticSidebar from './components/sidebar/StaticSidebar';
import DynamicSidebar from './components/sidebar/DynamicSidebar';
import ScrollToTop from './components/ScrollToTop';
import Header from './components/Header';
import Footer from './components/Footer';

// Pages
import Start from './pages/Start';
import Gain from './pages/Gain';
import DelayEcho from './pages/DelayEcho';
import Reverb from './pages/Reverb';
import Saturation from './pages/Saturation';
import FiltersEQ from './pages/FiltersEqualization';
import Beyond from './pages/Beyond';

// Style
import './index.css';

// App
function App() {
  // Sidebar state (closed by default)
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // References to see if mouseDown interacts with them
  const sidebarRef = useRef(null);
  const hamburgerRef = useRef(null);

  const toggleSidebar = () => setSidebarOpen(prev => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  // Close sidebar when clicking outside it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        hamburgerRef.current &&
        !hamburgerRef.current.contains(event.target)
      ) {
        closeSidebar();
      }
    };
    if (sidebarOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [sidebarOpen]);

  return (
    <Router>
      <ScrollToTop />
      <div className="page_layout">
        
        <StaticSidebar />

        <HamburgerMenu 
          isActive={sidebarOpen}
          onClick={toggleSidebar}
          buttonRef={hamburgerRef}
        />

        <DynamicSidebar
          isOpen={sidebarOpen}
          onLinkClick={closeSidebar}
          ref={sidebarRef}
        />

        { /* Main Content */}
        <div className="content_wrapper">
          <Header onToggle={toggleSidebar} /> {/* Has the ability to toggle sidebar on click */}

          <Routes>
            <Route path="/LearnAudioEffects/" element={<Start />} />
            <Route path="/LearnAudioEffects/gain" element={<Gain />} />
            <Route path="/LearnAudioEffects/delay" element={<DelayEcho />} />
            <Route path="/LearnAudioEffects/reverb" element={<Reverb />} />
            <Route path="/LearnAudioEffects/saturation" element={<Saturation />} />
            <Route path="/LearnAudioEffects/filters-eq" element={<FiltersEQ />} />
            <Route path="/LearnAudioEffects/beyond" element={<Beyond />} />
            {/* Add more routes (Pages) when we get there */}
          </Routes>
          <Footer />
        </div>

      </div>
    </Router>
  );
}

export default App;