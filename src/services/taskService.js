import moment, { duration } from 'moment';
import momentz from 'moment-timezone';


function getTaskFromEvent(event) {
  let task = {};
  let duration = moment(event.end.dateTime).diff(moment(event.start.dateTime), "minutes");
  
  task.id = event.id ? event.id : "";
  task.title = event.summary;
  task.description = event.description ? event.description : "";
  task.creation_time = moment(event.created).valueOf();
  task.start = event.start.dateTime ? event.start.dateTime : "";
  task.end = event.end.dateTime ? event.end.dateTime : "";
  event.duration = duration > 0 ? duration.toString() : "";
  task.kind = "calendar#event";
  return task
}

export function getMergedEventsAndTasks(tasks, events) {
  let data = [];

  tasks.forEach(task => {
    task.kind = "slate#task"
    data.push(task);
  });

  events.forEach(event => {
    let task = getTaskFromEvent(event);
    data.push(task);
  });

  // console.log("events", events);
  // console.log("data", data);

  let set = new Set();

  let unionArray = data.filter(item => {
    if (item.kind == "slate#task"){
      if (!set.has(item.calendar_id)) {
        set.add(item.calendar_id);
        return true;
      };
    } else if(item.kind == "calendar#event"){
      if (!set.has(item.id)) {
        set.add(item.id);
        return true;
      };
    };
    return false;
  }, set);
  // console.log("unionArray",unionArray);
  return unionArray;
};

function refactorTask(task, default_timezone) {
  let data = {};

  data.id = task.id ? task.id : "";
  data.title = task.title ? task.title : "";
  data.description = task.description ? task.description : "";
  data.status = task.status ? task.status : "";
  data.duration = task.duration ? task.duration : "";
  data.category = task.category ? task.category : "default";
  data.timezone = task.timezone ? task.timezone : default_timezone;

  data.end = task.end ? momentz(task.end).tz(task.timezone).format() : "";
  data.start = task.start ? momentz(task.start).tz(task.timezone).format() : "";

  data.user_id = task.user_id ? task.user_id : "";
  data.creation_time = task.creation_time ? task.creation_time : "";
  data.kind = "slate#task";
  return data
};

function refactorEvent(event, default_timezone) {
  let data = {};

  data.title = event.summary ? event.summary : "";
  data.description = event.description ? event.description : "";
  data.start = event.start.dateTime ? momentz(event.start.dateTime).tz(default_timezone).format() : "";
  data.end = event.end.dateTime ? momentz(event.end.dateTime).tz(default_timezone).format() : "";
  data.creation_time = moment(event.created).valueOf();

  let duration = moment(event.end.dateTime).diff(moment(event.start.dateTime), "minutes");
  data.duration = duration > 0 ? duration.toString() : "";
  data.kind = event.kind;

  return data;
}

export function getTodayMergedEventsAndTasks(tasks, events, default_timezone) {
  let data = [];
  
  // refactoring task to handle timezones 
  tasks.forEach(task => {
    data.push(refactorTask(task, default_timezone));
  });

  // refactoring event to handle timezones
  events.forEach(event => {
    data.push(refactorEvent(event, default_timezone));
  });

  // let set = new Set();
  // // If both task and event is present then only task is filtered
  // let unionArray = data.filter(item => {
  //   if (!set.has(item.title)) {
  //     if (moment(item.start).isSame(momentz().tz(default_timezone), 'day')) {
  //       set.add(item.title);
  //       return true;
  //     }
  //     return false;
  //   }
  //   return false;
  // }, set);


  let set = new Set();
  // If both task and event is present then only task is filtered
  let unionArray = data.filter(item => {
    let key = item.title+item.start;
    if (!set.has(key)) {
      if (moment(item.start).isSame(momentz().tz(default_timezone), 'day')) {
        set.add(key);
        return true;
      }
      return false;
    }
    return false;
  }, set);


  // Sorted based on start date
  let sortedArray = unionArray.sort(function (a, b) {
    return (a.start < b.start) ? -1 : ((a.start > b.start) ? 1 : 0);
  });

  return sortedArray;
};