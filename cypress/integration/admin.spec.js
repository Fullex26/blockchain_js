describe('Admin Portal E2E', () => {
  it('Admin issues benefit and registers vendor', () => {
    // TODO: Implement MetaMask mocking for wallet connection
    cy.visit('/');
    cy.contains('Connect Wallet').click();
    // After wallet connect, fill vendor form
    cy.get('input[placeholder="Vendor Address"]').type('0xVendor');
    cy.contains('Add Vendor').click();
    cy.contains('Success');
    // Issue a benefit
    cy.get('input[placeholder="Recipient Address"]').type('0xRecipient');
    cy.get('input[placeholder="Benefit Type"]').type('TestBenefit');
    cy.get('input[placeholder="Value"]').type('100');
    cy.get('input[type="date"]').type('2099-12-31');
    cy.contains('Issue Benefit').click();
    cy.contains('Success');
    // Verify table contains new benefit
    cy.get('table').contains('TestBenefit');
  });