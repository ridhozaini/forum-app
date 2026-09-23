import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import TextField from './TextField';

/**
 * Skenario pengujian TextField:
 * - should render the label and the current value
 * - should call onChange when the user types into the field
 * - should render as a textarea when as="textarea" is given
 * - should show the error message and mark the field as invalid when error is given
 */
describe('TextField component', () => {
  it('should render the label and the current value', () => {
    render(
      <TextField id="email" label="Email" value="budi@mail.com" onChange={jest.fn()} />,
    );

    expect(screen.getByLabelText('Email')).toHaveValue('budi@mail.com');
  });

  it('should call onChange when the user types into the field', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();

    render(<TextField id="email" label="Email" value="" onChange={onChange} />);

    await user.type(screen.getByLabelText('Email'), 'a');

    expect(onChange).toHaveBeenCalled();
  });

  it('should render as a textarea when as="textarea" is given', () => {
    render(
      <TextField id="body" label="Isi" value="" onChange={jest.fn()} as="textarea" />,
    );

    expect(screen.getByLabelText('Isi').tagName).toBe('TEXTAREA');
  });

  it('should show the error message and mark the field as invalid when error is given', () => {
    render(
      <TextField id="email" label="Email" value="" onChange={jest.fn()} error="Email wajib diisi" />,
    );

    expect(screen.getByText('Email wajib diisi')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true');
  });
});
