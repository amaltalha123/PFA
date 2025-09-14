import React, { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Modal from './admin/Modal';

interface AddStageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onStageAdded: () => void;
}

const stageSchema = z.object({
  stagiare_id: z.number().min(1, "Veuillez sélectionner un stagiaire"),
  encadrant_id: z.number().min(1, "Veuillez sélectionner un encadrant"),
  date_debut: z.string().min(1, "Veuillez saisir la date de début"),
  date_fin: z.string().min(1, "Veuillez saisir la date de fin"),
  sujet: z.string().min(1, "Veuillez saisir le sujet"),
  type_stage: z.enum(['PFA', 'PFE', 'initiation']),
});

type StageFormData = z.infer<typeof stageSchema>;

const AddStageDialog: React.FC<AddStageDialogProps> = ({
  isOpen,
  onClose,
  onStageAdded,
}) => {
  const [stagiaires, setStagiaires] = useState<any[]>([]);
  const [encadrants, setEncadrants] = useState<any[]>([]);

  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'error' | 'success' | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<StageFormData>({
    resolver: zodResolver(stageSchema),
    defaultValues: {
      stagiare_id: 0,
      encadrant_id: 0,
      date_debut: '',
      date_fin: '',
      sujet: '',
      type_stage: 'initiation',
    },
  });

  useEffect(() => {
    const fetchStagiaires = async () => {
      try {
        const response = await axiosClient.get('/statistic/TotalStagiaires');
        setStagiaires(response.data.stagiaires);
      } catch (error) {
        console.error('Erreur lors de la récupération des stagiaires:', error);
      }
    };

    const fetchEncadrants = async () => {
      try {
        const response = await axiosClient.get('/statistic/TotalEncadrant');
        setEncadrants(response.data.encadrant);
      } catch (error) {
        console.error('Erreur lors de la récupération des encadrants:', error);
      }
    };

    fetchStagiaires();
    fetchEncadrants();
  }, []);

  const onSubmit = async (data: StageFormData) => {
    try {
      const payload = {
    ...data,
    stagiare_id: Number(data.stagiare_id),
    encadrant_id: Number(data.encadrant_id),
  };
  console.log(payload);
      const response = await axiosClient.post('/stage/add', payload);
      if (response.data.success) {
        setMessageType('success');
        setMessage('Stage créé avec succès !');
        onStageAdded();
        reset();
      } else {
        setMessageType('error');
        setMessage(response.data.message || 'Erreur lors de la création du stage');
      }
    } catch (error: any) {
      if (error.response && error.response.data) {
        setMessageType('error');
        setMessage(error.response.data.message || 'Erreur lors de la création du stage');
      } else {
        setMessageType('error');
        setMessage('Erreur lors de la création du stage');
      }
    }
  };

  const closeMessageModal = () => {
    setMessage(null);
    setMessageType(null);
    if (messageType === 'success') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Dialogue principal */}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl w-11/12 max-w-3xl max-h-[90vh] overflow-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Nouveau Stage</h2>
              <button
                onClick={() => {
                  onClose();
                  reset();
                }}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Fermer"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stagiaire
                  </label>
                  <select
                    {...register('stagiare_id', { valueAsNumber: true })}
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors.stagiare_id ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value={0}>Sélectionnez un stagiaire</option>
                    {stagiaires.map((stagiaire) => (
                      <option key={stagiaire.Stagiaire.id} value={stagiaire.Stagiaire.id}>
                        {stagiaire.nom} {stagiaire.prenom}
                      </option>
                    ))}
                  </select>
                  {errors.stagiare_id && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.stagiare_id.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Encadrant
                  </label>
                  <select
                    {...register('encadrant_id', { valueAsNumber: true })}
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors.encadrant_id ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value={0}>Sélectionnez un encadrant</option>
                    {encadrants.map((encadrant) => (
                      <option key={encadrant.Encadrant.id} value={encadrant.Encadrant.id}>
                        {encadrant.nom} {encadrant.prenom}
                      </option>
                    ))}
                  </select>

                  {errors.encadrant_id && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.encadrant_id.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date Début
                  </label>
                  <input
                    type="date"
                    {...register('date_debut')}
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors.date_debut ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.date_debut && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.date_debut.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date Fin
                  </label>
                  <input
                    type="date"
                    {...register('date_fin')}
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors.date_fin ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.date_fin && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.date_fin.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sujet
                </label>
                <input
                  type="text"
                  {...register('sujet')}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.sujet ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.sujet && (
                  <p className="text-red-500 text-sm mt-1">{errors.sujet.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type de Stage
                </label>
                <select
                  {...register('type_stage')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="PFA">PFA</option>
                  <option value="PFE">PFE</option>
                  <option value="initiation">initiation</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    reset();
                  }}
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Créer Stage
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Modal message */}
      {message && (
        <Modal onClose={closeMessageModal}>
          <div
            className={`p-4 rounded ${
              messageType === 'error'
                ? 'bg-red-100 text-red-700'
                : 'bg-green-100 text-green-700'
            }`}
          >
            <p>{message}</p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={closeMessageModal}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Fermer
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default AddStageDialog;