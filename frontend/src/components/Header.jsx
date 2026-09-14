import { Link } from 'react-router-dom';
import BunnyIcon from './BunnyIcon';

export default function Header() {
  return (
    <header className="site-header">
      <div className="site-header-text">
        <Link to="/" className="site-title">
          Bunny Thoughts
        </Link>
        <div className="site-subtitle">www.bunnythoughts.gov.www\bunnythoughts</div>
      </div>
      <div className="site-header-avatar">
        <BunnyIcon />
      </div>
    </header>
  );
}
