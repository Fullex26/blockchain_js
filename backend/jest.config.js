module.exports = {
  testEnvironment: 'node',
  moduleFileExtensions: ['js', 'json'],
  testMatch: ['**/__tests__/**/*.(test|spec).js'],
  setupFilesAfterEnv: ['<rootDir>/jest.env.js'],
  verbose: true
};