import threadsReducer from './reducer';
import { ActionType } from './action';

/**
 * Skenario pengujian threadsReducer:
 * - should return the initial state when given by unknown action
 * - should return the threads when given by RECEIVE_THREADS action
 * - should add a thread to the front of the list when given ADD_THREAD action
 * - should update vote arrays of the matching thread when given
 *   UPDATE_THREAD_VOTES action
 * - should not change other threads when updating votes of one thread
 */
describe('threadsReducer', () => {
  it('should return the initial state when given by unknown action', () => {
    const action = { type: 'UNKNOWN' };

    const nextState = threadsReducer([], action);

    expect(nextState).toEqual([]);
  });

  it('should return the threads when given by RECEIVE_THREADS action', () => {
    const initialState = [];
    const threads = [
      { id: 'thread-1', title: 'Thread pertama' },
      { id: 'thread-2', title: 'Thread kedua' },
    ];

    const action = {
      type: ActionType.RECEIVE_THREADS,
      payload: { threads },
    };

    const nextState = threadsReducer(initialState, action);

    expect(nextState).toEqual(threads);
  });

  it('should add a thread to the front of the list when given ADD_THREAD action', () => {
    const initialState = [{ id: 'thread-1', title: 'Thread lama' }];
    const newThread = { id: 'thread-2', title: 'Thread baru' };

    const action = {
      type: ActionType.ADD_THREAD,
      payload: { thread: newThread },
    };

    const nextState = threadsReducer(initialState, action);

    expect(nextState).toHaveLength(2);
    expect(nextState[0]).toEqual(newThread);
    expect(nextState[1]).toEqual(initialState[0]);
  });

  it('should update vote arrays of the matching thread when given UPDATE_THREAD_VOTES action', () => {
    const initialState = [
      {
        id: 'thread-1', title: 'Thread 1', upVotesBy: [], downVotesBy: [],
      },
      {
        id: 'thread-2', title: 'Thread 2', upVotesBy: [], downVotesBy: [],
      },
    ];

    const action = {
      type: ActionType.UPDATE_THREAD_VOTES,
      payload: { threadId: 'thread-1', upVotesBy: ['user-1'], downVotesBy: [] },
    };

    const nextState = threadsReducer(initialState, action);

    expect(nextState[0].upVotesBy).toEqual(['user-1']);
    expect(nextState[1]).toEqual(initialState[1]);
  });
});
