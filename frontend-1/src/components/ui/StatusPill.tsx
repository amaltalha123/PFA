import React from 'react';

interface StatusPillProps {
  status: 'en cours' | 'terminé' | 'en attente';
}

const StatusPill: React.FC<StatusPillProps> = ({ status }) => {
  var statusClasses = status === 'terminé' ? 'bg-blue-500' : 'bg-green-500';
  if(status==='en attente'){
    statusClasses='bg-red-500';
  }else if(status==='terminé'){
    statusClasses='bg-blue-500';
  }else {
    statusClasses='bg-green-500';
  }
  
  return (
    <span className={`text-white px-2 py-1 rounded-full ${statusClasses}`}>
      {status}
    </span>
  );
};

export default StatusPill;
