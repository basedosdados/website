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

Cypress.Commands.add('fillRegisterForm', (userData) => {
  if (userData.firstName) {
    cy.get('input[name="firstName"]').type(userData.firstName);
  }
  if (userData.lastName) {
    cy.get('input[name="lastName"]').type(userData.lastName);
  }
  if (userData.email) {
    cy.get('input[name="username"]').clear().type(userData.email);
  }
  if (userData.username) {
    cy.get('input[name="user"]').type(userData.username);
  }
  if (userData.password) {
    cy.get('input[id="password"]').type(userData.password);
  }
  if (userData.confirmPassword) {
    cy.get('input[id="confirmPassword"]').type(userData.confirmPassword);
  }
});

Cypress.Commands.add('mockRegisterApi', (response) => {
  cy.intercept('GET', '/api/user/registerAccount*', response).as('registerApi');
});

Cypress.Commands.add('loginAndSetCookies', () => {
  const email = Cypress.env('CRYPRESS_AUTH_EMAIL');
  const password = Cypress.env('CRYPRESS_AUTH_PASSWORD');

  if (!email || !password) {
    throw new Error('Email e senha de autenticação não configurados no Cypress.env');
  }

  return cy.request({
    method: 'POST',
    url: `/api/user/getUserTestCypress?a=${btoa(email)}&p=${btoa(password)}`,
    failOnStatusCode: false
  }).then((response) => {
    if (response.status !== 200 || !response.body?.authToken) {
      throw new Error(`Falha na autenticação: ${response.body?.error || `Status ${response.status}`}`);
    }

    const { authToken, user } = response.body;

    if (typeof authToken !== 'string') {
      throw new Error('Token de autenticação inválido');
    }

    const userString = typeof user === 'string' ? user : JSON.stringify(user);

    cy.setCookie('token', authToken);
    cy.setCookie('userBD', userString);
    
    return cy.wrap({
      token: authToken,
      user: user
    });
  });
});

Cypress.Commands.add('arrivingAtCheckout', (button) => {
  cy.get(button, { timeout: 10000 })
    .should('be.visible')  
    .click();

  cy.get('#chakra-modal-modal-email-gcp', { timeout: 15000 })
    .should('be.visible')
    .and('have.css', 'opacity', '1')
    .as('plansModal')
    .within(() => {
      cy.contains('E-mail de acesso ao BigQuery', { timeout: 15000 })
        .should('be.visible');

      cy.contains('button', 'Próximo')
        .should('be.visible')
        .click();
    });

    cy.get('#chakra-modal-modal-stripe-checkout', { timeout: 30000 })
      .should('be.visible')
      .and('have.css', 'opacity', '1')
      .as('checkoutModal');

    cy.get('@checkoutModal').should(($modal) => {
      expect($modal.height()).to.be.greaterThan(0);
      expect($modal.width()).to.be.greaterThan(0);
      expect($modal.find('*').length).to.be.greaterThan(0);
    });
});

Cypress.Commands.add('verifyElement', (text) => {
  cy.contains(text, { timeout: 20000 })
    .should(($el) => {
      expect($el).to.be.visible;
      const rect = $el[0].getBoundingClientRect();
      expect(rect.top).to.be.greaterThan(0);
      expect(rect.bottom).to.be.lessThan(Cypress.config('viewportHeight'));
      expect($el.text().trim()).to.not.be.empty;
    });
})

Cypress.Commands.add('fillStripeInput', (fieldName, value) => {
  const selectors = {
    cardNumber: 'input[id="Field-numberInput"]',
    cardExpiry: 'input[id="Field-expiryInput"]',
    cardCvc: 'input[id="Field-cvcInput"]'
  };

  cy.get('iframe[name^="__privateStripeFrame"]', { timeout: 60000 })
    .its('0.contentDocument.body')
    .should('not.be.empty')
    .then(cy.wrap)
    .find(selectors[fieldName])
    .type(value, { force: true, delay: 100 })
    .should('have.value', value);
});

Cypress.Commands.add('applyCoupon', (coupon, text) => {
  cy.get('input[placeholder="Digite o cupom"]', { timeout: 15000 })
    .clear()
    .type(coupon);

  cy.contains('button', 'Aplicar', { timeout: 30000 })
    .should('be.visible')
    .click({ force: true });

  cy.contains(text, { timeout: 30000 })
    .should('be.visible')
})