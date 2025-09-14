import React, { useState } from "react";
import ReactDOM from "react-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axiosClient from "../../api/axiosClient";

interface Stagiaire {
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
  password:string;
  role: "stagiaire";
  Stagiaire: Stagiaire;
  Encadrant:any;
}

interface AjouterStagiaireProps {
  onCreate: (newUser: UserDetail) => void; // callback vers le parent
}

// --- Schéma Zod ---
const StagiaireSchema = z.object({
  nom: z.string().min(1, "Nom obligatoire"),
  prenom: z.string().min(1, "Prénom obligatoire"),
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  role: z.string().transform(() => "stagiaire"),
  ecole: z.string().min(1, "École obligatoire"),
  filiere: z.string().min(1, "Filière obligatoire"),
  niveau: z.string().min(1, "Niveau obligatoire"),
  cv: z.any().optional(),
  lettre_motivation: z.any().optional(),
});

type StagiaireForm = z.infer<typeof StagiaireSchema>;

// --- Modal ---
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

// --- Composant ---
const AjouterStagiaireButton: React.FC<AjouterStagiaireProps> = ({ onCreate }) => {
  const [open, setOpen] = useState(false);
  const [apiResponse, setApiResponse] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StagiaireForm>({
    resolver: zodResolver(StagiaireSchema),
    defaultValues: {
      role: "stagiaire",
    },
  });

  const onSubmit = async (data: StagiaireForm) => {
    try {
      const formData = new FormData();
      formData.append("nom", data.nom);
      formData.append("prenom", data.prenom);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("ecole", data.ecole);
      formData.append("filiere", data.filiere);
      formData.append("niveau", data.niveau);
      formData.append("role", "stagiaire");

      if (data.cv && data.cv[0]) formData.append("cv", data.cv[0]);
      if (data.lettre_motivation && data.lettre_motivation[0])
        formData.append("lettre_motivation", data.lettre_motivation[0]);

      const response = await axiosClient.post("/register/user/stagiaire", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setApiResponse({
        success: true,
        message: response.data.message || "Stagiaire ajouté avec succès",
      });

      onCreate(response.data.user); // mettre à jour le parent
      setOpen(false);
    } catch (error: any) {
      console.error(error);
      setApiResponse({
        success: false,
        message:
          error.response?.data?.message || "Erreur lors de l'ajout du stagiaire",
      });
    }
  };

  return (
    <div>
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-green-700 w-40 text-center"
      >
        + stagiaire
      </button>

      {open && (
        <Modal onClose={() => setOpen(false)}>
          <h2 className="text-xl font-bold mb-4">Ajouter un stagiaire</h2>

          {apiResponse && (
            <div
              className={`mb-3 p-2 rounded ${
                apiResponse.success
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {apiResponse.message}
            </div>
          )}

          {/* Formulaire (copie du tien) */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            {/* Nom + Prénom */}
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

            {/* Email + École */}
            <div className="grid grid-cols-2 gap-4">
              <div>
      <label className="block text-sm font-medium">Email</label>
      <input {...register("email")} className="border p-2 rounded w-full" />
      {errors.email && (
        <p className="text-red-500 text-sm">{errors.email.message}</p>
      )}
    </div>

    {/* Mot de passe */}
    <div>
      <label className="block text-sm font-medium">Mot de passe</label>
      <input
        type="password"
        {...register("password")}
        className="border p-2 rounded w-full"
      />
      {errors.password && (
        <p className="text-red-500 text-sm">{errors.password.message}</p>
      )}
    </div>
            </div>

            {/* Filière + Niveau */}

            <div className="grid grid-cols-2 gap-4">
                <div>
                <label className="block text-sm font-medium">École</label>
                <input {...register("ecole")} className="w-full p-2 border rounded" />
                {errors.ecole && <p className="text-red-500 text-sm">{errors.ecole.message}</p>}
                </div>

                <div>
                <label className="block text-sm font-medium">Filière</label>
                <input {...register("filiere")} className="w-full p-2 border rounded" />
                {errors.filiere && <p className="text-red-500 text-sm">{errors.filiere.message}</p>}
                </div>

                <div>
                <label className="block text-sm font-medium">Niveau</label>
                <input {...register("niveau")} className="w-full p-2 border rounded" />
                {errors.niveau && <p className="text-red-500 text-sm">{errors.niveau.message}</p>}
                </div>
            </div>

            {/* CV */}
            <div>
              <label className="block text-sm font-medium mb-1">CV</label>
              <input type="file" {...register("cv")} className="w-full border rounded px-3 py-2" />
            </div>

            {/* Lettre de motivation */}
            <div>
              <label className="block text-sm font-medium mb-1">Lettre de motivation</label>
              <input type="file" {...register("lettre_motivation")} className="w-full border rounded px-3 py-2" />
            </div>

            {/* Boutons */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
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

export default AjouterStagiaireButton;
