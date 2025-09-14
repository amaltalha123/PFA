import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axiosClient from "../../api/axiosClient";

interface Departement {
  id: number;
  nom: string;
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
  role: "encadrant";
  Stagiaire: any;
  Encadrant: Encadrant;
}

interface ModifierEncadrantProps {
  encadrant?: Partial<UserDetail>;
  id?: number;
  departements: Departement[];
  onUpdate: (updatedUser:UserDetail) => void;
}

// Schéma Zod pour validation
const EncadrantSchema = z.object({
  nom: z.string().min(1, "Nom obligatoire"),
  prenom: z.string().min(1, "Prénom obligatoire"),
  email: z.string().email("Email invalide"),
  specialite: z.string().min(1, "Spécialité obligatoire"),
  departement: z.string().min(1, "Département obligatoire"),
});

type EncadrantForm = z.infer<typeof EncadrantSchema>;

// Modal générique
const Modal: React.FC<{ onClose: () => void; children: React.ReactNode }> = ({
  children,
  onClose,
}) => {
  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-xl shadow-lg w-11/12 max-w-3xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body
  );
};

const ModifierEncadrantButton: React.FC<ModifierEncadrantProps> = ({
  encadrant,
  id,
  departements,
  onUpdate,
}) => {
  const [open, setOpen] = useState(false);
  const [apiResponse, setApiResponse] = useState<{ success: boolean; message: string } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EncadrantForm>({
    resolver: zodResolver(EncadrantSchema),
    defaultValues: {
      nom: "",
      prenom: "",
      email: "",
      specialite: "",
      departement: "",
    },
  });

  // Met à jour les valeurs du formulaire quand encadrant change
  useEffect(() => {
    if (encadrant) {
      reset({
        nom: encadrant.nom || "",
        prenom: encadrant.prenom || "",
        email: encadrant.email || "",
        specialite: encadrant.Encadrant?.specialite || "",
        departement: encadrant.Encadrant?.Departement?.nom || "",
      });
    }
  }, [encadrant, reset]);

  const onSubmit = async (data: EncadrantForm) => {
    try {
      // Préparer le payload selon votre API
      const payload = {
        nom: data.nom,
        prenom: data.prenom,
        email: data.email,
        specialite: data.specialite,
        departement: data.departement,
      };

      const response = await axiosClient.patch(`/modifyUser/${id}`, payload);

      setApiResponse({
        success: true,
        message: response.data.message || "Encadrant modifié avec succès",
      });

      if (response.data.user) {
        onUpdate(response.data.user);
      }

      setOpen(false);
    } catch (error: any) {
      console.error(error);
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
        {encadrant ? "Modifier" : "Ajouter un encadrant"}
      </button>

      {open && (
        <Modal onClose={() => setOpen(false)}>
          <h2 className="text-xl font-bold mb-4">
            {encadrant ? "Modifier l'encadrant" : "Ajouter un encadrant"}
          </h2>

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

            {/* Email */}
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input type="email" {...register("email")} className="w-full p-2 border rounded" />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>

            {/* Spécialité */}
            <div>
              <label className="block text-sm font-medium">Spécialité</label>
              <input {...register("specialite")} className="w-full p-2 border rounded" />
              {errors.specialite && <p className="text-red-500 text-sm">{errors.specialite.message}</p>}
            </div>

            {/* Département */}
            <div>
              <label className="block text-sm font-medium">Département</label>
              <select {...register("departement")} className="w-full p-2 border rounded">
                <option value="">-- Sélectionner --</option>
                {departements.map((dep) => (
                  <option key={dep.id} value={dep.nom}>
                    {dep.nom}
                  </option>
                ))}
              </select>
              {errors.departement && <p className="text-red-500 text-sm">{errors.departement.message}</p>}
            </div>

            {/* Boutons */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setOpen(false)}
                type="button"
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

export default ModifierEncadrantButton;