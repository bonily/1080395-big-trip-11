import TripDayComponent from "../components/tripDay";
import TripDaysComponent from "../components/tripDays.js";
import TripNoItemComponent from "../components/noItem.js";
import {render, RenderPosition} from "../utils/render.js";
import TripItemsListTemplate from "../components/tripItems.js";
import SortListComponent from "../components/listSort.js";
import {SORT_FILTERS} from "../const.js";
import {groupTripItems} from "../utils/common.js";
import ItemController from "./itemController.js";


const renderDayItemsList = ({tripComponent, day, index, items, onDataChange, instans, onViewChange}) => {
  const dayContainer = new TripDayComponent(day, index);

  const dayItems = (day) ? day[1] : items;

  render(tripComponent, dayContainer, RenderPosition.BEFOREEND);

  const itemListElement = new TripItemsListTemplate();

  render(dayContainer.getElement(), itemListElement, RenderPosition.BEFOREEND);

  return dayItems.map((item) => {
    const itemController = new ItemController(itemListElement.getElement(), onDataChange, onViewChange);

    itemController.render(item);
    instans.push(itemController);
    return itemController;
  });
};

const gerSortedItems = (items, sortType) => {
  const durationMs = (item) => item.endEventTime.getTime() - item.startEventTime.getTime();
  let sortedItems = [];
  const showingItems = items.slice();
  switch (sortType) {
    case `price`:
      sortedItems = showingItems.sort((a, b) => a.price - b.price);
      break;
    case `time` :
      sortedItems = showingItems.sort((a, b) => durationMs(a) - durationMs(b));
      break;
  }
  return sortedItems;
};


export default class TripController {
  constructor(container) {
    this._container = container;

    this._tripNoItemComponent = new TripNoItemComponent();
    this._daysComponent = new TripDaysComponent();
    this._sortListComponent = new SortListComponent(SORT_FILTERS);
    this._tripDaysListComponent = this._daysComponent.getElement();
    this._showedItemControllers = [];

    this._items = [];
    this._groupedItems = [];

    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._sortListComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    this._onDataChange = this._onDataChange.bind(this);
    this.onViewChange = this._onViewChange.bind(this);
  }

  render(items) {
    this._items = items;
    this._groupedItems = groupTripItems(items);

    if (items.length === 0) {
      render(this._container, this._tripNoItemComponent, RenderPosition.BEFOREEND);
      return;
    }

    render(this._container, this._sortListComponent, RenderPosition.AFTERBEGIN);

    render(this._container, this._daysComponent, RenderPosition.BEFOREEND);

    this._groupedItems.forEach((item, i) => renderDayItemsList({
      tripComponent: this._tripDaysListComponent,
      day: item,
      index: (i + 1),
      onDataChange: this.onDataChange,
      instans: this._showedItemControllers,
      onViewChange: this.onViewChange
    }));
  }

  _onSortTypeChange(sortType) {
    this._tripDaysListComponent.innerHTML = ``;
    if (sortType === `event`) {
      this._groupedItems.forEach((item, i) => renderDayItemsList({
        tripComponent: this._tripDaysListComponent,
        day: item,
        index: (i + 1),
        onDataChange: this.onDataChange,
        instans: this._showedItemControllers,
        onViewChange: this.onViewChange
      }));
    }

    renderDayItemsList({
      tripComponent: this._tripDaysListComponent,
      items: gerSortedItems(this._items, sortType),
      onDataChange: this.onDataChange,
      instans: this._showedItemControllers,
      onViewChange: this.onViewChange
    });
  }

  onDataChange(callback, oldData, newData) {
    this._onDataChange(callback, oldData, newData);
  }

  _onDataChange(callback, oldData, newData) {
    const index = this._items.findIndex((it) => it === oldData);

    if (index === -1) {
      return;
    }

    this._items = [].concat(this._items.slice(0, index), newData, this._items.slice(index + 1));

    callback(this._items[index]);
  }

  onViewChange() {
    this._onViewChange();
  }

  _onViewChange() {
    this._showedItemControllers.forEach((it) => it.setDefaultView());
  }
}
