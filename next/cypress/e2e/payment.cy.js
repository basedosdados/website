describe('Área do Usuário e Sistema de pagamento', () => {
  const username = 'cypress_test';

  function getSafeUserBdCookie() {
    return cy.getCookie('userBD').then(cookie => {
      if (!cookie?.value) throw new Error('Cookie userBD não encontrado');
      
      try {
        const decoded = decodeURIComponent(cookie.value);
        return JSON.parse(decoded);
      } catch (e1) {
        try {
          return JSON.parse(cookie.value);
        } catch (e2) {
          throw new Error(`Falha ao parsear cookie: ${e2.message}`);
        }
      }
    });
  }

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

  it('Verificar aplicação de cupons', () => {
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

      cy.applyCoupon('25off', 'Cupom 25OFF')
      cy.applyCoupon('20off', 'Cupom 20OFF')
      cy.applyCoupon('15off', 'Cupom 15OFF')
    });
  });

  it('Fazer fluxo de assinatura BDPro', () => {
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

      cy.contains('button', 'Confirmar pagamento', { timeout: 1500 })
        .should('be.visible')
        .click();

      cy.wait(60000);
    });

    cy.get('#chakra-modal-modal-stripe-payment_intent-succeeded', { timeout: 60000 })
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

    cy.wait(60000);
    cy.get('#chakra-modal-modal-stripe-payment_intent-succeeded', { timeout: 60000 })
      .should('not.be.visible');
    cy.wait(60000);
  });

  it('Verificar se BDPro está ativo e cancelar', () => {
    cy.contains('Ativo')
      .should('be.visible');

    cy.contains('p', 'BD Pro')
      .should('be.visible');

    cy.contains('(Mensal)')
      .should('be.visible');

    cy.contains('Próxima data de renovação automática:')
      .should('be.visible');

    cy.contains('button', 'Cancelar plano')
      .should('be.visible')
      .click();

    cy.get('#chakra-modal-modal-cancel-sub', { timeout: 15000 })
      .should('be.visible')
      .and('have.css', 'opacity', '1')
      .as('cancelSub')
      .within(() => {
        cy.contains('button','Cancelar plano')
          .should('be.visible')
          .click();
      });

    cy.get('#chakra-modal-modal-cancel-sub', { timeout: 300000 })
      .should('not.exist');

    cy.contains('Cancelado')
      .should('be.visible');

    cy.contains('Acesso ao plano disponível até:')
      .should('be.visible');

    getSafeUserBdCookie().then(userData => {
      const userId = userData.id.split(':')[1];

      cy.request({
        method: 'GET',
        url: `/api/stripe/getSubscriptionActive?p=${btoa(userId)}`,
        headers: {
          'Content-Type': 'application/json',
        }
      }).then((subscriptionResponse) => {
        const subscriptionId = subscriptionResponse.body;

        cy.request({
          method: 'GET',
          url: `/api/stripe/removeSubscriptionImmediately?p=${btoa(subscriptionId)}`,
          headers: {
            'Content-Type': 'application/json',
          }
        }).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.have.property('success', true);
          cy.wait(60000);

          cy.visit(`/user/${username}?plans_and_payment`);

          cy.contains('p', 'BD Grátis', { timeout: 10000 })
            .should('be.visible');
        });
      });
    });
  });

  it('Fazer fluxo de assinatura BDEmpresas', () => {
    cy.contains('button', 'Comparar planos')
      .should('be.visible')
      .click();

    cy.arrivingAtCheckout('#bd_pro_empresas_button_sub_btn');

    cy.get('@checkoutModal').within(() => {
      cy.contains('Pagamento', { timeout: 20000 })
        .should('be.visible');

      cy.verifyElement('BD Empresas');

      cy.contains('R$ 3.360,00/ano')
        .should('be.visible');

      cy.get('iframe[name^="__privateStripeFrame"]', { timeout: 30000 })
        .should('be.visible')
        .its('0.contentDocument.body')
        .should('not.be.empty')
        .then(cy.wrap)

      cy.fillStripeInput('cardNumber', '4242424242424242');
      cy.fillStripeInput('cardExpiry', '12/30');
      cy.fillStripeInput('cardCvc', '123');

      cy.contains('button', 'Confirmar pagamento', { timeout: 1500 })
        .should('be.visible')
        .click();

      cy.wait(60000);
    });

    cy.get('#chakra-modal-modal-stripe-payment_intent-succeeded', { timeout: 60000 })
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

    cy.wait(60000);
    cy.get('#chakra-modal-modal-stripe-payment_intent-succeeded', { timeout: 60000 })
      .should('not.be.visible');
    cy.wait(60000);
  });

  it('Verificar se BDEmpresas está ativo e cancelar', () => {
    cy.contains('Ativo')
      .should('be.visible');

    cy.contains('p', 'BD Empresas')
      .should('be.visible');

    cy.contains('(Anual)')
      .should('be.visible');

    cy.contains('Próxima data de renovação automática:')
      .should('be.visible');

    cy.contains('button', 'Cancelar plano')
      .should('be.visible')
      .click();

    cy.get('#chakra-modal-modal-cancel-sub', { timeout: 15000 })
      .should('be.visible')
      .and('have.css', 'opacity', '1')
      .as('cancelSub')
      .within(() => {
        cy.contains('button','Cancelar plano')
          .should('be.visible')
          .click();
      });

    cy.get('#chakra-modal-modal-cancel-sub', { timeout: 300000 })
      .should('not.exist');

    cy.contains('Cancelado')
      .should('be.visible');

    cy.contains('Acesso ao plano disponível até:')
      .should('be.visible');

    getSafeUserBdCookie().then(userData => {
      const userId = userData.id.split(':')[1];

      cy.request({
        method: 'GET',
        url: `/api/stripe/getSubscriptionActive?p=${btoa(userId)}`,
        headers: {
          'Content-Type': 'application/json',
        }
      }).then((subscriptionResponse) => {
        const subscriptionId = subscriptionResponse.body;

        cy.request({
          method: 'GET',
          url: `/api/stripe/removeSubscriptionImmediately?p=${btoa(subscriptionId)}`,
          headers: {
            'Content-Type': 'application/json',
          }
        }).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.have.property('success', true);
          cy.wait(60000);

          cy.visit(`/user/${username}?plans_and_payment`);

          cy.contains('p', 'BD Grátis', { timeout: 10000 })
            .should('be.visible');
        });
      });
    });
  });
});

