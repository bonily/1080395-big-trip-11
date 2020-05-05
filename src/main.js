import API from "./api/index.js";
import Provider from "./api/provider.js";
import Store from "./api/store.js";
import TripController from "./controllers/tripController.js";
import MainFiltersController from "./controllers/filterController.js";

import {render, RenderPosition} from "./utils/render.js";

import TripMainControlComponent from "./components/tripMainControls.js";
import BoardTemplate from "./components/board.js";
import ListLoading from "./components/listLoading.js";
import ItemsModel from "./models/items.js";
import {remove} from "./utils/render.js";
import StatTemplate from "./components/stat.js";


// const TASK_COUNT = 20;

const END_POINT = `https://11.ecmascript.pages.academy/big-trip`;
const AUTHORIZATION = `Basic dXNlckBwYXfghjSIUYBVCDSzd29yZAo=`;
const STORE_PREFIX = `bigtrip-localstorage`;
const STORE_VER = `v1`;
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;
const api = new API(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);
const itemsModel = new ItemsModel();


const siteHeaderTripElement = document.querySelector(`.trip-main`);
const siteHeaderMenuElement = siteHeaderTripElement.querySelector(`.trip-controls`);
const siteMainEventElement = document.querySelector(`.trip_container`);
const newItemButton = siteHeaderTripElement.querySelector(`.trip-main__event-add-btn`);

const boardContainer = new BoardTemplate();
const listLoadingComponent = new ListLoading();
const tripController = new TripController(boardContainer.getElement(), itemsModel, apiWithProvider, newItemButton);
const filterController = new MainFiltersController(siteHeaderMenuElement, itemsModel);
const statComponent = new StatTemplate(itemsModel);
const tripMainControlComponent = new TripMainControlComponent();
// render(siteHeaderTripElement, new TripMainComponent(items), RenderPosition.AFTERBEGIN);
render(siteHeaderMenuElement, tripMainControlComponent, RenderPosition.BEFOREEND);


render(siteMainEventElement, boardContainer, RenderPosition.BEFOREEND);
render(siteMainEventElement, statComponent, RenderPosition.BEFOREEND);
render(boardContainer.getElement(), listLoadingComponent, RenderPosition.BEFOREEND);


filterController.render();

statComponent.hide();

tripMainControlComponent.setOnChange((MenuItem) => {
  switch (MenuItem) {
    case `Stats`:
      boardContainer.hide();
      statComponent.show();
      break;
    case `Table`:
      statComponent.hide();
      boardContainer.show();
      break;
  }

});

newItemButton.addEventListener(`click`, () => {
  tripController.createNewItem();
  statComponent.hide();
  boardContainer.show();
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
  tripController.render();
  statComponent.rerender();
});

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);

  apiWithProvider.sync();
});

window.addEventListener(`offline`, () => {
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
