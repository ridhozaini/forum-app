import { toast } from 'react-toastify';

import api from '../../utils/api';
import { applyVoteToggle } from '../../utils';
import { hideLoading, showLoading } from '../loading/action';

const ActionType = {
  RECEIVE_THREADS: 'RECEIVE_THREADS',
  ADD_THREAD: 'ADD_THREAD',
  UPDATE_THREAD_VOTES: 'UPDATE_THREAD_VOTES',
};

function receiveThreadsActionCreator(threads) {
  return { type: ActionType.RECEIVE_THREADS, payload: { threads } };
}

function addThreadActionCreator(thread) {
  return { type: ActionType.ADD_THREAD, payload: { thread } };
}

function updateThreadVotesActionCreator({ threadId, upVotesBy, downVotesBy }) {
  return {
    type: ActionType.UPDATE_THREAD_VOTES,
    payload: { threadId, upVotesBy, downVotesBy },
  };
}

function asyncReceiveThreads() {
  return async (dispatch) => {
    dispatch(showLoading('threads'));
    try {
      const [threads, users] = await Promise.all([
        api.getAllThreads(),
        api.getAllUsers(),
      ]);

      const usersById = new Map(users.map((user) => [user.id, user]));
      const normalizedThreads = threads.map((thread) => ({
        ...thread,
        owner: thread.owner || usersById.get(thread.ownerId) || {
          id: thread.ownerId,
          name: 'Pengguna',
          avatar: '',
        },
      }));

      dispatch(receiveThreadsActionCreator(normalizedThreads));
    } finally {
      dispatch(hideLoading('threads'));
    }
  };
}

function asyncAddThread({ title, body, category }) {
  return async (dispatch, getState) => {
    dispatch(showLoading('submitThread'));
    try {
      const thread = await api.createThread({ title, body, category });
      const { authUser } = getState();

      const normalizedThread = {
        ...thread,
        owner: authUser,
        upVotesBy: thread.upVotesBy || [],
        downVotesBy: thread.downVotesBy || [],
        totalComments: thread.totalComments || 0,
      };

      dispatch(addThreadActionCreator(normalizedThread));
      return { success: true, thread: normalizedThread };
    } catch (error) {
      return { success: false, message: error.message };
    } finally {
      dispatch(hideLoading('submitThread'));
    }
  };
}

/**
 * Optimistically flips the vote in the store first, then confirms with the
 * API. On failure the previous vote arrays are restored.
 */
function asyncToggleVoteThread({ threadId, type }) {
  return async (dispatch, getState) => {
    const { threads, authUser } = getState();
    const thread = threads.find((item) => item.id === threadId);
    if (!thread || !authUser) return;

    const previousVotes = {
      upVotesBy: thread.upVotesBy,
      downVotesBy: thread.downVotesBy,
    };

    const isSameDirection = type === 'up'
      ? thread.upVotesBy.includes(authUser.id)
      : thread.downVotesBy.includes(authUser.id);

    const optimistic = applyVoteToggle({
      upVotesBy: thread.upVotesBy,
      downVotesBy: thread.downVotesBy,
      userId: authUser.id,
      type,
    });

    dispatch(updateThreadVotesActionCreator({ threadId, ...optimistic }));

    try {
      if (isSameDirection) {
        await api.neutralVoteThread(threadId);
      } else if (type === 'up') {
        await api.upVoteThread(threadId);
      } else {
        await api.downVoteThread(threadId);
      }
    } catch (error) {
      dispatch(updateThreadVotesActionCreator({ threadId, ...previousVotes }));
      toast.error('Gagal mengirim vote. Coba lagi.');
    }
  };
}

export {
  ActionType,
  receiveThreadsActionCreator,
  addThreadActionCreator,
  updateThreadVotesActionCreator,
  asyncReceiveThreads,
  asyncAddThread,
  asyncToggleVoteThread,
};
