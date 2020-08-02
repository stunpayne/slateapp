import { SET_CURRENT_USER, SET_SLATE_USER } from '../types';

const initialState = {
  slateInfo: null,
  userInfo: null,
  isAuthenticated: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: true,
        userInfo: action.info,
      };
    case SET_SLATE_USER:
      return {
        ...state,
        isAuthenticated: true,
        slateInfo: action.slateInfo,
        userInfo: action.userInfo,
      };
    default:
      return state;
  }
}
