import { toast } from 'react-toastify';

import api from '../../utils/api';
import { applyVoteToggle } from '../../utils';
import { hideLoading, showLoading } from '../loading/action';

const ActionType = {
  RECEIVE_THREAD_DETAIL: 'RECEIVE_THREAD_DETAIL',
  CLEAR_THREAD_DETAIL: 'CLEAR_THREAD_DETAIL',
  ADD_COMMENT: 'ADD_COMMENT',
  UPDATE_THREAD_DETAIL_VOTES: 'UPDATE_THREAD_DETAIL_VOTES',
  UPDATE_COMMENT_VOTES: 'UPDATE_COMMENT_VOTES',
};

function receiveThreadDetailActionCreator(threadDetail) {
  return { type: ActionType.RECEIVE_THREAD_DETAIL, payload: { threadDetail } };
}

function clearThreadDetailActionCreator() {
  return { type: ActionType.CLEAR_THREAD_DETAIL };
}

function addCommentActionCreator(comment) {
  return { type: ActionType.ADD_COMMENT, payload: { comment } };
}

function updateThreadDetailVotesActionCreator({ upVotesBy, downVotesBy }) {
  return {
    type: ActionType.UPDATE_THREAD_DETAIL_VOTES,
    payload: { upVotesBy, downVotesBy },
  };
}

function updateCommentVotesActionCreator({ commentId, upVotesBy, downVotesBy }) {
  return {
    type: ActionType.UPDATE_COMMENT_VOTES,
    payload: { commentId, upVotesBy, downVotesBy },
  };
}

function asyncReceiveThreadDetail(threadId) {
  return async (dispatch) => {
    dispatch(clearThreadDetailActionCreator());
    dispatch(showLoading('threadDetail'));
    try {
      const threadDetail = await api.getThreadDetail(threadId);
      dispatch(receiveThreadDetailActionCreator(threadDetail));
    } finally {
      dispatch(hideLoading('threadDetail'));
    }
  };
}

function asyncAddComment({ threadId, content }) {
  return async (dispatch, getState) => {
    dispatch(showLoading('submitComment'));
    try {
      const comment = await api.createComment({ threadId, content });
      const { authUser } = getState();

      const normalizedComment = {
        ...comment,
        owner: comment.owner || authUser,
        upVotesBy: comment.upVotesBy || [],
        downVotesBy: comment.downVotesBy || [],
      };

      dispatch(addCommentActionCreator(normalizedComment));
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    } finally {
      dispatch(hideLoading('submitComment'));
    }
  };
}

function asyncToggleVoteThreadDetail({ threadId, type }) {
  return async (dispatch, getState) => {
    const { threadDetail, authUser } = getState();
    if (!threadDetail || !authUser) return;

    const previousVotes = {
      upVotesBy: threadDetail.upVotesBy,
      downVotesBy: threadDetail.downVotesBy,
    };
    const isSameDirection = type === 'up'
      ? threadDetail.upVotesBy.includes(authUser.id)
      : threadDetail.downVotesBy.includes(authUser.id);

    const optimistic = applyVoteToggle({
      upVotesBy: threadDetail.upVotesBy,
      downVotesBy: threadDetail.downVotesBy,
      userId: authUser.id,
      type,
    });

    dispatch(updateThreadDetailVotesActionCreator(optimistic));

    try {
      if (isSameDirection) {
        await api.neutralVoteThread(threadId);
      } else if (type === 'up') {
        await api.upVoteThread(threadId);
      } else {
        await api.downVoteThread(threadId);
      }
    } catch (error) {
      dispatch(updateThreadDetailVotesActionCreator(previousVotes));
      toast.error('Gagal mengirim vote. Coba lagi.');
    }
  };
}

function asyncToggleVoteComment({ threadId, commentId, type }) {
  return async (dispatch, getState) => {
    const { threadDetail, authUser } = getState();
    if (!threadDetail || !authUser) return;

    const comment = threadDetail.comments.find((item) => item.id === commentId);
    if (!comment) return;

    const previousVotes = {
      upVotesBy: comment.upVotesBy,
      downVotesBy: comment.downVotesBy,
    };
    const isSameDirection = type === 'up'
      ? comment.upVotesBy.includes(authUser.id)
      : comment.downVotesBy.includes(authUser.id);

    const optimistic = applyVoteToggle({
      upVotesBy: comment.upVotesBy,
      downVotesBy: comment.downVotesBy,
      userId: authUser.id,
      type,
    });

    dispatch(updateCommentVotesActionCreator({ commentId, ...optimistic }));

    try {
      if (isSameDirection) {
        await api.neutralVoteComment({ threadId, commentId });
      } else if (type === 'up') {
        await api.upVoteComment({ threadId, commentId });
      } else {
        await api.downVoteComment({ threadId, commentId });
      }
    } catch (error) {
      dispatch(updateCommentVotesActionCreator({ commentId, ...previousVotes }));
      toast.error('Gagal mengirim vote. Coba lagi.');
    }
  };
}

export {
  ActionType,
  receiveThreadDetailActionCreator,
  clearThreadDetailActionCreator,
  addCommentActionCreator,
  updateThreadDetailVotesActionCreator,
  updateCommentVotesActionCreator,
  asyncReceiveThreadDetail,
  asyncAddComment,
  asyncToggleVoteThreadDetail,
  asyncToggleVoteComment,
};
