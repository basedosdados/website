describe('Fluxo de Login - Cenários Principais', () => {
  beforeEach(() => {
    cy.visit(`/user/login`);
    cy.window().then((win) => {
      win.sessionStorage.clear();
    });
    cy.clearCookies();
  });

  it('Deve exibir o formulário corretamente', () => {
    cy.contains('h1', 'Faça login').should('be.visible');
    cy.get('input[name=username]').should('exist');
    cy.get('input[name=password]').should('exist');
    cy.contains('button', 'Entrar').should('be.visible');
    cy.contains('Esqueceu a senha?').should('be.visible');
    cy.contains('Cadastre-se').should('be.visible');
  });

  it('Deve permitir alternar visibilidade da senha', () => {
    cy.get('input[name=password]').should('have.attr', 'type', 'password');
    cy.get('[alt="exibir senhar"]').click();
    cy.get('input[name=password]').should('have.attr', 'type', 'text');
  });

  it('Deve logar com sucesso e redirecionar para home', () => {
    cy.mockAuthApi(
      { statusCode: 200, body: { id: 'user123' } },
      null,
      { statusCode: 200, body: { username: 'testuser', workDataTool: 'some-data' } } // userResponse
    );

    cy.login('test@example.com', 'correct123');

    cy.wait(['@getToken', '@getUser']).then(() => {
      cy.getCookie('userBD').should('exist');
      cy.url({ timeout: 10000 }).should('eq', Cypress.config().baseUrl + '/');
    });
  });

  it('Deve redirecionar para survey quando workDataTool é null', () => {
    cy.intercept('GET', '/api/user/getToken*', { id: 'user123' });
    cy.intercept('GET', '/api/user/getUser*', { 
      username: 'testuser',
      workDataTool: null 
    });

    cy.get('input[name=username]').type('test@example.com');
    cy.get('input[name=password]').type('correct123');
    cy.contains('button', 'Entrar').click();

    cy.url().should('include', '/user/survey');
  });
});

describe('Fluxo de Login - Casos de Erro', () => {
  beforeEach(() => {
    cy.visit('/user/login');
  });

  it('Deve mostrar erro quando email é inválido', () => {
    cy.get('input[name=username]').invoke('prop', 'type', 'text').type('invalido');
    cy.get('input[name=password]').type('qualquer');
    cy.contains('button', 'Entrar').click();

    cy.contains('Por favor, insira um endereço de e-mail válido.').should('be.visible');
  });

  it('Deve mostrar erro quando campos estão vazios', () => {
    cy.contains('button', 'Entrar').click();
    cy.contains('Por favor, insira um endereço de e-mail válido.').should('be.visible');
    cy.contains('Por favor, insira a senha.').should('be.visible');
  });

  it('Deve mostrar erro com credenciais inválidas', () => {
    cy.mockAuthApi(
      { statusCode: 200, body: { error: true } },
      { statusCode: 200, body: { isActive: true } }
    );

    cy.login('wrong@example.com', 'wrongpass');
    cy.contains('E-mail ou senha incorretos.').should('be.visible');
  });

  it('Deve lidar com conta inativa corretamente', () => {
    cy.mockAuthApi(
      { statusCode: 200, body: { error: true } },
      { statusCode: 200, body: { isActive: false, id: 'user:inactive123' } },
      null,
      { statusCode: 200 }
    );

    cy.login('inactive@example.com', 'anypassword');

    cy.wait(['@getToken', '@getIdUser', '@activationApi']).then(() => {
      cy.window().its('sessionStorage.registration_email_bd')
        .should('eq', 'inactive@example.com');
      cy.url().should('include', '/user/check-email?e=1');
    });
  });

  it('Deve mostrar erro de servidor ao falhar busca de userData', () => {
    cy.intercept('GET', '/api/user/getToken*', { id: 'user123' });
    cy.intercept('GET', '/api/user/getUser*', { 
      error: true 
    });

    cy.get('input[name=username]').type('test@example.com');
    cy.get('input[name=password]').type('correct123');
    cy.contains('button', 'Entrar').click();

    cy.contains('Não foi possível conectar ao servidor. Tente novamente mais tarde.').should('be.visible');
  });
});