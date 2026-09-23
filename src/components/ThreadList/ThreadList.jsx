import React from 'react';
import PropTypes from 'prop-types';

import ThreadItem from '../ThreadItem/ThreadItem';
import EmptyState from '../EmptyState/EmptyState';

function ThreadList({
  threads, currentUserId = null, onUpVote, onDownVote,
}) {
  if (threads.length === 0) {
    return (
      <EmptyState
        title="Belum ada thread di kategori ini"
        description="Coba pilih kategori lain, atau jadilah yang pertama memulai diskusi."
      />
    );
  }

  return (
    <div className="thread-list">
      {threads.map((thread) => (
        <ThreadItem
          key={thread.id}
          thread={thread}
          currentUserId={currentUserId}
          onUpVote={onUpVote}
          onDownVote={onDownVote}
        />
      ))}
    </div>
  );
}

ThreadList.propTypes = {
  threads: PropTypes.arrayOf(PropTypes.object).isRequired,
  currentUserId: PropTypes.string,
  onUpVote: PropTypes.func.isRequired,
  onDownVote: PropTypes.func.isRequired,
};

export default ThreadList;
