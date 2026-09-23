const API_BASE_URL = 'https://forum-api.dicoding.dev/v1';

/**
 * Intercepts the Dicoding Forum API calls used by the login flow so the
 * E2E test does not depend on the real backend or a real account.
 */
Cypress.Commands.add('interceptLoginSuccess', () => {
  cy.intercept('POST', `${API_BASE_URL}/login`, {
    statusCode: 200,
    body: { status: 'success', message: 'ok', data: { token: 'fake-e2e-token' } },
  }).as('loginRequest');

  cy.intercept('GET', `${API_BASE_URL}/users/me`, {
    statusCode: 200,
    body: {
      status: 'success',
      message: 'ok',
      data: {
        user: {
          id: 'user-e2e', name: 'Pengguna E2E', email: 'e2e@mail.com', avatar: '',
        },
      },
    },
  }).as('getOwnProfileRequest');

  cy.intercept('GET', `${API_BASE_URL}/threads`, {
    statusCode: 200,
    body: { status: 'success', message: 'ok', data: { threads: [] } },
  }).as('getThreadsRequest');

  cy.intercept('GET', `${API_BASE_URL}/users`, {
    statusCode: 200,
    body: { status: 'success', message: 'ok', data: { users: [] } },
  }).as('getUsersRequest');
});

Cypress.Commands.add('interceptLoginFailure', () => {
  cy.intercept('POST', `${API_BASE_URL}/login`, {
    statusCode: 400,
    body: { status: 'fail', message: 'email or password is wrong' },
  }).as('loginRequest');
});
