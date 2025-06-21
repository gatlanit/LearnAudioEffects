import { forwardRef } from 'react';
import { Link } from 'react-router-dom';

// Sidebar with chapter links
const DynamicSidebar = forwardRef(({ isOpen, onLinkClick }, ref) => (
  <nav ref={ref} className={`dynamic_sidebar ${isOpen ? 'open' : ''}`} id="sidebar">
    <div className="sidebar-scroll">
      <ul>
        <li><Link to="/" onClick={onLinkClick}>Get started</Link></li>
        <li><Link to="/gain" onClick={onLinkClick}>Gain</Link></li>
        <li><Link to="/delay" onClick={onLinkClick}>Delay/Echo</Link></li>
        <li><Link to="/reverb" onClick={onLinkClick}>Reverb</Link></li>
        <li><Link to="/saturation" onClick={onLinkClick}>Saturation</Link></li>
        <li><Link to="/filters-eq" onClick={onLinkClick}>Filters & Equalization</Link></li>
        <li><Link to="/beyond" onClick={onLinkClick}>Beyond</Link></li>
      </ul>
    </div>
  </nav>
));

export default DynamicSidebar;