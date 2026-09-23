import React from 'react';
import PropTypes from 'prop-types';

import CommentItem from '../CommentItem/CommentItem';
import EmptyState from '../EmptyState/EmptyState';

function CommentList({
  comments, currentUserId = null, onUpVote, onDownVote,
}) {
  if (comments.length === 0) {
    return (
      <EmptyState
        title="Belum ada komentar"
        description="Jadilah yang pertama menanggapi thread ini."
      />
    );
  }

  return (
    <div className="comment-list">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          currentUserId={currentUserId}
          onUpVote={onUpVote}
          onDownVote={onDownVote}
        />
      ))}
    </div>
  );
}

CommentList.propTypes = {
  comments: PropTypes.arrayOf(PropTypes.object).isRequired,
  currentUserId: PropTypes.string,
  onUpVote: PropTypes.func.isRequired,
  onDownVote: PropTypes.func.isRequired,
};

export default CommentList;
