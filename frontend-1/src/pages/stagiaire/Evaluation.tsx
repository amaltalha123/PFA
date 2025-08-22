import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Button,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Visibility } from '@mui/icons-material';
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
  const [evaluation, setEvaluation] = useState<EvaluationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [evaluationExists, setEvaluationExists] = useState<boolean>(false); // État pour vérifier l'existence de l'évaluation

  // Fonction pour récupérer l'évaluation existante
  const fetchExistingEvaluation = async (assignmentId: number) => {
    try {
      const res = await axiosClient.get(`/evaluations/stagiaire/get/${assignmentId}`);
      if (res.status === 200) {
        const evaluationData = res.data.evaluation;
        setEvaluation(evaluationData);
        setEvaluationExists(true); // L'évaluation existe
        // Récupérer le fichier d'évaluation si l'évaluation existe
        handleEvaluationFile(assignmentId);
      } else {
        setError(res.data.message || 'Erreur lors de la récupération de l\'évaluation.');
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        // Gérer les erreurs 404 et autres
          setError(err.response.data.message || 'Erreur lors de la récupération de l\'évaluation.');
        
      } else {
        setError('Erreur lors de la récupération de l\'évaluation.');
      }
    } finally {
      setLoading(false); // Arrêter le chargement ici
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

  return (
    <div className="p-6">
      <Typography variant="h4" component="h2" sx={{ mb: 4, fontWeight: 700 }}>
        Évaluation Du stagiaire
      </Typography>

      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {evaluationExists ? (
              <>
                {fileUrl ? (
                  <Box>
                    <Typography variant="h6" component="h3" sx={{ mb: 2 }}>
                      Fichier d'Évaluation
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
                  </Box>
                ) : (
                  <Typography variant="body1" color="text.secondary">
                    Le fichier d'évaluation n'est pas encore disponible.
                  </Typography>
                )}
              </>
            ) : (
              <Typography variant="body1" color="text.secondary">
                L'évaluation n'est pas encore soumise par votre encadrant.
              </Typography>
            )}
          </>
        )}
      </Paper>
    </div>
  );
};

export default Evaluation;
