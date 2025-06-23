// Jest environment setup - runs before each test file
require('dotenv').config();

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'file:./test.db';

console.log('Test environment loaded - DATABASE_URL:', process.env.DATABASE_URL); 