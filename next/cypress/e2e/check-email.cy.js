describe('Página de confirmação de e-mail', () => {
  it('Deve redirecionar para a home sem e-mail no sessionStorage', () => {
    cy.visit('/user/check-email');
    cy.url({ timeout: 10000 }).should('eq', Cypress.config().baseUrl + '/');
  });

  it('Deve exibir o e-mail pendente de confirmação', () => {
    cy.visit('/user/check-email', {
      onBeforeLoad(win) {
        win.sessionStorage.setItem('registration_email_bd', 'test@example.com');
      }
    });

    cy.contains('Confirme seu endereço de e-mail').should('be.visible');
    cy.contains('test@example.com').should('be.visible');
    cy.contains('Reenviar e-mail').should('be.visible');
  });

  it('Deve reenviar o e-mail de confirmação', () => {
    cy.mockGetIdUser({
      statusCode: 200,
      body: { id: 'AccountNode:user123', isActive: false }
    });
    cy.intercept('POST', '**/account/account_activate/**', { statusCode: 200 }).as('activationApi');

    cy.visit('/user/check-email', {
      onBeforeLoad(win) {
        win.sessionStorage.setItem('registration_email_bd', 'test@example.com');
      }
    });

    cy.contains('Reenviar e-mail').click();
    cy.wait(['@getIdUser', '@activationApi']);
    cy.contains(/Espere \d+ segundos/).should('be.visible');
  });
});
