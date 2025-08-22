import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { useNavigate } from 'react-router-dom';

const ActivateAccount = () => {
  const [comfirme_password, setcomfirme_password] = useState('');
  const [password, setPassword] = useState('');
  const [isActivated, setIsActivated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the account is already activated
    let user;
    try {
      const userString = localStorage.getItem('user');
      user = userString ? JSON.parse(userString) : null;
    } catch (error) {
      console.error("Erreur lors du parsing de l'utilisateur:", error);
      user = null; // Gérer l'erreur comme vous le souhaitez
    }
    if (user ) {
      setIsActivated(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (comfirme_password === password) {
        const response = await axiosClient.put('/update', {
          password
        });
        alert(response.data.message);
        navigate(`/login`);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Erreur d'activation");
    }
  };

  const handleRedirect = () => {
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    if (user) {
      navigate(`/${user.role}`);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-indigo-700 text-center">Modifier le mot de passe du compte</h2>

        <label className="block mb-2 font-medium text-gray-700">Nouveau Mot de passe</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-6 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />

        <label className="block mb-2 font-medium text-gray-700">Confirmer le mot de passe</label>
        <input
          type="password"
          value={comfirme_password}
          onChange={(e) => setcomfirme_password(e.target.value)}
          className="w-full p-3 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />

        <button
          type="submit"
          className="w-full bg-indigo-700 text-white py-3 rounded hover:bg-indigo-800 transition"
        >
          Se connecter
        </button>

        {isActivated && (
          <div className="mt-4 text-center">
            <p className="text-gray-600">Votre compte est déjà activé.</p>
            <button
              onClick={handleRedirect}
              className="text-indigo-600 hover:underline"
            >
              Aller à votre tableau de bord
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default ActivateAccount;
