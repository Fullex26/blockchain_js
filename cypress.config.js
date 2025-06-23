const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    video: false,
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 15000,
    requestTimeout: 15000,
    responseTimeout: 15000,
    pageLoadTimeout: 30000,
    supportFile: 'cypress/support/e2e.js',
    specPattern: 'cypress/integration/**/*.spec.js',
    excludeSpecPattern: ['*.hot-update.js'],
    chromeWebSecurity: false,
    env: {
      // Portal configurations
      ADMIN_PORT: 3000,
      BENEFICIARY_PORT: 3001,
      VENDOR_PORT: 3002,
      
      // Blockchain configuration
      CONTRACT_ADDRESS: '0x82612557339F097e7dF02325E0206CCD4c28D909',
      SEPOLIA_RPC_URL: 'https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
      CHAIN_ID: 11155111, // Sepolia chain ID
      
      // Test wallet private keys (DO NOT use in production!)
      ADMIN_PRIVATE_KEY: '0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a',
      BENEFICIARY_PRIVATE_KEY: '0x8b3a5c8b5e8b3a5c8b5e8b3a5c8b5e8b3a5c8b5e8b3a5c8b5e8b3a5c8b5e8b3a5c',
      VENDOR_PRIVATE_KEY: '0x2ac56bdf7f6e59c26c8b678c77c99b6a7e35e4b29b4e2f8d9c8e5a4b3c2d1e0f'
    },
    setupNodeEvents(on, config) {
      // Node event listeners for blockchain testing
      on('task', {
        log(message) {
          console.log(message);
          return null;
        }
      });
    },
  },
}); 