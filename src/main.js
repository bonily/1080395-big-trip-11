import TripController from "./controllers/tripController.js";
import {generateEventItems} from "./mock/trip.js";
import {groupTripItems} from "./utils/common.js";
import {render, RenderPosition} from "./utils/render.js";
import {MAIN_FILTERS} from "./const.js";
import TripMainComponent from "./components/tripMainInfo.js";
import TripMainControlComponent from "./components/tripMainControls.js";
import TripMainFilterComponent from "./components/tripMainFilter.js";
import BoardTemplate from "./components/board.js";


const TASK_COUNT = 20;

const items = generateEventItems(TASK_COUNT);

const siteHeaderTripElement = document.querySelector(`.trip-main`);
const siteHeaderMenuElement = siteHeaderTripElement.querySelector(`.trip-controls`);
const siteMainEventElement = document.querySelector(`.trip_container`);

const boardContainer = new BoardTemplate();
const tripController = new TripController(boardContainer.getElement());

render(siteHeaderTripElement, new TripMainComponent(items), RenderPosition.AFTERBEGIN);
render(siteHeaderMenuElement, new TripMainControlComponent(), RenderPosition.BEFOREEND);
render(siteHeaderMenuElement, new TripMainFilterComponent(MAIN_FILTERS), RenderPosition.BEFOREEND);

render(siteMainEventElement, boardContainer, RenderPosition.BEFOREEND);

tripController.render(groupTripItems(items));


