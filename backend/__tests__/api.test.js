// Run with: npx jest
process.env.DATABASE_URL = 'file:./test.db?connection_limit=1';

const request = require('supertest');
const { execSync } = require('child_process');
const { app, prisma } = require('../server');

beforeAll(() => {
  // Apply migrations to the test database
  execSync('npx prisma migrate dev --name init --schema=./prisma/schema.prisma', {
    stdio: 'inherit'
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('API Endpoints', () => {
  test('POST /api/users creates a user', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ walletAddress: '0xABC', role: 'Beneficiary', name: 'Test User' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('walletAddress', '0xABC');
    expect(res.body).toHaveProperty('role', 'Beneficiary');
  });

  test('GET /benefits/:address returns array', async () => {
    const res = await request(app).get('/benefits/0xABC');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /transactions/vendor/:address returns array', async () => {
    const res = await request(app).get('/transactions/vendor/0xABC');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});