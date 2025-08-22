import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiUsers, FiGrid, FiHome, FiUserCheck } from 'react-icons/fi';

const Sidebar: React.FC = () => {
  const location = useLocation();

  const links = [
    { to: '/stagiaire/dashboard', label: 'Tableau de bord', icon: <FiHome />},
    { to: '/stagiaire/affectations', label: 'affectations', icon: <FiUserCheck />},
  ];

  return (
    <aside className="w-64 h-screen bg-indigo-900 text-white flex flex-col p-4 shadow-lg">
      {/* Logo / Titre */}
      <h2 className="text-2xl font-bold mb-8 tracking-wide border-b border-indigo-700 pb-4">
        Espace Stagiaire
      </h2>

      {/* Liens */}
      <nav className="flex flex-col gap-2">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`flex items-center gap-3 p-3 rounded-lg transition ${
              location.pathname === link.to
                ? 'bg-indigo-600 shadow-md'
                : 'hover:bg-indigo-700'
            }`}
          >
            {link.icon}
            <span>{link.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
