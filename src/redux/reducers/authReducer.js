import { SET_CURRENT_USER, SET_SLATE_USER, SET_SLATE_UPDATED_USER, AUTH_DATA_LOADING_STATUS } from '../types';

const initialState = {
  slateInfo: null,
  userInfo: null,
  isAuthenticated: false,
  isLoading: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: true,
        userInfo: action.info,
        isLoading: false
      };
    case SET_SLATE_USER:
      return {
        ...state,
        isAuthenticated: true,
        slateInfo: action.slateInfo,
        userInfo: action.userInfo,
        isLoading: false
      };
    case SET_SLATE_UPDATED_USER:
      return {
        ...state,
        isAuthenticated: true,
        slateInfo: action.slateInfo,
        isLoading: false
      };
    case AUTH_DATA_LOADING_STATUS:
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
}
