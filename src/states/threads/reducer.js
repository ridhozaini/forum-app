import { ActionType } from './action';

const initialState = [];

function threadsReducer(threads = initialState, action = {}) {
  switch (action.type) {
    case ActionType.RECEIVE_THREADS:
      return action.payload.threads;
    case ActionType.ADD_THREAD:
      return [action.payload.thread, ...threads];
    case ActionType.UPDATE_THREAD_VOTES:
      return threads.map((thread) => {
        if (thread.id !== action.payload.threadId) return thread;
        return {
          ...thread,
          upVotesBy: action.payload.upVotesBy,
          downVotesBy: action.payload.downVotesBy,
        };
      });
    default:
      return threads;
  }
}

export default threadsReducer;
