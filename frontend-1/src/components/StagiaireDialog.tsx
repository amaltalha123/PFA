import React from 'react';
import { Stagiaire } from '../types/assignment-types';

interface StagiaireDialogProps {
  stagiaire: Stagiaire | null;
  onClose: () => void;
}

const StagiaireDialog: React.FC<StagiaireDialogProps> = ({ stagiaire, onClose }) => {
  if (!stagiaire) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
        <h2 className="text-xl font-bold mb-4">
          Fiche Stagiaire: {stagiaire.User.nom} {stagiaire.User.prenom}
        </h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-medium">Informations Personnelles</p>
            <p><strong>Nom:</strong> {stagiaire.User.nom}</p>
            <p><strong>Prénom:</strong> {stagiaire.User.prenom}</p>
            <p><strong>Email:</strong> {stagiaire.User.email}</p>
            <p><strong>École:</strong> {stagiaire.ecole}</p>
            <p><strong>Filière:</strong> {stagiaire.filiere}</p>
            <p><strong>Niveau:</strong> {stagiaire.niveau}</p>
          </div>
          <div>
            <p className="font-medium">Documents</p>
            <p>
              <strong>CV:</strong> 
              {stagiaire.cv ? (
                <a href={stagiaire.cv} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                  Télécharger
                </a>
              ) : (
                ' Non disponible'
              )}
            </p>
            <p>
              <strong>Lettre de motivation:</strong> 
              {stagiaire.lettre_motivation ? (
                <a href={stagiaire.lettre_motivation} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                  Télécharger
                </a>
              ) : (
                ' Non disponible'
              )}
            </p>
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

export default StagiaireDialog;
