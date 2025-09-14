import React, { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';
import { Assignment, Documents } from '../../types/assignment-types';
import StatusBadge from '../../components/ui/StatusBadge'

const AssignmentDetail: React.FC = () => {
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [documents, setDocuments] = useState<Documents | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedAssignment = localStorage.getItem('selectedAssignment');
    if (storedAssignment) {
      setAssignment(JSON.parse(storedAssignment));
    }
  }, []);

  useEffect(() => {
    const fetchDocuments = async (id: number) => {
      try {
        const res = await axiosClient.get(`/stage/documents/${id}`);
        if (res.data.success) {
          setDocuments(res.data.documents);
        }
      } catch (error) {
        console.error('Error fetching documents:', error);
      } finally {
        setLoading(false);
      }
    };

    if (assignment?.id) { 
      fetchDocuments(assignment.id);
    }
  }, [assignment]);

  const handleGenerateCertificate = async (id:number) => {
     try {
        console.log(id);
        const res = await axiosClient.post(`/attestation/generate/${id}`,{}, {
          headers: { 'Content-Type': 'application/json' }
        });

        if (res.data.success) {
          console.log(res.data.message);
          try {
            const res = await axiosClient.get(`/stage/documents/${id}`);
            if (res.data.success) {
              setDocuments(res.data.documents);
            }
          } catch (error) {
            console.error('Error fetching documents:', error);
          } finally {
            setLoading(false);
          }
        }else{
          alert(res.data.message);
        }
      } catch (error) {
        console.error('Error fetching documents:', error);
      } finally {
        setLoading(false);
      }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">Affectation non trouvée</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Détails du Stage</h1>
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
        
        <PersonCard 
          person={assignment.Encadrant.User}
          title="Encadrant"
          details={{
            'Spécialité': assignment.Encadrant.specialite,
            'Département': assignment.Encadrant.Departement.nom
          }}
          avatarInitials={`${assignment.Encadrant.User.nom.charAt(0)}${assignment.Encadrant.User.prenom.charAt(0)}`}
        />
      </div>

      {/* Documents Section */}
      <div className="space-y-6">
        <DocumentCard 
          title="Rapport de stage"
          documentUrl={documents?.Rapport?.fichier || null} // Vérifiez si documents n'est pas null
        />

        <DocumentCard 
          title="Évaluation"
          documentUrl={documents?.Document?.document_evaluation || null} // Vérifiez si documents n'est pas null
        />

        {/* Certificate Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Attestation de stage</h3>
              <p className="text-gray-600">Générez une attestation officielle de stage</p>
            </div>
            
            {assignment.status === 'terminé' && 
             documents?.Rapport?.fichier && 
             documents?.Document?.document_evaluation ? (
              <button
              onClick={() => handleGenerateCertificate(assignment.id)}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                Générer l'attestation
              </button>
            ) : (
              <span className="text-sm text-red-500 italic">
                Disponible uniquement lorsque le stage est terminé et tous les documents sont rendus
              </span>
            )}

            
          </div>
          <DocumentCard 
          title="Attestation"
          documentUrl={documents?.Document?.document_attestation || null} // Vérifiez si documents n'est pas null
        />
        </div>
      </div>
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

// Component for Document Card
const DocumentCard: React.FC<{
  title: string;
  documentUrl?: string | null;
}> = ({ title, documentUrl }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <h3 className="text-xl font-semibold text-gray-800 mb-4">{title}</h3>
    {documentUrl ? (
      <div className="flex items-center justify-between">
        <a 
          href={documentUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 transition-colors inline-block"
        >
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Télécharger le document</span>
          </div>
        </a>
      </div>
    ) : (
      <div className="flex items-center justify-center h-24 border-2 border-dashed border-gray-300 rounded-lg">
        <span className="text-gray-500">Aucun document disponible</span>
      </div>
    )}
  </div>
);

// Status Badge Component
// const StatusBadge: React.FC<{ status: 'en cours' | 'terminé' |'en attente' }> = ({ status }) => {
//   let classe='';
//   if(status==='terminé'){
//      classe='bg-blue-100 text-green-800';
//   }else if(status==='en attente'){
//      classe='bg-red-100 text-red-800';
//   }else {
//     classe='bg-green-100 text-green-800';
//   }
//   return (
//   <span className={`px-2 py-1 rounded-full text-xs font-medium ${classe}`}>
//     {status === 'en cours' ? 'En cours' : status === 'terminé' ? 'Terminé' : 'En attente'}
//   </span>
// );

// };

export default AssignmentDetail;

