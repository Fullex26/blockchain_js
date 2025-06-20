describe('Vendor Portal E2E', () => {
  it('Vendor redeems a benefit and sees history', () => {
    // TODO: Stub wallet connection
    cy.visit('/');
    cy.contains('Connect Wallet').click();
    // Redeem form
    cy.get('input[placeholder="Beneficiary Address"]').type('0xRecipient');
    cy.get('input[placeholder="Benefit Type"]').type('TestBenefit');
    cy.contains('Redeem').click();
    cy.contains('Success');
    // Verify redemption in history table
    cy.get('table').contains('TestBenefit');
  });