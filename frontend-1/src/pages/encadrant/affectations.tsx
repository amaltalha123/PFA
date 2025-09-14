import React, { useState, useEffect } from 'react';
import AssignmentTable from '../../components/encadrant/AssignmentTable.tsx';
import { useDialog } from '../../hooks/useDialog';
import axiosClient from '../../api/axiosClient';
import { Assignment } from '../../types/assignment-types';

const Affectation: React.FC = () => {
  const {
    StagiaireDialog,
    openStagiaireDialog,
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
    fetchAssignments(); 
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Affectations de stages</h1>
     
      <AssignmentTable 
        assignments={assignments} 
        openStagiaireDialog={openStagiaireDialog} 
       
      />
      {StagiaireDialog}
      
    </div>
  );
};

export default Affectation;
