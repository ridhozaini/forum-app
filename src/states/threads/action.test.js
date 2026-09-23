import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import {
  ActionType,
  asyncReceiveThreads,
  asyncAddThread,
  asyncToggleVoteThread,
} from './action';
import { ActionType as LoadingActionType } from '../loading/action';
import api from '../../utils/api';

jest.mock('../../utils/api');
jest.mock('react-toastify', () => ({ toast: { error: jest.fn(), success: jest.fn() } }));

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

/**
 * Skenario pengujian thunk pada threads:
 * - asyncReceiveThreads should dispatch showLoading, RECEIVE_THREADS
 *   (with owner normalized from the users list), and hideLoading when the
 *   API calls succeed
 * - asyncReceiveThreads should still dispatch hideLoading when the API call fails
 * - asyncAddThread should dispatch showLoading, ADD_THREAD, and hideLoading
 *   and return a success result when the API call succeeds
 * - asyncAddThread should return a failure result (without dispatching
 *   ADD_THREAD) when the API call fails
 * - asyncToggleVoteThread should optimistically dispatch UPDATE_THREAD_VOTES
 *   with the toggled vote when up-voting for the first time
 * - asyncToggleVoteThread should revert the optimistic update when the API call fails
 */
describe('threads thunk', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should dispatch showLoading, RECEIVE_THREADS, and hideLoading when asyncReceiveThreads succeeds', async () => {
    const threads = [
      {
        id: 'thread-1', title: 'Judul', ownerId: 'user-1', owner: null,
      },
    ];
    const users = [{ id: 'user-1', name: 'Budi', avatar: '' }];

    api.getAllThreads.mockResolvedValue(threads);
    api.getAllUsers.mockResolvedValue(users);

    const store = mockStore({});
    await store.dispatch(asyncReceiveThreads());

    const actions = store.getActions();

    expect(actions[0]).toEqual({ type: LoadingActionType.SHOW_LOADING, payload: { key: 'threads' } });
    expect(actions[1].type).toEqual(ActionType.RECEIVE_THREADS);
    expect(actions[1].payload.threads[0].owner).toEqual(users[0]);
    expect(actions[2]).toEqual({ type: LoadingActionType.HIDE_LOADING, payload: { key: 'threads' } });
  });

  it('should still dispatch hideLoading when asyncReceiveThreads fails', async () => {
    api.getAllThreads.mockRejectedValue(new Error('Network error'));
    api.getAllUsers.mockResolvedValue([]);

    const store = mockStore({});

    await expect(store.dispatch(asyncReceiveThreads())).rejects.toThrow('Network error');

    const actions = store.getActions();
    expect(actions).toContainEqual({ type: LoadingActionType.HIDE_LOADING, payload: { key: 'threads' } });
  });

  it('should dispatch ADD_THREAD and return success when asyncAddThread succeeds', async () => {
    const createdThread = { id: 'thread-1', title: 'Judul baru' };
    api.createThread.mockResolvedValue(createdThread);

    const authUser = { id: 'user-1', name: 'Budi' };
    const store = mockStore({ authUser });

    const result = await store.dispatch(asyncAddThread({ title: 'Judul baru', body: 'Isi', category: 'umum' }));

    const actions = store.getActions();
    expect(actions.some((action) => action.type === ActionType.ADD_THREAD)).toBe(true);
    expect(result.success).toBe(true);
    expect(result.thread.owner).toEqual(authUser);
  });

  it('should return a failure result without dispatching ADD_THREAD when asyncAddThread fails', async () => {
    api.createThread.mockRejectedValue(new Error('Gagal membuat thread'));

    const store = mockStore({ authUser: { id: 'user-1' } });

    const result = await store.dispatch(asyncAddThread({ title: '', body: '', category: '' }));

    const actions = store.getActions();
    expect(actions.some((action) => action.type === ActionType.ADD_THREAD)).toBe(false);
    expect(result).toEqual({ success: false, message: 'Gagal membuat thread' });
  });

  it('should optimistically dispatch UPDATE_THREAD_VOTES when up-voting for the first time', async () => {
    api.upVoteThread.mockResolvedValue({});

    const threads = [{
      id: 'thread-1', upVotesBy: [], downVotesBy: [],
    }];
    const authUser = { id: 'user-1' };
    const store = mockStore({ threads, authUser });

    await store.dispatch(asyncToggleVoteThread({ threadId: 'thread-1', type: 'up' }));

    const actions = store.getActions();
    expect(actions[0]).toEqual({
      type: ActionType.UPDATE_THREAD_VOTES,
      payload: { threadId: 'thread-1', upVotesBy: ['user-1'], downVotesBy: [] },
    });
    expect(api.upVoteThread).toHaveBeenCalledWith('thread-1');
  });

  it('should revert the optimistic update when the API call fails', async () => {
    api.upVoteThread.mockRejectedValue(new Error('Gagal vote'));

    const threads = [{
      id: 'thread-1', upVotesBy: [], downVotesBy: [],
    }];
    const authUser = { id: 'user-1' };
    const store = mockStore({ threads, authUser });

    await store.dispatch(asyncToggleVoteThread({ threadId: 'thread-1', type: 'up' }));

    const actions = store.getActions();
    const revertAction = actions[actions.length - 1];

    expect(revertAction).toEqual({
      type: ActionType.UPDATE_THREAD_VOTES,
      payload: { threadId: 'thread-1', upVotesBy: [], downVotesBy: [] },
    });
  });
});
