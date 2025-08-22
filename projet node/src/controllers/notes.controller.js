const { Stagiaire, Notes } = require('../models'); 

exports.addNote = async (req, res) => {
   
  const { contenue,date,color } = req.body;

  try {
    const userId = req.user.id;
    const stagiaire = await Stagiaire.findOne({where:{ user_id:userId}});

    if(!stagiaire){
      res.status(500).json({
      success: false,
      message: "Stagiaire introuvable",
      data: null
    });
    }

    const note = await Notes.create({
      contenue:contenue,
      date:date,
      color:color,
      stagiaire_id: stagiaire.id
    });

    return res.status(201).json({
      success: true,
      message: "note ajouté avec succès.",
      data: {
        contenue:contenue,
        date:date,
        color:color
      }
    });

  } catch (error) {
    console.error("Erreur lors de l'ajout:", error);
    res.status(500).json({
      success: false,
      errorCode: "SERVER_ERROR",
      message: "Erreur serveur lors de l'ajout",
      data: null
    });
  }
};

exports.deleteNote = async (req, res) => {
    const noteId = req.params.id;
    try {
    const note = await Notes.findByPk(noteId);
    if (!note){
      return res.status(404).json({ message: "" });
    }
    await note.destroy();
    return res.status(201).json({
      success: true,
      message: "note supprimé avec succès.", 
    });

  } catch (error) {
    console.error("Erreur suppression :", error);
    res.status(500).json({ 
        success: false, 
        message: "Erreur serveur" 
    });
  }
}

exports.updateNote = async (req, res) => {
  const noteId = req.params.id; 
  const { contenue,date,color } = req.body;

  try {
    const note = await Notes.findByPk(noteId);
    if (!note) return res.status(404).json({ message: "note non trouvé" });

    if (note) {
      note.contenue=contenue;
      note.date=date;
      note.color=color;
      await note.save();
    }

    res.status(201).json({
        success: true,
        message: "note modiffié avec succès.",
    });
  } catch (error) {
    console.error("Erreur update :", error);
    res.status(500).json({ 
        success: false,
        message: "Erreur serveur" });
  }
};

exports.getAllNotes = async (req, res) => {
  
  const userId = req.user.id;
  const stagiaire = await Stagiaire.findOne({where:{ user_id:userId}});

  try {
   const notes = await Notes.findAll({
    where: { stagiaire_id: stagiaire.id }
  });


    return res.status(200).json({
      success: true,
      message: "Liste des notes récupérée avec succès.",
      notes: notes,
    });

  } catch (error) {
    console.error("Erreur lors de la récupération :", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la récupération des notes.",
    });
  }
};


