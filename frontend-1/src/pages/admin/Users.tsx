import React, { useState, useEffect } from 'react';
import { FiTrash2, FiPlus, FiX } from 'react-icons/fi';
import axiosClient from '../../api/axiosClient';
import DownloadViewButton from '../../components/DownloadViewButton';
import getAvatar from '../../components/Avatar';

interface Stagiaire{
  ecole: string;
  filiere: string;
  niveau: string;
  cv: string | null;
  lettre_motivation: string | null;
}

interface Departement{
  nom:string
}
interface Encadrant {
  specialite: string;
  Departement: Departement;
}

interface UserDetail {
  id?: number;
  nom: string;
  prenom: string;
  email: string;
  password?: string;
  role: 'encadrant' | 'stagiaire';

  // Champs spécifiques stagiaire
  Stagiaire: Stagiaire;

  // Champs spécifiques encadrant
  Encadrant: Encadrant;
}

interface User {
  id?: number;
  nom: string;
  prenom: string;
  email: string;
  password?: string;
  role: 'encadrant' | 'stagiaire';

  // Champs spécifiques stagiaire
  ecole?: string;
  filiere?: string;
  niveau?: string;
  cv?: File | null;
  lettre_motivation?: File | null;

  // Champs spécifiques encadrant
  specialite?: string;
  departement?: string;
}
interface Department {
  id: number;
  nom: string;
}
const Users: React.FC = () => {
  const [encadrants, setEncadrants] = useState<UserDetail[]>([]);
  const [stagiaires, setStagiaires] = useState<UserDetail[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [departements, setDepartements] = useState<Department[]>([]);


  // Charger les données au montage
  useEffect(() => {
  const fetchDepartements = async () => {
    try {
      const res = await axiosClient.get('/departements/all'); 
      setDepartements(res.data.data.departements || []);
      console.log(res.data.data.message);
    } catch (err) {
      console.error();
    }
  };

  const fetchStagiaires = async () => {
    try {
      const res = await axiosClient.get('/statistic/TotalStagiaires'); 
      
      setStagiaires(res.data.stagiaires || []); 
    } catch (err) {
      console.error(err);
    }
  };
  const fetchEncadrants = async () => {
    try {
      const res = await axiosClient.get('/statistic/TotalEncadrant'); 
      setEncadrants(res.data.encadrant || []); 
    } catch (err) {
      console.error(err);
    }
  };
    fetchEncadrants();
    fetchStagiaires();
    fetchDepartements();
  }, []);


  // Ouvrir le formulaire
  const openModal = (role: 'encadrant' | 'stagiaire') => {
    setCurrentUser({
      nom: '',
      prenom: '',
      email: '',
      password: '',
      role,
      ecole: '',
      filiere: '',
      niveau: '',
      specialite: '',
      departement: '',
      cv: null,
      lettre_motivation: null,
    });
    setIsModalOpen(true);
  };

  // Ouvrir le formulaire pour modifier
  const openEditModal = (user: UserDetail) => {
    setCurrentUser({
      id: user.id,
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      password: '', // Ne pas pré-remplir le mot de passe
      role: user.role,
      ecole: user.role === 'stagiaire' ? user.Stagiaire?.ecole || '' : '',
      filiere: user.role === 'stagiaire' ? user.Stagiaire?.filiere || '' : '',
      niveau: user.role === 'stagiaire' ? user.Stagiaire?.niveau || '' : '',
      specialite: user.role === 'encadrant' ? user.Encadrant?.specialite || '' : '',
      departement: user.role === 'encadrant' ? (user.Encadrant?.Departement?.nom || '') : '',
      cv: null,
      lettre_motivation: null,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentUser(null);
  };

  // Enregistrer un nouvel utilisateur
  const handleSave = async () => {
    if (!currentUser) return;
    if (!currentUser.nom || !currentUser.prenom || !currentUser.email || !currentUser.password) {
      alert("Tous les champs sont obligatoires");
      return;
    }
    if (currentUser.role === "stagiaire") {
      if (!currentUser.ecole || !currentUser.filiere || !currentUser.niveau || !currentUser.cv || !currentUser.lettre_motivation) {
        alert("Tous les champs stagiaire sont obligatoires");
        return;
      }
    }

    // Validation spécifique encadrant
    if (currentUser.role === "encadrant") {
      if (!currentUser.specialite || !currentUser.departement) {
        alert("Tous les champs encadrant sont obligatoires");
        return;
      }
    }
    try {
      
      const formData = new FormData();
      formData.append('nom', currentUser.nom);
      formData.append('prenom', currentUser.prenom);
      formData.append('email', currentUser.email);
      formData.append('password', currentUser.password || '123456');
      formData.append('role', currentUser.role);

      if (currentUser.role === 'stagiaire') {
        formData.append('ecole', currentUser.ecole || '');
        formData.append('filiere', currentUser.filiere || '');
        formData.append('niveau', currentUser.niveau || '');
        if (currentUser.cv) formData.append('cv', currentUser.cv);
        if (currentUser.lettre_motivation) {
          formData.append('lettre_motivation', currentUser.lettre_motivation);
        }
      }

      if (currentUser.role === 'encadrant') {
        formData.append('specialite', currentUser.specialite || '');
        formData.append('departement', currentUser.departement || '');
      }

      const res = await axiosClient.post(
        '/register',
        formData
      );

      console.log(res.data.message);

      if (currentUser.role === 'encadrant') {
        setEncadrants([...encadrants, res.data.user]);
        
      } else {
        setStagiaires([...stagiaires, res.data.user]);
      }

      closeModal();
    } catch (err) {
      console.error('Erreur enregistrement', err);
    }
  };

  // Supprimer un utilisateur
  const handleDelete = async (id: number) => {
    try {
      const res = await axiosClient.delete(`/delete/${id}`);
      alert(res.data.message);

      setEncadrants(encadrants.filter(user => user.id !== id));
      setStagiaires(stagiaires.filter(user => user.id !== id));
    } catch (err) {
      console.error('suppression échouée', err);
    }
  };

  return (
    <div className="p-6 space-y-10">
      <Section
        title="Encadrants"
        data={encadrants}
        onAdd={() => openModal('encadrant')}
        onEdit={openEditModal} // Assurez-vous que cette ligne est présente
        onDelete={(id) => handleDelete(id)}
      />
      <Section
        title="Stagiaires"
        data={stagiaires}
        onAdd={() => openModal('stagiaire')}
        onEdit={openEditModal} // Assurez-vous que cette ligne est présente
        onDelete={(id) => handleDelete(id)}
      />


      {isModalOpen && currentUser && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-lg w-96 p-6 relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
              onClick={closeModal}
            >
              <FiX size={20} />
            </button>
            <h2 className="text-lg font-bold mb-4">
              Ajouter {currentUser.role}
            </h2>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Nom"
                value={currentUser.nom}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, nom: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2"
                required
              />
              <input
                type="text"
                placeholder="Prénom"
                value={currentUser.prenom}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, prenom: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={currentUser.email}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, email: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2"
                required
              />
              <input
                type="password"
                placeholder="password"
                value={currentUser.password}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, password: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2"
                required
              />

              {currentUser.role === 'stagiaire' && (
                <>
                  <input
                    type="text"
                    placeholder="École"
                    value={currentUser.ecole}
                    onChange={(e) =>
                      setCurrentUser({ ...currentUser, ecole: e.target.value })
                    }
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Filière"
                    value={currentUser.filiere}
                    onChange={(e) =>
                      setCurrentUser({
                        ...currentUser,
                        filiere: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Niveau"
                    value={currentUser.niveau}
                    onChange={(e) =>
                      setCurrentUser({ ...currentUser, niveau: e.target.value })
                    }
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  />
                  <input
                    type="file"
                    onChange={(e) =>
                      setCurrentUser({
                        ...currentUser,
                        cv: e.target.files?.[0] || null,
                      })
                    }
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  />
                  <input
                    type="file"
                    onChange={(e) =>
                      setCurrentUser({
                        ...currentUser,
                        lettre_motivation: e.target.files?.[0] || null,
                      })
                    }
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  />
                </>
              )}

              {currentUser.role === 'encadrant' && (
                <>
                  <input
                    type="text"
                    placeholder="Spécialité"
                    value={currentUser.specialite}
                    onChange={(e) =>
                      setCurrentUser({
                        ...currentUser,
                        specialite: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  />
                  <select
                    value={currentUser?.departement || ""}
                    onChange={(e) => {
                      const depId = Number(e.target.value);
                      const dep = departements.find((d) => d.id === depId);
                      setCurrentUser((prev) =>
                        prev ? { ...prev, departement: dep ? dep.nom : "" } : prev
                      );
                    }}
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  >
                    <option value="">-- Sélectionner un département --</option>
                    {departements.map((dep: Department) => (
                      <option key={dep.id} value={dep.id}>
                        {dep.nom}
                      </option>
                    ))}
                  </select>


                </>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                onClick={closeModal}
              >
                Annuler
              </button>
              <button
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                onClick={handleSave}
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface SectionProps {
  title: string;
  data: UserDetail[];
  onAdd: () => void;
  onEdit: (user: UserDetail) => void;
  onDelete: (id: number) => void;
  
  
}

const Section: React.FC<SectionProps> = ({ title, data, onAdd, onEdit,onDelete }) => (
  <section>
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-bold text-indigo-700">{title}</h2>
      <button
        className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        onClick={onAdd}
      >
        <FiPlus /> Ajouter
      </button>
    </div>
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-indigo-50">
            <th className="p-3 border-b">Avatar</th> {/* Nouvelle colonne Avatar */}
            <th className="p-3 border-b">Nom</th>
            <th className="p-3 border-b">Prénom</th>
            <th className="p-3 border-b">Email</th>
            {data.length > 0 && data[0].role === 'stagiaire' && (
              <>
                <th className="p-3 border-b">École</th>
                <th className="p-3 border-b">Filière</th>
                <th className="p-3 border-b">Niveau</th>
                <th className="p-3 border-b">CV</th>
                <th className="p-3 border-b">Lettre de motivation</th>
              </>
            )}
            {data.length > 0 && data[0].role === 'encadrant' && (
              <>
                <th className="p-3 border-b">Spécialité</th>
                <th className="p-3 border-b">Département</th>
              </>
            )}
            <th className="p-3 border-b text-center">Actions</th>
          </tr>
        </thead>

       <tbody>
  {data.map((u, i) => (
    <tr key={i} className="hover:bg-gray-50">
      <td className="p-3 border-b">
        <div className="w-8 h-8 bg-indigo-600 text-white flex items-center justify-center rounded-full">
          {(() => {
                const avatar = getAvatar(u.prenom, u.nom);
                return (
                  <div className={`w-10 h-10 rounded-full ${avatar.color} text-white flex items-center justify-center font-bold`}>
                    {avatar.initials}
                  </div>
                );
              })()} {/* Affichage de l'avatar */}
        </div>
      </td>
      <td className="p-3 border-b">{u.nom}</td>
      <td className="p-3 border-b">{u.prenom}</td>
      <td className="p-3 border-b">{u.email}</td>
      {u.role === 'stagiaire' && (
        <>
          <td className="p-3 border-b">{u.Stagiaire?.ecole}</td>
          <td className="p-3 border-b">{u.Stagiaire?.filiere}</td>
          <td className="p-3 border-b">{u.Stagiaire?.niveau}</td>
          <td className="p-3 border-b">
            <DownloadViewButton 
              fileUrl={u.Stagiaire?.cv || null}
              fileName={`cv_${u.nom}_${u.prenom}.pdf`}
            />
          </td>
          <td className="p-3 border-b">
            <DownloadViewButton 
              fileUrl={u.Stagiaire?.lettre_motivation || null}
              fileName={`lettre_motivation_${u.nom}_${u.prenom}.pdf`}
            />
          </td>
        </>
      )}
      {u.role === 'encadrant' && (
        <>
          <td className="p-3 border-b">{u.Encadrant ? u.Encadrant.specialite : 'N/A'}</td>
          <td className="p-3 border-b">{u.Encadrant && u.Encadrant.Departement ? u.Encadrant.Departement.nom : 'N/A'}</td>
        </>
      )}
      <td className="p-3 border-b flex justify-center gap-3">
        <button
         className="text-blue-500 hover:text-blue-700"
         onClick={() => onEdit(u)} // Utilisation de onEdit ici
        >
          Modifier
        </button>
        <button
          className="text-red-500 hover:text-red-700"
          onClick={() => onDelete(u.id!)}
        >
          <FiTrash2 />
        </button>

        
      </td>
    </tr>
  ))}
</tbody>


      </table>
    </div>
  </section>
);


export default Users;
