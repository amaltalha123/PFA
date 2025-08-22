import React, { useState } from 'react';
import axiosClient from '../api/axiosClient';
import { useNavigate } from 'react-router-dom';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
   

    try {
      const response = await axiosClient.post('/login', {
        email,
        password
      });

      alert("Connexion réussie !");
        try {
          const response = await axiosClient.get('/profile');
          const role = response.data.role;
          const userData = response.data;

          localStorage.setItem('user', JSON.stringify(userData));

          if (role) {
            navigate(`/ActivateAccount`);
          }
          console.log(response.data); 
        
      } catch (err: any) {
        alert(err.response?.data?.message || "Erreur de récupération du profile");
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Erreur de connexion");
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
    </div>
  );
};

export default Login;
