import { useState } from 'react';
import StagiaireDialog from '../components/StagiaireDialog';
import EncadrantDialog from '../components/EncadrantDialog';
import AddStageDialog from '../components/AddStageDialog';
import { Stagiaire } from '../types/dialog-types';
import { Encadrant } from '../types/dialog-types';
import { AddStage } from '../types/dialog-types';

interface UseDialogReturn {
  openStagiaireDialog: (stagiaireData: Stagiaire) => void;
  openEncadrantDialog: (encadrantData: Encadrant) => void;
  openAddStageDialog: (onStageAdded: () => void) => void; // Ajout de la fonction pour ouvrir le dialogue d'ajout
  closeDialogs: () => void;
  StagiaireDialog: React.ReactNode;
  EncadrantDialog: React.ReactNode;
  AddStageDialog: React.ReactNode; // Ajout du dialogue d'ajout
}

export const useDialog = (): UseDialogReturn => {
  const [stagiaire, setStagiaire] = useState<Stagiaire | null>(null);
  const [encadrant, setEncadrant] = useState<Encadrant | null>(null);
  const [isStagiaireDialogOpen, setStagiaireDialogOpen] = useState(false);
  const [isEncadrantDialogOpen, setEncadrantDialogOpen] = useState(false);
  const [isAddStageDialogOpen, setAddStageDialogOpen] = useState(false);
  const [onStageAddedCallback, setOnStageAddedCallback] = useState<() => void>(() => () => {}); // Ajoutez cette ligne

  const openStagiaireDialog = (stagiaireData: Stagiaire) => {
    setStagiaire(stagiaireData);
    setStagiaireDialogOpen(true);
  };

  const openEncadrantDialog = (encadrantData: Encadrant) => {
    setEncadrant(encadrantData);
    setEncadrantDialogOpen(true);
  };

  const openAddStageDialog = (onStageAdded: () => void) => {
    setAddStageDialogOpen(true); 
    setOnStageAddedCallback(() => onStageAdded); // Stockez la fonction de mise à jour
  };

  const closeDialogs = () => {
    setStagiaireDialogOpen(false);
    setEncadrantDialogOpen(false);
    setAddStageDialogOpen(false); // Fermer le dialogue d'ajout
  };

  return {
    openStagiaireDialog,
    openEncadrantDialog,
    openAddStageDialog,
    closeDialogs,
    StagiaireDialog: isStagiaireDialogOpen && stagiaire ? (
      <StagiaireDialog stagiaire={stagiaire} onClose={closeDialogs} />
    ) : null,
    EncadrantDialog: isEncadrantDialogOpen && encadrant ? (
      <EncadrantDialog encadrant={encadrant} onClose={closeDialogs} />
    ) : null,
    AddStageDialog: isAddStageDialogOpen ? (
      <AddStageDialog 
        onClose={closeDialogs} 
        onStageAdded={() => {
          closeDialogs(); // Fermer le dialogue après ajout
          onStageAddedCallback(); // Appelle la fonction de mise à jour
        }} 
        isOpen={isAddStageDialogOpen} 
      />
    ) : null,
  };
};
