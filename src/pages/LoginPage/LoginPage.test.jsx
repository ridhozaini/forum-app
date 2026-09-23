import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import LoginPage from './LoginPage';
import renderWithProviders from '../../testUtils/renderWithProviders';
import api from '../../utils/api';

jest.mock('../../utils/api');

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

/**
 * Skenario pengujian LoginPage:
 * - should render the email and password fields along with the submit button
 * - should show validation errors when the form is submitted while empty
 * - should call the login API with the typed credentials and navigate to "/" on success
 * - should show an error message and not navigate when the login API call fails
 */
describe('LoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the email and password fields along with the submit button', () => {
    renderWithProviders(<LoginPage />, { preloadedState: { loading: {} } });

    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Kata sandi')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Masuk' })).toBeInTheDocument();
  });

  it('should show validation errors when the form is submitted while empty', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginPage />, { preloadedState: { loading: {} } });

    await user.click(screen.getByRole('button', { name: 'Masuk' }));

    expect(await screen.findByText('Email wajib diisi')).toBeInTheDocument();
    expect(screen.getByText('Kata sandi wajib diisi')).toBeInTheDocument();
    expect(api.login).not.toHaveBeenCalled();
  });

  it('should call the login API with the typed credentials and navigate to "/" on success', async () => {
    api.login.mockResolvedValue('fake-token');
    api.getOwnProfile.mockResolvedValue({ id: 'user-1', name: 'Budi' });

    const user = userEvent.setup();
    renderWithProviders(<LoginPage />, { preloadedState: { loading: {} } });

    await user.type(screen.getByLabelText('Email'), 'budi@mail.com');
    await user.type(screen.getByLabelText('Kata sandi'), 'rahasia123');
    await user.click(screen.getByRole('button', { name: 'Masuk' }));

    await waitFor(() => {
      expect(api.login).toHaveBeenCalledWith({ email: 'budi@mail.com', password: 'rahasia123' });
    });
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/'));
  });

  it('should show an error message and not navigate when the login API call fails', async () => {
    api.login.mockRejectedValue(new Error('Email atau password salah'));

    const user = userEvent.setup();
    renderWithProviders(<LoginPage />, { preloadedState: { loading: {} } });

    await user.type(screen.getByLabelText('Email'), 'budi@mail.com');
    await user.type(screen.getByLabelText('Kata sandi'), 'salahsandi');
    await user.click(screen.getByRole('button', { name: 'Masuk' }));

    expect(await screen.findByText('Email atau password salah')).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
