// Run with: npm test
// Environment variables are now loaded via jest.env.js

const request = require('supertest');
const { execSync } = require('child_process');
const { app, prisma } = require('../server.test');

beforeAll(async () => {
  // Setup test database using db push (more reliable for testing)
  try {
    console.log('Setting up test database...');
    execSync('DATABASE_URL="file:./test.db" npx prisma db push --schema=./prisma/schema.test.prisma', {
      stdio: 'inherit',
      env: { ...process.env, DATABASE_URL: 'file:./test.db' }
    });
    console.log('Test database setup complete');
  } catch (error) {
    console.log('Database setup failed:', error.message);
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
      .send({ walletAddress: '0xABC123', role: 'Beneficiary', name: 'Test User' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('walletAddress', '0xABC123');
    expect(res.body).toHaveProperty('role', 'Beneficiary');
  });

  test('GET /benefits/:address returns array', async () => {
    const res = await request(app).get('/benefits/0xABC123');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /transactions/vendor/:address returns array', async () => {
    const res = await request(app).get('/transactions/vendor/0xABC123');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});