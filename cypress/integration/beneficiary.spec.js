describe('Beneficiary Portal E2E', () => {
  it('Beneficiary sees assigned benefit', () => {
    // TODO: Implement wallet connection stub
    cy.visit('/');
    cy.contains('Connect Wallet').click();
    // Verify benefit card exists
    cy.get('div').contains('Your Benefits').next().should('exist');
  });