describe('Fluxo de Registro', () => {
  beforeEach(() => {
    cy.visit('/user/register');
  });

  it('Deve exibir o formulário corretamente', () => {
    cy.contains('h1', 'Cadastre-se').should('be.visible');
    cy.get('input[name="firstName"]').should('exist');
    cy.get('input[name="lastName"]').should('exist');
    cy.get('input[name="user"]').should('exist');
    cy.get('input[name="username"]').should('exist');
    cy.get('input[id="password"]').should('exist');
    cy.get('input[id="confirmPassword"]').should('exist');
    cy.contains('button', 'Cadastrar').should('be.visible');
  });

  it('Deve validar campos obrigatórios', () => {
    cy.contains('button', 'Cadastrar').click();

    cy.contains('Por favor, insira seu nome.').should('be.visible');
    cy.contains('Endereço de e-mail inválido ou já existe uma conta com este e-mail.').should('be.visible');
    cy.contains('Nome de usuário inválido ou já existe uma conta com este nome de usuário.').should('be.visible');
    cy.contains('Por favor, insira a senha.').should('be.visible');
  });

  it('Deve validar formato de email', () => {
    cy.get('input[name="username"]').invoke('prop', 'type', 'text').type('emailinvalido');
    cy.contains('button', 'Cadastrar').click();
    cy.contains('Endereço de e-mail inválido ou já existe uma conta com este e-mail.').should('be.visible');
  });

  it('Deve validar requisitos da senha', () => {
    const user = {
      confirmPassword: 'weak'
    };

    cy.fillRegisterForm(user);
    cy.contains('button', 'Cadastrar').click();

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
    const user = {
      password: 'ValidPass123!',
      confirmPassword: 'Diferent123!'
    };
    
    cy.fillRegisterForm(user);
    cy.contains('button', 'Cadastrar').click();
    cy.contains('A senha inserida não coincide com a senha criada no campo acima. Por favor, verifique se não há erros de digitação e tente novamente.').should('be.visible');
  });

  it('Deve registrar com sucesso', () => {
    cy.fixture('registerUsers').then((users) => {
      const validUser = users.validUser;

      cy.mockRegisterApi({
        statusCode: 200,
        body: { success: true }
      });

      cy.fillRegisterForm(validUser);
      cy.contains('button', 'Cadastrar').click();

      cy.wait('@registerApi').then(() => {
        cy.url().should('include', '/user/check-email');
        cy.window().its('sessionStorage.registration_email_bd')
          .should('eq', validUser.email);
      });
    });
  });

  it('Deve mostrar erro para email já cadastrado', () => {
    cy.fixture('registerUsers').then((users) => {
      const existingUser = users.existingEmail;

      cy.mockRegisterApi({
        statusCode: 200,
        body: {
          success: false,
          errors: [{ field: "email" }]
        }
      });

      cy.fillRegisterForm(existingUser);
      cy.contains('button', 'Cadastrar').click();

      cy.contains('Conta com este email já existe.').should('be.visible');
      cy.contains('Erro ao tentar se cadastrar: o usuário já existe!').should('be.visible');
    });
  });

  it('Deve mostrar erro para username já existente', () => {
    cy.fixture('registerUsers').then((users) => {
      const existingUser = users.existingUsername;

      cy.mockRegisterApi({
        statusCode: 200,
        body: {
          success: false,
          errors: [{ field: "username" }]
        }
      });

      cy.fillRegisterForm(existingUser);
      cy.contains('button', 'Cadastrar').click();

      cy.contains('Conta com este nome de usuário já existe.').should('be.visible');
      cy.contains('Erro ao tentar se cadastrar: o nome de usuário já existe!').should('be.visible');
    });
  });

  it('Deve alternar visibilidade da senha', () => {
    cy.get('input[id="password"]').should('have.attr', 'type', 'password');
    cy.get('[alt="exibir senhar"]').first().click();
    cy.get('input[id="password"]').should('have.attr', 'type', 'text');

    cy.get('input[id="confirmPassword"]').should('have.attr', 'type', 'password');
    cy.get('[alt="exibir senhar"]').last(1).click();
    cy.get('input[id="confirmPassword"]').should('have.attr', 'type', 'text');
  });
});