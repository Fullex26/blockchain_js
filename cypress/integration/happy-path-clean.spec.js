describe('Happy Path E2E - Clean Implementation', () => {
  // Test data constants
  const testAddresses = {
    admin: '0x1234567890123456789012345678901234567890',
    beneficiary: '0xAbCdEf1234567890AbCdEf1234567890AbCdEf12',
    vendor: '0x9876543210987654321098765432109876543210'
  };
  
  const benefitData = {
    recipient: testAddresses.beneficiary,
    type: 'JobSeeker',
    value: '100',
    expirationDate: '2025-12-31'
  };

  it('Complete benefit lifecycle: Issue → View → Redeem → Verify Status Change', () => {
    // ==========================================
    // PHASE 1: Admin Issues Benefit & Registers Vendor
    // ==========================================
    cy.log('📋 PHASE 1: Admin Portal Operations');
    
    cy.mockWallet(testAddresses.admin);
    cy.visitPortal('admin');
    cy.connectWallet(testAddresses.admin);
    
    // Register vendor first (required for redemption)
    cy.addVendor(testAddresses.vendor);
    
    // Issue benefit to beneficiary
    cy.fillBenefitForm(benefitData);
    cy.contains('Issue Benefit').click();
    cy.contains('Benefit issued', { timeout: 10000 }).should('be.visible');
    
    // Verify benefit appears in admin table
    cy.verifyTableContains({
      type: benefitData.type,
      recipient: benefitData.recipient,
      value: benefitData.value,
      status: 'Issued'
    });
    
    // ==========================================
    // PHASE 2: Beneficiary Views Their Benefit
    // ==========================================
    cy.log('👤 PHASE 2: Beneficiary Portal - Viewing Benefit');
    
    cy.mockWallet(testAddresses.beneficiary);
    cy.visitPortal('beneficiary');
    cy.connectWallet(testAddresses.beneficiary);
    
    // Verify benefit card shows correct information
    cy.verifyBenefitCard(benefitData, 'Issued');
    
    // ==========================================
    // PHASE 3: Vendor Redeems the Benefit
    // ==========================================
    cy.log('🏪 PHASE 3: Vendor Portal - Redeeming Benefit');
    
    cy.mockWallet(testAddresses.vendor);
    cy.visitPortal('vendor');
    cy.connectWallet(testAddresses.vendor);
    
    // Verify vendor is properly registered
    cy.contains('Your address is not a registered vendor').should('not.exist');
    
    // Submit redemption
    cy.fillRedemptionForm({
      beneficiary: testAddresses.beneficiary,
      type: benefitData.type
    });
    cy.contains('Redeem').click();
    cy.contains('Benefit redeemed', { timeout: 10000 }).should('be.visible');
    
    // Verify redemption appears in vendor history
    cy.verifyTableContains({
      type: benefitData.type,
      recipient: testAddresses.beneficiary
    });
    
    // ==========================================
    // PHASE 4: Final Verification - Status Updated
    // ==========================================
    cy.log('✅ PHASE 4: Verifying Status Change');
    
    // Return to beneficiary portal to confirm status change
    cy.visitPortal('beneficiary');
    cy.connectWallet(testAddresses.beneficiary);
    
    // Allow time for blockchain state update
    cy.wait(2000);
    cy.reload();
    cy.connectWallet(testAddresses.beneficiary);
    
    // Verify status changed to "Redeemed"
    cy.verifyBenefitCard(benefitData, 'Redeemed');
    
    cy.log('🎉 Complete Happy Path Test Successful!');
  });

  // Supporting test cases for robustness
  it('Validates admin-only functions', () => {
    cy.mockWallet(testAddresses.admin);
    cy.visitPortal('admin');
    cy.connectWallet(testAddresses.admin);
    
    // Ensure admin functions are accessible
    cy.get('input[placeholder="Vendor Address"]').should('be.visible');
    cy.get('input[placeholder="Recipient Address"]').should('be.visible');
    cy.contains('Issue Benefit').should('be.visible');
  });

  it('Prevents unauthorized vendor actions', () => {
    const unauthorizedAddress = '0x1111111111111111111111111111111111111111';
    
    cy.mockWallet(unauthorizedAddress);
    cy.visitPortal('vendor');
    cy.connectWallet(unauthorizedAddress);
    
    // Should show unauthorized message
    cy.contains('Your address is not a registered vendor').should('be.visible');
    cy.get('input[placeholder="Beneficiary Address"]').should('not.exist');
  });

  it('Handles missing MetaMask gracefully', () => {
    cy.window().then((win) => {
      delete win.ethereum;
    });
    
    cy.visitPortal('admin');
    cy.contains('Connect Wallet').click();
    
    // Should handle missing MetaMask
    cy.on('window:alert', (text) => {
      expect(text).to.contain('MetaMask');
    });
  });
}); 