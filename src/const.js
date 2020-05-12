export const EVENT_TYPES_TRANSPORT = [`taxi`, `bus`, `train`, `ship`, `transport`, `drive`, `flight`];

export const EVENT_TYPES_ACTIVITY = [`check-in`, `sightseeing`, `restaurant`];

export const MONTH_NAMES = [
  `JAN`,
  `FEB`,
  `MAR`,
  `APR`,
  `MAY`,
  `JUNE`,
  `JULY`,
  `AUG`,
  `SEP`,
  `OСT`,
  `NOV`,
  `DEC`,
];

export const SORT_FILTERS = [
  {name: `event`, isActive: true},
  {name: `time`, isActive: false},
  {name: `price`, isActive: false},
];

export const MAIN_FILTER = {
  ALL: `everything`,
  FUTURE: `future`,
  PAST: `past`,
};

export const FormState = {
  DISABLED: `disabled`,
  ENABLED: `abled`,
};

export const KeyMap = {
  START: `startEventTime`,
  TYPE: `eventType`,
};

export const ItemRenderModeMap = {
  DEFAULT: `default`,
  EDIT: `edit`,
  NEW: `new`,
  FIRST: `firstNew`,
};

export const MenuItemMap = {
  STATS: `Stats`,
  TABLE: `Table`
};
