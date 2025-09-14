import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import DownloadViewButton from '../../components/DownloadViewButton';
import getAvatar from '../../components/Avatar';
import ModifierStagiaireButton from '../../components/admin/ModifyStagiaireButton'
import ModifierEncadrantButton from '../../components/admin/ModifyEncadrantButton';
import AjouterStagiaireButton from '../../components/admin/AjouterStagiaireButton';
import AjouterEncadrantButton from '../../components/admin/AjouterEncadrantButton';

interface Stagiaire{
  ecole: string;
  filiere: string;
  niveau: string;
  cv: string | null;
  lettre_motivation: string | null;
}

interface Departement{
  id: number; 
  nom:string
}
interface Encadrant {
  specialite: string;
  Departement: Departement;
}

interface UserDetail {
  id?: number;
  nom: string;
  prenom: string;
  email: string;
  password?: string;
  role: 'encadrant' | 'stagiaire';

  // Champs spécifiques stagiaire
  Stagiaire: Stagiaire;

  // Champs spécifiques encadrant
  Encadrant: Encadrant;
}

interface User {
  id?: number;
  nom: string;
  prenom: string;
  email: string;
  password?: string;
  role: 'encadrant' | 'stagiaire';

  // Champs spécifiques stagiaire
  ecole?: string;
  filiere?: string;
  niveau?: string;
  cv?: File | null;
  lettre_motivation?: File | null;

  // Champs spécifiques encadrant
  specialite?: string;
  departement?: string;
}
interface Department {
  id: number;
  nom: string;
}
const User: React.FC = () => {
  const [encadrants, setEncadrants] = useState<UserDetail[]>([]);
  const [stagiaires, setStagiaires] = useState<UserDetail[]>([]);
  const [departements, setDepartements] = useState<Department[]>([]);


  // Charger les données au montage
  useEffect(() => {
  const fetchDepartements = async () => {
    try {
      const res = await axiosClient.get('/departements/all'); 
      setDepartements(res.data.data.departements || []);
      console.log(res.data.data.message);
    } catch (err) {
      console.error();
    }
  };

  const fetchStagiaires = async () => {
    try {
      const res = await axiosClient.get('/statistic/TotalStagiaires'); 
      
      setStagiaires(res.data.stagiaires || []); 
    } catch (err) {
      console.error(err);
    }
  };
  const fetchEncadrants = async () => {
    try {
      const res = await axiosClient.get('/statistic/TotalEncadrant'); 
      setEncadrants(res.data.encadrant || []); 
    } catch (err) {
      console.error(err);
    }
  };
    fetchEncadrants();
    fetchStagiaires();
    fetchDepartements();

  
  }, []);
  
  const handleUpdateStagiaire = (updatedUser: UserDetail) => {
    setStagiaires(prev =>
      prev.map(u => (u.id === updatedUser .id ? updatedUser  : u))
    );
  };

  const handleUpdateEncadrant = (updatedUser: UserDetail) => {
    setEncadrants(prev =>
      prev.map(u => (u.id === updatedUser .id ? updatedUser  : u))
    );
  };
  const handleCreateStagiaire = (newStagiaire: UserDetail) => {
    setStagiaires((prev) => [...prev, newStagiaire]); 
  };
  const handleCreateEncadrant = (newEncadrant: UserDetail) => {
    setEncadrants((prev) => [...prev, newEncadrant]); 
  };

  return (
    <div className="p-6 space-y-10">
      <Section
        title="Encadrants"
        data={encadrants}
        onUpdate={handleUpdateEncadrant}
        departements={departements}
        onCreate={handleCreateEncadrant}
        role="encadrant"
      />

      <Section
        title="Stagiaires"
        data={stagiaires}
        onUpdate={handleUpdateStagiaire}
        departements={departements}
        onCreate={handleCreateStagiaire}
        role="stagiaire"
      />
    </div>
  );
  

};

interface SectionProps {
  title: string;
  data: UserDetail[];
  onUpdate?: (updatedUser:UserDetail) => void;
  departements:Departement[];
  onCreate: (createdUser: UserDetail) => void;
  role:string;
}

const Section: React.FC<SectionProps> = ({title, data, onUpdate,departements,onCreate,role}) => {
  

  return (
  <section>
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-bold text-indigo-700">{title}</h2>
     

      {role === 'stagiaire' && (
          <AjouterStagiaireButton onCreate={onCreate} />
      )}
      {role === 'encadrant' && (
          <AjouterEncadrantButton onCreate={onCreate} departements={departements} />
      )}
    </div>
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-indigo-50">
            <th className="p-3 border-b">Avatar</th> 
            <th className="p-3 border-b">Nom</th>
            <th className="p-3 border-b">Prénom</th>
            <th className="p-3 border-b">Email</th>
            {data.length > 0 && data[0].role === 'stagiaire' && (
              <>
                <th className="p-3 border-b">École</th>
                <th className="p-3 border-b">Filière</th>
                <th className="p-3 border-b">Niveau</th>
                <th className="p-3 border-b">CV</th>
                <th className="p-3 border-b">Lettre de motivation</th>
              </>
            )}
            {data.length > 0 && data[0].role === 'encadrant' && (
              <>
                <th className="p-3 border-b">Spécialité</th>
                <th className="p-3 border-b">Département</th>
              </>
            )}
            <th className="p-3 border-b">Actions</th>
          </tr>
        </thead>

       <tbody>
  {data.map((u, i) => (
    <tr key={i} className="hover:bg-gray-50">
      <td className="p-3 border-b">
        <div className="w-8 h-8 bg-indigo-600 text-white flex items-center justify-center rounded-full">
          {(() => {
                const avatar = getAvatar(u.prenom, u.nom);
                return (
                  <div className={`w-10 h-10 rounded-full ${avatar.color} text-white flex items-center justify-center font-bold`}>
                    {avatar.initials}
                  </div>
                );
              })()} 
        </div>
      </td>
      <td className="p-3 border-b">{u.nom}</td>
      <td className="p-3 border-b">{u.prenom}</td>
      <td className="p-3 border-b">{u.email}</td>
      {u.role === 'stagiaire' && (
        <>
          <td className="p-3 border-b">{u.Stagiaire?.ecole}</td>
          <td className="p-3 border-b">{u.Stagiaire?.filiere}</td>
          <td className="p-3 border-b">{u.Stagiaire?.niveau}</td>
          <td className="p-3 border-b">
            <DownloadViewButton 
              fileUrl={u.Stagiaire?.cv || null}
              fileName={`cv_${u.nom}_${u.prenom}.pdf`}
            />
          </td>
          <td className="p-3 border-b">
            <DownloadViewButton 
              fileUrl={u.Stagiaire?.lettre_motivation || null}
              fileName={`lettre_motivation_${u.nom}_${u.prenom}.pdf`}
            />
          </td>
        </>
      )}
      {u.role === 'encadrant' && (
        <>
          <td className="p-3 border-b">{u.Encadrant ? u.Encadrant.specialite : 'N/A'}</td>
          <td className="p-3 border-b">{u.Encadrant && u.Encadrant.Departement ? u.Encadrant.Departement.nom : 'N/A'}</td>
        </>
      )}
      {u.role === 'stagiaire' && (
      <td className="p-3 border-b">
       
          <ModifierStagiaireButton
          stagiaire={{
            nom: u.nom,
            prenom: u.prenom,
            email:u.email,
            ecole: u.Stagiaire?.ecole,
            filiere: u.Stagiaire?.filiere,
            niveau: u.Stagiaire?.niveau,
            cv:u.Stagiaire?.cv,
            lettre_motivation:u.Stagiaire?.lettre_motivation, 
          }}
          id={u.id}
          onUpdate={onUpdate!}
        />
        
      </td>)}
      {u.role === 'encadrant' && (
        <td className="p-3 border-b">
          
          <ModifierEncadrantButton
           encadrant={{
            nom: u.nom,
            prenom: u.prenom,
            email:u.email,
            Encadrant:{
            specialite:u.Encadrant.specialite,
            Departement:u.Encadrant.Departement,
            }
          }}
          id={u.id}
          onUpdate={onUpdate!}
          departements={departements}
        />
        
        </td>
      )}
    </tr>
  ))}
</tbody>


      </table>
    </div>
  </section>
)};


export default User;
