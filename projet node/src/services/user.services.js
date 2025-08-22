const bcrypt = require('bcrypt');
const { User } = require('../models');

const registerUser  = async (userData) => {
  const { nom, prenom, email, password, role } = userData;

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser  = await User.create({
    nom,
    prenom,
    email,
    password: hashedPassword,
    role
  });

  return newUser ;
};

module.exports = {
  registerUser 
};
