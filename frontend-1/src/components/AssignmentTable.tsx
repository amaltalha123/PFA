import React from 'react';
import { useNavigate } from 'react-router-dom'; // Utilisez useNavigate
import axiosClient from "../api/axiosClient";
import { Assignment } from "../types/assignment-types";
import AvatarBadge from "./ui/AvatarBadge";
import StatusPill from "./ui/StatusPill";
import { format } from 'date-fns';

interface AssignmentTableProps {
  assignments: Assignment[];
  setAssignments: React.Dispatch<React.SetStateAction<Assignment[]>>;
  openStagiaireDialog: (stagiaireData: any) => void;
  openEncadrantDialog: (encadrantData: any) => void;
}

const AssignmentTable: React.FC<AssignmentTableProps> = ({ assignments, setAssignments, openStagiaireDialog, openEncadrantDialog }) => {
  const navigate = useNavigate(); // Utilisez useNavigate


  const handleRowClick = (assignment: Assignment) => {
  localStorage.setItem('selectedAssignment', JSON.stringify(assignment)); 
  navigate('/admin/assignments/detail'); // Naviguer vers la page de détails sans passer l'ID dans l'URL
};

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-3 text-left">Stagiaire</th>
            <th className="p-3 text-left">Encadrant</th>
            <th className="p-3 text-left">Début</th>
            <th className="p-3 text-left">Fin</th>
            <th className="p-3 text-left">Statut</th>
            
          </tr>
        </thead>
        <tbody>
          {assignments.map((assignment) => (
            <tr 
              key={assignment.id} 
              className="border-b hover:bg-gray-50 cursor-pointer"
              onClick={() => handleRowClick(assignment)} // Ajoutez l'événement de clic ici
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

              <td className="p-3">{format(new Date(assignment.date_debut), 'dd/MM/yyyy')}</td>
              <td className="p-3">{format(new Date(assignment.date_fin), 'dd/MM/yyyy')}</td>
              <td className="p-3">
                <StatusPill status={assignment.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AssignmentTable;
