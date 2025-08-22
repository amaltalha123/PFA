const { Stagiaire, Stage, document, User } = require('../models');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generateAttestationPDF = async (req, res) => {
  const stagiaireId = req.params.id;

  try {
    const stagiaire = await Stagiaire.findByPk(stagiaireId);
    const stage = await Stage.findOne({ where: { stagiare_id: stagiaireId } });

    const now = new Date();
    const dateFin = new Date(stage.date_fin);

    if( dateFin >= now ){
      return res.status(500).json({ success: false, message: "Le stage n'est pas encore términé" });
    }


    const user =await User.findOne({where: { id: stagiaire.user_id }});
    if (!stagiaire || !stage) {
      return res.status(404).json({ message: "Stagiaire ou stage non trouvé" });
    }

    // Préparer le dossier
    const dir = path.join(__dirname, '../../uploads/attestations');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    // Générer un nom de fichier unique
    const fileName = `attestation_${Date.now()}_${user.nom}.pdf`;
    const filePath = path.join(dir, fileName);

    // Créer le document PDF
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // Styliser le PDF
    doc
      .fontSize(22)
      .font('Times-Bold')
      .text('ATTESTATION DE STAGE', { align: 'center' })
      .moveDown(2);

    doc
      .fontSize(12)
      .font('Times-Roman')
      .text(`Nous soussignés, la société 4D Logiciels, attestons que :`)
      .moveDown();

    doc
      .fontSize(14)
      .font('Times-Bold')
      .text(`${user.prenom} ${user.nom}`, { align: 'center' })
      .moveDown();

    doc
      .fontSize(12)
      .font('Times-Roman')
      .text(`A effectué un stage ${stage.type_stage} au sein de notre entreprise du ${new Date(stage.date_debut).toLocaleDateString()} au ${new Date(stage.date_fin).toLocaleDateString()}, dans le cadre de sa formation.`)
      .moveDown(2);

    doc
      .text(`Ce stage a permis à ${user.prenom} d'acquérir une expérience pratique en lien avec sa formation académique.`)
      .moveDown(2);

    doc
      .text(`Fait à Rabat, le ${new Date().toLocaleDateString()}`)
      .moveDown(4);

    doc
      .text('Signature et cachet de l\'entreprise', { align: 'right' });

    doc.end();

    stream.on('finish', async () => {
      // Enregistrer dans la base de données (table document)
      const existingDoc = await document.findOne({ where: { stage_id: stage.id } });
      const relativePath = `uploads/attestations/${fileName}`;

      if (existingDoc) {
        existingDoc.document_attestation = relativePath;
        await existingDoc.save();
      } else {
        await document.create({
          stage_id: stage.id,
          document_attestation: relativePath
        });
      }

      return res.status(200).json({
        success: true,
        message: "Attestation générée avec succès",
        path: relativePath
      });
    });

  } catch (error) {
    console.error("Erreur PDF :", error);
    res.status(500).json({ success: false, message: "Erreur serveur", error: error.message });
  }
};

const getAttestationPDF = async (req, res) => {
  const stageId = req.params.id;

  try {
    
    const doc = await document.findOne({ where: { stage_id: stageId } });

    if (!doc || !doc.document_attestation) {
      return res.status(404).json({ message: "Attestation non trouvée pour ce stage" });
    }

    const filePath = path.join(__dirname, '../../', doc.document_attestation);

    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success:false,message: "Fichier d'attestation introuvable sur le serveur" });
    }

    
    res.download(filePath, (err) => {
      if (err) {
        console.error("Erreur envoi fichier :", err);
        res.status(500).json({ success:false,message: "Erreur lors de l'envoi du fichier" });
      }
    });
  } catch (error) {
    console.error("Erreur récupération attestation :", error);
    res.status(500).json({success:false, message: "Erreur serveur", error: error.message });
  }
};


module.exports = { generateAttestationPDF ,getAttestationPDF};
