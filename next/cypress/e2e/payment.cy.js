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

  it('Deve verificar se o plano grátis está ativo', () => {
    cy.contains('span', 'Ativo').should('be.visible');
    cy.contains('p', 'BD Grátis').should('be.visible');
  })

  it('Deve validar a exibição de todos os planos no modal', () => {
    cy.contains('button', 'Comparar planos')
      .should('be.visible')
      .click();

    cy.get('section[role="dialog"].chakra-modal__content')
      .should('be.visible')
      .as('plansModal')
      .within(() => {
        cy.contains('p', 'BD Pro').should('be.visible');
        cy.contains('p', 'BD Empresas').should('be.visible');
        cy.contains('R$ 37').should('be.visible');
        cy.contains('R$ 280').should('be.visible');

        cy.get('#toggle-prices')
          .should('exist')
          .and('have.attr', 'type', 'checkbox')
          .and('be.checked')
          .click({ force: true });

        cy.contains('R$ 47').should('be.visible');
        cy.contains('R$ 350').should('be.visible');
      });

      cy.get('@plansModal').within(() => {
        cy.get('button[aria-label="Close"]')
          .first()
          .click();
      });

      cy.get('section[role="dialog"]')
        .should('not.exist');
  });

  it('Deve chegar no checkout e validar preços', () => {
    cy.contains('button', 'Comparar planos')
      .should('be.visible')
      .click();

    cy.get('#bd_pro_button_sub_btn', { timeout: 10000 })
      .should('be.visible')  
      .click();

    cy.get('#chakra-modal-modal-email-gcp', { timeout: 10000 })
      .should('be.visible')
      .as('plansModal')
      .within(() => {
        cy.contains('E-mail de acesso ao BigQuery', { timeout: 10000 })
          .should('be.visible');
    
        cy.contains('button', 'Próximo')
          .should('be.visible')
          .click();
      });

    cy.get('#chakra-modal-modal-stripe-checkout', { timeout: 30000 })
      .should('be.visible')
      .as('checkoutModal')
      .within(() => {
        cy.contains('Pagamento', { timeout: 15000 })
          .should('be.visible');
        
        cy.contains('BD Pro', { timeout: 20000 })
        .should(($el) => {
          expect($el).to.be.visible;
          expect($el[0].getBoundingClientRect().top).to.be.greaterThan(0);
          expect($el[0].getBoundingClientRect().bottom).to.be.lessThan(Cypress.config('viewportHeight'));
        });

        cy.contains('R$ 444,00/ano')
          .should('be.visible');
    
        cy.get('#toggle-prices-modal-checkout')
          .should('exist')
          .and('have.attr', 'type', 'checkbox')
          .and('be.checked')
          .click({ force: true });
    
        cy.contains('R$ 47,00/mês', { timeout: 1000000 })
          .should('be.visible');
      });
  });
});