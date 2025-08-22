import React, { useEffect, useState, useRef } from 'react';
import { FiLogOut } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom'; // Importer useNavigate
import axiosClient from '../../api/axiosClient'; // Assurez-vous que le chemin est correct
import getAvatar from '../Avatar'; // Assurez-vous que le chemin est correct
import ReactDOM from 'react-dom';

// Définir le type pour le profil utilisateur
interface UserProfile {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: string;
}

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const menuRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate(); // Utiliser useNavigate pour la redirection

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axiosClient.get('/profile');
        if (response.data) {
          setUserProfile(response.data);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  const handlePasswordChange = async () => {
    try {
      await axiosClient.put('/update', { password: newPassword });
      alert('Mot de passe modifié avec succès');
      setDialogOpen(false);
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Erreur lors de la modification du mot de passe');
    }
  };

  const handleLogout = () => {
    // Vider le localStorage
    localStorage.clear();

    // Vider les cookies (si vous utilisez une bibliothèque pour gérer les cookies, utilisez-la ici)
    // Exemple : Cookies.remove('cookieName');

    // Rediriger vers la page d'accueil
    navigate('/'); // Remplacez '/' par le chemin de votre page d'accueil
  };

  // Gestionnaire d'événements pour fermer le menu si on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuRef]);

  return (
    <header className="bg-white shadow-md px-6 py-4 flex justify-between items-center border-b border-gray-200">
      <h1 className="text-2xl font-bold text-indigo-700 tracking-wide">Tableau de bord</h1>

      <div className="flex items-center gap-4">
        <div className="relative" ref={menuRef}>
          <button onClick={toggleMenu} className="flex items-center gap-2">
            {userProfile ? (
              (() => {
                const avatar = getAvatar(userProfile.prenom, userProfile.nom);
                return (
                  <div className={`w-10 h-10 rounded-full ${avatar.color} text-white flex items-center justify-center font-bold`}>
                    {avatar.initials}
                  </div>
                );
              })()
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold">?</div>
            )}
          </button>

          {menuOpen && userProfile && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg z-10">
              <div className="flex items-center p-4 border-b border-gray-200">
                {userProfile && (() => {
                  const avatar = getAvatar(userProfile.prenom, userProfile.nom);
                  return (
                    <div className={`w-12 h-12 rounded-full ${avatar.color} text-white flex items-center justify-center font-bold`}>
                      {avatar.initials}
                    </div>
                  );
                })()}
                <div className="ml-3">
                  <p className="font-semibold">{`${userProfile.prenom} ${userProfile.nom}`}</p>
                  <p className="text-sm text-gray-600">{userProfile.role}</p>
                  <p className="text-sm text-gray-600">{userProfile.email}</p>
                </div>
              </div>
              <ul className="py-2">
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => setDialogOpen(true)}>
                  Modifier le mot de passe
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Bouton déconnexion */}
        <button onClick={handleLogout} className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-sm transition">
          <FiLogOut className="text-lg" />
          Déconnexion
        </button>
      </div>

      {dialogOpen && ReactDOM.createPortal(
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-lg font-semibold mb-4">Modifier le mot de passe</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Nouveau mot de passe</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                placeholder="Entrez votre nouveau mot de passe"
              />
            </div>
            <div className="flex justify-end">
              <button onClick={handlePasswordChange} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg mr-2">
                Enregistrer
              </button>
              <button onClick={() => setDialogOpen(false)} className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded-lg">
                Annuler
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </header>
  );
};

export default Header;
