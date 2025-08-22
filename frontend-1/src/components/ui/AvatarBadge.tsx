import React from 'react';

interface FullName {
  nom :string;
  prenom:string;
}

interface AvatarBadgeProps {
  initials: FullName;
}

const getAvatar = (initials:AvatarBadgeProps) => {
  const initialNom = initials.initials.nom.charAt(0).toUpperCase();
  const initialPrenom = initials.initials.prenom.charAt(0).toUpperCase();
  return `${initialNom}${initialPrenom}`;
};

const AvatarBadge: React.FC<AvatarBadgeProps> = ({initials}) => {
  return (
    <div className="w-8 h-8 bg-indigo-600 text-white flex items-center justify-center rounded-full">
      {getAvatar({initials})}
    </div>
  );
};

export default AvatarBadge;
