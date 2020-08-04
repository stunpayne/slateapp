import { FETCH_SLATE_TASKS, TASK_DATA_LOADING_STATUS, TASK_DATA_ADDING_STATUS, TASK_DATA_UPDATE_STATUS } from '../types';
import { googleApiClient } from '../../services/GoogleApiService';
import { CALENDAR_BASE_URL } from '../../constants';
import axios from 'axios';
import { base_url } from '../../config/urls';
import { setUpdatedSlateInfo } from './authActions';

export function setSlateTasks(tasks) {
  return {
    type: FETCH_SLATE_TASKS,
    payload: tasks
  };
};

export function setDataLoadingStatus(status) {
  return {
    type: TASK_DATA_LOADING_STATUS,
    payload: status
  };
};

export function setDataAddingStatus(status) {
  return {
    type: TASK_DATA_ADDING_STATUS,
    payload: status
  };
};

export function setTaskUpdateStatus(status) {
  return {
    type: TASK_DATA_UPDATE_STATUS,
    payload: status
  };
};

// export const fetchCalendarEvents = (params) => async dispatch => {
//   dispatch(setDataLoadingStatus(true));
//   const request = await googleApiClient();
//   request.get(`${CALENDAR_BASE_URL}/calendars/primary/events`, { params }).then(res => {
//     if (res.status == 200 && res.data.items) {
//       dispatch(setCalendarEvents(res.data.items));
//     };
//   }).catch(err => {
//     console.log("err from fetch calendar tasks", err);
//     dispatch(setDataLoadingStatus(false));
//   });
// };

export const addCalendarEvent = (data) => async dispatch => {
  dispatch(setDataAddingStatus(true));
  const request = await googleApiClient();
  return request.post(`${CALENDAR_BASE_URL}/calendars/primary/events`, data);
  // request.post(`${CALENDAR_BASE_URL}/calendars/primary/events`, data).then(res => {
  //   if (res.status == 200) {
  //     console.log("add event", res.data);
  //     dispatch(setDataAddingStatus(false));
  //   };
  // }).catch(err => {
  //   console.log("err from fetch calendar tasks", err);
  //   dispatch(setDataAddingStatus(false));
  // });
};

export const addSlateTask = (data) => dispatch => {
  return axios.post(`${base_url}/api/task/create`, data);
};

export const fetchSlateTasks = (data) => dispatch => {
  dispatch(setDataLoadingStatus(true));
  axios.put(`${base_url}/api/task/get`, data)
    .then(res => {
      if (res.status == 200 || res.status == 201) {
        dispatch(setSlateTasks(res.data.tasks));
        dispatch(setUpdatedSlateInfo(res.data.user));
      }
    }).catch(error => {
      dispatch(setDataLoadingStatus(false));
      console.log("error in fetchSlateTasks", error.response.data);
    });
};

export const slateTaskMarkComplete = (data) => dispatch => {
  dispatch(setTaskUpdateStatus(true));
  axios.put(`${base_url}/api/task/complete`, data)
    .then(res => {
      if (res.status == 200 || res.status == 201) {
        let params = { user_id: data.user_id };
        dispatch(fetchSlateTasks(params));
      }
    }).catch(error => {
      dispatch(setTaskUpdateStatus(false));
      console.log("error in slateTaskMarkComplete", error.response.data);
    });
};

