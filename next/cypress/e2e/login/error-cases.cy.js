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