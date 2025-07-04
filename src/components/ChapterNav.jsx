import { Link, useLocation } from 'react-router-dom';
import { chapters } from '../data/chapters';

const ChapterNav = () => {
  const location = useLocation();

  // Get the current chapter path from the URL (without slashes)
  const currentPath = location.pathname.replace(/^\/+/, '').split('/')[0];

  const currentIndex = chapters.findIndex(ch => ch.path === currentPath);
  const prev = chapters[currentIndex - 1];
  const next = chapters[currentIndex + 1];

  return (
    <div className="chapter-nav">
      {prev ? (
        <Link to={`/${prev.path}`} className="prev-button">‹ Previous</Link>
      ) : (
        <div className="prev-placeholder" />
      )}

      {next ? (
        <Link to={`/${next.path}`} className="next-button">Next ›</Link>
      ) : (
        <div className="next-placeholder" />
      )}
    </div>
  );
};

export default ChapterNav;