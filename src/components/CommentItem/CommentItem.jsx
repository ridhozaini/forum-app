import React from 'react';
import PropTypes from 'prop-types';

import Avatar from '../Avatar/Avatar';
import VoteButtons from '../VoteButtons/VoteButtons';
import { showFormattedDate } from '../../utils';
import './CommentItem.css';

function CommentItem({
  comment, currentUserId = null, onUpVote, onDownVote,
}) {
  const {
    id, content, createdAt, owner, upVotesBy, downVotesBy,
  } = comment;

  const ownerName = owner?.name || 'Pengguna';
  const ownerAvatar = owner?.avatar || '';

  const isUpVoted = Boolean(currentUserId) && upVotesBy.includes(currentUserId);
  const isDownVoted = Boolean(currentUserId) && downVotesBy.includes(currentUserId);

  return (
    <article className="comment-item">
      <Avatar name={ownerName} image={ownerAvatar} size="medium" />
      <div className="comment-item__body">
        <div className="comment-item__meta">
          <span className="comment-item__owner">{ownerName}</span>
          <span className="comment-item__dot">·</span>
          <span>{showFormattedDate(createdAt)}</span>
        </div>
        <p className="comment-item__content">{content}</p>
        <VoteButtons
          upVotesCount={upVotesBy.length}
          downVotesCount={downVotesBy.length}
          isUpVoted={isUpVoted}
          isDownVoted={isDownVoted}
          disabled={!currentUserId}
          onUpVote={() => onUpVote(id)}
          onDownVote={() => onDownVote(id)}
        />
      </div>
    </article>
  );
}

CommentItem.propTypes = {
  comment: PropTypes.shape({
    id: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    owner: PropTypes.shape({
      name: PropTypes.string,
      avatar: PropTypes.string,
    }),
    upVotesBy: PropTypes.arrayOf(PropTypes.string).isRequired,
    downVotesBy: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  currentUserId: PropTypes.string,
  onUpVote: PropTypes.func.isRequired,
  onDownVote: PropTypes.func.isRequired,
};

export default CommentItem;
