import API from "./api.js";
import TripController from "./controllers/tripController.js";
import MainFiltersController from "./controllers/filterController.js";
import {generateEventItems} from "./mock/trip.js";
import {render, RenderPosition} from "./utils/render.js";
import TripMainComponent from "./components/tripMainInfo.js";
import TripMainControlComponent from "./components/tripMainControls.js";
import BoardTemplate from "./components/board.js";
import ItemsModel from "./models/items.js";
import {createEventTypesMap} from "./const.js";


// const TASK_COUNT = 20;

// const items = generateEventItems(TASK_COUNT);
const AUTHORIZATION = `Basic dXNlckBwYXfghjSIUYBVCDSzd29yZAo=`;
const api = new API(AUTHORIZATION);
const itemsModel = new ItemsModel();


const siteHeaderTripElement = document.querySelector(`.trip-main`);
const siteHeaderMenuElement = siteHeaderTripElement.querySelector(`.trip-controls`);
const siteMainEventElement = document.querySelector(`.trip_container`);
const newItemButton = siteHeaderTripElement.querySelector(`.trip-main__event-add-btn`);

const boardContainer = new BoardTemplate();
const tripController = new TripController(boardContainer.getElement(), itemsModel);
const filterController = new MainFiltersController(siteHeaderMenuElement, itemsModel);

//render(siteHeaderTripElement, new TripMainComponent(items), RenderPosition.AFTERBEGIN);
render(siteHeaderMenuElement, new TripMainControlComponent(), RenderPosition.BEFOREEND);

render(siteMainEventElement, boardContainer, RenderPosition.BEFOREEND);

filterController.render();

newItemButton.addEventListener(`click`, () => {
  tripController.createNewItem();
});

api.getItems()
.then((items) => {
  itemsModel.setItems(items);
  tripController.render();
});

api.getOffers()
.then((offers) => {
  createEventTypesMap(offers);
})
