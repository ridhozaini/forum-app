import { ActionType } from './action';

const initialState = null;

function threadDetailReducer(threadDetail = initialState, action = {}) {
  switch (action.type) {
    case ActionType.RECEIVE_THREAD_DETAIL:
      return action.payload.threadDetail;
    case ActionType.CLEAR_THREAD_DETAIL:
      return null;
    case ActionType.ADD_COMMENT:
      if (!threadDetail) return threadDetail;
      return {
        ...threadDetail,
        comments: [action.payload.comment, ...threadDetail.comments],
      };
    case ActionType.UPDATE_THREAD_DETAIL_VOTES:
      if (!threadDetail) return threadDetail;
      return {
        ...threadDetail,
        upVotesBy: action.payload.upVotesBy,
        downVotesBy: action.payload.downVotesBy,
      };
    case ActionType.UPDATE_COMMENT_VOTES:
      if (!threadDetail) return threadDetail;
      return {
        ...threadDetail,
        comments: threadDetail.comments.map((comment) => {
          if (comment.id !== action.payload.commentId) return comment;
          return {
            ...comment,
            upVotesBy: action.payload.upVotesBy,
            downVotesBy: action.payload.downVotesBy,
          };
        }),
      };
    default:
      return threadDetail;
  }
}

export default threadDetailReducer;
