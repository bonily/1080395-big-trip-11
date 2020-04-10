import {createTripMainInfoTemplate} from "./components/tripMainInfo.js";
import {createTripMainControlsTemplate} from "./components/tripMainControls.js";
import {createTripMainFilterTemlate} from "./components/tripMainFilter.js";
import {createListSortTemplate} from "./components/listSorting.js";
import {createTripDaysTemplate} from "./components/tripItem.js";
import {createTripEditTemplate} from "./components/tripEdittor.js";
import {generateItems} from "./mock/trip.js";
import {getSimpleDate} from "./utils.js";
import {SORT_FILTERS, MAIN_FILTERS} from "./const.js";

const TASK_COUNT = 20;

const items = generateItems(TASK_COUNT);


const siteHeaderTripElement = document.querySelector(`.trip-main`);
const siteHeaderMenuElement = siteHeaderTripElement.querySelector(`.trip-controls__menu`);
const siteHeaderFilterElement = siteHeaderTripElement.querySelector(`.trip-controls__flter`);
const siteMainEventElement = document.querySelector(`.trip-events`);


const trip = items.slice(1).reduce((acc, item) => {
  if (acc[getSimpleDate(item.startEventTime)] === undefined) {
    acc[getSimpleDate(item.startEventTime)] = [];
  }
  acc[getSimpleDate(item.startEventTime)].push(item);
  return acc;
}, {});

const render = (place, template, position) => {
  place.insertAdjacentHTML(position, template);
};

render(siteHeaderTripElement, createTripMainInfoTemplate(items), `afterbegin`);
render(siteHeaderMenuElement, createTripMainControlsTemplate(), `afterend`);
render(siteHeaderFilterElement, createTripMainFilterTemlate(MAIN_FILTERS), `afterend`);
render(siteMainEventElement, createListSortTemplate(SORT_FILTERS), `beforeend`);
render(siteMainEventElement, createTripEditTemplate(items[0]), `beforeend`);
render(siteMainEventElement, createTripDaysTemplate(trip), `beforeend`);

