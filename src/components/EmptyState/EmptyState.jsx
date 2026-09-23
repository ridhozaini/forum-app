import React from 'react';
import PropTypes from 'prop-types';
import './EmptyState.css';

function EmptyState({ title, description = '' }) {
  return (
    <div className="empty-state">
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

EmptyState.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
};

export default EmptyState;
