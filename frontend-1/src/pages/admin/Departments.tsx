import React, { useState, useEffect } from "react";
import {FiPlus } from "react-icons/fi";
import axiosClient from '../../api/axiosClient';
import ReactDOM from 'react-dom';

interface Department {
  id: number;
  nom: string;
  etat: string; // "activé" ou "archivé"
}

const Departments: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDept, setCurrentDept] = useState<Department | null>(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axiosClient.get('/departements/all');
        setDepartments(response.data.data?.departements || []);
      } catch (error) {
        alert("Échec de récupération");
        console.error(error);
      }
    };
    fetchDepartments();
  }, []);

  const openModal = (dept?: Department) => {
    setCurrentDept(dept || { id: 0, nom: "", etat: "activé" });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentDept(null);
  };

  const handleSave = async () => {
    if (!currentDept) return;

    try {
      if (currentDept.id === 0) {
        // Ajout dans la base via API
        const response = await axiosClient.post(
          "/addDepartement",
          { nom: currentDept.nom }
        );

        if (response.data.success) {
          const newDept = response.data.data;
          setDepartments([...departments, newDept]);
        } else {
          alert(response.data.message || "Erreur lors de l'ajout.");
        }
      } else {
       
        const response = await axiosClient.patch(
          `/modifyDepartement/${currentDept.id}`,
          { nom: currentDept.nom }
        );

        if (response.data.success) {
          setDepartments(
            departments.map((d) => (d.id === currentDept.id ? currentDept : d))
          );
        } else {
          alert(response.data.message || "Erreur lors de la modification.");
        }
      }

      closeModal();
    } catch (error) {
      console.error("Erreur lors de l'enregistrement :", error);
      alert("Erreur serveur lors de l'enregistrement du département.");
    }
  };

  
  const activer = async (id: number) => {
    try {
      const response = await axiosClient.patch(`/departements/activer/${id}`);

      if (response.data.success) {
        setDepartments(
          departments.map((d) =>
            d.id === id ? { ...d, etat: "activé" } : d
          )
        );
      } else {
        alert(response.data.message || "Erreur lors de la mise à jour de l'état.");
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'état :", error);
      alert("Erreur serveur lors de la mise à jour de l'état.");
    }
  };

  const archiver = async (id: number) => {
    try {
      const response = await axiosClient.patch(`/departements/archiver/${id}`);

      if (response.data.success) {
        setDepartments(
          departments.map((d) =>
            d.id === id ? { ...d, etat: "archivé" } : d
          )
        );
      } else {
        alert(response.data.message || "Erreur lors de la mise à jour de l'état.");
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'état :", error);
      alert("Erreur serveur lors de la mise à jour de l'état.");
    }
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-indigo-700">Départements</h2>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          <FiPlus /> Ajouter un département
        </button>
      </div>

      {/* Tableau */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-indigo-50">
              <th className="p-3 border-b">Nom</th>
              <th className="p-3 border-b">État</th>
              <th className="p-3 border-b text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((dept) => (
              <tr key={dept.id} className="hover:bg-gray-50">
                <td className="p-3 border-b">{dept.nom}</td>
                <td className="p-3 border-b capitalize">{dept.etat}</td>
                <td className="p-3 border-b flex justify-center gap-3">
                  <button
                    onClick={() => openModal(dept)}
                    className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                    title="Modifier"
                  >
                    Moifier
                  </button>

                  {dept.etat === "activé" ? (
                  <button
                    onClick={() => archiver(dept.id)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                    title="Archiver"
                  >
                    Archiver
                  </button>
                ) : (
                  <button
                    onClick={() => activer(dept.id)}
                    className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                    title="Activer"
                  >
                    Activer
                  </button>
                )}

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && currentDept && ReactDOM.createPortal(
        <div className="fixed inset-0 h-full bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h3 className="text-lg font-bold mb-4">
              {currentDept.id === 0
                ? "Ajouter un département"
                : "Modifier le département"}
            </h3>
            <input
              type="text"
              placeholder="Nom"
              value={currentDept.nom}
              onChange={(e) =>
                setCurrentDept({ ...currentDept, nom: e.target.value })
              }
              className="w-full p-2 border rounded mb-3"
            />

            {/* Optionnel : afficher/modifier l'état dans le modal */}
            {/* 
            <select
              value={currentDept.etat}
              onChange={(e) =>
                setCurrentDept({ ...currentDept, etat: e.target.value })
              }
              className="w-full p-2 border rounded mb-3"
            >
              <option value="activé">Activé</option>
              <option value="archivé">Archivé</option>
            </select>
            */}

            <div className="flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                Sauvegarder
              </button>
            </div>
          </div>
        </div>,
      document.body
      )}
    </div>
  );
};

export default Departments;
