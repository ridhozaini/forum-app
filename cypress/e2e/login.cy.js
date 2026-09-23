describe('Login flow', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('should display the login page correctly', () => {
    cy.visit('/login');

    cy.get('h1').should('contain.text', 'Masuk');
    cy.get('label').contains('Email').should('exist');
    cy.get('label').contains('Kata sandi').should('exist');
    cy.get('button[type="submit"]').should('contain.text', 'Masuk');
  });

  it('should show validation alerts when email and password are not filled in', () => {
    cy.visit('/login');

    cy.get('button[type="submit"]').click();

    cy.contains('Email wajib diisi').should('be.visible');
    cy.contains('Kata sandi wajib diisi').should('be.visible');
  });

  it('should display an alert message when the credentials are wrong', () => {
    cy.interceptLoginFailure();
    cy.visit('/login');

    cy.get('#email').type('salah@mail.com');
    cy.get('#password').type('salahsandi');
    cy.get('button[type="submit"]').click();

    cy.wait('@loginRequest');
    cy.contains('email or password is wrong').should('be.visible');
  });

  it('should log the user in and redirect to the homepage on correct credentials', () => {
    cy.interceptLoginSuccess();
    cy.visit('/login');

    cy.get('#email').type('e2e@mail.com');
    cy.get('#password').type('rahasia123');
    cy.get('button[type="submit"]').click();

    cy.wait('@loginRequest');
    cy.wait('@getOwnProfileRequest');

    cy.url().should('eq', `${Cypress.config('baseUrl')}/`);
    cy.contains('Pengguna E2E').should('be.visible');
    cy.contains('Keluar').should('be.visible');
  });
});
