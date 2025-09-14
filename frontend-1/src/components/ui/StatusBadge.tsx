import React from 'react';
// Status Badge Component
const StatusBadge: React.FC<{ status: 'en cours' | 'terminé' |'en attente' }> = ({ status }) => {
    const normalizedStatus = status.trim().toLowerCase();
    let classe = '';
    let label = '';
    if (normalizedStatus === 'terminé') {
    classe = 'bg-blue-100 text-green-800';
    label = 'Terminé';
    } else if (normalizedStatus === 'en attente') {
    classe = 'bg-red-100 text-red-800';
    label = 'En attente';
    } else {
    classe = 'bg-green-100 text-green-800';
    label = 'En cours';
    }
    return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${classe}`}>
        {label}
    </span>
    );

};

export default StatusBadge;