import { FETCH_SLATE_TASKS, TASK_DATA_LOADING_STATUS, TASK_DATA_ADDING_STATUS, TASK_DATA_UPDATE_STATUS } from '../types';

const initialState = {
  isLoading: false,
  isAdding: false,
  isUpdating: false,
  events: [],
  tasks: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_SLATE_TASKS:
      return {
        ...state,
        tasks: action.payload,
        isLoading: false,
        isAdding: false,
        isUpdating:false
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
    case TASK_DATA_UPDATE_STATUS:
      return {
        ...state,
        isUpdating: action.payload,
      };
    default:
      return state;
  }
}
