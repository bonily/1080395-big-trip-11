import {generateItems} from "./mock/trip.js";
import {groupTripItems} from "./utils/common.js";
import {render, RenderPosition} from "./utils/render.js";
import {SORT_FILTERS, MAIN_FILTERS} from "./const.js";

import SortListComponent from "./components/listSort.js";
import TripMainComponent from "./components/tripMainInfo.js";
import TripMainControlComponent from "./components/tripMainControls.js";
import TripMainFilterComponent from "./components/tripMainFilter.js";
import TripController from "./controllers/tripController.js";


const TASK_COUNT = 20;

const items = generateItems(TASK_COUNT);

const siteHeaderTripElement = document.querySelector(`.trip-main`);
const siteHeaderMenuElement = siteHeaderTripElement.querySelector(`.trip-controls`);
const siteMainEventElement = document.querySelector(`.trip-events`);

const tripController = new TripController(siteMainEventElement);

render(siteHeaderTripElement, new TripMainComponent(items), RenderPosition.AFTERBEGIN);
render(siteHeaderMenuElement, new TripMainControlComponent(), RenderPosition.BEFOREEND);
render(siteHeaderMenuElement, new TripMainFilterComponent(MAIN_FILTERS), RenderPosition.BEFOREEND);
render(siteMainEventElement, new SortListComponent(SORT_FILTERS), RenderPosition.AFTERBEGIN);
tripController.render(groupTripItems(items));


