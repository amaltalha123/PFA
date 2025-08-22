// src/components/assignment/Evaluation.tsx
import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Button,
  Box,
  Rating,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Save, Visibility } from '@mui/icons-material';
import axiosClient from '../../api/axiosClient';
import axios from 'axios';

// Interface pour l'évaluation
interface EvaluationData {
  ponctualite: number | null;
  autonomie: number | null;
  integration: number | null;
  qualite_travaille: number | null;
}

const Evaluation: React.FC = () => {
  const [evaluation, setEvaluation] = useState<EvaluationData>({
    ponctualite: null,
    autonomie: null,
    integration: null,
    qualite_travaille: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [evaluationExists, setEvaluationExists] = useState<boolean>(false); // Nouvel état pour vérifier l'existence de l'évaluation

  // Fonction pour récupérer l'évaluation existante
  const fetchExistingEvaluation = async (assignmentId: number) => {
    try {
      const res = await axiosClient.get(`/evaluations/stagiaire/get/${assignmentId}`);
      if (res.status === 200) {
        const evaluationData = res.data.evaluation;
        setEvaluation({
          ponctualite: evaluationData.ponctualite,
          autonomie: evaluationData.autonomie,
          integration: evaluationData.integration,
          qualite_travaille: evaluationData.qualite_travaille,
        });
        setEvaluationExists(true); // L'évaluation existe
        // Récupérer le fichier d'évaluation si l'évaluation existe
        handleEvaluationFile(assignmentId);
      } else {
        setError(res.data.message || 'Erreur lors de la récupération de l\'évaluation.');
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || 'Erreur lors de la récupération de l\'évaluation.');
      } else {
        setError('Erreur lors de la récupération de l\'évaluation.');
      }
    }
  };

  // Fonction pour récupérer le fichier d'évaluation
  const handleEvaluationFile = async (assignmentId: number) => {
    try {
      const res = await axiosClient.get(`/evaluations/${assignmentId}`, { responseType: 'blob' });
      if (res.status === 200) {
        const file = new Blob([res.data], { type: 'application/pdf' });
        const fileUrl = URL.createObjectURL(file);
        setFileUrl(fileUrl);
      } 
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || 'Erreur lors de la récupération du fichier d\'évaluation.');
      } else {
        setError('Erreur lors de la récupération du fichier d\'évaluation.');
      }
    }
  };

  // Utiliser useEffect pour récupérer l'évaluation existante lors du chargement du composant
  useEffect(() => {
    const selectedAssignment = localStorage.getItem('selectedAssignment');
    if (selectedAssignment) {
      const assignment = JSON.parse(selectedAssignment);
      fetchExistingEvaluation(assignment.id);
    }
  }, []);

  const handleSubmitEvaluation = async () => {
    const { ponctualite, autonomie, integration, qualite_travaille } = evaluation;

    if (ponctualite === null || autonomie === null || integration === null || qualite_travaille === null) {
      setError('Veuillez remplir toutes les évaluations.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null); // Réinitialiser le message de succès

    try {
      const selectedAssignment = localStorage.getItem('selectedAssignment');
      if (!selectedAssignment) {
        throw new Error('Aucun assignment sélectionné');
      }

      const assignment = JSON.parse(selectedAssignment);

      // Envoi des données d'évaluation au backend
      const res1 = await axiosClient.post(`/evaluations/stagiaire/add/${assignment.id}`, {
        ponctualite,
        autonomie,
        integration,
        qualite_travaille,
      });

     
      // Vérifiez si la réponse est un succès
      if (res1.status === 201 && res1.data.success) {
        setSuccessMessage(res1.data.message || 'Évaluation soumise avec succès.');

        // Récupération de l'évaluation
        const res2 = await axiosClient.get(`/evaluations/stagiaire/get/${assignment.id}`);
        if (res2.status === 200) {
          const evaluationData = res2.data.evaluation;

          // Génération du fichier d'évaluation
          const res3 = await axiosClient.post(`/evaluations/generate/${assignment.id}`);
          if (res3.status === 200 && res3.data.success) {
            handleEvaluationFile(assignment.id);
          } else {
            setError(res3.data.message || 'Erreur lors de la génération du fichier d\'évaluation.');
          }
        } else {
          setError(res2.data.message || 'Erreur lors de la récupération de l\'évaluation.');
        }
      } else {
        setError(res1.data.message || 'Erreur lors de la soumission de l\'évaluation.');
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || 'Erreur lors de la soumission de l\'évaluation...');
      } else {
        setError('Erreur lors de la soumission de l\'évaluation.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <Typography variant="h4" component="h2" sx={{ mb: 4, fontWeight: 700 }}>
        Évaluation Du stagiaire
      </Typography>

      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h6" component="h3" sx={{ mb: 3 }}>
          Formulaire d'Évaluation
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}

        <Box mb={3}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Ponctualité (sur 5):
          </Typography>
          <Rating 
            value={evaluation.ponctualite} 
            max={5} 
            onChange={(_, newValue) => setEvaluation({ ...evaluation, ponctualite: newValue })}
          />
        </Box>

        <Box mb={3}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Autonomie (sur 5):
          </Typography>
          <Rating 
            value={evaluation.autonomie} 
            max={5} 
            onChange={(_, newValue) => setEvaluation({ ...evaluation, autonomie: newValue })}
          />
        </Box>

        <Box mb={3}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Intégration (sur 5):
          </Typography>
          <Rating 
            value={evaluation.integration} 
            max={5} 
            onChange={(_, newValue) => setEvaluation({ ...evaluation, integration: newValue })}
          />
        </Box>

        <Box mb={3}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Qualité du travail (sur 5):
          </Typography>
          <Rating 
            value={evaluation.qualite_travaille} 
            max={5} 
            onChange={(_, newValue) => setEvaluation({ ...evaluation, qualite_travaille: newValue })}
          />
        </Box>

        {/* Afficher le bouton de soumission uniquement si l'évaluation n'existe pas */}
        {!evaluationExists && (
          <Box display="flex" justifyContent="flex-end">
            <Button 
              variant="contained" 
              startIcon={<Save />}
              onClick={handleSubmitEvaluation}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Soumettre'}
            </Button>
          </Box>
        )}
      </Paper>

      {fileUrl && (
        <Paper elevation={3} sx={{ p: 4, mt: 4, borderRadius: 2 }}>
          <Typography variant="h6" component="h3" sx={{ mb: 2 }}>
            Fichier d'Évaluation Généré
          </Typography>
          <Button
            variant="contained"
            startIcon={<Visibility />}
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Voir le Fichier
          </Button>
        </Paper>
      )}
    </div>
  );
};

export default Evaluation;
