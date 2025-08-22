const { Evaluation, Stagiaire,Encadrant, evaluationRapport, Stage, document ,Rapport,User} = require('../models');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generateEvaluationPDF = async (req, res) => {
  const stageId = req.params.id;
  const userId = req.user.id;
  try {
    
    const evaluation = await Evaluation.findOne({ where: { stage_id: stageId } });
    const stage = await Stage.findOne({ where: {id: stageId } });

    const now = new Date();
    const dateFin = new Date(stage.date_fin);

    if( dateFin >= now ){
      return res.status(500).json({ success: false, message: "Le stage n'est pas encore términé" });
    }
    const encadrant = await Encadrant.findOne({where:{user_id:userId}});
    const stagiaire = await Stagiaire.findOne({where:{id:stage.stagiare_id}});

    const user = await User.findOne({where:{id:stagiaire.user_id}});
    if(stage.encadrant_id != encadrant.id) {
        return res.status(404).json({ success: false, message: "Accèe interdit à cette ressource" });
    }

    const rapport = await Rapport.findOne({ where: { stage_id: stageId } });
    if(!rapport && !evaluation){
      return res.status(404).json({success: false,  message: "rapport ou evaluation du stagiaire n'ont pas encore soumis" });
      
    }

    const evaluation_rapport = await evaluationRapport.findOne({ where: { rapport_id: rapport.id } });
    if (!evaluation_rapport ) {
      return res.status(404).json({ success: false, message: "Évaluation du rapport non trouvée" });
    }

    // Préparation du dossier
    const dir = path.join(__dirname, '../../uploads/document_evaluation');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const randomNumber = Math.floor(100000 + Math.random() * 900000);
    const fileName = `evaluation_${randomNumber}.pdf`;
    const filePath = path.join(dir, fileName);
    const doc = new PDFDocument();
    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    // Contenu du PDF
    doc.fontSize(20).text(`Évaluation du stagiaire`, { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`Nom : ${user.nom}`);
    doc.text(`Prénom : ${user.prenom}`);
    doc.text(`ID : ${stagiaire.id}`);
    doc.moveDown();

    doc.fontSize(16).text(`Notes :`, { underline: true });
    doc.moveDown();
    doc.fontSize(14).list([
      `Ponctualité : ${evaluation.ponctualite}/5`,
      `Autonomie : ${evaluation.autonomie}/5`,
      `Intégration : ${evaluation.integration}/5`,
      `Qualité du travail : ${evaluation.qualite_travaille}/5`
    ]);

    doc.fontSize(20).text(`Évaluation du rapport`, { align: 'center' });
    doc.moveDown();
    doc.fontSize(16).text(`Notes :`, { underline: true });
    doc.moveDown();
    doc.fontSize(14).list([
      `Présentation générale : ${evaluation_rapport.presentation_generale}/5`,
      `Structure méthodologie : ${evaluation_rapport.stricture_méthodologie}/5`,
      `Contenu rapport : ${evaluation_rapport.contenue_rapport}/5`,
      `Esprit d’analyse et de synthèse : ${evaluation_rapport.esprit_analyse_synthèse}/5`
    ]);

    doc.end();

    writeStream.on('finish', async () => {
      const relativePath = `uploads/document_evaluation/${fileName}`;

      const existingDoc = await document.findOne({ where: { stage_id: stage.id } });

      if (existingDoc) {
        existingDoc.document_evaluation = relativePath;
        await existingDoc.save();
      } else {
        await document.create({
          stage_id: stage.id,
          document_evaluation: relativePath
        });
      }

      return res.status(200).json({
        success:true,
        message: "PDF généré et enregistré avec succès",
        path: relativePath
      });
    });

  } catch (error) {
    console.error("Erreur PDF :", error);
    res.status(500).json({ success:false,message: "Erreur serveur", error: error.message });
  }
};

const getEvaluationPDF = async (req, res) => {
  const stageId = req.params.id;
  
  try {
    
    const doc = await document.findOne({ where: { stage_id: stageId } });

    if (!doc || !doc.document_evaluation) {
      return res.status(404).json({ message: "evaluation non trouvée pour ce stage" });
    }

    const filePath = path.join(__dirname, '../../', doc.document_evaluation);

    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "Fichier d'evaluation introuvable sur le serveur" });
    }

    
    res.download(filePath, (err) => {
      if (err) {
        console.error("Erreur envoi fichier :", err);
        res.status(500).json({ message: "Erreur lors de l'envoi du fichier" });
      }
    });
  } catch (error) {
    console.error("Erreur récupération evaluation :", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

module.exports = { generateEvaluationPDF,getEvaluationPDF };
