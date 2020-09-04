import moment, { duration } from 'moment';
import momentz from 'moment-timezone';


function getTaskFromEvent(event){
  let task = {};
  let duration = moment(event.end.dateTime).diff(moment(event.start.dateTime), "minutes");
  task.title = event.summary;
  task.description = event.description ? event.description: "";
  task.creation_time = moment(event.created).valueOf();
  task.start = event.start.dateTime? event.start.dateTime : "";
  task.end = event.end.dateTime? event.end.dateTime : "";
  event.duration = duration > 0 ? duration.toString() : "";
  task.kind =  "calendar#event";
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

  let set = new Set();

  let unionArray = data.filter(item => {
    if (!set.has(item.title)) {
      set.add(item.title);
      return true;
    }
    return false;
  }, set);
  // console.log(unionArray);
  return unionArray;
};

export function getTodayMergedEventsAndTasks(tasks, events) {
  let data = [];

  tasks.forEach(task => {
    task.kind = "slate#task"
    data.push(task);
  });

  events.forEach(event => {
    let task = getTaskFromEvent(event);
    data.push(task);
  });

  let set = new Set();

  let unionArray = data.filter(item => {
    if (!set.has(item.title)) {
      if (moment(item.start).isSame(moment(), 'day')){
        set.add(item.title);
        return true;
      }
      return false;
    }
    return false;
  }, set);

  return unionArray;
};