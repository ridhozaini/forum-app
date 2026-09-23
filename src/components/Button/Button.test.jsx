import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Button from './Button';

/**
 * Skenario pengujian Button:
 * - should render its children as the button label
 * - should call onClick when clicked
 * - should not call onClick when disabled
 * - should use type="submit" only when explicitly given
 */
describe('Button component', () => {
  it('should render its children as the button label', () => {
    render(<Button>Kirim</Button>);

    expect(screen.getByRole('button', { name: 'Kirim' })).toBeInTheDocument();
  });

  it('should call onClick when clicked', async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();

    render(<Button onClick={onClick}>Kirim</Button>);
    await user.click(screen.getByRole('button', { name: 'Kirim' }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('should not call onClick when disabled', async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();

    render(<Button onClick={onClick} disabled>Kirim</Button>);
    await user.click(screen.getByRole('button', { name: 'Kirim' }));

    expect(onClick).not.toHaveBeenCalled();
  });

  it('should use type="submit" only when explicitly given', () => {
    const { rerender } = render(<Button>Kirim</Button>);
    expect(screen.getByRole('button', { name: 'Kirim' })).toHaveAttribute('type', 'button');

    rerender(<Button type="submit">Kirim</Button>);
    expect(screen.getByRole('button', { name: 'Kirim' })).toHaveAttribute('type', 'submit');
  });
});
