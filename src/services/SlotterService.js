import { SLOT_TYPE_FREE, SLOT_TYPE_BLOCKED_BY_USER, SLOT_TYPE_OCCUPIED, SLOT_TYPE_SCHEDULE } from '../constants';
import moment from 'moment';

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

  return timeSlots;
};


export function getDNDSlots(start_ts, end_ts, dnd_start_time, dnd_end_time) {
  var dndSlots = [];
  let start_date = moment(start_ts).format('L');
  // let end_date = moment(end_ts).format('L');
  let dnd_start_ts;
  let dnd_end_ts;

  let dummy_date = "01/01/2000";
  const getTime = (datestr, timestr) => moment(datestr + ' ' + timestr, 'MM/DD/YYYY h:mm A');

  var time1Date = getTime(dummy_date, dnd_start_time);
  var time2Date = getTime(dummy_date, dnd_end_time);

  if (time1Date >= time2Date) {
    // firstDay - 10:30 PM, NextDay - 6:30 AM
    // console.log("time1", time1Date, time2Date);
    dnd_start_ts = getTime(start_date, dnd_start_time);
    dnd_end_ts = getTime(start_date, dnd_end_time).add(1, "days");
  } else {
    // firstDay - 6:30 AM, sameDay - 12:30 PM
    // console.log("time2", time1Date, time2Date);
    dnd_start_ts = getTime(start_date, dnd_start_time);
    dnd_end_ts = getTime(start_date, dnd_end_time);
  };

  console.log("dnd_start_ts, dnd_end_ts", dnd_start_ts.format(), dnd_end_ts.format());

  if (moment() < dnd_end_ts.subtract(1, "days")) {
    let dndSlot = getDndSlot(moment().format(), dnd_end_ts.format());
    dndSlots.push(dndSlot);
  };

  while (dnd_start_ts < moment(end_ts)) {
    let dndSlot = getDndSlot(dnd_start_ts.format(), dnd_end_ts.format());
    
    if (dnd_start_ts < moment(start_ts)) {
      dndSlot.start = {
        "dateTime": moment(start_ts).format()
      };
    };

    if (dnd_end_ts > moment(end_ts)) {
      dndSlot.end = {
        "dateTime": moment(end_ts).format()
      };
    };

    dnd_start_ts.add(1, 'days');
    dnd_end_ts.add(1, 'days');
    dndSlots.push(dndSlot);
  };


  // console.log(dndSlots);
  return dndSlots;
};
