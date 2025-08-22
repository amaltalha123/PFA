const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'cv') {
      cb(null, 'uploads/cvs');
    } else if (file.fieldname === 'lettre_motivation') {
      cb(null, 'uploads/lettres');
    } else if (file.fieldname === 'piece_jointe') {
      // Vérifiez si le champ 'piece_jointe' est présent dans le corps de la requête
      if (!req.body.piece_jointe) {
        // Si aucune pièce jointe n'est fournie, passez à la prochaine étape
        return cb(null, null); // null pour indiquer qu'aucun fichier ne sera enregistré
      }
      cb(null, 'uploads/tickets'); // Sinon, enregistrez le fichier
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
