import loadingReducer from './reducer';
import { ActionType } from './action';

/**
 * Skenario pengujian loadingReducer:
 * - should return the initial state ({}) when given by unknown action
 * - should set the given key to true when given by SHOW_LOADING action
 * - should set the given key to false when given by HIDE_LOADING action
 * - should not affect other keys already present in the state
 */
describe('loadingReducer', () => {
  it('should return the initial state ({}) when given by unknown action', () => {
    const nextState = loadingReducer(undefined, { type: 'UNKNOWN' });

    expect(nextState).toEqual({});
  });

  it('should set the given key to true when given by SHOW_LOADING action', () => {
    const nextState = loadingReducer({}, {
      type: ActionType.SHOW_LOADING,
      payload: { key: 'threads' },
    });

    expect(nextState).toEqual({ threads: true });
  });

  it('should set the given key to false when given by HIDE_LOADING action', () => {
    const initialState = { threads: true };

    const nextState = loadingReducer(initialState, {
      type: ActionType.HIDE_LOADING,
      payload: { key: 'threads' },
    });

    expect(nextState).toEqual({ threads: false });
  });

  it('should not affect other keys already present in the state', () => {
    const initialState = { threads: true, auth: false };

    const nextState = loadingReducer(initialState, {
      type: ActionType.SHOW_LOADING,
      payload: { key: 'leaderboards' },
    });

    expect(nextState).toEqual({ threads: true, auth: false, leaderboards: true });
  });
});
