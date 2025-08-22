const request = require('supertest');
const fs = require('fs');
const path = require('path');
const app = require('../app'); 

let cookieAdmin; // Stocke le cookie JWT 

beforeAll(async () => {
  // Connexion en tant qu'admin pour récupérer le token
  const response = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'talha.amal@etu.uae.ac.ma',
      password: 'pass123'
    });

  cookieAdmin = response.headers['set-cookie'];
});

describe('POST /api/auth/register (stagiaire)', () => {
  it('devrait enregistrer un stagiaire avec fichiers', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .set('Cookie', cookieAdmin)
      .field('nom', 'Ahmed')
      .field('prenom', 'Ali')
      .field('email', 'ahmed.ali@example.com')
      .field('password', 'secret123')
      .field('role', 'stagiaire')
      .field('ecole', 'ENSA Tétouan')
      .field('filiere', 'GI')
      .field('niveau', '3ème année')
      .attach('cv', fs.readFileSync(path.join(__dirname, 'uploads/dummy.pdf')), 'cv.pdf')
      .attach('lettre_motivation', fs.readFileSync(path.join(__dirname, 'uploads/dummy.pdf')), 'lettre.pdf');

    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.user.email).toBe('ahmed.ali@example.com');
  });
});


describe("POST /api/auth/register - Email déjà utilisé", () => {
  it("devrait retourner 409 si l'email est déjà utilisé", async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .set('Cookie', cookieAdmin)
      .field('nom', 'Ahmed')
      .field('prenom', 'Ali')
      .field('email', 'ahmed.ali@example.com') 
      .field('password', 'secret123')
      .field('role', 'stagiaire')
      .field('ecole', 'ENSA Tétouan')
      .field('filiere', 'GI')
      .field('niveau', '3ème année')
      .attach('cv', fs.readFileSync(path.join(__dirname, 'uploads/dummy.pdf')), 'cv.pdf')
      .attach('lettre_motivation', fs.readFileSync(path.join(__dirname, 'uploads/dummy.pdf')), 'lettre.pdf');

    expect(response.statusCode).toBe(409);
    expect(response.body.success).toBe(false);
    expect(response.body.errorCode).toBe('EMAIL_EXISTS');
    expect(response.body.message).toBe('Cet email est déjà utilisé.');
  });
});


describe('POST /api/auth/register (encadrant)', () => {
  it('devrait enregistrer un encadrant si le département existe', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .set('Cookie', cookieAdmin)
      .field('nom', 'Yassine')
      .field('prenom', 'Ben')
      .field('email', 'yassine.ben@example.com')
      .field('password', 'encadrant123')
      .field('role', 'encadrant')
      .field('specialite', 'Java')
      .field('departement', 'DEPT 1');

    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.user.email).toBe('yassine.ben@example.com');
  });

  it("doit échouer si le département n'existe pas", async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .set('Cookie', cookieAdmin)
      .field('nom', 'Sara')
      .field('prenom', 'Doe')
      .field('email', 'sarah.doe@example.com')
      .field('password', 'encadrant123')
      .field('role', 'encadrant')
      .field('specialite', 'Data')
      .field('departement', 'NonExistantDept');

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toMatch(/introuvable/i);
  });
});
