export interface User {
  nom: string;
  prenom: string;
  email: string;
}

export interface Stagiaire {
  id:number;
  User:User;
  ecole: string;
  filiere: string;
  niveau: string;
  avatar: string;
  cv: string;
  lettre_motivation: string;
}
 
export interface Departement {
  nom: string;
}
export interface Encadrant {
  id:number;
  User:User;
  specialite: string;
  Departement: Departement;
  avatar: string;
}

export interface Assignment {
  id: number;
  Stagiaire: Stagiaire;
  Encadrant: Encadrant;
  date_debut: string;
  date_fin: string;
  status: 'en cours' | 'terminé';
}

export interface Rapport  {
  id: number,
  contenue: string,
  fichier: string,
  
  }

  export interface Document{
    document_evaluation:string,
    document_attestation:string,
  }
export interface Documents{
  Document:Document
  Rapport:Rapport;
}

