const getAvatar = (nom: string, prenom: string) => {
  const initialNom = nom.charAt(0).toUpperCase();
  const initialPrenom = prenom.charAt(0).toUpperCase();
  
  // Générer une couleur basée sur les initiales
  const colors = ['bg-blue-600', 'bg-green-600', 'bg-red-600', 'bg-yellow-600', 'bg-purple-600', 'bg-pink-600'];
  const colorIndex = (initialNom.charCodeAt(0) + initialPrenom.charCodeAt(0)) % colors.length;
  
  return {
    initials: `${initialNom}${initialPrenom}`,
    color: colors[colorIndex]
  };
};

export default getAvatar;