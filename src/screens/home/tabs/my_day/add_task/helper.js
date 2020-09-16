import moment from 'moment';
import { USER_DND_ENABLED } from '../../../../../constants';
import { getDndSlots } from '../../../../../services/SlotterService';

export const isValidDate = (date) => {
  if (date != null) {
    return !isNaN(date.getTime())
  }
  return false;
};

export const checkEndValid = (start, end) => {
  let isValid = true;
  if (!moment(end).isAfter(start)) {
    isValid = false;
  };
  return isValid
};

export const extractDateTime = (date, time) => {
  let datestr = moment(date.toISOString()).format('L');
  let timestr = moment(time.toISOString()).format('LT');
  let final = moment(datestr + ' ' + timestr, 'MM/DD/YYYY h:mm A').toISOString();
  console.log("date", datestr, "time", timestr, "final", final);
  return final;
};


export const fetchDndSlots = (start, end, slateInfo) =>  {
  let dndSlots = [];
  let wh = slateInfo.preferences.working_hours;
  if (USER_DND_ENABLED) {
    var USER_DND_STOP = moment(wh.wh_start, ["HH:mm"]).format("hh:mm A");
    var USER_DND_START = moment(wh.wh_end, ["HH:mm"]).format("hh:mm A");
    var timezone = slateInfo.default_timezone;
    dndSlots = getDndSlots(start, end, USER_DND_START, USER_DND_STOP, timezone);
  };
  return dndSlots;
};