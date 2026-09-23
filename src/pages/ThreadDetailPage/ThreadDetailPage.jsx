import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';

import Avatar from '../../components/Avatar/Avatar';
import VoteButtons from '../../components/VoteButtons/VoteButtons';
import CommentList from '../../components/CommentList/CommentList';
import LoadingIndicator from '../../components/LoadingIndicator/LoadingIndicator';
import Button from '../../components/Button/Button';
import {
  asyncAddComment,
  asyncReceiveThreadDetail,
  asyncToggleVoteComment,
  asyncToggleVoteThreadDetail,
} from '../../states/threadDetail/action';
import { showFormattedDate } from '../../utils';
import './ThreadDetailPage.css';

function ThreadDetailPage() {
  const { threadId } = useParams();
  const dispatch = useDispatch();

  const threadDetail = useSelector((states) => states.threadDetail);
  const authUser = useSelector((states) => states.authUser);
  const isLoadingDetail = useSelector((states) => states.loading.threadDetail);
  const isSubmittingComment = useSelector((states) => states.loading.submitComment);

  const [commentText, setCommentText] = useState('');
  const [commentError, setCommentError] = useState('');

  useEffect(() => {
    dispatch(asyncReceiveThreadDetail(threadId));
  }, [dispatch, threadId]);

  const onUpVoteThread = () => {
    dispatch(asyncToggleVoteThreadDetail({ threadId, type: 'up' }));
  };

  const onDownVoteThread = () => {
    dispatch(asyncToggleVoteThreadDetail({ threadId, type: 'down' }));
  };

  const onUpVoteComment = (commentId) => {
    dispatch(asyncToggleVoteComment({ threadId, commentId, type: 'up' }));
  };

  const onDownVoteComment = (commentId) => {
    dispatch(asyncToggleVoteComment({ threadId, commentId, type: 'down' }));
  };

  const onSubmitComment = async (event) => {
    event.preventDefault();
    setCommentError('');

    if (!commentText.trim()) {
      setCommentError('Komentar tidak boleh kosong.');
      return;
    }

    const result = await dispatch(asyncAddComment({ threadId, content: commentText }));

    if (result.success) {
      setCommentText('');
    } else {
      setCommentError(result.message || 'Gagal mengirim komentar.');
    }
  };

  if (isLoadingDetail || !threadDetail) {
    return <LoadingIndicator label="Memuat thread..." />;
  }

  const {
    title, body, category, createdAt, owner, upVotesBy, downVotesBy, comments,
  } = threadDetail;

  const ownerName = owner?.name || 'Pengguna';
  const ownerAvatar = owner?.avatar || '';

  const isUpVoted = Boolean(authUser) && upVotesBy.includes(authUser.id);
  const isDownVoted = Boolean(authUser) && downVotesBy.includes(authUser.id);

  return (
    <div>
      <article className="thread-detail">
        {category && <span className="thread-detail__category">{category}</span>}
        <h1 className="thread-detail__title">{title}</h1>

        <div className="thread-detail__owner">
          <Avatar name={ownerName} image={ownerAvatar} size="large" />
          <div>
            <p className="thread-detail__owner-name">{ownerName}</p>
            <p className="thread-detail__date">{showFormattedDate(createdAt)}</p>
          </div>
        </div>

        <p className="thread-detail__body">{body}</p>

        <VoteButtons
          upVotesCount={upVotesBy.length}
          downVotesCount={downVotesBy.length}
          isUpVoted={isUpVoted}
          isDownVoted={isDownVoted}
          disabled={!authUser}
          onUpVote={onUpVoteThread}
          onDownVote={onDownVoteThread}
        />
      </article>

      <section className="thread-detail__comment-form">
        <h3>
          {comments.length}
          {' '}
          komentar
        </h3>

        {authUser ? (
          <form onSubmit={onSubmitComment}>
            <textarea
              className="input"
              rows={3}
              placeholder="Tulis tanggapanmu..."
              value={commentText}
              onChange={(event) => setCommentText(event.target.value)}
            />
            {commentError && <div className="form-error">{commentError}</div>}
            <div className="thread-detail__comment-submit">
              <Button type="submit" disabled={isSubmittingComment}>
                {isSubmittingComment ? 'Mengirim...' : 'Kirim komentar'}
              </Button>
            </div>
          </form>
        ) : (
          <p className="thread-detail__login-hint">
            <Link to="/login">Masuk</Link>
            {' '}
            untuk ikut berkomentar.
          </p>
        )}
      </section>

      <CommentList
        comments={comments}
        currentUserId={authUser ? authUser.id : null}
        onUpVote={onUpVoteComment}
        onDownVote={onDownVoteComment}
      />
    </div>
  );
}

export default ThreadDetailPage;
