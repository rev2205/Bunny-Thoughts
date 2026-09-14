import { NavLink } from 'react-router-dom';

export default function Nav() {
  return (
    <nav className="site-nav" aria-label="Main navigation">
      <ul>
        <li>
          <NavLink
            to="/"
            end
            className={({ isActive }) => (isActive ? 'active' : undefined)}
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/faq"
            className={({ isActive }) => (isActive ? 'active' : undefined)}
          >
            FAQ
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
