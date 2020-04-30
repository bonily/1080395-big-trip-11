import {MAIN_FILTERS} from "../const.js";

const getNotCurrentItems = (items, date, type) => {

  return items.filter((item) => {
    if (type === `past`) {
      return item.startEventTime < date;
    }

    return item.startEventTime > date;

  });
};


export const getItemsByFilter = (items, filter) => {
  const nowDate = new Date();
  switch (filter) {
    case MAIN_FILTERS.PAST:
      return getNotCurrentItems(items, nowDate, `past`);
    case MAIN_FILTERS.FUTURE:
      return getNotCurrentItems(items, nowDate, `future`);
  }
  return items;
};

