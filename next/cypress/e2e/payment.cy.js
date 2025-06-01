describe('Área do Usuário e Sistema de pagamento', () => {
  const username = 'cypress_test';

  beforeEach(() => {
    cy.session('userSession', () => {
      cy.loginAndSetCookies();

      cy.getCookie('token').should('exist');
      cy.getCookie('userBD').should('exist');
    });

    cy.intercept('GET', '/api/stripe/getPlans').as('getPlans');

    cy.visit(`/user/${username}?plans_and_payment`);

    cy.wait('@getPlans', { timeout: 15000 });
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

  it('Deve chegar no checkout', () => {
    cy.contains('button', 'Comparar planos')
      .should('be.visible')
      .click();

    cy.arrivingAtCheckout('#bd_pro_button_sub_btn');

    cy.get('@checkoutModal').within(() => {
      cy.contains('Pagamento', { timeout: 20000 })
        .should('be.visible');

      cy.contains('BD Pro', { timeout: 25000 })
        .should(($el) => {
          expect($el).to.be.visible;
          const rect = $el[0].getBoundingClientRect();
          expect(rect.top).to.be.greaterThan(0);
          expect(rect.bottom).to.be.lessThan(Cypress.config('viewportHeight'));
          expect($el.text().trim()).to.not.be.empty;
        });
    });
  });

  it('Verificar preços e trocar o plano no modal', () => {
    cy.contains('button', 'Comparar planos')
      .should('be.visible')
      .click();

    cy.arrivingAtCheckout('#bd_pro_button_sub_btn');

    cy.get('@checkoutModal').within(() => {
      cy.contains('Pagamento', { timeout: 20000 })
        .should('be.visible');

      cy.verifyElement('BD Pro');

      cy.contains('R$ 444,00/ano')
        .should('be.visible');

      cy.get('#toggle-prices-modal-checkout')
        .should('exist')
        .and('have.attr', 'type', 'checkbox')
        .and('be.checked')
        .click({ force: true });

      cy.contains('R$ 47,00/mês', { timeout: 20000 })
        .should('be.visible');

      cy.contains('Trocar plano')
        .should('be.visible')
        .click();
    });

    cy.arrivingAtCheckout('#bd_pro_empresas_button_sub_btn');

    cy.get('@checkoutModal').within(() => {
      cy.contains('Pagamento', { timeout: 20000 })
        .should('be.visible');

      cy.verifyElement('BD Empresas');

      cy.contains('R$ 3.360,00/ano')
        .should('be.visible');

      cy.get('#toggle-prices-modal-checkout')
        .should('exist')
        .and('have.attr', 'type', 'checkbox')
        .and('be.checked')
        .click({ force: true });

      cy.contains('R$ 350,00/mês', { timeout: 20000 })
        .should('be.visible');
    });
  });

  it('Fazer fluxo de assinatura', () => {
    cy.contains('button', 'Comparar planos')
      .should('be.visible')
      .click();

    cy.get('#toggle-prices')
      .should('exist')
      .and('have.attr', 'type', 'checkbox')
      .and('be.checked')
      .click({ force: true });

    cy.contains('R$ 47/mês', { timeout: 20000 })
      .should('be.visible');

    cy.arrivingAtCheckout('#bd_pro_button_sub_btn');

    cy.get('@checkoutModal').within(() => {
      cy.contains('Pagamento', { timeout: 20000 })
        .should('be.visible');

      cy.verifyElement('BD Pro');

      cy.contains('R$ 47,00/mês')
        .should('be.visible');

      cy.get('iframe[name^="__privateStripeFrame"]', { timeout: 30000 })
        .should('be.visible')
        .its('0.contentDocument.body')
        .should('not.be.empty')
        .then(cy.wrap)

      cy.fillStripeInput('cardNumber', '4242424242424242');
      cy.fillStripeInput('cardExpiry', '12/30');
      cy.fillStripeInput('cardCvc', '123');

      cy.contains('button', 'Confirmar pagamento')
        .should('be.visible')
        .click();
    });

    cy.get('#chakra-modal-modal-stripe-payment_intent-succeeded', { timeout: 30000 })
      .should('be.visible')
      .and('have.css', 'opacity', '1')
      .as('paymentIntentSucceeded')
      .within(() => {
        cy.contains('Assinatura efetuada com sucesso!', { timeout: 20000 })
          .should('be.visible');

        cy.get('button[aria-label="Close"]')
          .first()
          .click();
      });

    cy.get('#chakra-modal-modal-stripe-payment_intent-succeeded', { timeout: 300000 })
      .should('not.be.visible');
  });
});

