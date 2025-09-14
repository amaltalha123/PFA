import React, { useState } from "react";
import ReactDOM from "react-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axiosClient from "../../api/axiosClient";
interface Stagiaire{
  ecole: string;
  filiere: string;
  niveau: string;
  cv: string | null;
  lettre_motivation: string | null;
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
  Encadrant: any;
}

interface ModifierStagiaireProps {
  stagiaire?: Partial<StagiaireForm>; 
  id?:number;
  onUpdate: (updatedUser:UserDetail) => void; 
}

// Schéma Zod
const StagiaireSchema = z.object({
  nom: z.string().min(1, "Nom obligatoire"),
  prenom: z.string().min(1, "Prénom obligatoire"),
  email:z.string().email(),
  role: z.string().transform(() => "stagiaire"),
  ecole: z.string().min(1, "École obligatoire"),
  filiere: z.string().min(1, "Filière obligatoire"),
  niveau: z.string().min(1, "Niveau obligatoire"),
  cv: z.any().optional(),
  lettre_motivation: z.any().optional(),
});

type StagiaireForm = z.infer<typeof StagiaireSchema>;

// Modal générique
const Modal: React.FC<{ onClose: () => void; children: React.ReactNode }> = ({

  children,
}) => {
  return ReactDOM.createPortal(
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
    <div className="bg-white p-6 rounded-xl shadow-lg w-11/12 max-w-3xl relative">
       
        {children}
      </div>
    </div>,
    document.body
  );
};

// Composant bouton + formulaire sous forme React.FC
const ModifierStagiaireButton: React.FC<ModifierStagiaireProps> = ({
  stagiaire,
  id,
  onUpdate,
}) => {
  const [open, setOpen] = useState(false);
  const [apiResponse, setApiResponse] = useState<{ success: boolean; message: string } | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<StagiaireForm>({
    resolver: zodResolver(StagiaireSchema),
    defaultValues: {
      ...stagiaire,
      role: "stagiaire",
    },
  });

  const onSubmit = async (data: StagiaireForm) => {
  try {
    const formData = new FormData();
    formData.append("nom", data.nom);
    formData.append("prenom", data.prenom);
    formData.append("email", data.email);
    formData.append("ecole", data.ecole);
    formData.append("filiere", data.filiere);
    formData.append("niveau", data.niveau);

    if (data.cv && data.cv[0]) formData.append("cv", data.cv[0]);
    if (data.lettre_motivation && data.lettre_motivation[0])
      formData.append("lettre_motivation", data.lettre_motivation[0]);

    const response = await axiosClient.patch(`/modifyUser/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    setApiResponse({
      success: true,
      message: response.data.message || "Utilisateur modifié avec succès",
    });

    onUpdate && onUpdate(response.data.user); // mettre à jour le parent
    setOpen(false); // fermer la modal
  } catch (error: any) {
    console.error(error); // Ajouté pour debug
    setApiResponse({
      success: false,
      message: error.response?.data?.message || "Erreur lors de la modification",
    });
  }
};

  return (
    <div>
      <button
        onClick={() => setOpen(true)}
        className="px-3 py-1 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-700"
      >
        {stagiaire ? "Modifier" : "Ajouter"}
      </button>

      {open && (
        <Modal onClose={() => setOpen(false)}>
          <h2 className="text-xl font-bold mb-4">
            {stagiaire ? "Modifier le stagiaire" : "Ajouter un stagiaire"}
          </h2>
            {apiResponse && (
            <div
                className={`mb-3 p-2 rounded ${
                apiResponse.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-100 text-red-800"
                }`}
            >
                {apiResponse.message}
            </div>
            )}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
  
            {/* Ligne 1 : Nom + Prénom */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                <label className="block text-sm font-medium">Nom</label>
                <input {...register("nom")} className="w-full p-2 border rounded" />
                {errors.nom && <p className="text-red-500 text-sm">{errors.nom.message}</p>}
                </div>

                <div>
                <label className="block text-sm font-medium">Prénom</label>
                <input {...register("prenom")} className="w-full p-2 border rounded" />
                {errors.prenom && <p className="text-red-500 text-sm">{errors.prenom.message}</p>}
                </div>
            </div>

            {/* Email en pleine largeur */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                <label className="block text-sm font-medium">Email</label>
                <input type="email" {...register("email")} className="w-full p-2 border rounded" />
                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                </div>
                <div>
                <label className="block text-sm font-medium">École</label>
                <input {...register("ecole")} className="w-full p-2 border rounded" />
                </div>

            </div>

            {/* Ligne 2 : École + Filière */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                <label className="block text-sm font-medium">Filière</label>
                <input {...register("filiere")} className="w-full p-2 border rounded" />
                </div>

                <div>
                <label className="block text-sm font-medium">Niveau</label>
                <input {...register("niveau")} className="w-full p-2 border rounded" />
                </div>

                
            </div>

           
            
            {/* CV */}
            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Cv du stagiaire</label>
                <input
                type="file"
                {...register("cv")}
                className="w-full border rounded-lg px-3 py-2 mb-2"
                required
                />
                {stagiaire?.cv && (
                <a
                    href={stagiaire.cv.startsWith('http') ? stagiaire.cv : `/${stagiaire.cv}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                >
                    {/* Icône SVG */}
                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    Voir le CV actuel
                </a>
                )}
            </div>

            {/* Lettre de motivation */}
            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Lettre de motivation</label>
                <input
                type="file"
                {...register("lettre_motivation")}
                className="w-full border rounded-lg px-3 py-2 mb-2"
                required
                />
                {stagiaire?.lettre_motivation && (
                <a
                    href={stagiaire.lettre_motivation.startsWith('http') ? stagiaire.lettre_motivation : `/${stagiaire.lettre_motivation}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                >
                    {/* Icône SVG */}
                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    Voir la lettre de motivation actuelle
                </a>
                )}
            </div>

            {/* Boutons */}
            <div className="mt-6 flex justify-end gap-3">
                <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                type="button"
                >
                Annuler
                </button>
                <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                Enregistrer
                </button>
            </div>
            </form>
        </Modal>
      )}
    </div>
  );
};

export default ModifierStagiaireButton;
