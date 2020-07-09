import { SET_CURRENT_USER } from '../types';

const initialState = {
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
    default:
      return state;
  }
}
