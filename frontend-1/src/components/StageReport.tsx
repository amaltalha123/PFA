// src/components/StageReport.tsx
import React from 'react';

interface StageReportProps {
  reportUrl: string | null; // URL du rapport
}

const StageReport: React.FC<StageReportProps> = ({ reportUrl }) => {
  return (
    <div className="mb-4 p-4 border rounded shadow">
      <h2 className="text-xl font-bold mb-2">Rapport de Stage</h2>
      {reportUrl ? (
        <a href={reportUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
          Télécharger le rapport
        </a>
      ) : (
        <p>Aucun rapport disponible.</p>
      )}
    </div>
  );
};

export default StageReport;
