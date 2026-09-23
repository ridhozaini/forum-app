import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import Avatar from '../Avatar/Avatar';
import VoteButtons from '../VoteButtons/VoteButtons';
import { showFormattedDate, truncateText } from '../../utils';
import './ThreadItem.css';

function ThreadItem({
  thread, currentUserId = null, onUpVote, onDownVote,
}) {
  const {
    id, title, body, category, createdAt, owner, totalComments, upVotesBy, downVotesBy,
  } = thread;

  const ownerName = owner?.name || 'Pengguna';
  const ownerAvatar = owner?.avatar || '';

  const isUpVoted = Boolean(currentUserId) && upVotesBy.includes(currentUserId);
  const isDownVoted = Boolean(currentUserId) && downVotesBy.includes(currentUserId);

  return (
    <article className="thread-item">
      <div className="thread-item__main">
        {category && <span className="thread-item__category">{category}</span>}
        <Link to={`/threads/${id}`} className="thread-item__title">
          {title}
        </Link>
        {body && <p className="thread-item__excerpt">{truncateText(body, 140)}</p>}

        <div className="thread-item__meta">
          <Avatar name={ownerName} image={ownerAvatar} size="small" />
          <span className="thread-item__owner">{ownerName}</span>
          <span className="thread-item__dot">·</span>
          <span>{showFormattedDate(createdAt)}</span>
          <span className="thread-item__dot">·</span>
          <span>
            {totalComments}
            {' '}
            komentar
          </span>
        </div>
      </div>

      <VoteButtons
        upVotesCount={upVotesBy.length}
        downVotesCount={downVotesBy.length}
        isUpVoted={isUpVoted}
        isDownVoted={isDownVoted}
        disabled={!currentUserId}
        onUpVote={() => onUpVote(id)}
        onDownVote={() => onDownVote(id)}
      />
    </article>
  );
}

ThreadItem.propTypes = {
  thread: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    body: PropTypes.string,
    category: PropTypes.string,
    createdAt: PropTypes.string.isRequired,
    totalComments: PropTypes.number,
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

export default ThreadItem;
