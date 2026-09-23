import React from 'react';
import PropTypes from 'prop-types';
import './LoadingIndicator.css';

function LoadingIndicator({ label = 'Memuat...' }) {
  return (
    <div className="loading-indicator" role="status" aria-live="polite">
      <span className="loading-indicator__spinner" />
      <span>{label}</span>
    </div>
  );
}

LoadingIndicator.propTypes = {
  label: PropTypes.string,
};

export default LoadingIndicator;
