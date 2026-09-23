import leaderboardsReducer from './reducer';
import { ActionType } from './action';

/**
 * Skenario pengujian leaderboardsReducer:
 * - should return the initial state ([]) when given by unknown action
 * - should return the leaderboards when given by RECEIVE_LEADERBOARDS action
 * - should replace the previous leaderboards when RECEIVE_LEADERBOARDS is dispatched again
 */
describe('leaderboardsReducer', () => {
  it('should return the initial state ([]) when given by unknown action', () => {
    const nextState = leaderboardsReducer(undefined, { type: 'UNKNOWN' });

    expect(nextState).toEqual([]);
  });

  it('should return the leaderboards when given by RECEIVE_LEADERBOARDS action', () => {
    const leaderboards = [
      { user: { id: 'user-1', name: 'Budi' }, score: 10 },
    ];

    const nextState = leaderboardsReducer([], {
      type: ActionType.RECEIVE_LEADERBOARDS,
      payload: { leaderboards },
    });

    expect(nextState).toEqual(leaderboards);
  });

  it('should replace the previous leaderboards when RECEIVE_LEADERBOARDS is dispatched again', () => {
    const firstBatch = [{ user: { id: 'user-1', name: 'Budi' }, score: 10 }];
    const secondBatch = [{ user: { id: 'user-2', name: 'Siti' }, score: 20 }];

    const afterFirst = leaderboardsReducer([], {
      type: ActionType.RECEIVE_LEADERBOARDS,
      payload: { leaderboards: firstBatch },
    });
    const afterSecond = leaderboardsReducer(afterFirst, {
      type: ActionType.RECEIVE_LEADERBOARDS,
      payload: { leaderboards: secondBatch },
    });

    expect(afterSecond).toEqual(secondBatch);
  });
});
