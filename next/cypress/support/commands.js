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

Cypress.Commands.add('mockGetIdUser', (response) => {
  cy.intercept('GET', '/api/user/getIdUser*', response).as('getIdUser');
});

Cypress.Commands.add('parseUserBdCookie', () => {
  return cy.getCookie('userBD').then((cookie) => {
    if (!cookie?.value) throw new Error('Cookie userBD não encontrado');

    try {
      return JSON.parse(decodeURIComponent(cookie.value));
    } catch (e1) {
      return JSON.parse(cookie.value);
    }
  });
});

Cypress.Commands.add('cancelActiveSubscription', (types = ['bd_pro', 'chatbot']) => {
  cy.loginAndSetCookies().then(({ user }) => {
    const userData = typeof user === 'string' ? JSON.parse(user) : user;
    const rawId = userData?.id;
    if (!rawId) return;

    const userId = String(rawId).includes(':')
      ? String(rawId).split(':')[1]
      : String(rawId);

    const cancelNext = (index, didCancel) => {
      if (index >= types.length) {
        if (!didCancel) return;

        cy.wait(60000);
        cy.loginAndSetCookies().then(({ user: refreshedUser }) => {
          const refreshed = typeof refreshedUser === 'string'
            ? JSON.parse(refreshedUser)
            : refreshedUser;
          if (refreshed?.proSubscription === 'bd_pro') {
            cy.wait(30000);
            cy.loginAndSetCookies();
          }
        });
        return;
      }

      const type = types[index];

      cy.request({
        method: 'GET',
        url: `/api/stripe/getSubscriptionActive?p=${btoa(userId)}&t=${btoa(type)}`,
        failOnStatusCode: false,
      }).then((subscriptionResponse) => {
        if (subscriptionResponse.status !== 200 || !subscriptionResponse.body) {
          cy.log(`Nenhuma assinatura ${type} ativa para cancelar`);
          return cancelNext(index + 1, didCancel);
        }

        cy.request({
          method: 'GET',
          url: `/api/stripe/removeSubscriptionImmediately?p=${btoa(subscriptionResponse.body)}`,
          failOnStatusCode: false,
        }).then((response) => {
          if (response.status === 200 && response.body?.success) {
            cy.log(`Assinatura ${type} cancelada imediatamente`);
            return cancelNext(index + 1, true);
          }

          cy.log(`Falha ao cancelar assinatura ${type}: status ${response.status}`);
          cancelNext(index + 1, didCancel);
        });
      });
    };

    cancelNext(0, false);
  });
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

Cypress.Commands.add('openPlansModal', () => {
  cy.contains('button', 'Comparar planos')
    .should('be.visible')
    .click();

  cy.get('section[role="dialog"].chakra-modal__content', { timeout: 20000 })
    .should('be.visible')
    .and('have.css', 'opacity', '1')
    .as('plansModal')
    .within(() => {
      cy.contains('p', 'BD Pro', { timeout: 20000 }).should('be.visible');
    });
});

Cypress.Commands.add('arrivingAtCheckout', (button) => {
  cy.intercept('GET', '/api/user/changeUserGcpEmail*', { body: { ok: true } }).as('changeGcpEmail');

  cy.get('section[role="dialog"].chakra-modal__content', { timeout: 20000 })
    .should('be.visible')
    .and('have.css', 'opacity', '1')
    .within(($modal) => {
      const $byId = button ? $modal.find(button) : $modal.find('#bd_pro_button_sub_btn');

      if ($byId.length) {
        cy.wrap($byId)
          .should('be.visible')
          .click({ force: true });
        return;
      }

      cy.contains(/Iniciar teste grátis|Assinar/)
        .should('be.visible')
        .click({ force: true });
    });

  cy.contains('E-mail de acesso ao BigQuery', { timeout: 20000 })
    .should('be.visible');

  cy.get('#chakra-modal-modal-email-gcp', { timeout: 15000 })
    .should('be.visible')
    .as('emailGcpModal')
    .within(() => {
      cy.contains('button', 'Próximo')
        .should('be.visible')
        .click();
    });

  cy.wait('@changeGcpEmail');

  cy.get('#chakra-modal-modal-stripe-checkout', { timeout: 30000 })
    .should('be.visible')
    .as('checkoutModal');

  cy.get('@checkoutModal').within(() => {
    cy.contains('Confirme seu plano', { timeout: 20000 }).should('be.visible');
  });
});

Cypress.Commands.add('proceedToPaymentStep', () => {
  cy.get('@checkoutModal').within(() => {
    cy.contains('button', 'Próximo')
      .should('be.visible')
      .click();

    cy.contains('Pagamento', { timeout: 20000 }).should('be.visible');
  });

  cy.get('iframe[name^="__privateStripeFrame"]', { timeout: 60000 })
    .should('be.visible');
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

Cypress.Commands.add('fillStripeCard', ({
  number = '4242424242424242',
  expiry = '1230',
  cvc = '123',
  postal = '12345',
} = {}) => {
  const cdp = (command, params = {}, sessionId) => {
    const payload = { command, params };
    if (sessionId) payload.sessionId = sessionId;
    return Cypress.automation('remote:debugger:protocol', payload);
  };

  const sleep = (ms) => new Cypress.Promise((resolve) => setTimeout(resolve, ms));

  const clickNode = (nodeId) =>
    cdp('DOM.scrollIntoViewIfNeeded', { nodeId })
      .catch(() => null)
      .then(() => cdp('DOM.getContentQuads', { nodeId }))
      .then(({ quads }) => {
        const quad = quads && quads[0];
        if (!quad || quad.length < 8) return false;
        const x = (quad[0] + quad[2] + quad[4] + quad[6]) / 4;
        const y = (quad[1] + quad[3] + quad[5] + quad[7]) / 4;
        return cdp('Input.dispatchMouseEvent', {
          type: 'mousePressed',
          x,
          y,
          button: 'left',
          clickCount: 1,
        }).then(() =>
          cdp('Input.dispatchMouseEvent', {
            type: 'mouseReleased',
            x,
            y,
            button: 'left',
            clickCount: 1,
          })
        ).then(() => true);
      })
      .catch(() => false);

  const clickSearch = (query, { exactText } = {}) =>
    cdp('DOM.getDocument', { depth: -1, pierce: true }).then(() =>
      cdp('DOM.performSearch', { query }).then((search) => {
        if (!search.resultCount) {
          return cdp('DOM.discardSearchResults', { searchId: search.searchId }).then(() => false);
        }

        return cdp('DOM.getSearchResults', {
          searchId: search.searchId,
          fromIndex: 0,
          toIndex: Math.min(search.resultCount, 30),
        }).then((result) => {
          const nodeIds = result.nodeIds || [];
          const inspect = (index, candidates) => {
            if (index >= nodeIds.length) {
              const sorted = candidates.sort((a, b) => a.length - b.length);
              const tryClick = (i) => {
                if (i >= sorted.length) {
                  return cdp('DOM.discardSearchResults', { searchId: search.searchId }).then(() => false);
                }
                return clickNode(sorted[i].nodeId).then((clicked) => {
                  if (clicked) {
                    return cdp('DOM.discardSearchResults', { searchId: search.searchId }).then(() => true);
                  }
                  return tryClick(i + 1);
                });
              };
              return tryClick(0);
            }

            return cdp('DOM.getOuterHTML', { nodeId: nodeIds[index] }).then(({ outerHTML }) => {
              const text = String(outerHTML || '')
                .replace(/<[^>]+>/g, ' ')
                .replace(/\s+/g, ' ')
                .trim();

              const matches = exactText
                ? text === exactText || text.includes(exactText)
                : true;

              if (matches) {
                candidates.push({ nodeId: nodeIds[index], length: text.length });
              }

              return inspect(index + 1, candidates);
            }).catch(() => inspect(index + 1, candidates));
          };

          return inspect(0, []);
        });
      })
    );

  const typeChars = (value, sessionId) =>
    value.split('').reduce(
      (chain, char) =>
        chain.then(() =>
          cdp('Input.insertText', { text: char }, sessionId).then(() => sleep(35))
        ),
      Cypress.Promise.resolve()
    );

  const clickFirstMatch = (queries) => {
    const tryQuery = (index) => {
      if (index >= queries.length) return Cypress.Promise.resolve(false);
      const { query, exactText } = queries[index];
      return clickSearch(query, exactText ? { exactText } : {}).then((clicked) => {
        if (clicked) return true;
        return tryQuery(index + 1);
      });
    };
    return tryQuery(0);
  };

  const fillField = (queries, value) =>
    clickFirstMatch(queries).then((clicked) => {
      if (!clicked) return false;
      return typeChars(value).then(() => true);
    });

  const CardNumberQueries = [
    { query: 'Número do cartão', exactText: 'Número do cartão' },
    { query: 'Card number', exactText: 'Card number' },
    { query: '1234 1234 1234 1234' },
    { query: 'cc-number' },
    { query: 'Secure card number input frame' },
  ];

  const CardExpiryQueries = [
    { query: 'MM / AA' },
    { query: 'MM/AA' },
    { query: 'MM / YY' },
    { query: 'MM/YY' },
    { query: 'Data de validade', exactText: 'Data de validade' },
    { query: 'Expiration' },
    { query: 'cc-exp' },
    { query: 'Secure expiration date input frame' },
  ];

  const CardCvcQueries = [
    { query: 'CVC' },
    { query: 'CVV' },
    { query: 'Código de segurança', exactText: 'Código de segurança' },
    { query: 'Security code' },
    { query: 'cc-csc' },
    { query: 'Secure CVC input frame' },
  ];

  const fillCardFields = () =>
    fillField(CardNumberQueries, number).then((okNumber) => {
      if (!okNumber) return false;
      return fillField(CardExpiryQueries, expiry).then((okExpiry) => {
        if (!okExpiry) return false;
        return fillField(CardCvcQueries, cvc).then((okCvc) => {
          if (!okCvc) return false;
          return fillField(
            [
              { query: 'CEP', exactText: 'CEP' },
              { query: 'ZIP' },
              { query: 'Postal code', exactText: 'Postal code' },
            ],
            postal
          ).then(() => true);
        });
      });
    });

  const selectCardTab = () => {
    const CardTabQueries = [
      { query: 'Cartão', exactText: 'Cartão' },
      { query: 'Card', exactText: 'Card' },
      { query: 'Pay with card' },
      { query: 'Use a card' },
      { query: 'Or pay with a card' },
    ];
    return clickFirstMatch(CardTabQueries).then((clicked) => {
      if (clicked) return true;
      return clickSearch('Boleto', { exactText: 'Boleto' }).then(() =>
        sleep(500).then(() => clickSearch('Cartão', { exactText: 'Cartão' }))
      );
    });
  };

  const fillOopifField = (selectors, value, targets) => {
    const tryTarget = (index) => {
      if (index >= targets.length) return Cypress.Promise.resolve(false);
      const target = targets[index];
      return cdp('Target.attachToTarget', { targetId: target.targetId, flatten: true })
        .then(({ sessionId }) =>
          cdp(
            'Runtime.evaluate',
            {
              expression: `(() => {
                const el = document.querySelector(${JSON.stringify(selectors)});
                if (!el) return false;
                el.focus();
                el.click();
                return true;
              })()`,
              returnByValue: true,
            },
            sessionId
          ).then((result) => {
            if (!result?.result?.value) return tryTarget(index + 1);
            return typeChars(value, sessionId).then(() => true);
          })
        )
        .catch(() => tryTarget(index + 1));
    };
    return tryTarget(0);
  };

  const fillViaOopif = () =>
    cdp('Target.getTargets').then(({ targetInfos = [] }) => {
      const stripeTargets = targetInfos.filter((target) =>
        /stripe\.com/i.test(target.url || '')
      );
      if (!stripeTargets.length) return false;

      return fillOopifField(
        'input[autocomplete="cc-number"], input[name="number"], input[name="cardnumber"]',
        number,
        stripeTargets
      ).then((okNumber) => {
        if (!okNumber) return false;
        return fillOopifField(
          'input[autocomplete="cc-exp"], input[name="expiry"], input[name="exp-date"]',
          expiry,
          stripeTargets
        ).then((okExpiry) => {
          if (!okExpiry) return false;
          return fillOopifField(
            'input[autocomplete="cc-csc"], input[name="cvc"], input[name="cvv"]',
            cvc,
            stripeTargets
          );
        });
      });
    }).catch(() => false);

  const attemptFill = (remaining) => {
    if (remaining <= 0) return Cypress.Promise.resolve(false);
    return fillCardFields().then((filled) => {
      if (filled) return true;
      return fillViaOopif().then((filledOopif) => {
        if (filledOopif) return true;
        return selectCardTab()
          .then(() => sleep(1000))
          .then(() => fillCardFields())
          .then((filledAfterSelect) => {
            if (filledAfterSelect) return true;
            return sleep(1500).then(() => attemptFill(remaining - 1));
          });
      });
    });
  };

  cy.get('#chakra-modal-modal-stripe-checkout iframe[name^="__privateStripeFrame"]', { timeout: 60000 })
    .should('be.visible');

  cy.wait(2000);

  cy.then(() =>
    attemptFill(4).then((filled) => {
      if (!filled) {
        throw new Error('Campo de cartão do Stripe não encontrado após selecionar Cartão');
      }
      return true;
    })
  );
});

Cypress.Commands.add('confirmStripePayment', () => {
  cy.intercept(
    'POST',
    /https:\/\/api\.stripe\.com\/v1\/(payment_intents|setup_intents)\/.+\/confirm/
  ).as('stripeConfirmation');

  cy.fillStripeCard();

  cy.contains('button', 'Confirmar pagamento', { timeout: 20000 })
    .should('be.visible')
    .click();

  cy.wait('@stripeConfirmation', { timeout: 30000 }).then((interception) => {
    expect(interception.response.statusCode).to.be.oneOf([200, 201]);
    const body = interception.response.body || {};
    const status =
      body.status ||
      body.paymentIntent?.status ||
      body.setupIntent?.status;
    expect(status).to.eq('succeeded');
  });
});

Cypress.Commands.add('applyCoupon', (coupon, text) => {
  cy.get('input[placeholder="Digite o cupom"]', { timeout: 15000 })
    .clear({ force: true })
    .type(coupon, { force: true });

  cy.contains('button', 'Aplicar', { timeout: 30000 })
    .should('be.visible')
    .click({ force: true });

  cy.contains(text, { timeout: 30000 })
    .should('be.visible')
})
