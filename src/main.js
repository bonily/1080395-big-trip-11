import {generateItems} from "./mock/trip.js";
import {getSimpleDate, render, RenderPosition} from "./utils.js";
import {SORT_FILTERS, MAIN_FILTERS} from "./const.js";
import TripDayComponent from "./components/tripDay";
import TripItemComponent from "./components/tripItem.js";
import TripDaysComponent from "./components/tripDays.js";
import SortListComponent from "./components/listSort.js";
import TripMainComponent from "./components/tripMainInfo.js";
import TripMainControlComponent from "./components/tripMainControls.js";
import TripMainFilterComponent from "./components/tripMainFilter.js";
import TripEditComponent from "./components/tripEdit.js";


const TASK_COUNT = 20;

const items = generateItems(TASK_COUNT);

const siteHeaderTripElement = document.querySelector(`.trip-main`);
const siteHeaderMenuElement = siteHeaderTripElement.querySelector(`.trip-controls`);
const siteMainEventElement = document.querySelector(`.trip-events`);


const trip = items.reduce((acc, item) => {
  if (acc[getSimpleDate(item.startEventTime)] === undefined) {
    acc[getSimpleDate(item.startEventTime)] = [];
  }
  acc[getSimpleDate(item.startEventTime)].push(item);
  return acc;
}, {});


const renderItem = (itemListElement, item) => {
  const replaceItemToEdit = () => {
    itemListElement.replaceChild(itemEditComponent.getElement(), itemComponent.getElement());
  };

  const replaceEditToItem = () => {
    itemListElement.replaceChild(itemComponent.getElement(), itemEditComponent.getElement());
  };

  const onEscKeyDown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      replaceEditToItem();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  const itemComponent = new TripItemComponent(item);
  const editButton = itemComponent.getElement().querySelector(`.event__rollup-btn`);

  editButton.addEventListener(`click`, (evt) => {
    evt.preventDefault();
    replaceItemToEdit();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  const itemEditComponent = new TripEditComponent(item);
  const editForm = itemEditComponent.getElement();
  editForm.addEventListener(`submit`, (evt) => {
    evt.preventDefault();
    replaceEditToItem();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  render(itemListElement, itemComponent.getElement(), RenderPosition.BEFOREEND);
};

const groupedTripItems = Object.entries(trip).sort();

const renderDayItemsList = (tripComponent, day, index) => {
  const dayContainer = new TripDayComponent(day, index);
  const dayItems = day[1];

  render(tripComponent, dayContainer.getElement(), RenderPosition.BEFOREEND);

  const itemListElement = dayContainer.getElement().querySelector(`.trip-events__list`);

  dayItems.forEach((dayItem) => renderItem(itemListElement, dayItem));
};

const renderDaysList = (groupedItems) => {
  const daysContainer = new TripDaysComponent();

  render(siteMainEventElement, daysContainer.getElement(), RenderPosition.BEFOREEND);

  const tripDaysList = daysContainer.getElement();

  groupedItems.forEach((item, i) => renderDayItemsList(tripDaysList, item, i + 1));
};


renderDaysList(groupedTripItems);


// const render = (place, template, position) => {
//   place.insertAdjacentHTML(position, template);
// };

render(siteHeaderTripElement, new TripMainComponent(items).getElement(), RenderPosition.AFTERBEGIN);
render(siteHeaderMenuElement, new TripMainControlComponent().getElement(), RenderPosition.BEFOREEND);
render(siteHeaderMenuElement, new TripMainFilterComponent(MAIN_FILTERS).getElement(), RenderPosition.BEFOREEND);
render(siteMainEventElement, new SortListComponent(SORT_FILTERS).getElement(), RenderPosition.AFTERBEGIN);
// render(siteMainEventElement, createTripEditTemplate(items[0]), `beforeend`);
// render(siteMainEventElement, createTripDayMarkup(trip[0], 0), `beforeend`);

