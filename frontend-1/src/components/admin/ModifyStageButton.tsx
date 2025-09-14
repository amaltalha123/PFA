import React, { useEffect, useState } from "react";
import FormModal from "./FormModal";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axiosClient from "../../api/axiosClient";
import { Assignment} from "../../types/assignment-types";


interface ModifyStageButtonProps {
  stage: Assignment;
  onUpdate: (stage: Assignment) => void;
}

const stageSchema = z.object({
  stagiare_id: z.string().min(1, "Veuillez choisir un stagiaire"),
  encadrant_id: z.string().min(1, "Veuillez choisir un encadrant"),
  type_stage: z.string().nonempty("Veuillez choisir un type de stage"),
  sujet: z.string().min(3, "Le sujet doit contenir au moins 3 caractères"),
  date_debut: z.string().nonempty("La date de début est obligatoire"),
  date_fin: z.string().nonempty("La date de fin est obligatoire"),
});

type StageFormData = z.infer<typeof stageSchema>;

const ModifyStageButton: React.FC<ModifyStageButtonProps> = ({
  stage,
  onUpdate,
}) => {
  const [open, setOpen] = useState(false);
  const [apiResponse, setApiResponse] = useState<{ success: boolean; message: string } | null>(null);
  const [encadrants, setEncadrants] = useState<any[]>([]);
  const [stagiaires, setStagiaires] = useState<any[]>([]);

  useEffect(() => {
  

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
  
  }, []);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<StageFormData>({
  resolver: zodResolver(stageSchema),
  defaultValues: {
    stagiare_id: stage.Stagiaire?.id ? String(stage.Stagiaire.id) : "",
    encadrant_id: stage.Encadrant?.id ? String(stage.Encadrant.id) : "",
    type_stage: stage.type_stage,
    sujet: stage.sujet,
    date_debut: stage.date_debut,
    date_fin: stage.date_fin,
  },
});
useEffect(() => {
  if (open) {
    reset({
      stagiare_id: String(stage.Stagiaire.id),
      encadrant_id: String(stage.Encadrant.id),
      type_stage: stage.type_stage,
      sujet: stage.sujet,
      date_debut: formatDateForInput(stage.date_debut),
      date_fin: formatDateForInput(stage.date_fin),
    });
    setApiResponse(null);
  }
}, [open, reset, stage]);

    const formatDateForInput = (dateString: string) => {
    if (!dateString) return "";
    return dateString.split("T")[0]; // garde uniquement la partie avant 'T'
    };
  const onSubmit = async (data: StageFormData) => {
    try {
      const payload = {
      ...data,
      stagiare_id: Number(data.stagiare_id),
      encadrant_id: Number(data.encadrant_id),
    };
    console.log("Données envoyées à l'API:", payload);
    const response = await axiosClient.patch(`/stage/modify/${stage.id}`, payload, {
      headers: { "Content-Type": "application/json" },
    });

      setApiResponse({ success: true, message: "Stage modifié avec succès" });
      onUpdate(response.data.stage);
      reset();
      setOpen(false);
    } catch (error: any) {
      setApiResponse({
        success: false,
        message: error.response?.data?.message || "Erreur lors de la modification",
      });
    }
  };

  return (
    <>
      <button
        className="px-3 py-1 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600"
        onClick={(e) =>{setOpen(true); e.stopPropagation();}}
      >
        Modifier
      </button>

      {open && (
        <FormModal onClose={() => setOpen(false)}>
          <h2 className="text-xl font-bold mb-4">Modifier le Stage</h2>
         <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
  <div className="grid grid-cols-2 gap-4">
    {/* Stagiaire */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Stagiaire</label>
      <select
        {...register("stagiare_id")}
        className={`w-full px-3 py-2 border rounded-md ${
          errors.stagiare_id ? "border-red-500" : "border-gray-300"
        }`}
      >
        <option value="">Sélectionnez un stagiaire</option>
        {stagiaires.map((s) => (
          <option key={s.Stagiaire.id} value={s.Stagiaire.id}>
            {s.nom} {s.prenom}
          </option>
        ))}
      </select>
      {errors.stagiare_id && (
        <p className="text-red-500 text-sm mt-1">{errors.stagiare_id.message}</p>
      )}
    </div>

    {/* Encadrant */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Encadrant</label>
      <select
        {...register("encadrant_id")}
        className={`w-full px-3 py-2 border rounded-md ${
          errors.encadrant_id ? "border-red-500" : "border-gray-300"
        }`}
      >
        <option value="">Sélectionnez un encadrant</option>
        {encadrants.map((e) => (
          <option key={e.Encadrant.id} value={e.Encadrant.id}>
            {e.nom} {e.prenom}
          </option>
        ))}
      </select>
      {errors.encadrant_id && (
        <p className="text-red-500 text-sm mt-1">{errors.encadrant_id.message}</p>
      )}
    </div>
  </div>

  <div className="grid grid-cols-2 gap-4">
    {/* Date Début */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Date Début</label>
      <input
        type="date"
        {...register("date_debut")}
        className={`w-full px-3 py-2 border rounded-md ${
          errors.date_debut ? "border-red-500" : "border-gray-300"
        }`}
      />
      {errors.date_debut && (
        <p className="text-red-500 text-sm mt-1">{errors.date_debut.message}</p>
      )}
    </div>

    {/* Date Fin */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Date Fin</label>
      <input
        type="date"
        {...register("date_fin")}
        className={`w-full px-3 py-2 border rounded-md ${
          errors.date_fin ? "border-red-500" : "border-gray-300"
        }`}
      />
      {errors.date_fin && (
        <p className="text-red-500 text-sm mt-1">{errors.date_fin.message}</p>
      )}
    </div>
  </div>

  {/* Sujet */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">Sujet</label>
    <input
      type="text"
      {...register("sujet")}
      className={`w-full px-3 py-2 border rounded-md ${
        errors.sujet ? "border-red-500" : "border-gray-300"
      }`}
    />
    {errors.sujet && (
      <p className="text-red-500 text-sm mt-1">{errors.sujet.message}</p>
    )}
  </div>

  {/* Type de Stage */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">Type de Stage</label>
    <select
      {...register("type_stage")}
      className="w-full px-3 py-2 border border-gray-300 rounded-md"
    >
      <option value="PFA">PFA</option>
      <option value="PFE">PFE</option>
      <option value="initiation">initiation</option>
    </select>
  </div>

  {/* Boutons */}
  <div className="flex justify-end space-x-3 pt-4">
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
      Sauvegarder
    </button>
  </div>
</form>

          {apiResponse && (
            <p
              className={`mt-4 text-center font-medium ${
                apiResponse.success ? "text-green-600" : "text-red-600"
              }`}
            >
              {apiResponse.message}
            </p>
          )}
        </FormModal>
      )}
    </>
  );
};

export default ModifyStageButton;
