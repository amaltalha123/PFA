import React from 'react';
import { Link } from 'react-router-dom';

const PublicHeader = () => {
  return (
    <header className="bg-indigo-700 text-white p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold">Gestion Stagiaires</h1>
      <nav>
        <Link to="/login" className="bg-white text-indigo-700 px-4 py-2 rounded hover:bg-gray-200 transition">
          Se connecter
        </Link>
      </nav>
    </header>
  );
};

export default PublicHeader;
