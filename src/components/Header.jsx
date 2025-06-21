import { useLocation } from 'react-router-dom';
import { chaptersMap } from '../data/chapters';

const Header = ({ onToggle }) => {
  const location = useLocation();
  const path = location.pathname.replace(/^\/+/, '').split('/')[0];
  const chapter = chaptersMap[path] || { title: '', color: '#000' };

  return (
    <header className="page_header">
      <h2 onClick={onToggle}>
        Learn Audio Effects{' '}
        <span className="chapter-title" style={{ color: chapter.color }}>
          – {chapter.title}
        </span>
      </h2>
    </header>
  );
};

export default Header;
