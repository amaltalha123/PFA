// src/initAdmin.js
require('dotenv').config();
const bcrypt = require('bcrypt');
const { User } = require('./models');
const { sequelize } = require('./models/index');

(async () => {
  try {
    //await sequelize.authenticate();
    
    await sequelize.sync({ alter: true })
    .then(() => console.log("Modèles synchronisés avec la base de données."))
    .catch(err => console.error(" Erreur de synchronisation :", err));
 

    const existingAdmin = await User.findOne({ where: { email: process.env.DEFAULT_ADMIN_EMAIL } });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(process.env.DEFAULT_ADMIN_PASSWORD, 10);
      await User.create({
        nom:process.env.DEFAULT_ADMIN_LASTNAME,
        prenom:process.env.DEFAULT_ADMIN_NAME,
        email: process.env.DEFAULT_ADMIN_EMAIL,
        password: hashedPassword,
        role: 'admin',
      });
      console.log("Utilisateur admin créé.");
    } else {
      console.log("Admin existe déjà.");
    }

    process.exit(0);
  } catch (err) {
    console.error("Erreur lors de la création de l'admin:", err);
    process.exit(1);
  }
})();
