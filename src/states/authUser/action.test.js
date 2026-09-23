import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import {
  ActionType,
  asyncLogin,
  asyncRegister,
  asyncPreloadAuthUser,
} from './action';
import { ActionType as LoadingActionType } from '../loading/action';
import api from '../../utils/api';

jest.mock('../../utils/api');

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

/**
 * Skenario pengujian thunk pada authUser:
 * - asyncLogin should dispatch SET_AUTH_USER and return success when the
 *   login and profile API calls succeed
 * - asyncLogin should return a failure result without dispatching
 *   SET_AUTH_USER when the login API call fails
 * - asyncRegister should return a success result when the register API call succeeds
 * - asyncRegister should return a failure result when the register API call fails
 * - asyncPreloadAuthUser should not call the API at all when there is no stored access token
 * - asyncPreloadAuthUser should dispatch SET_AUTH_USER when there is a valid stored access token
 */
describe('authUser thunk', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should dispatch SET_AUTH_USER and return success when asyncLogin succeeds', async () => {
    api.login.mockResolvedValue('fake-token');
    api.getOwnProfile.mockResolvedValue({ id: 'user-1', name: 'Budi' });

    const store = mockStore({});
    const result = await store.dispatch(asyncLogin({ email: 'budi@mail.com', password: 'rahasia' }));

    const actions = store.getActions();
    expect(actions.some((action) => action.type === ActionType.SET_AUTH_USER)).toBe(true);
    expect(api.putAccessToken).toHaveBeenCalledWith('fake-token');
    expect(result).toEqual({ success: true });
  });

  it('should return a failure result without dispatching SET_AUTH_USER when asyncLogin fails', async () => {
    api.login.mockRejectedValue(new Error('Email atau password salah'));

    const store = mockStore({});
    const result = await store.dispatch(asyncLogin({ email: 'salah@mail.com', password: 'salah' }));

    const actions = store.getActions();
    expect(actions.some((action) => action.type === ActionType.SET_AUTH_USER)).toBe(false);
    expect(result).toEqual({ success: false, message: 'Email atau password salah' });
  });

  it('should return a success result when asyncRegister succeeds', async () => {
    api.register.mockResolvedValue({ id: 'user-1', name: 'Budi' });

    const store = mockStore({});
    const result = await store.dispatch(asyncRegister({ name: 'Budi', email: 'budi@mail.com', password: 'rahasia' }));

    expect(result).toEqual({ success: true });
  });

  it('should return a failure result when asyncRegister fails', async () => {
    api.register.mockRejectedValue(new Error('Email sudah terdaftar'));

    const store = mockStore({});
    const result = await store.dispatch(asyncRegister({ name: 'Budi', email: 'dipakai@mail.com', password: 'rahasia' }));

    expect(result).toEqual({ success: false, message: 'Email sudah terdaftar' });
  });

  it('should not call the API at all when there is no stored access token', async () => {
    api.getAccessToken.mockReturnValue(null);

    const store = mockStore({});
    await store.dispatch(asyncPreloadAuthUser());

    expect(api.getOwnProfile).not.toHaveBeenCalled();
    expect(store.getActions()).toEqual([]);
  });

  it('should dispatch SET_AUTH_USER when there is a valid stored access token', async () => {
    api.getAccessToken.mockReturnValue('valid-token');
    api.getOwnProfile.mockResolvedValue({ id: 'user-1', name: 'Budi' });

    const store = mockStore({});
    await store.dispatch(asyncPreloadAuthUser());

    const actions = store.getActions();
    expect(actions[0]).toEqual({ type: LoadingActionType.SHOW_LOADING, payload: { key: 'preload' } });
    expect(actions.some((action) => action.type === ActionType.SET_AUTH_USER)).toBe(true);
    expect(actions[actions.length - 1]).toEqual({ type: LoadingActionType.HIDE_LOADING, payload: { key: 'preload' } });
  });
});
