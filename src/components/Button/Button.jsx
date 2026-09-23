import React from 'react';
import PropTypes from 'prop-types';
import './Button.css';

function Button({
  children,
  type = 'button',
  variant = 'primary',
  disabled = false,
  onClick = undefined,
  fullWidth = false,
}) {
  const classNames = [
    'btn',
    `btn--${variant}`,
    fullWidth ? 'btn--full' : '',
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type === 'submit' ? 'submit' : 'button'}
      className={classNames}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  type: PropTypes.oneOf(['button', 'submit']),
  variant: PropTypes.oneOf(['primary', 'secondary', 'ghost']),
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  fullWidth: PropTypes.bool,
};

export default Button;
