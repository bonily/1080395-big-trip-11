import {createTripMainInfoTemplate} from "./components/tripMainInfo.js";
import {createTripMainControlsTemplate} from "./components/tripMainControls.js";
import {createTripMainFilterTemlate} from "./components/tripMainFilter.js";
import {createListSortTemplate} from "./components/listSorting.js";
import {createTripDayTemplate} from "./components/tripDay.js";
import {createTripItemTemplate} from "./components/tripItem.js";
import {createTripEditTemplate} from "./components/tripEdittor.js";

const TASK_COUNT = 3;

const siteHeaderTripElement = document.querySelector(`.trip-main`);
const siteHeaderMenuElement = siteHeaderTripElement.querySelector(`.trip-controls__menu`);
const siteHeaderFilterElement = siteHeaderTripElement.querySelector(`.trip-controls__flter`);
const siteMainEventElement = document.querySelector(`.trip-events`);

const render = (place, template, position) => {
  place.insertAdjacentHTML(position, template);
};

render(siteHeaderTripElement, createTripMainInfoTemplate(), `afterbegin`);
render(siteHeaderMenuElement, createTripMainControlsTemplate(), `afterend`);
render(siteHeaderFilterElement, createTripMainFilterTemlate(), `afterend`);
render(siteMainEventElement, createListSortTemplate(), `beforeend`);
render(siteMainEventElement, createTripDayTemplate(), `beforeend`);

const siteTripItemElement = siteMainEventElement.querySelector(`.trip-events__list`);

for (let i = 0; i < TASK_COUNT; i++) {
  render(siteTripItemElement, createTripItemTemplate(), `beforeend`);
}

render(siteTripItemElement, createTripEditTemplate(), `afterbegin`);

