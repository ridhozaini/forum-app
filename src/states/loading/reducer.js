import { ActionType } from './action';

const initialState = {};

function loadingReducer(state = initialState, action = {}) {
  switch (action.type) {
    case ActionType.SHOW_LOADING:
      return { ...state, [action.payload.key]: true };
    case ActionType.HIDE_LOADING:
      return { ...state, [action.payload.key]: false };
    default:
      return state;
  }
}

export default loadingReducer;
