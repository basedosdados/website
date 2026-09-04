describe('Fluxo de Recuperação de Senha - Pedido de e-mail', () => {
  beforeEach(() => {
    cy.visit('/user/password-recovery');
  });

  it('Deve exibir o formulário corretamente', () => {
    cy.contains('Redefina sua senha').should('be.visible');
    cy.contains('Insira o endereço de e-mail que você usou para cadastrar sua conta').should('be.visible');
    cy.get('input[placeholder="Insira seu e-mail"]').should('exist');
    cy.contains('button', 'Enviar e-mail de redefinição').should('be.visible');
    cy.contains('entre em contato').should('be.visible');
  });

  it('Deve mostrar erro quando o e-mail é inválido', () => {
    cy.get('input[placeholder="Insira seu e-mail"]').type('invalido', { force: true });
    cy.contains('button', 'Enviar e-mail de redefinição').click();
    cy.contains('Endereço de e-mail inválido.').should('be.visible');
  });

  it('Deve mostrar erro quando o usuário não existe', () => {
    cy.mockGetIdUser({ statusCode: 200, body: { error: 'err, user not found' } });

    cy.get('input[placeholder="Insira seu e-mail"]').type('missing@example.com');
    cy.contains('button', 'Enviar e-mail de redefinição').click();

    cy.wait('@getIdUser');
    cy.contains('Endereço de e-mail inválido.').should('be.visible');
  });

  it('Deve enviar o e-mail de redefinição com sucesso', () => {
    cy.mockGetIdUser({
      statusCode: 200,
      body: { id: 'AccountNode:user123', isActive: true }
    });
    cy.intercept('POST', '**/account/password_reset/**', { statusCode: 200 }).as('passwordReset');

    cy.get('input[placeholder="Insira seu e-mail"]').type('test@example.com');
    cy.contains('button', 'Enviar e-mail de redefinição').click();

    cy.wait(['@getIdUser', '@passwordReset']);
    cy.contains(/Espere \d+ segundos/).should('be.visible');
  });
});

describe('Fluxo de Recuperação de Senha - Nova senha', () => {
  beforeEach(() => {
    cy.visit('/user/password-recovery?q=uid123&p=token123');
  });

  it('Deve exibir o formulário de nova senha', () => {
    cy.contains('Redefina sua nova senha').should('be.visible');
    cy.get('input[id="password"]').should('exist');
    cy.get('input[id="confirmPassword"]').should('exist');
    cy.contains('button', 'Atualizar senha').should('be.visible');
  });

  it('Deve validar campos obrigatórios', () => {
    cy.contains('button', 'Atualizar senha').click();
    cy.contains('Por favor, insira a senha.').should('be.visible');
    cy.contains('Confirmar a senha é necessário').should('be.visible');
  });

  it('Deve validar requisitos da senha', () => {
    cy.get('input[id="confirmPassword"]').type('weak');
    cy.contains('button', 'Atualizar senha').click();

    const requirements = [
      '8 caracteres',
      'Uma letra maiúscula',
      'Uma letra minúscula',
      'Um número',
      'Um caractere especial, dentre ! @ # ? ! % & *'
    ];

    requirements.forEach((text) => {
      cy.contains('li', text)
        .should('have.css', 'color', 'rgb(191, 52, 52)');
    });
  });

  it('Deve validar confirmação de senha', () => {
    cy.get('input[id="password"]').type('ValidPass123!');
    cy.get('input[id="confirmPassword"]').type('Diferent123!');
    cy.contains('button', 'Atualizar senha').click();
    cy.contains('A senha inserida não coincide com a senha criada no campo acima. Por favor, verifique se não há erros de digitação e tente novamente.').should('be.visible');
  });

  it('Deve atualizar a senha e redirecionar para o login', () => {
    cy.intercept('POST', '**/account/password_reset_confirm/**', { statusCode: 200 }).as('passwordResetConfirm');

    cy.get('input[id="password"]').type('ValidPass123!');
    cy.get('input[id="confirmPassword"]').type('ValidPass123!');
    cy.contains('button', 'Atualizar senha').click();

    cy.wait('@passwordResetConfirm');
    cy.url({ timeout: 10000 }).should('include', '/user/login');
  });

  it('Deve voltar ao pedido de e-mail quando a confirmação falhar', () => {
    cy.intercept('POST', '**/account/password_reset_confirm/**', { statusCode: 400 }).as('passwordResetConfirm');

    cy.get('input[id="password"]').type('ValidPass123!');
    cy.get('input[id="confirmPassword"]').type('ValidPass123!');
    cy.contains('button', 'Atualizar senha').click();

    cy.wait('@passwordResetConfirm');
    cy.url({ timeout: 10000 }).should('include', '/user/password-recovery');
    cy.contains('Redefina sua senha').should('be.visible');
  });
});
