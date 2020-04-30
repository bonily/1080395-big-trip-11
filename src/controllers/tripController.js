import TripDayComponent from "../components/tripDay";
import TripDaysComponent from "../components/tripDays.js";
import TripNoItemComponent from "../components/noItem.js";
import {render, RenderPosition, remove} from "../utils/render.js";
import TripItemsListTemplate from "../components/tripItems.js";
import SortListComponent from "../components/listSort.js";
import {SORT_FILTERS} from "../const.js";
import {groupTripItems} from "../utils/common.js";
import ItemController, {EmptyTask} from "./itemController.js";



const renderDayItemsList = ({tripComponent, day, index, items, onDataChange, instans, onViewChange, onDeleteItem, onNewItem}) => {
  const dayContainer = new TripDayComponent(day, index);

  const dayItems = (day) ? day[1] : items;

  render(tripComponent, dayContainer, RenderPosition.BEFOREEND);

  const itemListElement = new TripItemsListTemplate();

  render(dayContainer.getElement(), itemListElement, RenderPosition.BEFOREEND);

  return dayItems.map((item) => {
    const itemController = new ItemController(itemListElement.getElement(), onDataChange, onViewChange, onDeleteItem, onNewItem);

    itemController.render(item);

    if (instans.indexOf(itemController) === -1) {
      instans.push(itemController);
    }

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
  constructor(container, itemsModel) {
    this._container = container;
    this._itemsModel = itemsModel;

    this._tripNoItemComponent = new TripNoItemComponent();
    this._sortListComponent = null;

    this._showedItemControllers = [];
    this._daysComponent = null;
    this._tripDaysListComponent = null;
    this._defaultSortMode = `event`;
    this._creatingNewItem = null;

    this._groupedItems = [];

    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this.onDataChange = this._onDataChange.bind(this);
    this.onViewChange = this._onViewChange.bind(this);
    this.onDeleteItem = this._onDeleteItem.bind(this);
    this.onNewItem = this._onNewItem.bind(this);


    this._itemsModel.setFilterChangeHandler(this._onFilterChange);
  }

  render() {
    const items = this._itemsModel.getItems();

    if (items.length === 0) {
      render(this._container, this._tripNoItemComponent, RenderPosition.BEFOREEND);
      return;
    }

    this._renderSortFltersComponent();
    this._renderDayListComponent();
    this._renderItems(items);
  }

  _renderDayListComponent() {
    this._daysComponent = new TripDaysComponent();
    this._tripDaysListComponent = this._daysComponent.getElement();
    render(this._container, this._daysComponent, RenderPosition.BEFOREEND);
  }

  _renderSortFltersComponent() {
    this._sortListComponent = new SortListComponent(SORT_FILTERS);
    this._sortListComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    render(this._container, this._sortListComponent, RenderPosition.BEFOREEND);
  }

  _renderItems(items) {
    const groupedItems = groupTripItems(items);

    groupedItems.forEach((item, i) => renderDayItemsList({
      tripComponent: this._tripDaysListComponent,
      day: item,
      index: (i + 1),
      onDataChange: this.onDataChange,
      instans: this._showedItemControllers,
      onViewChange: this.onViewChange,
      onDeleteItem: this.onDeleteItem,
      onNewItem: this._onNewItem,
    }));
  }

  _removeItems() {
    this._showedItemControllers.forEach((itemController) => itemController.destroy());
    this._showedItemControllers = [];
    remove(this._daysComponent);

  }


  _onSortTypeChange(sortType) {
    const items = this._itemsModel.getItems();
    this._removeItems();
    this._renderDayListComponent();

    if (sortType === `event`) {
      this._renderItems(items);
    }

    renderDayItemsList({
      tripComponent: this._tripDaysListComponent,
      items: gerSortedItems(items, sortType),
      onDataChange: this.onDataChange,
      instans: this._showedItemControllers,
      onViewChange: this.onViewChange,
      onDeleteItem: this.onDeleteItem,
      onNewItem: this._onNewItem,
    });
  }

  onDataChange(oldData, newData) {
    this._onDataChange(oldData, newData);
  }

  _onDataChange(itemController, oldData, newData) {
    const isSuccess = this._itemsModel.updateItem(oldData.id, newData);

    if (isSuccess) {
      itemController.render(newData);
    }
  }

  _updateItems() {
    this._removeItems();
    this._renderDayListComponent();
    this._renderItems(this._itemsModel.getItems());
  }

  _onFilterChange() {
    this._updateItems();
    this._onSortTypeChange(this._defaultSortMode);
    remove(this._sortListComponent);
    this._renderSortFltersComponent();
  }

  onViewChange() {
    this._onViewChange();
  }

  _onViewChange() {
    this._showedItemControllers.forEach((it) => it.setDefaultView());
  }

  onDeleteItem(id) {
    this._onDeleteItem(id);
  }

  _onDeleteItem(id) {
    this._itemsModel.removeItem(id);
    this._creatingNewItem = null;
    this._updateItems();
  }

  onNewItem(item) {
    this._onNewItem(item);
  }

  _onNewItem(item) {
    this._itemsModel.addItem(item);
    this._creatingNewItem = null;
    this._updateItems();
  }

  createNewItem() {
    if (this._creatingNewItem) {
      return;
    }

    this._creatingNewItem = new ItemController(this._tripDaysListComponent, this.onDataChange, this.onViewChange, this.onDeleteItem, this.onNewItem);
    this._creatingNewItem.render(EmptyTask, `new`);

  }
}
