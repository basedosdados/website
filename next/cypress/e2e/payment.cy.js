describe('Área do Usuário e Sistema de pagamento', () => {
  const username = 'cypress_test';

  function getSafeUserBdCookie() {
    return cy.parseUserBdCookie();
  }

  it('Não deve acessar sem autenticação', () => {
    cy.clearCookies();
    cy.visit(`/user/${username}?plans_and_payment`);
    cy.url().should('include', '/user/login');
  });

  describe('com autenticação', () => {
  before(() => {
    cy.cancelActiveSubscription();
    cy.then(() => {
      Cypress.session.clearAllSavedSessions();
    });
  });

  after(() => {
    cy.cancelActiveSubscription();
    cy.then(() => {
      Cypress.session.clearAllSavedSessions();
    });
  });

  beforeEach(() => {
    cy.session('userSession', () => {
      cy.loginAndSetCookies();

      cy.getCookie('token').should('exist');
      cy.getCookie('userBD').should('exist');
    });

    cy.intercept('GET', '**/api/stripe/getPlans*').as('getPlans');

    cy.visit(`/user/${username}?plans_and_payment`, { timeout: 120000 });

    cy.location('pathname', { timeout: 60000 }).should('include', `/user/${username}`);
    cy.contains('Planos e pagamento', { timeout: 60000 }).should('be.visible');
  });

  it('Deve acessar a página do usuário com autenticação', () => {
    cy.url().should('include', `/user/${username}`);
    cy.url().should('include', 'plans_and_payment');
  });

  it('Deve verificar se o plano grátis está ativo', () => {
    cy.contains('p', 'BD Grátis').should('be.visible');
    cy.contains('button', 'Comparar planos').should('be.visible');
  })

  it('Deve validar a exibição de todos os planos no modal', () => {
    cy.openPlansModal();

    cy.get('@plansModal').within(() => {
        cy.contains('p', 'BD Pro').should('be.visible');
        cy.contains('p', 'BD Orgs').should('be.visible');
        cy.contains('R$ 37').should('be.visible');
        cy.contains('Sob consulta').should('be.visible');
        cy.contains('Entre em contato').should('be.visible');

        cy.get('#toggle-prices')
          .should('exist')
          .and('have.attr', 'type', 'checkbox')
          .and('be.checked')
          .click({ force: true });

        cy.contains('R$ 47').should('be.visible');
        cy.contains('Sob consulta').should('be.visible');
      });

      cy.get('@plansModal').within(() => {
        cy.get('button[aria-label="Close"]')
          .first()
          .click();
      });

      cy.get('section[role="dialog"]')
        .should('not.exist');
  });

  it('Deve exibir a seção do Chatbot na área de planos', () => {
    cy.contains(/Assinar Chatbot|Acessar chatbot/).should('be.visible');
  });

  it('Deve chegar no checkout', () => {
    cy.openPlansModal();
    cy.arrivingAtCheckout('#bd_pro_button_sub_btn');
    cy.proceedToPaymentStep();

    cy.get('@checkoutModal').within(() => {
      cy.contains('Pagamento', { timeout: 20000 })
        .should('be.visible');

      cy.contains('button', 'Confirmar pagamento', { timeout: 60000 })
        .should('be.visible');

      cy.get('iframe[name^="__privateStripeFrame"]', { timeout: 60000 })
        .should('be.visible');
    });
  });

  it('Verificar preços e trocar o plano no modal', () => {
    cy.openPlansModal();
    cy.arrivingAtCheckout('#bd_pro_button_sub_btn');

    cy.get('@checkoutModal').within(() => {
      cy.contains('Confirme seu plano', { timeout: 20000 })
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

      cy.clearCookie('plan_selected');

      cy.contains('Trocar plano')
        .should('be.visible')
        .click();
    });

    cy.get('body', { timeout: 15000 }).should(($body) => {
      const $checkout = $body.find('#chakra-modal-modal-stripe-checkout');
      expect(
        $checkout.length === 0 || $checkout.css('display') === 'none' || $checkout.css('opacity') === '0',
        'checkout fechado'
      ).to.eq(true);
    });

    cy.get('section[role="dialog"].chakra-modal__content:visible')
      .should('be.visible')
      .and('have.css', 'opacity', '1')
      .within(() => {
        cy.contains('p', 'BD Orgs', { timeout: 20000 }).should('be.visible');
        cy.contains('Sob consulta').should('be.visible');
        cy.contains('Entre em contato').should('be.visible');
      });
  });

  it('Verificar aplicação de cupons', () => {
    cy.openPlansModal();

    cy.get('#toggle-prices')
      .should('exist')
      .and('have.attr', 'type', 'checkbox')
      .and('be.checked')
      .click({ force: true });

    cy.contains('R$ 47/mês', { timeout: 20000 })
      .should('be.visible');

    cy.arrivingAtCheckout('#bd_pro_button_sub_btn');

    cy.get('@checkoutModal').within(() => {
      cy.contains('Confirme seu plano', { timeout: 20000 })
        .should('be.visible');

      cy.verifyElement('BD Pro');

      cy.contains('R$ 47,00/mês')
        .should('be.visible');

      cy.applyCoupon('25off', 'Cupom 25OFF')
      cy.applyCoupon('20off', 'Cupom 20OFF')
      cy.applyCoupon('15off', 'Cupom 15OFF')
    });
  });

  const baseUrl = String(
    Cypress.env('NEXT_PUBLIC_BASE_URL_FRONTEND') || Cypress.config('baseUrl') || ''
  ).toLowerCase();
  const isSafeStripeEnv =
    baseUrl.includes('localhost') ||
    baseUrl.includes('127.0.0.1') ||
    baseUrl.includes('staging') ||
    baseUrl.includes('development');
  const canFillStripeIframe =
    Cypress.browser.family === 'chromium' && Cypress.browser.name !== 'electron';

  if (isSafeStripeEnv && canFillStripeIframe) {
    it('Fazer fluxo de assinatura BDPro', () => {
      cy.openPlansModal();

      cy.get('#toggle-prices')
        .should('exist')
        .and('have.attr', 'type', 'checkbox')
        .and('be.checked')
        .click({ force: true });

      cy.contains('R$ 47/mês', { timeout: 20000 })
        .should('be.visible');

      cy.arrivingAtCheckout('#bd_pro_button_sub_btn');
      cy.proceedToPaymentStep();

      cy.get('@checkoutModal').within(() => {
        cy.contains('Pagamento', { timeout: 20000 })
          .should('be.visible');

        cy.verifyElement('BD Pro');

        cy.contains('R$ 47,00/mês')
          .should('be.visible');
      });

      cy.get('iframe[name^="__privateStripeFrame"]', { timeout: 60000 })
        .should('be.visible');

      cy.contains('button', 'Confirmar pagamento', { timeout: 60000 })
        .should('be.visible');

      cy.fillStripeCard();

      cy.intercept(
        'POST',
        /https:\/\/api\.stripe\.com\/v1\/(payment_intents|setup_intents)\/.+\/confirm/
      ).as('stripeConfirmation');

      cy.get('@checkoutModal').within(() => {
        cy.contains('button', 'Confirmar pagamento', { timeout: 20000 })
          .should('be.visible')
          .click();
      });

      cy.wait('@stripeConfirmation', { timeout: 30000 }).then((interception) => {
        expect(interception.response.statusCode).to.be.oneOf([200, 201]);
        const body = interception.response.body || {};
        const status =
          body.status ||
          body.paymentIntent?.status ||
          body.setupIntent?.status;
        expect(status).to.eq('succeeded');
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

      cy.get('#chakra-modal-modal-stripe-payment_intent-succeeded', { timeout: 20000 })
        .should('not.be.visible');

      cy.wait(30000);
    });

    it('Verificar se BDPro está ativo e cancelar', () => {
      cy.contains('Ativo', { timeout: 30000 })
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
          url: `/api/stripe/getSubscriptionActive?p=${btoa(userId)}&t=${btoa('bd_pro')}`,
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
  } else {
    it('Fazer fluxo de assinatura BDPro', function () {
      this.skip();
    });
  }
  });
});

