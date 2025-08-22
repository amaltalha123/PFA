import React, { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';

interface AddStageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onStageAdded: () => void;
}

const AddStageDialog: React.FC<AddStageDialogProps> = ({ 
  isOpen, 
  onClose, 
  onStageAdded 
}) => {
  const [formData, setFormData] = useState({
    stagiare_id: '',
    encadrant_id: '',
    date_debut: '',
    date_fin: '',
    sujet: '',
    type_stage: 'PFA'
  });

  const [stagiaires, setStagiaires] = useState<any[]>([]);
  const [encadrants, setEncadrants] = useState<any[]>([]);

  useEffect(() => {
    const fetchStagiaires = async () => {
      try {
        const response = await axiosClient.get('/statistic/TotalStagiaires'); 
        setStagiaires(response.data.stagiaires);
      } catch (error) {
        console.error("Erreur lors de la récupération des stagiaires:", error);
      }
    };

    const fetchEncadrants = async () => {
      try {
        const response = await axiosClient.get('/statistic/TotalEncadrant'); 
        setEncadrants(response.data.encadrant);
      } catch (error) {
        console.error("Erreur lors de la récupération des encadrants:", error);
      }
    };

    fetchStagiaires();
    fetchEncadrants();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
      
//       const response = await axiosClient.post('/stage/add', {
//         stagiare_id: formData.stagiare_id,
//         encadrant_id: formData.encadrant_id,
//         date_debut: formData.date_debut,
//         date_fin: formData.date_fin,
//         sujet: formData.sujet,
//         type_stage: formData.type_stage
//       });
      
//       if (response.status === 200) {
//         console.log(formData);
//         onStageAdded();
//         onClose();
//       } else {
//         console.error("Erreur lors de la création du stage:", response.data);
//       }
//     } catch (error) {
//       console.error("Erreur lors de la création du stage:", error);
//     }
//   };
  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const response = await axiosClient.post('/stage/add', {
      stagiare_id: formData.stagiare_id,
      encadrant_id: formData.encadrant_id,
      date_debut: formData.date_debut,
      date_fin: formData.date_fin,
      sujet: formData.sujet,
      type_stage: formData.type_stage
    });
    
    if (response.data.success) { // Vérifiez si la réponse indique un succès
      console.log(response.data); // Affichez la réponse pour le débogage
      onStageAdded(); // Appelle la fonction pour mettre à jour le tableau
      onClose(); // Ferme le dialogue
    } else {
      alert("Erreur lors de la création du stage:" + response.data.message);
    }
  } catch (error) {
    alert("Erreur lors de la création du stage");
  }
};


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Nouveau Stage</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Stagiaire</label>
                <select
                  name="stagiare_id"
                  value={formData.stagiare_id}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Sélectionnez un stagiaire</option>
                  {stagiaires.map(stagiaire => (
                    <option key={stagiaire.Stagiaire.id} value={stagiaire.Stagiaire.id}>
                      {stagiaire.nom} {stagiaire.prenom}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Encadrant</label>
                <select
                  name="encadrant_id"
                  value={formData.encadrant_id}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Sélectionnez un encadrant</option>
                  {encadrants.map(encadrant => (
                    <option key={encadrant.Encadrant.id} value={encadrant.Encadrant.id}>
                      {encadrant.nom} {encadrant.prenom}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Date Début</label>
                <input
                  type="date"
                  name="date_debut"
                  value={formData.date_debut}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Date Fin</label>
                <input
                  type="date"
                  name="date_fin"
                  value={formData.date_fin}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sujet</label>
              <input
                type="text"
                name="sujet"
                value={formData.sujet}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type de Stage</label>
              <select
                name="type_stage"
                value={formData.type_stage}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="PFA">PFA</option>
                <option value="PFE">PFE</option>
                <option value="Autre">Initiation</option>
              </select>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none"
              >
                Créer Stage
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddStageDialog;
