import React, { useState, useEffect } from 'react';
import { 
  Paper, 
  Typography, 
  Button, 
  Divider, 
  Box, 
  CircularProgress,
  TextField,
  Rating,
  Chip,
  Alert
} from '@mui/material';
import { Download, Description, Grade, AddComment } from '@mui/icons-material';
import axiosClient from '../../api/axiosClient';
import axios from 'axios';

interface Evaluation {
  presentation_generale: number;
  stricture_méthodologie: number;
  contenue_rapport: number;
  esprit_analyse_synthèse: number;
}

interface RapportData {
  id: number;
  fichier: string;
  contenue: String;
  createdAt: string;
  evaluation?: Evaluation;
}

const Rapport: React.FC = () => {
  const [rapport, setRapport] = useState<RapportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [evaluationMode, setEvaluationMode] = useState(false);
  const [presentation_generale, setPresentationGenerale] = useState<number | null>(null);
  const [stricture_méthodologie, setStrictureMethodologie] = useState<number | null>(null);
  const [contenue_rapport, setContenueRapport] = useState<number | null>(null);
  const [esprit_analyse_synthèse, setEspritAnalyseSynthese] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchRapport = async () => {
      try {
        const selectedAssignment = localStorage.getItem('selectedAssignment');
        if (!selectedAssignment) {
          throw new Error('Aucun assignment sélectionné');
        }
        
        const assignment = JSON.parse(selectedAssignment);
        const response = await axiosClient.get(`/rapport/${assignment.id}`);
        if (response.data.success) {
          setRapport(response.data.data[0]);
        } else {
          setRapport(null);
        }
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRapport();
  }, []);

  const fetchEvaluation = async () => {
    if (!rapport) return;

    try {
        const response = await axiosClient.get(`/evaluations/rapport/get/${rapport.id}`);
        if (response.data.success && response.data.evaluation) {
            const evaluation = response.data.evaluation;
            console.log(evaluation); // Check if the evaluation is logged correctly
            setPresentationGenerale(evaluation.presentation_generale);
            setStrictureMethodologie(evaluation.stricture_méthodologie);
            setContenueRapport(evaluation.contenue_rapport);
            setEspritAnalyseSynthese(evaluation.esprit_analyse_synthèse);
        } else {
            console.error("Evaluation not found or response not successful");
        }
    } catch (err) {
        console.error(err);
         if (axios.isAxiosError(err) && err.response) {
                setEvaluationMode(true);
        } else {
                setError('Erreur lors de la soumission de l\'évaluation.');
        }
    }
};


 const handleSubmitEvaluation = async () => {
    if (presentation_generale === null || stricture_méthodologie === null || contenue_rapport === null || esprit_analyse_synthèse === null) return;
    
    setSubmitting(true);
    try {
      const response = await axiosClient.post(`/evaluations/rapport/add/${rapport?.id}`, {
        presentation_generale,
        stricture_méthodologie,
        contenue_rapport,
        esprit_analyse_synthèse
      });
      
      if (response.data.success) {
        setRapport(prev => ({
          ...prev!,
          evaluation: {
            presentation_generale,
            stricture_méthodologie,
            contenue_rapport,
            esprit_analyse_synthèse,
          }
        }));
        setEvaluationMode(false);
      }
      
    } catch (err: any) {
      if (err.response) {
        setError(err.response.data.message || "Erreur inconnue");
      } else {
        console.error(err.message);
        setError("Erreur réseau ou serveur");
      }
    } finally {
      setSubmitting(false);
    }
  };

const handleEvaluateClick = () => {
    setEvaluationMode(true);
    fetchEvaluation(); // Fetch existing evaluation when entering evaluation mode
};

// In the rendering logic, ensure to check if the evaluation state variables are set
{evaluationMode || true ? (
    <Box>
        <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 3 }}>
            Ajouter une évaluation
        </Typography>

        <Box mb={3}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Présentation générale (sur 5):
            </Typography>
            <Rating 
                value={presentation_generale} 
                max={5} 
                onChange={(_, newValue) => setPresentationGenerale(newValue)}
            />
        </Box>

        <Box mb={3}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Structure méthodologie (sur 5):
            </Typography>
            <Rating 
                value={stricture_méthodologie} 
                max={5} 
                onChange={(_, newValue) => setStrictureMethodologie(newValue)}
            />
        </Box>

        <Box mb={3}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Contenu du rapport (sur 5):
            </Typography>
            <Rating 
                value={contenue_rapport} 
                max={5} 
                onChange={(_, newValue) => setContenueRapport(newValue)}
            />
        </Box>

        <Box mb={3}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Esprit d'analyse et synthèse (sur 5):
            </Typography>
            <Rating 
                value={esprit_analyse_synthèse} 
                max={5} 
                onChange={(_, newValue) => setEspritAnalyseSynthese(newValue)}
            />
        </Box>

        <Box display="flex" justifyContent="flex-end">
            <Button 
                variant="outlined" 
                sx={{ mr: 2 }} 
                onClick={() => setEvaluationMode(false)}
            >
                Annuler
            </Button>
            <Button 
                variant="contained" 
                startIcon={<AddComment />}
                onClick={handleSubmitEvaluation}
                disabled={submitting}
            >
                {submitting ? 'Envoi en cours...' : 'Soumettre'}
            </Button>
        </Box>
    </Box>
) : (
    <Box display="flex" justifyContent="center">
        <Button
            variant="contained"
            startIcon={<Grade />}
            onClick={handleEvaluateClick}
        >
            Évaluer ce rapport
        </Button>
    </Box>
)}


 
 
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

      {rapport ? (
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          {/* Section Rapport */}
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
                  <span className="font-bold text-lg text-gray-800">Contenu :</span>
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

          <Divider sx={{ my: 3 }} />

          {/* Section Évaluation */}
          {rapport.evaluation ? (
            <Box>
              <Box display="flex" alignItems="center" mb={2}>
                <Grade color="secondary" sx={{ fontSize: 40, mr: 2 }} />
                <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                  Évaluation du rapport
                </Typography>
              </Box>

              <Box mb={2}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Évaluation:
                </Typography>
                <Box display="flex" flexDirection="column" gap={1}>
                  <Box display="flex" alignItems="center">
                    <Typography variant="body2" sx={{ mr: 1 }}>Présentation générale:</Typography>
                    <Rating value={rapport.evaluation.presentation_generale} max={5} readOnly />
                    <Chip label={`${rapport.evaluation.presentation_generale}/5`} color="primary" sx={{ ml: 2 }} />
                  </Box>
                  <Box display="flex" alignItems="center">
                    <Typography variant="body2" sx={{ mr: 1 }}>Structure méthodologie:</Typography>
                    <Rating value={rapport.evaluation.stricture_méthodologie} max={5} readOnly />
                    <Chip label={`${rapport.evaluation.stricture_méthodologie}/5`} color="primary" sx={{ ml: 2 }} />
                  </Box>
                  <Box display="flex" alignItems="center">
                    <Typography variant="body2" sx={{ mr: 1 }}>Contenu du rapport:</Typography>
                    <Rating value={rapport.evaluation.contenue_rapport} max={5} readOnly />
                    <Chip label={`${rapport.evaluation.contenue_rapport}/5`} color="primary" sx={{ ml: 2 }} />
                  </Box>
                  <Box display="flex" alignItems="center">
                    <Typography variant="body2" sx={{ mr: 1 }}>Esprit d'analyse et synthèse:</Typography>
                    <Rating value={rapport.evaluation.esprit_analyse_synthèse} max={5} readOnly />
                    <Chip label={`${rapport.evaluation.esprit_analyse_synthèse}/5`} color="primary" sx={{ ml: 2 }} />
                  </Box>
                </Box>
              </Box>

              <Typography variant="caption" color="text.secondary">
                Évalué le {new Date().toLocaleDateString('fr-FR')}
              </Typography>
            </Box>
          ) : evaluationMode ? (
            <Box>
              <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 3 }}>
                Ajouter une évaluation
              </Typography>

              <Box mb={3}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Présentation générale (sur 5):
                </Typography>
                <Rating 
                  value={presentation_generale} 
                  max={5} 
                  onChange={(_, newValue) => setPresentationGenerale(newValue)}
                />
              </Box>

              <Box mb={3}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Structure méthodologie (sur 5):
                </Typography>
                <Rating 
                  value={stricture_méthodologie} 
                  max={5} 
                  onChange={(_, newValue) => setStrictureMethodologie(newValue)}
                />
              </Box>

              <Box mb={3}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Contenu du rapport (sur 5):
                </Typography>
                <Rating 
                  value={contenue_rapport} 
                  max={5} 
                  onChange={(_, newValue) => setContenueRapport(newValue)}
                />
              </Box>

              <Box mb={3}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Esprit d'analyse et synthèse (sur 5):
                </Typography>
                <Rating 
                  value={esprit_analyse_synthèse} 
                  max={5} 
                  onChange={(_, newValue) => setEspritAnalyseSynthese(newValue)}
                />
              </Box>

              <Box display="flex" justifyContent="flex-end">
                <Button 
                  variant="outlined" 
                  sx={{ mr: 2 }} 
                  onClick={() => setEvaluationMode(false)}
                >
                  Annuler
                </Button>
                <Button 
                  variant="contained" 
                  startIcon={<AddComment />}
                  onClick={handleSubmitEvaluation}
                  disabled={submitting}
                >
                  {submitting ? 'Envoi en cours...' : 'Soumettre'}
                </Button>
              </Box>
            </Box>
          ) : (
            <Box display="flex" justifyContent="center">
              <Button
                variant="contained"
                startIcon={<Grade />}
                onClick={handleEvaluateClick} // Use the new function
              >
                Évaluer ce rapport
              </Button>
            </Box>
          )}
        </Paper>
      ) : (
        <Paper elevation={0} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            Aucun rapport n'a été soumis pour le moment
          </Typography>
        </Paper>
      )}
    </div>
  );
};

export default Rapport;
