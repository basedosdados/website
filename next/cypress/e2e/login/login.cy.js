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
      cy.url().should('eq', Cypress.config().baseUrl + '/user/login');
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