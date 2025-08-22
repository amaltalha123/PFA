import React, { useState, useEffect } from 'react';
import AssignmentTable from '../../components/AssignmentTable';
import { useDialog } from '../../hooks/useDialog';
import axiosClient from '../../api/axiosClient';
import { Assignment } from '../../types/assignment-types';

const AssignmentPage: React.FC = () => {
  const {
    StagiaireDialog,
    EncadrantDialog,
    AddStageDialog,
    openStagiaireDialog,
    openEncadrantDialog,
    openAddStageDialog,
  } = useDialog();

  const [assignments, setAssignments] = useState<Assignment[]>([]);

  const fetchAssignments = async () => {
    try {
      const response = await axiosClient.get('/stage/all');
      setAssignments(response.data.assignments);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  useEffect(() => {
    fetchAssignments(); // Récupère les affectations au chargement du composant
  }, []);

  const handleStageAdded = () => {
    fetchAssignments(); // Recharge les affectations après l'ajout d'un stage
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Affectations de stages</h1>
      <button 
        onClick={() => openAddStageDialog(handleStageAdded)} // Passez la fonction de mise à jour ici
        className="mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Ajouter un Stage
      </button>
      <AssignmentTable 
        assignments={assignments} 
        setAssignments={setAssignments} // Passez setAssignments ici
        openStagiaireDialog={openStagiaireDialog} 
        openEncadrantDialog={openEncadrantDialog} 
      />
      {StagiaireDialog}
      {EncadrantDialog}
      {AddStageDialog} {/* Ajout du dialogue d'ajout ici */}
    </div>
  );
};

export default AssignmentPage;
