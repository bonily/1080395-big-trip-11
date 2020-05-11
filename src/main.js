import API from "./api/api.js";
import FilterController from "./controllers/filter-controller.js";
import ItemsModel from "./models/items-model.js";
import ListLoading from "./components/list-loading.js";
import MainInfoController from "./controllers/main-info-controller.js";
import {MAIN_FILTERS} from "./const.js";
import {nanoid} from "nanoid";
import Provider from "./api/provider.js";
import {render, RenderPosition, remove} from "./utils/render.js";
import StatisticsComponent from "./components/statistics.js";
import Store from "./api/store.js";
import TripBoardComponent from "./components/trip-board.js";
import TripController from "./controllers/trip-controller.js";
import TripMainControlComponent from "./components/trip-main-control.js";


const AUTHORIZATION = window.localStorage.getItem(`authToken`) || `Basic ${nanoid()}`;
window.localStorage.setItem(`authToken`, AUTHORIZATION);
const END_POINT = `https://11.ecmascript.pages.academy/big-trip`;

const STORE_PREFIX = `bigtrip-localstorage`;
const STORE_VER = `v1`;
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

const STATUS_TEXT = `offline`;

const siteHeaderTripElement = document.querySelector(`.trip-main`);
const siteHeaderMenuElement = siteHeaderTripElement.querySelector(`.trip-controls`);
const siteMainEventElement = document.querySelector(`.trip_container`);
const newItemButton = siteHeaderTripElement.querySelector(`.trip-main__event-add-btn`);


const api = new API(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);

const itemsModel = new ItemsModel();

const listLoadingComponent = new ListLoading();
const statisticsComponent = new StatisticsComponent(itemsModel);
const tripBoardComponent = new TripBoardComponent();
const tripMainControlComponent = new TripMainControlComponent();


const filterController = new FilterController(siteHeaderMenuElement, itemsModel, tripMainControlComponent);
const tripController = new TripController(tripBoardComponent, itemsModel, apiWithProvider, newItemButton, filterController);
const tripMainInfoController = new MainInfoController(siteHeaderTripElement, itemsModel);


render(siteHeaderMenuElement, tripMainControlComponent, RenderPosition.BEFOREEND);
render(siteMainEventElement, tripBoardComponent, RenderPosition.BEFOREEND);
render(siteMainEventElement, statisticsComponent, RenderPosition.BEFOREEND);
render(tripBoardComponent.getElement(), listLoadingComponent, RenderPosition.BEFOREEND);

filterController.render();
tripMainInfoController.render();
statisticsComponent.hide();

tripMainControlComponent.setOnControlClickHandler((MenuItem) => {
  switch (MenuItem) {
    case `Stats`:
      tripBoardComponent.hide();
      statisticsComponent.show();
      filterController.activeFilter = MAIN_FILTERS.ALL;
      filterController.rerender();
      break;
    case `Table`:
      statisticsComponent.hide();
      tripBoardComponent.show();
      break;
  }
});

newItemButton.addEventListener(`click`, () => {
  if (tripController.checkIsListItemsFull()) {
    filterController.onFilterChange(MAIN_FILTERS.ALL);
    filterController.rerender();
  }
  statisticsComponent.hide();
  tripBoardComponent.show();
  tripController.createNewItem();
});

Promise.all([
  apiWithProvider.getItems(),
  apiWithProvider.getOffers(),
  apiWithProvider.getDestinations()
]).then(([items, offers, destinations]) => {
  itemsModel.setItems(items);
  itemsModel.setOffers(offers);
  itemsModel.setDestinations(destinations);
  remove(listLoadingComponent);
  filterController.rerender();
  statisticsComponent.rerender();
  tripController.render();
  tripMainInfoController.rerender();
});

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);

  apiWithProvider.sync();
});

window.addEventListener(STATUS_TEXT, () => {
  document.title += ` [offline]`;
});


window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`./sw.js`)
    .then(() => {
      // Действие, в случае успешной регистрации ServiceWorker
    }).catch(() => {
      // Действие, в случае ошибки при регистрации ServiceWorker
    });
});
