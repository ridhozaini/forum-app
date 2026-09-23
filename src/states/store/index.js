import { applyMiddleware, combineReducers, createStore } from 'redux';
import thunk from 'redux-thunk';

import authUserReducer from '../authUser/reducer';
import threadsReducer from '../threads/reducer';
import threadDetailReducer from '../threadDetail/reducer';
import leaderboardsReducer from '../leaderboards/reducer';
import loadingReducer from '../loading/reducer';

const rootReducer = combineReducers({
  authUser: authUserReducer,
  threads: threadsReducer,
  threadDetail: threadDetailReducer,
  leaderboards: leaderboardsReducer,
  loading: loadingReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
