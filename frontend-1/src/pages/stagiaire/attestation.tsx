import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Button,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Download, Visibility } from '@mui/icons-material';
import axiosClient from '../../api/axiosClient';
import axios from 'axios';

const Attestation: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [attestationExists, setAttestationExists] = useState(false);

  // Fonction pour récupérer l'attestation
  const fetchAttestation = async (assignmentId: number) => {
    try {
      const res = await axiosClient.get(`/attestation/${assignmentId}`, { 
        responseType: 'blob',
      });
      
      if (res.status === 200) {
        const file = new Blob([res.data], { type: 'application/pdf' });
        const fileUrl = URL.createObjectURL(file);
        setFileUrl(fileUrl);
        setAttestationExists(true);
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        if (err.response.status === 404) {
          setError("L'attestation n'est pas encore disponible.");
        } else {
          setError("Erreur lors de la récupération de l'attestation.");
        }
      } else {
        setError("Une erreur est survenue lors du chargement.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const selectedAssignment = localStorage.getItem('selectedAssignment');
    if (selectedAssignment) {
      const assignment = JSON.parse(selectedAssignment);
      fetchAttestation(assignment.id); // Utiliser l'ID de l'assignement pour récupérer l'attestation
    } else {
      setError("Aucun assignment sélectionné.");
      setLoading(false);
    }
  }, []);

  return (
    <div className="p-6">
      <Typography variant="h4" component="h2" sx={{ mb: 4, fontWeight: 700 }}>
        Attestation de stage
      </Typography>

      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            
            {attestationExists && fileUrl && (
              <Box>
                <Typography variant="h6" component="h3" sx={{ mb: 2 }}>
                  Votre attestation de stage
                </Typography>
                <Box display="flex" gap={2}>
                  <Button
                    variant="contained"
                    startIcon={<Visibility />}
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Voir l'attestation
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Download />}
                    href={fileUrl}
                    download="attestation-stage.pdf"
                  >
                    Télécharger
                  </Button>
                </Box>
              </Box>
            )}
          </>
        )}
      </Paper>
    </div>
  );
};

export default Attestation;
