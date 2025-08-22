// src/components/Attestation.tsx
import React from 'react';

interface AttestationProps {
  canGenerate: boolean; // Indique si l'attestation peut être générée
  onGenerate: () => void; // Fonction pour générer l'attestation
}

const Attestation: React.FC<AttestationProps> = ({ canGenerate, onGenerate }) => {
  return (
    <div className="mb-4 p-4 border rounded shadow">
      <h2 className="text-xl font-bold mb-2">Attestation</h2>
      {canGenerate ? (
        <button onClick={onGenerate} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Générer l'attestation
        </button>
      ) : (
        <p>Vous ne pouvez pas générer l'attestation. Assurez-vous que le rapport et l'évaluation existent et que la date de fin est atteinte.</p>
      )}
    </div>
  );
};

export default Attestation;
