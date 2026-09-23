import authUserReducer from './reducer';
import { ActionType } from './action';

/**
 * Skenario pengujian authUserReducer:
 * - should return the initial state (null) when given by unknown action
 * - should return the authUser when given by SET_AUTH_USER action
 * - should return null when given by UNSET_AUTH_USER action
 * - should replace the previous authUser when SET_AUTH_USER is dispatched twice
 */
describe('authUserReducer', () => {
  it('should return the initial state (null) when given by unknown action', () => {
    const action = { type: 'UNKNOWN' };

    const nextState = authUserReducer(undefined, action);

    expect(nextState).toBeNull();
  });

  it('should return the authUser when given by SET_AUTH_USER action', () => {
    const initialState = null;
    const authUser = { id: 'user-1', name: 'Budi' };

    const action = {
      type: ActionType.SET_AUTH_USER,
      payload: { authUser },
    };

    const nextState = authUserReducer(initialState, action);

    expect(nextState).toEqual(authUser);
  });

  it('should return null when given by UNSET_AUTH_USER action', () => {
    const initialState = { id: 'user-1', name: 'Budi' };

    const action = { type: ActionType.UNSET_AUTH_USER };

    const nextState = authUserReducer(initialState, action);

    expect(nextState).toBeNull();
  });

  it('should replace the previous authUser when SET_AUTH_USER is dispatched twice', () => {
    const firstUser = { id: 'user-1', name: 'Budi' };
    const secondUser = { id: 'user-2', name: 'Siti' };

    const afterFirst = authUserReducer(null, {
      type: ActionType.SET_AUTH_USER,
      payload: { authUser: firstUser },
    });
    const afterSecond = authUserReducer(afterFirst, {
      type: ActionType.SET_AUTH_USER,
      payload: { authUser: secondUser },
    });

    expect(afterSecond).toEqual(secondUser);
  });
});
