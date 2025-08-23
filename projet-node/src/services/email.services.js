// emailService.js
const nodemailer = require('nodemailer');

// Configurez le transporteur Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'rr9444037@gmail.com',
    pass: 'gtjz bjqi hbkn mddz'
  }
});

const confirmationLink = `http://${process.env.FRONTEND_URL}/login`;

const sendWelcomeEmail = async (email, prenom, password) => {
  const mailOptions = {
    from: 'E-Stage <rr9444037@gmail.com>',
    to: email,
    subject: 'Bienvenue sur E-Stage !',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #2c3e50;">Bienvenue sur E-Stage !</h1>
        </div>
        
        <div style="margin-bottom: 25px;">
          <p>Bonjour ${prenom},</p>
          <p>Votre compte a été créé avec succès sur notre plateforme E-Stage.</p>
          <p>Voici vos identifiants de connexion :</p>
          
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Mot de passe temporaire:</strong> ${password}</p>
          </div>
          
          <p>Pour activer votre compte et commencer à utiliser nos services, veuillez cliquer sur le bouton ci-dessous :</p>
          
          <div style="text-align: center; margin: 25px 0;">
            <a href="${confirmationLink}" 
               style="display: inline-block; padding: 12px 25px; background-color: #3498db; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
              Activer mon compte
            </a>
          </div>
          
          <p>Si le bouton ne fonctionne pas, copiez et collez le lien suivant dans votre navigateur :</p>
          <p style="word-break: break-all; color: #3498db;">${confirmationLink}</p>
        </div>
        
        <div style="border-top: 1px solid #e0e0e0; padding-top: 20px; font-size: 12px; color: #7f8c8d;">
          <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
          <p>© ${new Date().getFullYear()} E-Stage - Tous droits réservés</p>
        </div>
      </div>
    `
    };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    return { success: false, error };
  }
};

module.exports = {
  sendWelcomeEmail
};