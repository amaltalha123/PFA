import React from 'react';

interface StatusPillProps {
  status: 'en cours' | 'terminé';
}

const StatusPill: React.FC<StatusPillProps> = ({ status }) => {
  const statusClasses = status === 'terminé' ? 'bg-blue-500' : 'bg-green-500';
  
  return (
    <span className={`text-white px-2 py-1 rounded-full ${statusClasses}`}>
      {status}
    </span>
  );
};

export default StatusPill;
