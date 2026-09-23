const ActionType = {
  SHOW_LOADING: 'SHOW_LOADING',
  HIDE_LOADING: 'HIDE_LOADING',
};

function showLoading(key) {
  return { type: ActionType.SHOW_LOADING, payload: { key } };
}

function hideLoading(key) {
  return { type: ActionType.HIDE_LOADING, payload: { key } };
}

export { ActionType, showLoading, hideLoading };
