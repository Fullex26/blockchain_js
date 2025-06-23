// Run with: npx jest
// Set test database URL before any imports
process.env.DATABASE_URL = 'file:./test.db';
process.env.NODE_ENV = 'test';

const request = require('supertest');
const { execSync } = require('child_process');
const { app, prisma } = require('../server');

beforeAll(async () => {
  // Apply migrations to the test database using test schema
  try {
    execSync('npx prisma migrate dev --name init --schema=./prisma/schema.test.prisma', {
      stdio: 'inherit'
    });
    // Generate client for test schema
    execSync('npx prisma generate --schema=./prisma/schema.test.prisma', {
      stdio: 'inherit'
    });
  } catch (error) {
    // Migration might already exist, continue
    console.log('Migration may already exist, continuing...', error.message);
  }
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('API Endpoints', () => {
  test('GET / returns API status', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('service', 'Civitas Backend API');
    expect(res.body).toHaveProperty('status', 'ok');
  });

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