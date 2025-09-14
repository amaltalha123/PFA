import React, { useState, useEffect } from 'react';
import AssignmentTable from '../../components/stagiaire/AssignmentTable.tsx';
import { useDialog } from '../../hooks/useDialog';
import axiosClient from '../../api/axiosClient';
import { Assignment } from '../../types/assignment-types';

const Affectation: React.FC = () => {
  const {
    EncadrantDialog,
    openEncadrantDialog,
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

  return (
    <div className="p-6 ">
      <h1 className="text-2xl font-bold mb-6">Affectations de stages</h1>
     
      <AssignmentTable 
        assignments={assignments} 
        setAssignments={setAssignments} // Passez setAssignments ici
        openEncadrantDialog={openEncadrantDialog} 
       
      />
      {EncadrantDialog}
      
    </div>
  );
};

export default Affectation;
