// src/components/ui/Header.tsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Fonction pour vérifier si le bouton est actif
  const isActive = (path: string) => {
    return location.pathname.includes(path);
  };

  return (
    <div className="flex justify-end space-x-6 mb-8 p-4 bg-white shadow-sm rounded-lg">
      <button 
        onClick={() => navigate('/encadrant/AssignmentDetailEncadrant/detail/mission')} 
        className={`px-4 py-2 rounded-md transition-colors duration-200 font-medium ${
          isActive('mission') 
            ? 'text-blue-600 bg-blue-100' 
            : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
        }`}
      >
        Mission
      </button>
      <button 
        onClick={() => navigate('/encadrant/AssignmentDetailEncadrant/detail/tickets')} 
        className={`px-4 py-2 rounded-md transition-colors duration-200 font-medium ${
          isActive('tickets') 
            ? 'text-blue-600 bg-blue-100' 
            : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
        }`}
      >
        Tickets
      </button>
      <button 
        onClick={() => navigate('/encadrant/AssignmentDetailEncadrant/detail/rapport')} 
        className={`px-4 py-2 rounded-md transition-colors duration-200 font-medium ${
          isActive('rapport') 
            ? 'text-blue-600 bg-blue-100' 
            : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
        }`}
      >
        Rapport
      </button>
      <button 
        onClick={() => navigate('/encadrant/AssignmentDetailEncadrant/detail/evaluation')} 
        className={`px-4 py-2 rounded-md transition-colors duration-200 font-medium ${
          isActive('evaluation') 
            ? 'text-blue-600 bg-blue-100' 
            : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
        }`}
      >
        Évaluation
      </button>
    </div>
  );
};

export default Header;