import api from '../../utils/api';
import { hideLoading, showLoading } from '../loading/action';

const ActionType = {
  RECEIVE_LEADERBOARDS: 'RECEIVE_LEADERBOARDS',
};

function receiveLeaderboardsActionCreator(leaderboards) {
  return { type: ActionType.RECEIVE_LEADERBOARDS, payload: { leaderboards } };
}

function asyncReceiveLeaderboards() {
  return async (dispatch) => {
    dispatch(showLoading('leaderboards'));
    try {
      const leaderboards = await api.getLeaderboards();
      dispatch(receiveLeaderboardsActionCreator(leaderboards));
    } finally {
      dispatch(hideLoading('leaderboards'));
    }
  };
}

export { ActionType, receiveLeaderboardsActionCreator, asyncReceiveLeaderboards };
