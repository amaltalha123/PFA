// src/components/Evaluation.tsx
import React from 'react';

interface EvaluationProps {
  evaluationUrl: string | null; // URL de l'évaluation
}

const Evaluation: React.FC<EvaluationProps> = ({ evaluationUrl }) => {
  return (
    <div className="mb-4 p-4 border rounded shadow">
      <h2 className="text-xl font-bold mb-2">Évaluation</h2>
      {evaluationUrl ? (
        <a href={evaluationUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
          Télécharger l'évaluation
        </a>
      ) : (
        <p>Aucune évaluation disponible.</p>
      )}
    </div>
  );
};

export default Evaluation;
