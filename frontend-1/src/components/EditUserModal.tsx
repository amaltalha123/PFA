import React from 'react';

interface Stagiaire{
  ecole: string;
  filiere: string;
  niveau: string;
  cv: string | null;
  lettre_motivation: string | null;
}

interface Departement{
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

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserDetail | null;
  onSave: (user: UserDetail) => void;
  departements: { id: number; nom: string }[]; // Ajoutez cette prop pour les départements
}

const EditUserModal: React.FC<EditUserModalProps> = ({ isOpen, onClose, user, onSave, departements }) => {
  const [currentUser , setCurrentUser ] = React.useState<UserDetail | null>(user);

  React.useEffect(() => {
    setCurrentUser (user);
  }, [user]);

  const handleSave = () => {
    if (currentUser ) {
      onSave(currentUser );
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg w-96 p-6 relative">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          X
        </button>
        <h2 className="text-lg font-bold mb-4">Modifier l'utilisateur</h2>

        <div className="space-y-3">
          <input
            type="text"
            placeholder="Nom"
            value={currentUser ?.nom || ''}
            onChange={(e) => setCurrentUser ({ ...currentUser !, nom: e.target.value })}
            className="w-full border rounded-lg px-3 py-2"
            required
          />
          <input
            type="text"
            placeholder="Prénom"
            value={currentUser ?.prenom || ''}
            onChange={(e) => setCurrentUser ({ ...currentUser !, prenom: e.target.value })}
            className="w-full border rounded-lg px-3 py-2"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={currentUser ?.email || ''}
            onChange={(e) => setCurrentUser ({ ...currentUser !, email: e.target.value })}
            className="w-full border rounded-lg px-3 py-2"
            required
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={currentUser ?.password || ''}
            onChange={(e) => setCurrentUser ({ ...currentUser !, password: e.target.value })}
            className="w-full border rounded-lg px-3 py-2"
          />

          {currentUser ?.role === 'stagiaire' && (
            <>
              <input
                type="text"
                placeholder="École"
                value={currentUser ?.Stagiaire?.ecole || ''}
                onChange={(e) => setCurrentUser ({ ...currentUser !, Stagiaire: { ...currentUser !.Stagiaire, ecole: e.target.value } })}
                className="w-full border rounded-lg px-3 py-2"
                required
              />
              <input
                type="text"
                placeholder="Filière"
                value={currentUser ?.Stagiaire?.filiere || ''}
                onChange={(e) => setCurrentUser ({ ...currentUser !, Stagiaire: { ...currentUser !.Stagiaire, filiere: e.target.value } })}
                className="w-full border rounded-lg px-3 py-2"
                required
              />
              <input
                type="text"
                placeholder="Niveau"
                value={currentUser ?.Stagiaire?.niveau || ''}
                onChange={(e) => setCurrentUser ({ ...currentUser !, Stagiaire: { ...currentUser !.Stagiaire, niveau: e.target.value } })}
                className="w-full border rounded-lg px-3 py-2"
                required
              />
            </>
          )}

          {currentUser ?.role === 'encadrant' && (
            <>
              <input
                type="text"
                placeholder="Spécialité"
                value={currentUser ?.Encadrant?.specialite || ''}
                onChange={(e) => setCurrentUser ({ ...currentUser !, Encadrant: { ...currentUser !.Encadrant, specialite: e.target.value } })}
                className="w-full border rounded-lg px-3 py-2"
                required
              />
              <select
                value={currentUser?.Encadrant.Departement.nom || ""}
                onChange={(e) => {
                  const depId = Number(e.target.value);
                  const dep = departements.find((d) => d.id === depId);
                  setCurrentUser ((prev) =>
                    prev ? { ...prev, departement: dep ? dep.nom : "" } : prev
                  );
                }}
                className="w-full border rounded-lg px-3 py-2"
                required
              >
                <option value="">-- Sélectionner un département --</option>
                {departements.map((dep) => (
                  <option key={dep.id} value={dep.id}>
                    {dep.nom}
                  </option>
                ))}
              </select>
            </>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
            onClick={onClose}
          >
            Annuler
          </button>
          <button
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            onClick={handleSave}
          >
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditUserModal;
