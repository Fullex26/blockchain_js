// Import commands.js using ES2015 syntax:
import './commands'
import './ethereum-mock'

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Enhanced error handling for blockchain applications
Cypress.on('uncaught:exception', (err, runnable) => {
  // Log the error details for debugging
  console.error('Uncaught exception detected:', err.message);
  console.error('Stack trace:', err.stack);
  
  // Check for specific blockchain-related errors that should fail the test
  const criticalErrors = [
    'bad address checksum',
    'call revert exception',
    'invalid address',
    'transaction failed',
    'execution reverted',
    'insufficient funds',
    'nonce too low',
    'network error'
  ];
  
  const isCriticalError = criticalErrors.some(errorType => 
    err.message.toLowerCase().includes(errorType)
  );
  
  if (isCriticalError) {
    console.error('CRITICAL BLOCKCHAIN ERROR - Test should fail:', err.message);
    // Return true to fail the test for critical errors
    return true;
  }
  
  // For non-critical errors (like async loading issues), continue the test
  console.warn('Non-critical error detected, continuing test:', err.message);
  return false;
});

// Enhanced error handling for failed HTTP requests
Cypress.on('fail', (err, runnable) => {
  console.error('Test failed:', err.message);
  throw err;
});

// Set up global test environment
beforeEach(() => {
  // Clear any existing wallet connections
  cy.window().then((win) => {
    if (win.ethereum && win.ethereum.removeAllListeners) {
      win.ethereum.removeAllListeners();
    }
  });
  
  // Set up better error logging
  cy.on('window:alert', (text) => {
    console.log('Alert detected:', text);
  });
  
  cy.on('window:confirm', (text) => {
    console.log('Confirm dialog detected:', text);
  });
});

// Enhanced blockchain transaction waiting with timeout
Cypress.Commands.add('waitForBlockchainTransaction', (timeout = 30000) => {
  console.log('Waiting for blockchain transaction to complete...');
  
  // Wait for transaction and check for success indicators
  cy.wait(5000, { log: false }); // Give the transaction time to be mined
  
  // Optionally wait for UI updates or success messages
  cy.get('body', { timeout: timeout }).then($body => {
    const bodyText = $body.text();
    if (bodyText.includes('Transaction') || bodyText.includes('Success') || bodyText.includes('Complete')) {
      console.log('✅ Transaction appears to have completed successfully');
    } else {
      console.log('⚠️ Transaction completion status unclear');
    }
  });
});

// Enhanced wallet switching with validation
Cypress.Commands.add('switchToWallet', (role) => {
  cy.window().then((win) => {
    if (win.ethereum && win.ethereum.switchToRole) {
      win.ethereum.switchToRole(role);
      
      // Verify the switch was successful
      const currentWallet = win.ethereum.getCurrentWallet();
      if (currentWallet.role !== role) {
        throw new Error(`Failed to switch to ${role} wallet`);
      }
      console.log(`✅ Successfully switched to ${role} wallet: ${currentWallet.address}`);
    } else {
      throw new Error('Ethereum mock not available for wallet switching');
    }
  });
});

// Add command to verify critical application state
Cypress.Commands.add('verifyApplicationState', () => {
  cy.window().then((win) => {
    // Check that ethereum provider is available
    if (!win.ethereum) {
      throw new Error('Ethereum provider not available - critical application state failure');
    }
    
    // Check that required environment variables are set
    if (!win.process || !win.process.env || !win.process.env.NEXT_PUBLIC_CONTRACT_ADDRESS) {
      console.warn('Contract address not found in window environment');
    }
    
    console.log('✅ Application state verification passed');
  });
});

// Add command to wait for portal to be fully loaded
Cypress.Commands.add('waitForPortalLoad', (portalName, timeout = 15000) => {
  cy.contains(portalName, { timeout }).should('be.visible');
  cy.wait(2000); // Additional wait for any async loading
  cy.verifyApplicationState();
  console.log(`✅ ${portalName} portal fully loaded`);
}); 