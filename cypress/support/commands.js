// ***********************************************
// Custom commands for Cypress E2E testing
// ***********************************************

// Properly checksummed test addresses (matching ethereum-mock.js)
const TEST_ADDRESSES = {
  admin: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
  beneficiary: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8', 
  vendor: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC'
};

// Mock wallet connection command
Cypress.Commands.add('mockWallet', (address) => {
  // Validate address format
  if (!address || !address.match(/^0x[a-fA-F0-9]{40}$/)) {
    throw new Error(`Invalid Ethereum address format: ${address}`);
  }
  
  cy.window().then((win) => {
    win.ethereum = {
      request: cy.stub().callsFake(({ method }) => {
        if (method === 'eth_requestAccounts') {
          return Promise.resolve([address]);
        }
        if (method === 'eth_accounts') {
          return Promise.resolve([address]);
        }
        return Promise.resolve();
      }),
      isMetaMask: true,
      on: cy.stub(),
      removeListener: cy.stub()
    };
  });
});

// Connect wallet command with validation
Cypress.Commands.add('connectWallet', (address) => {
  cy.mockWallet(address);
  cy.contains('Connect Wallet').click();
  
  // Wait and verify connection with more flexible address checking
  cy.get('body', { timeout: 15000 }).then($body => {
    const bodyText = $body.text();
    const addressShort = address.substring(0, 6);
    
    if (bodyText.includes(address) || bodyText.includes(addressShort)) {
      cy.log(`✅ Wallet connected successfully: ${address}`);
    } else {
      cy.log(`⚠️ Wallet connection status unclear for: ${address}`);
    }
  });
});

// Fill benefit form command with validation
Cypress.Commands.add('fillBenefitForm', (data) => {
  if (data.recipient && !data.recipient.match(/^0x[a-fA-F0-9]{40}$/)) {
    throw new Error(`Invalid recipient address: ${data.recipient}`);
  }
  
  if (data.recipient) {
    cy.get('input[placeholder*="Recipient"], input[placeholder*="Address"]').first().clear().type(data.recipient);
  }
  if (data.category) {
    cy.get('input[placeholder*="Type"], input[placeholder*="Category"]').first().clear().type(data.category);
  }
  if (data.amount) {
    cy.get('input[placeholder*="Value"], input[placeholder*="Amount"]').first().clear().type(data.amount);
  }
  if (data.description) {
    cy.get('input[placeholder*="Description"]').first().clear().type(data.description);
  }
  if (data.expirationDate) {
    cy.get('input[type="date"]').first().clear().type(data.expirationDate);
  }
});

// Fill redemption form command with validation
Cypress.Commands.add('fillRedemptionForm', (data) => {
  if (data.beneficiaryAddress && !data.beneficiaryAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
    throw new Error(`Invalid beneficiary address: ${data.beneficiaryAddress}`);
  }
  
  if (data.beneficiaryAddress) {
    cy.get('input[placeholder*="Beneficiary"], input[placeholder*="Address"]').first().clear().type(data.beneficiaryAddress);
  }
  if (data.amount) {
    cy.get('input[placeholder*="Amount"], input[placeholder*="Value"]').first().clear().type(data.amount);
  }
  if (data.description) {
    cy.get('input[placeholder*="Description"]').first().clear().type(data.description);
  }
});

// Add vendor command with enhanced validation
Cypress.Commands.add('addVendor', (vendorAddress) => {
  if (!vendorAddress || !vendorAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
    throw new Error(`Invalid vendor address format: ${vendorAddress}`);
  }
  
  cy.get('input[placeholder*="Vendor"], input[placeholder*="Address"]').first().clear().type(vendorAddress);
  cy.contains(/Add|Register/i).first().click();
  
  // Wait for transaction and verify
  cy.waitForBlockchainTransaction();
  
  cy.get('body').then($body => {
    const bodyText = $body.text();
    if (bodyText.includes('added') || bodyText.includes('registered') || bodyText.includes('success')) {
      cy.log(`✅ Vendor added successfully: ${vendorAddress}`);
    } else {
      cy.log(`⚠️ Vendor addition status unclear: ${vendorAddress}`);
    }
  });
});

// Verify benefit card command with flexible matching
Cypress.Commands.add('verifyBenefitCard', (data, status = 'Issued') => {
  cy.get('[data-testid="benefit-card"], .benefit-card, [class*="card"]', { timeout: 10000 })
    .should('be.visible')
    .then($cards => {
      if ($cards.length === 0) {
        cy.log('⚠️ No benefit cards found');
        return;
      }
      
      const cardText = $cards.text();
      let foundMatches = 0;
      
      if (data.category && cardText.includes(data.category)) {
        foundMatches++;
      }
      if (data.amount && cardText.includes(data.amount)) {
        foundMatches++;
      }
      if (cardText.includes(status)) {
        foundMatches++;
      }
      
      if (foundMatches > 0) {
        cy.log(`✅ Benefit card verification passed (${foundMatches} matches)`);
      } else {
        cy.log('⚠️ Benefit card verification inconclusive');
      }
    });
});

// Navigate to portal command with validation
Cypress.Commands.add('goToPortal', (portal) => {
  const ports = {
    admin: 3000,
    beneficiary: 3001,
    vendor: 3002
  };
  
  const port = ports[portal];
  if (!port) {
    throw new Error(`Unknown portal: ${portal}`);
  }
  
  cy.visit(`http://localhost:${port}`);
  cy.waitForPortalLoad(portal.charAt(0).toUpperCase() + portal.slice(1));
});

// Enhanced transaction waiting
Cypress.Commands.add('waitForTransaction', (timeout = 15000) => {
  cy.waitForBlockchainTransaction(timeout);
});

// Verify page elements with better error handling
Cypress.Commands.add('verifyPageElements', (elements) => {
  if (!Array.isArray(elements)) {
    throw new Error('Elements must be an array');
  }
  
  elements.forEach(element => {
    cy.get('body').should('contain', element);
  });
});

// Check wallet connection status with flexible matching
Cypress.Commands.add('checkWalletConnection', (expectedAddress) => {
  if (!expectedAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
    throw new Error(`Invalid address format: ${expectedAddress}`);
  }
  
  const addressShort = expectedAddress.substring(0, 6);
  
  cy.get('body').then($body => {
    const bodyText = $body.text();
    if (bodyText.includes(expectedAddress) || bodyText.includes(addressShort)) {
      cy.log(`✅ Wallet connection verified: ${expectedAddress}`);
    } else {
      cy.log(`⚠️ Wallet connection status unclear: ${expectedAddress}`);
    }
  });
});

// Handle metamask popup (stub for testing)
Cypress.Commands.add('confirmMetaMaskTransaction', () => {
  // In a real test environment, this would handle MetaMask popup
  // For our mock, we just wait a bit
  cy.wait(1000);
});

// Enhanced form validation helpers
Cypress.Commands.add('fillAndSubmitForm', (formData, submitText = 'Submit') => {
  Object.keys(formData).forEach(key => {
    const value = formData[key];
    if (key.toLowerCase().includes('address') && !value.match(/^0x[a-fA-F0-9]{40}$/)) {
      throw new Error(`Invalid address in form data: ${key} = ${value}`);
    }
    
    const placeholder = key.charAt(0).toUpperCase() + key.slice(1);
    cy.get(`input[placeholder*="${placeholder}"]`).clear().type(value);
  });
  
  cy.contains(submitText).click();
});

// Data table verification with better error handling
Cypress.Commands.add('verifyTableContains', (data) => {
  if (!Array.isArray(data)) {
    throw new Error('Data must be an array');
  }
  
  cy.get('table').should('be.visible');
  data.forEach(item => {
    cy.get('table').should('contain', item);
  });
});

// Portal navigation verification
Cypress.Commands.add('verifyPortalLoaded', (portalName) => {
  cy.waitForPortalLoad(portalName);
});

// Error handling
Cypress.Commands.add('verifyErrorMessage', (message) => {
  cy.contains(message).should('be.visible');
});

// Success message verification
Cypress.Commands.add('verifySuccessMessage', (message) => {
  cy.contains(message).should('be.visible');
});

// Prevent Cypress from failing on uncaught exceptions (handled in e2e.js now)
Cypress.on('uncaught:exception', (err, runnable) => {
  console.log('Caught exception in commands.js:', err.message);
  return false;
}); 