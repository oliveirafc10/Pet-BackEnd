const request = require('supertest');
const app =require('../../src/app');
const connection = require('../../src/database/connection');

describe('ONG', () => {
  beforeEach(async() => {
    await connection.migrate.rollback();
    await connection.migrate.latest();
  })

  afterAll(async() => {
    await connection.destroy();
  });

  it('should be able to a new ONG', async () => {
    const response = await request(app)
    .post('/ongs')
    .send({ 
        nome: "APAE3",
        email: "contato@gmail.com",
        whatsapp: "18996312995",
        cidade: "tupa",
        uf: "SP"
    })
    expect(response.body).toHaveProperty('id');
    expect(response.body.id).toHaveLength(8);
  });
})