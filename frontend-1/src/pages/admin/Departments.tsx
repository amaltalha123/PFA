import React, { useState, useEffect } from "react";
import { FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import axiosClient from '../../api/axiosClient';

interface Department {
  id: number;
  nom: string;
}

const Departments: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDept, setCurrentDept] = useState<Department | null>(null);

  // Charger la liste au montage
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axiosClient.get('/departements/all');
        console.log("dept "+ response.data.data?.departements || []);
        setDepartments(response.data.data?.departements || []);

      } catch (error) {
        alert("Echec de récupération");
        console.error(error);
      }
    };
    fetchDepartments();
  }, []);

  const openModal = (dept?: Department) => {
    setCurrentDept(dept || { id: 0, nom: ""});
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
        // On récupère l'id et nom du backend
        const newDept = response.data.data;
        setDepartments([...departments, newDept]);
      } else {
        alert(response.data.message || "Erreur lors de l'ajout.");
      }
    } else {
      // on modifie la liste des département 
      setDepartments(
        departments.map((d) => (d.id === currentDept.id ? currentDept : d))
      );
    }

      closeModal();
    } catch (error) {
      console.error("Erreur lors de l'enregistrement :", error);
      alert("Erreur serveur lors de l'enregistrement du département.");
    }
  };


  const handleDelete = async (id: number) => {
  if (!window.confirm("Voulez-vous vraiment supprimer ce département ?")) return;

    try {
      const response = await axiosClient.delete(`/deleteDepartement/${id}`);


      if (response.data.success) {
        setDepartments(departments.filter((d) => d.id !== id));
      } else {
        alert(response.data.message || "Erreur lors de la suppression.");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
      alert("Erreur serveur lors de la suppression.");
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
              <th className="p-3 border-b text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((dept) => (
              <tr key={dept.id} className="hover:bg-gray-50">
                <td className="p-3 border-b">{dept.nom}</td>
                
                <td className="p-3 border-b flex justify-center gap-3">
                  <button
                    onClick={() => openModal(dept)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <FiEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(dept.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && currentDept && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
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
            

            <div className="flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
              >
                Sauvegarder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Departments;
