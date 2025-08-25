const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'cv') {
      cb(null, 'uploads/cvs');
    } else if (file.fieldname === 'lettre_motivation') {
      cb(null, 'uploads/lettres');
    } else if (file.fieldname === 'piece_jointe') {
      cb(null, 'uploads/tickets'); 
    } else if (file.fieldname === 'fichier') {
      cb(null, 'uploads/rapports');
    } else {
      cb(new Error('Champ de fichier non reconnu.'), null);
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Créez l'instance de multer
const upload = multer({ storage });

module.exports = upload;
