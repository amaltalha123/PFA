const { Stage, mission} = require('../models'); 

exports.addMission = async (req, res) => {
  const stageId = req.params.id; 
  const { description, date_limite} = req.body;

  try {
    const stage = await Stage.findByPk(stageId);
    const now = new Date();
    const dateLimite = new Date(date_limite); 
    const dateFin=new Date(stage.date_fin); 
    let status;
      if(dateLimite > dateFin){
       return res.status(200).json({
        success: false,
        message: "Veuiller choisir une date inférieur à la date du fin de stage.",
       });
      }
    const Mission = await mission.create({
      description,
      date_limite,
      stage_id: stage.id
    });
    const dueDate = new Date(Mission.date_limite); 

      if (dueDate < now ) {
        status = 'Échéantes';
      } else {
        status = 'En cours';
      }
    return res.status(200).json({
      success: true,
      message: "Mission ajouté avec succès.",
      data: {
        Mission: {
          id:Mission.id,
          description:Mission.description,
          dueDate:Mission.date_limite,
          status:status
        }
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

exports.deleteMission = async (req, res) => {
    const MissionId = req.params.id;
    try {
    const Mission = await mission.findByPk(MissionId);
    if (!Mission){
      return res.status(404).json({ message: "" });
    }

    if (Mission && Mission.done === false) {
    await Mission.destroy();
    return res.status(201).json({
      success: true,
      message: "Mission supprimé avec succès.", 
    });
    }else {
      return res.status(404).json({ message: "Mission est déja términée" });
    }
    
  } catch (error) {
    console.error("Erreur suppression :", error);
    res.status(500).json({ 
        success: false, 
        message: "Erreur serveur" 
    });
  }
}

exports.updateMission = async (req, res) => {
  const MissionId = req.params.id; 
  const { description,date_limite } = req.body;

  try {
    const Mission = await mission.findByPk(MissionId);
    if (!Mission) return res.status(404).json({ message: "Mission non trouvé" });

    if (Mission && Mission.done === false) {
      Mission.date_limite=date_limite;
      Mission.description=description;
      await Mission.save();
      res.status(201).json({
        success: true,
        message: "Mission modiffié avec succès.",
        Mission:{
          id:Mission.id,
          description:Mission.description,
          dueDate:Mission.date_limite
        }
      });
    }else{
      return res.status(404).json({ success: false, message: "Mission est déja términée" });
    }

  } catch (error) {
    console.error("Erreur update :", error);
    res.status(500).json({ 
        success: false,
        message: "Erreur serveur" });
  }
};

exports.getMissionsByStage = async (req, res) => {
  const stageId = req.params.id;

  try {
    const stage = await Stage.findByPk(stageId);
    if (!stage) {
      return res.status(404).json({
        success: false,
        message: `Aucun stage trouvé avec l'id ${stageId}`,
      });
    }

    const missions = await mission.findAll({
      where: { stage_id: stageId },
      include: {
        model: Stage,
        attributes: ['id'],
      }
    });

    // Mapper les missions pour correspondre à l'interface Task
    const formattedMissions = missions.map(mission => {
      const now = new Date();
      const dueDate = new Date(mission.date_limite); // Assurez-vous que dueDate est au format Date
      let status;

      // Déterminer le statut de la mission
      if (mission.done) {
        status = 'Terminé';
      } else if (dueDate < now && mission.done===false) {
        status = 'Échéantes';
      } else {
        status = 'En cours';
      }

      return {
        id: mission.id,
        description: mission.description,
        dueDate: mission.date_limite, // Assurez-vous que la date limite est accessible
        status: status
      };
    });

    return res.status(200).json({
      success: true,
      message: `Liste des missions du stage ${stageId} récupérée avec succès.`,
      data: formattedMissions
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des missions :", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la récupération des missions.",
      data: null
    });
  }
};




exports.missionDone = async (req, res) => {
  const MissionId = req.params.id; 

  try {
    const Mission = await mission.findByPk(MissionId);
    if (!Mission) return res.status(404).json({ message: "Mission non trouvée" });

    // Vérifier si la date limite est atteinte
    const now = new Date();
    const dueDate = new Date(Mission.date_limite); // Assurez-vous que 'date_limite' est le bon champ

    if (dueDate < now) {
      return res.status(403).json({ success: false, message: "Accès non autorisé : la date limite est atteinte." });
    }

    if (Mission.done === false) {
      Mission.done = true;
      await Mission.save();
      res.status(201).json({
        success: true,
        message: "Mission modifiée avec succès.",
      });
    } else {
      return res.status(404).json({ success: false, message: "Mission est déjà terminée." });
    }

  } catch (error) {
    console.error("Erreur update :", error);
    res.status(500).json({ 
        success: false,
        message: "Erreur serveur" 
    });
  }
};
