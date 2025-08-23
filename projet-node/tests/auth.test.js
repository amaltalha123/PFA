const request = require('supertest');
const express = require('express');
const authRoutes = require('../src/routes/auth.routes');
const { User } = require('../src/models'); 

const app = express();
app.use(express.json());
app.use('/api', authRoutes); 

describe('POST /api/auth/login', () => {
  
   const validEmail = 'talha.amal@etu.uae.ac.ma';
   const validPassword = 'pass123';

  it('should return 200 and a token for valid credentials', async () => {
    const response = await request(app)
      .post('/api/login')
      .send({ email: validEmail, password: validPassword });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('Token');
    expect(response.body.message).toBe('Connexion réussie');
  });

  it('should return 401 for incorrect password', async () => {
    const response = await request(app)
      .post('/api/login')
      .send({ email: validEmail, password: 'wrongpassword' });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Mot de passe incorrect');
  });

  it('should return 404 for non-existent user', async () => {
    const response = await request(app)
      .post('/api/login')
      .send({ email: 'notfound@example.com', password: 'any' });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Utilisateur non trouvé');
  });
});
