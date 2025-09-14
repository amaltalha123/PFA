import React from 'react';
import { useNavigate } from 'react-router-dom'; // Utilisez useNavigate
import { Assignment } from "../../types/assignment-types";
import AvatarBadge from "../ui/AvatarBadge";
import StatusPill from "../ui/StatusPill";
import { format } from 'date-fns'; // Importer la fonction format

interface AssignmentTableProps {
  assignments: Assignment[];
  openStagiaireDialog: (stagiaireData: any) => void;
}

const AssignmentTable: React.FC<AssignmentTableProps> = ({ assignments,openStagiaireDialog }) => {
  const navigate = useNavigate(); // Utilisez useNavigate

  const handleRowClick = (assignment: Assignment) => {
    localStorage.setItem('selectedAssignment', JSON.stringify(assignment)); 
    navigate('/encadrant/AssignmentDetailEncadrant'); // Naviguer vers la page de détails sans passer l'ID dans l'URL
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-3 text-left">Stagiaire</th>
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

              {/* Formatage des dates */}
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
