export const SKIP_INTRODUCTION = "SKIP_INTRODUCTION";
export const FIRST_TIME_USE = "FIRST_TIME_USE";
export const CALENDAR_BASE_URL = "https://www.googleapis.com/calendar/v3";

// Slot types
export const SLOT_TYPE_FREE = 0;         //  No event scheduled during the slot
export const SLOT_TYPE_BLOCKED_BY_USER = 1;  //  Blocked by user without using this service
export const SLOT_TYPE_OCCUPIED = 2;         //  Blocked for an event by this service
export const SLOT_TYPE_SCHEDULE = 3;        //  Meant to be used for scheduling a task

export const USER_DND_ENABLED = true;
export const USER_DND_START = "10:30 PM";
export const USER_DND_STOP = "6:30 AM";
export const USER_TIMEZONE = "";

// export const USER_DND_START = "6:30 AM";
// export const USER_DND_STOP = "11:30 PM";