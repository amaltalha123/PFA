import React, { useState } from "react";
import ReactDOM from "react-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axiosClient from "../../api/axiosClient";

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
  role: 'encadrant';
  Stagiaire: any;
  Encadrant: Encadrant;
}

interface AjouterEncadrantProps {
  onCreate: (newUser: UserDetail) => void;
  departements:Departement[];
}

// --- Schéma Zod ---
const EncadrantSchema = z.object({
  nom: z.string().min(1, "Nom obligatoire"),
  prenom: z.string().min(1, "Prénom obligatoire"),
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  role: z.string().transform(() => "encadrant"),
  specialite: z.string().min(1, "spécialité obligatoire"),
  departement: z.string().min(1, "département obligatoire"),
  
});

type EncadrantForm = z.infer<typeof EncadrantSchema>;

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
const AjouterEncadrantButton: React.FC<AjouterEncadrantProps> = ({ onCreate,departements }) => {
  const [open, setOpen] = useState(false);
  const [apiResponse, setApiResponse] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EncadrantForm>({
    resolver: zodResolver(EncadrantSchema),
    defaultValues: {
      role: "encadrant",
    },
  });

  const onSubmit = async (data: EncadrantForm) => {
  try {
    const response = await axiosClient.post(
      "/register/user/encadrant",
      {
        nom: data.nom,
        prenom: data.prenom,
        email: data.email,
        password: data.password,
        specialite: data.specialite,
        departement: data.departement,
        role: "encadrant",
      },
      { headers: { "Content-Type": "application/json" } }
    );

    setApiResponse({
      success: true,
      message: response.data.message || "Encadrant ajouté avec succès",
    });

    onCreate(response.data.user);
    setOpen(false);
  } catch (error: any) {
    console.error(error);
    setApiResponse({
      success: false,
      message:
        error.response?.data?.message || "Erreur lors de l'ajout de l'encadrant",
    });
  }
};


  return (
    <div>
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-green-700 w-40 text-center"
      >
        + Encadrant
      </button>

      {open && (
        <Modal onClose={() => setOpen(false)}>
          <h2 className="text-xl font-bold mb-4">Ajouter un Encadrant</h2>

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

          {/* Formulaire */}
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

            <div>
            <label className="block text-sm font-medium">spécialité</label>
            <input
                {...register("specialite")}
                className="border p-2 rounded w-full"
            />
            {errors.specialite && (
                <p className="text-red-500 text-sm">{errors.specialite.message}</p>
            )}
            </div>

            {/* Département */}
            <div>
                <label className="block text-sm font-medium">Département</label>
                <select
                {...register("departement")}
                className="w-full p-2 border rounded"
                defaultValue=""
                >
                <option value="" disabled>
                    -- Sélectionner un département --
                </option>
                {departements.map((dep) => (
                    <option key={dep.id} value={dep.nom}>
                    {dep.nom}
                    </option>
                ))}
                </select>
                {errors.departement && (
                <p className="text-red-500 text-sm">{errors.departement.message}</p>
                )}
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

export default AjouterEncadrantButton;
