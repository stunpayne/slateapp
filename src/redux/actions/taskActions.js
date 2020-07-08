import { FETCH_CALENDAR_EVENTS, TASK_DATA_LOADING_STATUS } from '../types';
import { googleApiClient } from '../../services/GoogleApiService';
import { CALENDAR_BASE_URL } from '../../constants';

export function setCalendarEvents(tasks) {
  return {
    type: FETCH_CALENDAR_EVENTS,
    payload: tasks
  };
};

export function setDataLoadingStatus(status) {
  return {
    type: TASK_DATA_LOADING_STATUS,
    payload: status
  };
};


export const fetchCalendarEvents = (params) => async dispatch => {
  dispatch(setDataLoadingStatus(true));
  const request = await googleApiClient();
  request.get(`${CALENDAR_BASE_URL}/calendars/primary/events`, { params }).then(res => {
    if (res.status == 200) {
      if (res.data.items && res.data.items.length > 0) {
        dispatch(setCalendarEvents(res.data.items));
      }
    };
  }).catch(err => {
    console.log("err from fetch calendar tasks", err);
    dispatch(setDataLoadingStatus(false));
  });
};

export const addCalendarEvent = (data) => async dispatch => {
  dispatch(setDataLoadingStatus(true));
  const request = await googleApiClient();
  request.post(`${CALENDAR_BASE_URL}/calendars/primary/events`, data).then(res => {
    if (res.status == 200) {
      console.log("add event", res.data);
      dispatch(setDataLoadingStatus(false));
    };
  }).catch(err => {
    console.log("err from fetch calendar tasks", err);
    dispatch(setDataLoadingStatus(false));
  });
};