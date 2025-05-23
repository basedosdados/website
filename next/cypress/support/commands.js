Cypress.Commands.add('login', (email, password) => {
  cy.get('input[name=username]').should('be.visible').type(email);
  cy.get('input[name=password]').should('be.visible').type(password);
  cy.contains('button', 'Entrar').should('be.enabled').click();
});

Cypress.Commands.add('mockAuthApi', (
  tokenResponse,
  idUserResponse = null,
  userResponse = null,
  activationResponse = null
) => {
  cy.intercept('GET', '/api/user/getToken*', tokenResponse).as('getToken');

  if (idUserResponse) {
    cy.intercept('GET', '/api/user/getIdUser*', idUserResponse).as('getIdUser');
  }

  if (userResponse) {
    cy.intercept('GET', '/api/user/getUser*', userResponse).as('getUser');
  }

  if (activationResponse) {
    cy.intercept('POST', '**/account/account_activate/**', activationResponse).as('activationApi');
  }
});
