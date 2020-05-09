import {MAIN_FILTERS} from "../const.js";

const getNotCurrentItems = (items, date, type) => {
// type - ключ сортировки, past  - для поездок которые уже прошли
  return items.filter((item) => {
    return type === `past` ? item.endEventTime < date : item.startEventTime > date;
  });
};


export const getItemsByFilter = (items, filter) => {
  const nowDate = new Date();
  switch (filter) {
    case MAIN_FILTERS.PAST:
      return getNotCurrentItems(items, nowDate, `past`);
    case MAIN_FILTERS.FUTURE:
      return getNotCurrentItems(items, nowDate);
    default: return items;
  }

};

