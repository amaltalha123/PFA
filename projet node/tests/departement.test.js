const request = require('supertest');
const app = require('../app');
const { Departement, sequelize } = require('../src/models');


describe('Routes département', () => {

    let departementId;
    let cookieAdmin; // Stocke le cookie JWT 
    let NoncookieAdmin;
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

  
  test('POST /api/auth/addDepartement - doit ajouter un département', async () => {
    const res = await request(app)
      .post('/api/auth/addDepartement')
      .set('Cookie', cookieAdmin)
      .send({ nom: 'TestDept' });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.nom).toBe('TestDept');
    departementId = res.body.data.id; // sauvegarder pour suppression après
  });

  test('POST /api/auth/addDepartement - doit retourner 409 si département existe déjà', async () => {
    const res = await request(app)
      .post('/api/auth/addDepartement')
      .set('Cookie', cookieAdmin)
      .send({ nom: 'TestDept' });

    expect(res.statusCode).toBe(409);
    expect(res.body.errorCode).toBe('DEPARTMENT_ALREADY_EXISTS');
  });

  test('POST /api/auth/deleteDepartement - doit supprimer un département', async () => {
    const res = await request(app)
      .post(`/api/auth/deleteDepartement?id=${departementId}`)
      .set('Cookie', cookieAdmin)

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe(departementId);
  });

  test('POST /api/auth/deleteDepartement - doit retourner 404 si département introuvable', async () => {
    const res = await request(app)
      .post('/api/auth/deleteDepartement?id=999999')  // id qui n'existe pas
      .set('Cookie', cookieAdmin)

    expect(res.statusCode).toBe(404);
    expect(res.body.errorCode).toBe('DEPARTMENT_NOT_FOUND');
  });

  test('Accès sans token - doit retourner 401 Unauthorized', async () => {
    const res = await request(app)
      .post('/api/auth/addDepartement')
      .send({ nom: 'NoTokenDept' });

    expect(res.statusCode).toBe(401);
  });

  test('Accès sans rôle admin - doit retourner 403 Forbidden', async () => {
    const res = await request(app)
      .post('/api/auth/addDepartement')
      .set('Cookie',NoncookieAdmin)      
      .send({ nom: 'NoAdminDept' });

    expect(res.statusCode).toBe(403);
  });

});
