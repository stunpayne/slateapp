import { FETCH_CALENDAR_EVENTS, TASK_DATA_LOADING_STATUS, TASK_DATA_ADDING_STATUS } from '../types';

const initialState = {
  isLoading: false,
  isAdding: false,
  events: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CALENDAR_EVENTS:
      return {
        ...state,
        events: action.payload,
        isLoading: false,
        isAdding: false
      };
    case TASK_DATA_LOADING_STATUS:
      return {
        ...state,
        isLoading: action.payload,
      };
    case TASK_DATA_ADDING_STATUS:
      return {
        ...state,
        isAdding: action.payload,
      };
    default:
      return state;
  }
}
