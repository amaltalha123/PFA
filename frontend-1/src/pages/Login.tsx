import React, { useState } from 'react';
import axiosClient from '../api/axiosClient';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/admin/Modal'; // ton composant modal

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [modalMessage, setModalMessage] = useState<string | null>(null); // message API
  const [modalSuccess, setModalSuccess] = useState<boolean>(false); // succès ou erreur
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axiosClient.post('/login', { email, password });

      // récupération du profil après login
      try {
        const profileRes = await axiosClient.get('/profile');
        const role = profileRes.data.role;
        const userData = profileRes.data;

        localStorage.setItem('user', JSON.stringify(userData));

        setModalMessage('Connexion réussie !');
        setModalSuccess(true);

        // redirection après un court délai pour que le modal s'affiche
        setTimeout(() => {
          if (role) navigate(`/${userData.role}`);
        }, 1000);

      } catch (err: any) {
        setModalMessage(err.response?.data?.message || 'Erreur de récupération du profil');
        setModalSuccess(false);
      }

    } catch (err: any) {
      setModalMessage(err.response?.data?.message || 'Erreur de connexion');
      setModalSuccess(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-indigo-700 text-center">Connexion</h2>

        <label className="block mb-2 font-medium text-gray-700">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />

        <label className="block mb-2 font-medium text-gray-700">Mot de passe</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-6 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />

        <button
          type="submit"
          className="w-full bg-indigo-700 text-white py-3 rounded hover:bg-indigo-800 transition"
        >
          Se connecter
        </button>
      </form>

      {/* Modal */}
      {modalMessage && (
        <Modal onClose={() => setModalMessage(null)}>
          <div className={`p-4 rounded ${modalSuccess ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            <p>{modalMessage}</p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setModalMessage(null)}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Fermer
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Login;
