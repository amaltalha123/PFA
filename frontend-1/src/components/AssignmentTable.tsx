import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Utilisez useNavigate
import axiosClient from "../api/axiosClient";
import { Assignment } from "../types/assignment-types";
import AvatarBadge from "./ui/AvatarBadge";
import StatusPill from "./ui/StatusPill";
import { format } from 'date-fns';
import ModifyStageButton from './admin/ModifyStageButton';


interface AssignmentTableProps {
  assignments: Assignment[];
  setAssignments: React.Dispatch<React.SetStateAction<Assignment[]>>;
  openStagiaireDialog: (stagiaireData: any) => void;
  openEncadrantDialog: (encadrantData: any) => void;
}

const AssignmentTable: React.FC<AssignmentTableProps> = ({ assignments, setAssignments, openStagiaireDialog, openEncadrantDialog }) => {
  const navigate = useNavigate(); 


  const handleRowClick = (assignment: Assignment) => {
  localStorage.setItem('selectedAssignment', JSON.stringify(assignment)); 
  navigate('/admin/assignments/detail'); 

};


  
const activer = async (id: number) => {
    try {
      const response = await axiosClient.patch(`/stage/activer/${id}`);

      if (response.data.success) {
        setAssignments(
          assignments.map((d) =>
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
      const response = await axiosClient.patch(`/stage/archiver/${id}`);

      if (response.data.success) {
        setAssignments(
          assignments.map((d) =>
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
 const handleUpdateStage = (updatedStage: Assignment) => {
  setAssignments(assignments.map(a =>
    a.id === updatedStage.id ? updatedStage : a
  ));
};
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-3 text-left">Stagiaire</th>
            <th className="p-3 text-left">Encadrant</th>
            <th className="p-3 text-left">type</th>
            <th className="p-3 text-left">Début</th>
            <th className="p-3 text-left">Fin</th>
            <th className="p-3 text-left">Statut</th>
            <th className="p-3 text-left">etat</th>
            <th className="p-3 text-left">actions</th>
          </tr>
        </thead>
        <tbody>
          {assignments.map((assignment) => (
            <tr 
              key={assignment.id} 
              className="border-b hover:bg-gray-50 cursor-pointer"
              onClick={() => handleRowClick(assignment)} 
            >
              <td 
                className="p-3"
                onClick={(e) => {
                  e.stopPropagation(); // Empêche la propagation pour éviter de naviguer
                  if (assignment.Stagiaire) {
                    openStagiaireDialog(assignment.Stagiaire); // Ouvre le dialogue du stagiaire
                  }
                }}
              >
                {assignment.Stagiaire ? (
                  <>
                    <AvatarBadge initials={{ nom: assignment.Stagiaire.User.nom, prenom: assignment.Stagiaire.User.prenom }} />
                    <span>
                      {assignment.Stagiaire.User.nom} {assignment.Stagiaire.User.prenom}
                    </span>
                  </>
                ) : (
                  <span>Aucun stagiaire</span>
                )}
              </td>

              <td 
                className="p-3"
                onClick={(e) => {
                  e.stopPropagation(); // Empêche la propagation pour éviter de naviguer
                  if (assignment.Encadrant) {
                    openEncadrantDialog(assignment.Encadrant); // Ouvre le dialogue de l'encadrant
                  }
                }}
              >
                {assignment.Encadrant ? (
                  <>
                    <AvatarBadge initials={{ nom: assignment.Encadrant.User.nom, prenom: assignment.Encadrant.User.prenom }} />
                    <span>
                      {assignment.Encadrant.User.nom} {assignment.Encadrant.User.prenom}
                    </span>
                  </>
                ) : (
                  <span>Aucun encadrant</span>
                )}
              </td>
              <td className="p-3">{assignment.type_stage}</td>
              <td className="p-3">{format(new Date(assignment.date_debut), 'dd/MM/yyyy')}</td>
              <td className="p-3">{format(new Date(assignment.date_fin), 'dd/MM/yyyy')}</td>
              
              <td className="p-3">
                <StatusPill status={assignment.status} />
              </td>
              <td className="p-3">{assignment.etat}</td>
              <td className="p-3 flex justify-center gap-3"> {assignment.etat === "activé" ? (
                  <button
                    onClick={(e) => {archiver(assignment.id); e.stopPropagation();}}
                    className="px-3 py-1 bg-yellow-500 text-white rounded-lg shadow hover:bg-yellow-600"
                    title="Archiver"
                  >
                    Archiver
                  </button>
                ) : (
                  <button
                    onClick={(e) =>{activer(assignment.id); e.stopPropagation();}}
                    className="px-3 py-1 bg-green-500 text-white rounded-lg shadow hover:bg-yellow-600"
                    title="Activer"
                  >
                    Activer
                  </button>
                  
                )}
                <ModifyStageButton
                  stage={assignment}
                  onUpdate={handleUpdateStage}
                />
                </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AssignmentTable;
