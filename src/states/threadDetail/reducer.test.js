import threadDetailReducer from './reducer';
import { ActionType } from './action';

/**
 * Skenario pengujian threadDetailReducer:
 * - should return the initial state (null) when given by unknown action
 * - should return the threadDetail when given by RECEIVE_THREAD_DETAIL action
 * - should return null when given by CLEAR_THREAD_DETAIL action
 * - should add a comment to the front of the list when given ADD_COMMENT
 * - should return null (not throw) when ADD_COMMENT fires while threadDetail is null
 * - should update the thread's vote arrays when given UPDATE_THREAD_DETAIL_VOTES action
 * - should update only the matching comment's vote arrays when given UPDATE_COMMENT_VOTES action
 */
describe('threadDetailReducer', () => {
  it('should return the initial state (null) when given by unknown action', () => {
    const nextState = threadDetailReducer(undefined, { type: 'UNKNOWN' });

    expect(nextState).toBeNull();
  });

  it('should return the threadDetail when given by RECEIVE_THREAD_DETAIL action', () => {
    const threadDetail = { id: 'thread-1', title: 'Judul', comments: [] };

    const nextState = threadDetailReducer(null, {
      type: ActionType.RECEIVE_THREAD_DETAIL,
      payload: { threadDetail },
    });

    expect(nextState).toEqual(threadDetail);
  });

  it('should return null when given by CLEAR_THREAD_DETAIL action', () => {
    const initialState = { id: 'thread-1', title: 'Judul', comments: [] };

    const nextState = threadDetailReducer(initialState, { type: ActionType.CLEAR_THREAD_DETAIL });

    expect(nextState).toBeNull();
  });

  it('should add a comment to the front of the comments list when given ADD_COMMENT action', () => {
    const initialState = {
      id: 'thread-1',
      comments: [{ id: 'comment-1', content: 'Komentar lama' }],
    };
    const newComment = { id: 'comment-2', content: 'Komentar baru' };

    const nextState = threadDetailReducer(initialState, {
      type: ActionType.ADD_COMMENT,
      payload: { comment: newComment },
    });

    expect(nextState.comments).toHaveLength(2);
    expect(nextState.comments[0]).toEqual(newComment);
  });

  it('should return null when ADD_COMMENT is dispatched while threadDetail is null', () => {
    const nextState = threadDetailReducer(null, {
      type: ActionType.ADD_COMMENT,
      payload: { comment: { id: 'comment-1', content: 'Halo' } },
    });

    expect(nextState).toBeNull();
  });

  it("should update the thread's vote arrays when given UPDATE_THREAD_DETAIL_VOTES action", () => {
    const initialState = {
      id: 'thread-1', upVotesBy: [], downVotesBy: [], comments: [],
    };

    const nextState = threadDetailReducer(initialState, {
      type: ActionType.UPDATE_THREAD_DETAIL_VOTES,
      payload: { upVotesBy: ['user-1'], downVotesBy: [] },
    });

    expect(nextState.upVotesBy).toEqual(['user-1']);
  });

  it("should update only the matching comment's votes when given UPDATE_COMMENT_VOTES", () => {
    const initialState = {
      id: 'thread-1',
      comments: [
        {
          id: 'comment-1', content: 'A', upVotesBy: [], downVotesBy: [],
        },
        {
          id: 'comment-2', content: 'B', upVotesBy: [], downVotesBy: [],
        },
      ],
    };

    const nextState = threadDetailReducer(initialState, {
      type: ActionType.UPDATE_COMMENT_VOTES,
      payload: { commentId: 'comment-2', upVotesBy: ['user-9'], downVotesBy: [] },
    });

    expect(nextState.comments[0].upVotesBy).toEqual([]);
    expect(nextState.comments[1].upVotesBy).toEqual(['user-9']);
  });
});
