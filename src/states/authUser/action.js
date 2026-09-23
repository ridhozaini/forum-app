import api from '../../utils/api';
import { hideLoading, showLoading } from '../loading/action';

const ActionType = {
  SET_AUTH_USER: 'SET_AUTH_USER',
  UNSET_AUTH_USER: 'UNSET_AUTH_USER',
};

function setAuthUserActionCreator(authUser) {
  return {
    type: ActionType.SET_AUTH_USER,
    payload: { authUser },
  };
}

function unsetAuthUserActionCreator() {
  return { type: ActionType.UNSET_AUTH_USER };
}

function asyncLogin({ email, password }) {
  return async (dispatch) => {
    dispatch(showLoading('auth'));
    try {
      const token = await api.login({ email, password });
      api.putAccessToken(token);

      const authUser = await api.getOwnProfile();
      dispatch(setAuthUserActionCreator(authUser));

      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    } finally {
      dispatch(hideLoading('auth'));
    }
  };
}

function asyncRegister({ name, email, password }) {
  return async (dispatch) => {
    dispatch(showLoading('auth'));
    try {
      await api.register({ name, email, password });
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    } finally {
      dispatch(hideLoading('auth'));
    }
  };
}

function asyncUnsetAuthUser() {
  return async (dispatch) => {
    api.removeAccessToken();
    dispatch(unsetAuthUserActionCreator());
  };
}

function asyncPreloadAuthUser() {
  return async (dispatch) => {
    if (!api.getAccessToken()) return;

    dispatch(showLoading('preload'));
    try {
      const authUser = await api.getOwnProfile();
      dispatch(setAuthUserActionCreator(authUser));
    } catch (error) {
      api.removeAccessToken();
    } finally {
      dispatch(hideLoading('preload'));
    }
  };
}

export {
  ActionType,
  setAuthUserActionCreator,
  unsetAuthUserActionCreator,
  asyncLogin,
  asyncRegister,
  asyncUnsetAuthUser,
  asyncPreloadAuthUser,
};
