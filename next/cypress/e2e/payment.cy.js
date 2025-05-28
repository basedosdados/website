describe('Área do Usuário', () => {
  const username = 'cypress_test';

  beforeEach(() => {
    cy.session('userSession', () => {
      cy.loginAndSetCookies();

      cy.getCookie('token').should('exist');
      cy.getCookie('userBD').should('exist');
    });
    cy.visit(`/user/${username}?plans_and_payment`);
  });

  it('Não deve acessar sem autenticação', () => {
    cy.clearCookies();
    cy.visit(`/user/${username}?plans_and_payment`);
    cy.url().should('include', '/user/login');
  });

  it('Deve acessar a página do usuário com autenticação', () => {
    cy.url().should('include', `/user/${username}`);
    cy.url().should('include', 'plans_and_payment');
  });
});