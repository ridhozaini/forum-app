import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { ActionType, asyncReceiveLeaderboards } from './action';
import { ActionType as LoadingActionType } from '../loading/action';
import api from '../../utils/api';

jest.mock('../../utils/api');

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

/**
 * Skenario pengujian thunk pada leaderboards:
 * - asyncReceiveLeaderboards should dispatch showLoading, RECEIVE_LEADERBOARDS,
 *   and hideLoading in order when the API call succeeds
 * - asyncReceiveLeaderboards should still dispatch hideLoading even when the API call fails
 */
describe('leaderboards thunk', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should dispatch showLoading, RECEIVE_LEADERBOARDS, and hideLoading in order when the API call succeeds', async () => {
    const leaderboards = [{ user: { id: 'user-1', name: 'Budi' }, score: 10 }];
    api.getLeaderboards.mockResolvedValue(leaderboards);

    const store = mockStore({});
    await store.dispatch(asyncReceiveLeaderboards());

    const actions = store.getActions();
    expect(actions).toEqual([
      { type: LoadingActionType.SHOW_LOADING, payload: { key: 'leaderboards' } },
      { type: ActionType.RECEIVE_LEADERBOARDS, payload: { leaderboards } },
      { type: LoadingActionType.HIDE_LOADING, payload: { key: 'leaderboards' } },
    ]);
  });

  it('should still dispatch hideLoading even when the API call fails', async () => {
    api.getLeaderboards.mockRejectedValue(new Error('Gagal memuat leaderboard'));

    const store = mockStore({});

    await expect(store.dispatch(asyncReceiveLeaderboards())).rejects.toThrow('Gagal memuat leaderboard');

    const actions = store.getActions();
    expect(actions).toContainEqual({ type: LoadingActionType.HIDE_LOADING, payload: { key: 'leaderboards' } });
  });
});
