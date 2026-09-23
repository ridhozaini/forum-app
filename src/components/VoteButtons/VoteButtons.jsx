import React from 'react';
import PropTypes from 'prop-types';
import './VoteButtons.css';

function VoteButtons({
  upVotesCount, downVotesCount, isUpVoted, isDownVoted, onUpVote, onDownVote, disabled = false,
}) {
  return (
    <div className="vote-buttons">
      <button
        type="button"
        className={`vote-buttons__btn vote-buttons__btn--up ${isUpVoted ? 'is-active' : ''}`}
        onClick={onUpVote}
        disabled={disabled}
        aria-pressed={isUpVoted}
        aria-label="Upvote"
        title={disabled ? 'Masuk untuk memberi vote' : 'Upvote'}
      >
        <span aria-hidden="true">▲</span>
        <span>{upVotesCount}</span>
      </button>
      <button
        type="button"
        className={`vote-buttons__btn vote-buttons__btn--down ${isDownVoted ? 'is-active' : ''}`}
        onClick={onDownVote}
        disabled={disabled}
        aria-pressed={isDownVoted}
        aria-label="Downvote"
        title={disabled ? 'Masuk untuk memberi vote' : 'Downvote'}
      >
        <span aria-hidden="true">▼</span>
        <span>{downVotesCount}</span>
      </button>
    </div>
  );
}

VoteButtons.propTypes = {
  upVotesCount: PropTypes.number.isRequired,
  downVotesCount: PropTypes.number.isRequired,
  isUpVoted: PropTypes.bool.isRequired,
  isDownVoted: PropTypes.bool.isRequired,
  onUpVote: PropTypes.func.isRequired,
  onDownVote: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

export default VoteButtons;
