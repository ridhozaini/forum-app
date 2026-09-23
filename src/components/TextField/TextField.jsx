import React from 'react';
import PropTypes from 'prop-types';

function TextField({
  id,
  label,
  type = 'text',
  value,
  onChange,
  onBlur = undefined,
  error = '',
  placeholder = '',
  required = false,
  minLength = undefined,
  as = 'input',
  rows = 4,
}) {
  const Element = as;
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <Element
        id={id}
        name={id}
        type={as === 'input' ? type : undefined}
        rows={as === 'textarea' ? rows : undefined}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        required={required}
        minLength={minLength}
        className={`input ${error ? 'input--error' : ''}`}
        aria-invalid={Boolean(error)}
        aria-describedby={errorId}
      />
      {error && (
        <span id={errorId} className="field-error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}

TextField.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  error: PropTypes.string,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  minLength: PropTypes.number,
  as: PropTypes.oneOf(['input', 'textarea']),
  rows: PropTypes.number,
};

export default TextField;
