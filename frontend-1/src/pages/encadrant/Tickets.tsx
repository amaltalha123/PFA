// src/components/assignment/Tickets.tsx
import React, { useState, useEffect } from 'react';
import { 
  Paper, 
  Avatar, 
  Typography, 
  Button, 
  Divider, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle, 
  TextField,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  Box
} from '@mui/material';
import { Comment, Person, Schedule, Download, ArrowDownward, ArrowUpward } from '@mui/icons-material';
import { Assignment } from '../../types/assignment-types';
import axiosClient from '../../api/axiosClient';

interface Ticket {
  id: number;
  subject: string;
  Contenue: string;
  updatedAt: string;
  piece_jointe?: string;
  commentaire_encadrant?: string;
}

const Tickets: React.FC = () => {
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [ticketsData, setTicketsData] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  useEffect(() => {
    const selectedAssignment = localStorage.getItem('selectedAssignment');
    if (selectedAssignment) {
      const assignmentData: Assignment = JSON.parse(selectedAssignment);
      setAssignment(assignmentData);
    } else {
      console.error('Aucun assignment sélectionné dans le localStorage.');
    }

    const fetchTickets = async () => {
      try {
        const selectedAssignment = localStorage.getItem('selectedAssignment');
        if (!selectedAssignment) {
          console.error('Aucun assignment sélectionné dans le localStorage.');
          return;
        }

        const assignment = JSON.parse(selectedAssignment);
        const assignmentId = assignment.id;
        const response = await axiosClient.get(`/ticket/all/${assignmentId}`);
      
        if (Array.isArray(response.data.data)) {
          setTicketsData(response.data.data); 
        } else {
          console.error('La réponse de l\'API n\'est pas un tableau:', response.data);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const sortedTickets = [...ticketsData].sort((a, b) => {
    const dateA = new Date(a.updatedAt).getTime();
    const dateB = new Date(b.updatedAt).getTime();
    return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
  });

  if (loading) {
    return <Typography variant="h6">Chargement des tickets...</Typography>;
  }

  if (error) {
    return <Typography variant="h6" color="error">{error}</Typography>;
  }

  return (
    <div className="p-6">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h2" sx={{ fontWeight: 700 }}>
          Tickets de support
        </Typography>
        
        <FormControl variant="outlined" size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Trier par date</InputLabel>
          <Select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
            label="Trier par date"
            startAdornment={
              sortOrder === 'newest' ? 
                <ArrowDownward color="action" sx={{ mr: 1 }} /> : 
                <ArrowUpward color="action" sx={{ mr: 1 }} />
            }
          >
            <MenuItem value="newest">
              <Box display="flex" alignItems="center">
                <ArrowDownward fontSize="small" sx={{ mr: 1 }} />
                Plus récent
              </Box>
            </MenuItem>
            <MenuItem value="oldest">
              <Box display="flex" alignItems="center">
                <ArrowUpward fontSize="small" sx={{ mr: 1 }} />
                Plus ancien
              </Box>
            </MenuItem>
          </Select>
        </FormControl>
      </Box>
      
      {sortedTickets.length === 0 ? (
        <Paper elevation={0} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            Aucun ticket à afficher
          </Typography>
        </Paper>
      ) : (
        sortedTickets.map(ticket => (
          <TicketCard 
            key={ticket.id} 
            ticket={ticket} 
            assignment={assignment} 
            setTicketsData={setTicketsData} 
          />
        ))
      )}
    </div>
  );
};

const TicketCard: React.FC<{ ticket: Ticket; assignment: Assignment | null; setTicketsData: React.Dispatch<React.SetStateAction<Ticket[]>> }> = ({ ticket, assignment, setTicketsData }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [comment, setComment] = useState('');

  const stagiaire = assignment ? assignment.Stagiaire : null;

 const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  
  // Vérifiez si la date est valide
  if (isNaN(date.getTime())) {
    return 'Date invalide'; // Retournez un message d'erreur ou une chaîne par défaut
  }

  return date.toLocaleString('fr-FR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });
};


  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setComment(''); // Réinitialiser le commentaire
  };

  const handleSubmitComment = async () => {
    
    // Simuler l'envoi du commentaire au backend
    try {
      const updatedTicket = { ...ticket, commentaire_encadrant: comment };
    const response = await axiosClient.put(`/ticket/addComment/${updatedTicket.id}/${assignment.id}`,{commentaire_encadrant: comment});
    
    if(response.data.success){
       // Mettre à jour l'état des tickets
      setTicketsData(prevTickets => 
        prevTickets.map(t => (t.id === ticket.id ? updatedTicket : t))
      );

      // Fermer le dialogue
      handleCloseDialog();
    }else{
      console.log(response.data);
    }
      
    }catch (error) {
        console.log(error.message);
    }
  
  };

  return (
    <Paper 
      elevation={2} 
      sx={{ 
        mb: 3,
        borderRadius: '8px',
        overflow: 'hidden'
      }}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-2">
          <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
            {ticket.subject}
          </Typography>
        </div>

        {/* Student Contenue */}
        <div className="flex mt-3">
          <Avatar 
            src={stagiaire ? stagiaire.avatar : '/path/to/default/avatar.png'} // Utilisez une image par défaut si l'avatar est manquant
            sx={{ width: 40, height: 40, mr: 2 }}
          >
            <Person />
          </Avatar>
          <div className="flex-1">
            <div className="flex justify-between items-center">
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                {stagiaire ? stagiaire.User.nom + ' ' + stagiaire.User.prenom : 'Stagiaire Inconnu'}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                <Schedule fontSize="inherit" sx={{ mr: 0.5 }} />
                {formatDate(ticket.updatedAt)}
              </Typography>

            </div>
            <Typography variant="body2" sx={{ mt: 1, whiteSpace: 'pre-line' }}>
              {ticket.Contenue}
            </Typography>
            
            {ticket.piece_jointe && (
            <div style={{ marginTop: '8px' }}>
              <Typography variant="caption" display="block" sx={{ color: 'text.secondary' }}>
                Pièce jointe:
              </Typography>
              <Button 
                variant="outlined" 
                startIcon={<Download />} 
                href={ticket.piece_jointe} 
                target="_blank" 
                rel="noopener noreferrer" 
                sx={{ mt: 1, textTransform: 'none' }}
              >
                {ticket.piece_jointe.substring(ticket.piece_jointe.lastIndexOf('/') + 1).substring(ticket.piece_jointe.lastIndexOf('\/') + 1)}
              </Button>
            </div>
          )}


          </div>
        </div>

        {/* Supervisor comment */}
        {ticket.commentaire_encadrant ? (
          <>
            <Divider sx={{ my: 2 }} />
            <div className="flex mt-2">
              <Avatar 
                sx={{ 
                  width: 40, 
                  height: 40, 
                  mr: 2,
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText'
                }}
              >
                <Person />
              </Avatar>
              <div className="flex-1">
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Vous
                </Typography>
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    mt: 1, 
                    p: 2, 
                    backgroundColor: 'action.hover',
                    borderRadius: '4px',
                    borderColor: 'primary.light'
                  }}
                >
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                    {ticket.commentaire_encadrant}
                  </Typography>
                </Paper>
              </div>
            </div>
          </>
        ) : (
          /* Reply button - only shown when there's NO supervisor comment */
          <div className="flex justify-end mt-3">
            <Button
              variant="contained"
              size="small"
              startIcon={<Comment />}
              onClick={handleOpenDialog}
            >
              Répondre
            </Button>
          </div>
        )}
      </div>

      {/* Dialog for adding a comment */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog} 
        maxWidth="md" // Ajustez la largeur maximale du dialogue
        fullWidth // Permet au dialogue d'occuper toute la largeur disponible
      >
        <DialogTitle>Ajouter un commentaire</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Commentaire"
            type="text"
            fullWidth
            variant="outlined"
            multiline // Permet plusieurs lignes
            rows={4} // Nombre de lignes visibles
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Annuler
          </Button>
          <Button onClick={handleSubmitComment} color="primary">
            Envoyer
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default Tickets;

