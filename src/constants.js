export const SKIP_INTRODUCTION = "SKIP_INTRODUCTION";
export const SLATE_USER_CREATED = "SLATE_USER_CREATED";
export const SLATE_USER_INITIALLY_UPDATED = "SLATE_USER_INITIALLY_UPDATED";
export const FIRST_TIME_USE = "FIRST_TIME_USE";
export const CALENDAR_BASE_URL = "https://www.googleapis.com/calendar/v3";

// Slot types
export const SLOT_TYPE_FREE = 0;         //  No event scheduled during the slot
export const SLOT_TYPE_BLOCKED_BY_USER = 1;  //  Blocked by user without using this service
export const SLOT_TYPE_OCCUPIED = 2;         //  Blocked for an event by this service
export const SLOT_TYPE_SCHEDULE = 3;        //  Meant to be used for scheduling a task

export const TaskStatus= {
  UNSCHEDULED: 'UNSCHEDULED',
  SCHEDULED: 'SCHEDULED',
  COMPLETED: 'COMPLETED',
  DELAYED: 'DELAYED',
  DELETED: 'DELETED'
};

export const calendarEventColor = {
  google:"calendar#event",
  slate:"slate#task"
};

export const USER_DND_ENABLED = true;
// export const USER_DND_START = "10:30 PM";
// export const USER_DND_STOP = "6:30 AM";
// export const USER_TIMEZONE = "Asia/Kolkata";

// export const USER_TIMEZONE = "America/Chicago";
// export const USER_DND_START = "6:30 AM";
// export const USER_DND_STOP = "11:30 PM";