import { SLOT_TYPE_FREE, SLOT_TYPE_BLOCKED_BY_USER, SLOT_TYPE_OCCUPIED, SLOT_TYPE_SCHEDULE } from '../constants';
import moment from 'moment';
import momentz from 'moment-timezone';

function SimpleSlot(startTime, endTime, slotType) {
  let slot = {};
  // console.log("SimpleSlot", slotType, startTime, endTime);
  slot.start = { dateTime: startTime };
  slot.end = { dateTime: endTime };
  slot.slotType = slotType;
  return slot;
};

function CalendarEventSlot(calendarEvent, slotType) {
  let slot = {};
  // console.log("CalendarEventSlot", slotType, calendarEvent);
  slot.start = calendarEvent.start;
  slot.end = calendarEvent.end;
  slot.slotType = slotType;
  return slot;
};

function getDndSlot(startTime, endTime) {
  let slot = {};
  slot.start = { dateTime: startTime };
  slot.end = { dateTime: endTime };
  return slot;
};

function getStartTime(event) {
  return moment(event.start.dateTime);
};

function getEndTime(event) {
  return moment(event.end.dateTime);
};

function createAllSlots(calendarEvents) {
  let slottingResult = {
    slots: [],
    lastEvent: null
  };

  let slots = [];

  //  Iterate over the events two at a time and add all the blocked slots and free slots
  let first = calendarEvents[0];
  let lastEvent = first;
  slots.push(CalendarEventSlot(first, SLOT_TYPE_BLOCKED_BY_USER));

  let slot, second;
  for (var i = 1; i < calendarEvents.length; i++) {
    second = calendarEvents[i];
    slot = CalendarEventSlot(second, SLOT_TYPE_BLOCKED_BY_USER);
    slots.push(slot);

    if (getStartTime(first) == getStartTime(second)) {
      //  If the first and second events start together, the one with the higher end time will be second for sure due to sorting. So move ahead.
      first = second;
      lastEvent = second;
    } else if (getStartTime(first) < getStartTime(second)) {
      //  If the first event starts before the second one, compare the end times  

      if (getEndTime(first) < getStartTime(second)) {
        //  If the first event ends before the second one starts, there is a free slot
        slot = SimpleSlot(getEndTime(first).format(), getStartTime(second).format(), SLOT_TYPE_FREE);
        slots.push(slot);
        first = second;
        lastEvent = second;
      } else if (getEndTime(first) > getEndTime(second)) {
        //  If the first event ends after the second, skip the second one
        continue;
      } else {
        //  If the first one ends during the second one, there is no free slot, just move ahead
        first = second;
        lastEvent = second;
      };
    };
  };

  slottingResult.slots = slots;
  slottingResult.lastEvent = lastEvent;
  return slottingResult;
}

export function createSlots(deadline, calendarEvents) {
  // console.log("simple slot", deadline, calendarEvents);
  let startTime = moment().format();
  console.log("startTime", startTime);
  //  If there are no events, the entire time duration is a free slot
  if (calendarEvents.length == 0) {
    return [SimpleSlot(startTime, deadline, SLOT_TYPE_FREE)];
  };

  //############### Should do error handling is start.dateTime is not defined ########
  //  Sort events in ascending order of start time
  calendarEvents.sort(function (first, second) {
    if (getStartTime(first) < getStartTime(second)) {
      // a is less than b by some ordering criterion
      return -1;
    };

    if (getStartTime(first) == getStartTime(second)) {
      // a must be equal to b
      let compareEndTime = getEndTime(first) < getEndTime(second) ? -1 : 1
      return compareEndTime;
    };

    // a is greater than b by the ordering criterion
    return 1;
  });

  let timeSlots = [];
  //  If the start time is before the time the first event starts at, there is a free slot
  if (moment(startTime) < getStartTime(calendarEvents[0])) {
    timeSlots.push(SimpleSlot(startTime, getStartTime(calendarEvents[0]).format(), SLOT_TYPE_FREE));
  };

  let slottingResult = createAllSlots(calendarEvents);
  timeSlots.push(...slottingResult.slots);

  //  If the last event end at the deadline moratorium, do not create a slot for that
  if (getEndTime(slottingResult.lastEvent) < moment(deadline)) {
    timeSlots.push(SimpleSlot(getEndTime(slottingResult.lastEvent).format(), deadline, SLOT_TYPE_FREE))
  };

  // console.log("timeSlots",timeSlots);
  return timeSlots;
};


export function getDndSlots(start_ts, end_ts, dnd_start_time, dnd_end_time, timezone) {
  var dndSlots = [];
  let start_date = moment(start_ts).format('L');
  // let end_date = moment(end_ts).format('L');
  let dnd_start_ts;
  let dnd_end_ts;


  // const getTimeWithTz = (datestr, timestr) => moment(datestr + ' ' + timestr, 'MM/DD/YYYY h:mm A');
  const getTimeWithTz = (datestr, timestr) => momentz.tz(datestr + ' ' + timestr, 'MM/DD/YYYY h:mm A', timezone);

  let dummy_date = "01/01/2000";
  var a = dummy_date + " " + dnd_start_time;
  var b = dummy_date + " " + dnd_end_time;

  var aDate = new Date(a).getTime();
  var bDate = new Date(b).getTime();

  if (aDate < bDate) {
    // 'a happened before b'
    // firstDay - 6:30 AM, sameDay - 12:30 PM
    dnd_start_ts = getTimeWithTz(start_date, dnd_start_time);
    dnd_end_ts = getTimeWithTz(start_date, dnd_end_time);
    if(moment()  > dnd_end_ts){
      // if cur_time >  today's dnd end time, then skip that days dnd slot
      dnd_start_ts.add(1,"days");
      dnd_end_ts.add(1,"days");
    }
  } else if (aDate > bDate) {
    // 'a happend after b'
    // firstDay - 10:30 PM, NextDay - 6:30 AM
    dnd_start_ts = getTimeWithTz(start_date, dnd_start_time);
    dnd_end_ts = getTimeWithTz(start_date, dnd_end_time).add(1, "days");
  } else {
    // console.log('a and b happened at the same time')
    return [];
  }

  console.log("dnd_start_ts, dnd_end_ts", dnd_start_ts.format(), dnd_end_ts.format());
  let dnd_end_ts_copy = dnd_end_ts.clone();;

  if (moment() < dnd_end_ts_copy.subtract(1, "days")) {
    let now = moment().format();
    let dndSlot = getDndSlot(now, dnd_end_ts_copy.format());
    dndSlots.push(dndSlot);
  };

  while (dnd_start_ts < moment(end_ts)) {
    let dndSlot = getDndSlot(dnd_start_ts.format(), dnd_end_ts.format());    

    if (dnd_end_ts > moment(end_ts)) {
      dndSlot.end = {
        "dateTime": moment(end_ts).format()
      };
    };

    dnd_start_ts.add(1, 'days');
    dnd_end_ts.add(1, 'days');
    dndSlots.push(dndSlot);
  };

  console.log("dndSlots",dndSlots);
  return dndSlots;
};
