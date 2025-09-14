import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';

import { Assignment } from '../../types/assignment-types';
import Header from '../../components/ui/encadrant/Header';
import StatusBadge from '../../components/ui/StatusBadge'
import Mission from './Mission';
import Tickets from './Tickets';
import Rapport from './Rapport';
import Evaluation from './Evaluation';


const AssignmentDetailEncadrant: React.FC = () => {
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  // const [nonCommentedTickets, setNonComentedTickets] = useState<number | null>(null);
  // const [incompleteMissions, setIncompleteMissions] = useState<number | null>(null);
  // const [loading, setLoading] = useState(true);

 useEffect(() => {
    const storedAssignment = localStorage.getItem('selectedAssignment');
    if (storedAssignment) {
      setAssignment(JSON.parse(storedAssignment));
    }
  }, []);
  // useEffect(() => {
  //   const fetchNonCommentedTicketsNumber = async () => {
  //     if (!assignment) return;
  //     try {
  //       const response = await axiosClient.get(`/tickets/nonCommented/${assignment.id}`);
  //       setNonComentedTickets(response.data.totaltickets);
  //     } catch (error) {
  //       console.error('Erreur:', error);
  //     }
  //   };
  //   const fetchUndoneMissions = async () => {
  //     if (!assignment) return;
  //     try {
  //       const response = await axiosClient.get(`/missions/incompletes/${assignment.id}`);
  //       setIncompleteMissions(response.data.totalmissions);
  //     } catch (error) {
  //       console.error('Erreur:', error);
  //     }
  //   };
  //   fetchUndoneMissions();
  //   fetchNonCommentedTicketsNumber();
  // }, [assignment]);
  if (!assignment) {
    return <div>Loading...</div>; 
  }
  
  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Détails du Stage</h1>
        <Header /> {/* Inclure le nouvel en-tête */}
        <div className="flex space-x-4 text-sm text-gray-600">
          <p><span className="font-medium">Période:</span> {new Date(assignment.date_debut).toLocaleDateString()} - {new Date(assignment.date_fin).toLocaleDateString()}</p>
          <StatusBadge status={assignment.status} />
        </div>
      </div>

      {/* Stagiaire & Encadrant Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <PersonCard 
          person={assignment.Stagiaire.User}
          title="Stagiaire"
          details={{
            'École': assignment.Stagiaire.ecole,
            'Filière': assignment.Stagiaire.filiere,
            'Niveau': assignment.Stagiaire.niveau
          }}
          avatarInitials={`${assignment.Stagiaire.User.nom.charAt(0)}${assignment.Stagiaire.User.prenom.charAt(0)}`}
        />
        
        {/* Statistiques */}
        {/* <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Statistiques</h3>
          <div className="flex flex-col space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-600">Tickets non commentés:</span>
              <span className="text-xl font-bold text-blue-600">{nonCommentedTickets != null ? +nonCommentedTickets : 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-600">Missions non terminées:</span>
              <span className="text-xl font-bold text-red-600">{incompleteMissions != null ? +incompleteMissions : 0}</span>
            </div>
          </div>
        </div> */}
      </div>

      {/* Routes pour les sections */}
      <Routes>
        <Route path="detail/mission" element={<Mission />} />
        <Route path="detail/tickets" element={<Tickets />} />
        <Route path="detail/rapport" element={<Rapport />} />
        <Route path="detail/evaluation" element={<Evaluation />} />
      </Routes>
    </div>
  );
};


// Component for Person Card
const PersonCard: React.FC<{
  person: { nom: string; prenom: string; email: string };
  title: string;
  details: Record<string, string>;
  avatarInitials: string;
}> = ({ person, title, details, avatarInitials }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <div className="flex items-center space-x-4 mb-4">
      <div className="flex-shrink-0">
        <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium">
          {avatarInitials}
        </div>
      </div>
      <div>
        <h3 className="text-lg font-medium text-gray-900">{person.nom} {person.prenom}</h3>
        <p className="text-gray-500">{title}</p>
      </div>
    </div>
    <div className="space-y-2">
      <p className="text-sm">
        <span className="font-medium text-gray-600">Email:</span> {person.email}
      </p>
      {Object.entries(details).map(([key, value]) => (
        <p key={key} className="text-sm">
          <span className="font-medium text-gray-600">{key}:</span> {value}
        </p>
      ))}
    </div>
  </div>
);


export default AssignmentDetailEncadrant;
