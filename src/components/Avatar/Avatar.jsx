import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { getInitials } from '../../utils';
import './Avatar.css';

function Avatar({ name, image = '', size = 'medium' }) {
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = image && !imageFailed;

  return (
    <div className={`avatar avatar--${size}`} title={name}>
      {showImage ? (
        <img
          src={image}
          alt={name}
          onError={() => setImageFailed(true)}
        />
      ) : (
        <span>{getInitials(name)}</span>
      )}
    </div>
  );
}

Avatar.propTypes = {
  name: PropTypes.string.isRequired,
  image: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
};

export default Avatar;
