import React, { useState, useEffect } from 'react';
import { 
  Paper, 
  Typography, 
  Button, 
  Box, 
  CircularProgress, 
  TextField, 
  Alert 
} from '@mui/material';
import { Download, Description } from '@mui/icons-material';
import axiosClient from '../../api/axiosClient';
import { Assignment } from '../../types/assignment-types';
import axios from 'axios';

interface RapportData {
  id: number;
  fichier: string;
  contenue: string;
  createdAt: string;
}

const Rapport: React.FC = () => {
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [rapport, setRapport] = useState<RapportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [contenue, setContenu] = useState<string>(''); // État pour le contenu du rapport
  const [submitting, setSubmitting] = useState(false);
  const [isStageFinished, setIsStageFinished] = useState<boolean>(false); // État pour vérifier si le stage est terminé
  const [submissionDeadline, setSubmissionDeadline] = useState<Date | null>(null); // État pour la date limite de soumission

  useEffect(() => {
    const fetchRapport = async () => {
      try {
        const selectedAssignment = localStorage.getItem('selectedAssignment');
        if (!selectedAssignment) {
          throw new Error('Aucun assignment sélectionné');
        }
        const assignmentData: Assignment = JSON.parse(selectedAssignment);
        setAssignment(assignmentData);
        
        const response = await axiosClient.get(`/rapport/${assignmentData.id}`);
        if (response.data.success) {
          setRapport(response.data.data[0]);
        } else {
          setRapport(null);
        }

        // Vérifiez si la date de fin du stage est atteinte
        const now = new Date();
        const dateFin = new Date(assignmentData.date_fin);
        setIsStageFinished(now >= dateFin); // Met à jour l'état en fonction de la date de fin

        // Calculer la date limite de soumission (3 jours après la date de fin)
        const deadline = new Date(dateFin);
        deadline.setDate(deadline.getDate() + 3);
        setSubmissionDeadline(deadline); // Met à jour la date limite

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRapport();
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleUploadRapport = async () => {
    if (!file || !assignment || !contenue) return; // Vérifiez que assignment et contenu ne sont pas null

    setSubmitting(true);
    const formData = new FormData();
    formData.append('fichier', file);
    formData.append('contenue', contenue); // Ajoutez le contenu au FormData

    try {
      const response = await axiosClient.post(`/rapport/add/${assignment.id}`, formData, { 
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setRapport(response.data.data); // Mettre à jour le rapport avec le nouveau fichier
        setFile(null); // Réinitialiser le fichier
        setContenu(''); // Réinitialiser le contenu
      } else {
        // Si la réponse n'est pas un succès, afficher le message d'erreur
        alert(response.data.message);
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        alert(err.response.data.message || 'Erreur lors de la récupération de l\'évaluation.');
      } else {
        setError('Erreur lors de la récupération de l\'évaluation.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <div className="p-6">
      <Typography variant="h4" component="h2" sx={{ mb: 4, fontWeight: 700 }}>
        Rapport de stage
      </Typography>

      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        {/* Afficher le formulaire pour télécharger un rapport uniquement si aucun rapport n'existe et si le stage est terminé */}
        {rapport ? (
          <Box display="flex" alignItems="center" mb={2}>
            <Description color="primary" sx={{ fontSize: 40, mr: 2 }} />
            <Box flexGrow={1}>
              <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                Rapport
              </Typography>
              <Typography variant="caption" color="text.secondary">
                <div>
                  Soumis le {new Date(rapport.createdAt).toLocaleDateString('fr-FR')}
                </div>
                <div>
                  <span className="font-bold text-lg text-gray-800">Contenue :</span>
                  <p className="mt-1 p-3 bg-gray-100 rounded-lg shadow-sm border-l-4 border-blue-500">
                    {rapport.contenue}
                  </p>
                </div>
              </Typography>
            </Box>
            
            <Button
              variant="contained"
              startIcon={<Download />}
              href={rapport.fichier}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                if (!rapport.fichier) {
                  alert("Le fichier n'est pas disponible.");
                }
              }}
            >
              Télécharger
            </Button>
          </Box>
        ) : (
          <>
            {/* Afficher un message si le stage n'est pas terminé */}
            {!isStageFinished ? (
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                La durée du stage n'est pas encore terminée. Vous ne pouvez pas soumettre de rapport.
              </Typography>
            ) : (
              <>
                {/* Avertissement si le stage est terminé mais que la date limite n'est pas dépassée */}
                {submissionDeadline && new Date() < submissionDeadline && (
                  <Alert severity="warning" sx={{ mb: 3 }}>
                    Vous avez 3 jours après la fin du stage pour soumettre votre rapport.
                  </Alert>
                )}
                {/* Formulaire pour télécharger un rapport */}
                <Box mb={3}>
                  <TextField
                    type="file"
                    onChange={handleFileChange}
                    fullWidth
                    variant="outlined"
                    inputProps={{ accept: '.pdf,.doc,.docx' }} // Limiter les types de fichiers
                  />
                </Box>
                <Box mb={3}>
                  <TextField
                    label="Contenu du rapport"
                    value={contenue}
                    onChange={(e) => setContenu(e.target.value)} // Mettre à jour l'état du contenu
                    fullWidth
                    variant="outlined"
                    multiline
                    rows={4} // Nombre de lignes visibles
                  />
                </Box>
                <Box display="flex" justifyContent="flex-end" mb={3}>
                  <Button 
                    variant="contained" 
                    onClick={handleUploadRapport} 
                    disabled={submitting || !file || !contenue}
                  >
                    {submitting ? 'Téléchargement...' : 'Télécharger le rapport'}
                  </Button>
                </Box>
              </>
            )}
          </>
        )}
      </Paper>
    </div>
  );
};

export default Rapport;
