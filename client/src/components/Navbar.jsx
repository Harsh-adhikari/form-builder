import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <nav className="navbar">
      <Link to="/admin/forms" className="navbar-logo">
        Form<span>Craft</span>
      </Link>
      <div className="navbar-links">
        <Link
          to="/admin/forms"
          className={pathname.startsWith('/admin') ? 'active' : ''}
        >
          Admin
        </Link>
      </div>
    </nav>
  );
}
