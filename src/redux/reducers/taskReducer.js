import { FETCH_CALENDAR_EVENTS, TASK_DATA_LOADING_STATUS } from '../types';

const initialState = {
  isLoading: false,
  events: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CALENDAR_EVENTS:
      return {
        ...state,
        events: action.payload,
        isLoading: false
      };
    case TASK_DATA_LOADING_STATUS:
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
}
