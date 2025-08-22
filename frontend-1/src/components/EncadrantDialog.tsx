import React from 'react';
import { Encadrant } from '../types/assignment-types';

interface EncadrantDialogProps {
  encadrant: Encadrant | null;
  onClose: () => void;
}

const EncadrantDialog: React.FC<EncadrantDialogProps> = ({ encadrant, onClose }) => {
  if (!encadrant) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
        <h2 className="text-xl font-bold mb-4">
          Fiche Encadrant: {encadrant.User.nom} {encadrant.User.prenom}
        </h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-medium">Informations Personnelles</p>
            <p><strong>Nom:</strong> {encadrant.User.nom}</p>
            <p><strong>Prénom:</strong> {encadrant.User.prenom}</p>
            <p><strong>Email:</strong> {encadrant.User.email}</p>
            <p><strong>Spécialité:</strong> {encadrant.specialite}</p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button 
            onClick={onClose} 
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default EncadrantDialog;
