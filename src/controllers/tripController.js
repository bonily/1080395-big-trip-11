import TripDayComponent from "../components/tripDay";
import TripDaysComponent from "../components/tripDays.js";
import TripNoItemComponent from "../components/noItem.js";
import {render, RenderPosition, remove} from "../utils/render.js";
import TripItemsListTemplate from "../components/tripItems.js";
import SortListComponent from "../components/listSort.js";
import {SORT_FILTERS} from "../const.js";
import {groupTripItemsByKey} from "../utils/common.js";
import ItemController, {EmptyTask} from "./itemController.js";


const KeyMap = {
  start: `startEventTime`,
  type: `eventType`
};


const renderDayItemsList = ({tripComponent, day, index, items, onDataChange, instans, onViewChange, onDeleteItem, onNewItem, OfferMap, DestinationMap}) => {
  const dayContainer = new TripDayComponent(day, index);

  const dayItems = (day) ? day[1] : items;

  render(tripComponent, dayContainer, RenderPosition.BEFOREEND);

  const itemListElement = new TripItemsListTemplate();

  render(dayContainer.getElement(), itemListElement, RenderPosition.BEFOREEND);

  return dayItems.map((item) => {
    const itemController = new ItemController(itemListElement.getElement(), onDataChange, onViewChange, onDeleteItem, onNewItem, OfferMap, DestinationMap);

    itemController.render(item, `default`);

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
      sortedItems = showingItems.sort((a, b) => b.price - a.price);
      break;
    case `time` :
      sortedItems = showingItems.sort((a, b) => durationMs(b) - durationMs(a));
      break;
  }
  return sortedItems;
};


export default class TripController {
  constructor(container, itemsModel, api, newItemButton) {
    this._container = container;
    this._itemsModel = itemsModel;
    this._api = api;
    this._newItemButton = newItemButton;
    this.offerMap = {};
    this.destinationMap = {};

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


  hide() {
    this._container.hide();
  }

  show() {
    this._container.show();
  }

  render() {
    const items = this._itemsModel.getItems();
    this.offerMap = this._itemsModel.getOfferMap();
    this.destinationMap = this._itemsModel.getDestinationMap();

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
    const groupedItems = groupTripItemsByKey(items, KeyMap.start);

    groupedItems.forEach((item, i) => renderDayItemsList({
      tripComponent: this._tripDaysListComponent,
      day: item,
      index: (i + 1),
      onDataChange: this.onDataChange,
      instans: this._showedItemControllers,
      onViewChange: this.onViewChange,
      onDeleteItem: this.onDeleteItem,
      onNewItem: this._onNewItem,
      OfferMap: this.offerMap,
      DestinationMap: this.destinationMap
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
      OfferMap: this.offerMap,
      DestinationMap: this.destinationMap
    });
  }

  onDataChange(oldData, newData) {
    this._onDataChange(oldData, newData);
  }

  _onDataChange(itemController, oldData, newData) {
    this._api.updateItem(oldData.id, newData)
      .then((item) => {
        const isSuccess = this._itemsModel.updateItem(oldData.id, item);

        if (isSuccess) {
          itemController.render(item, `default`);
        }
      })
      .catch(() => {
        itemController.shake();
      });
  }

  _updateItems() {
    this._removeItems();
    this._renderDayListComponent();
    this._renderItems(this._itemsModel.getItems());
  }

  _onFilterChange() {
    this._updateItems();
    this._onSortTypeChange(this._defaultSortMode);
    this._sortListComponent.rerender();
    this._sortListComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    //remove(this._sortListComponent);
    //this._renderSortFltersComponent();
  }

  onViewChange() {
    this._onViewChange();
  }

  _onViewChange() {
    if (this._creatingNewItem) {
      this._creatingNewItem = null;
      this._setButtonAbleStat(this._newItemButton);
      return;
    }

    this._showedItemControllers.forEach((it) => it.setDefaultView());
  }

  onDeleteItem(id, itemController) {
    this._onDeleteItem(id, itemController);
  }

  _onDeleteItem(id, itemController) {
    this._api.deleteItem(id)
      .then(() => {
        this._itemsModel.removeItem(id);
        this._creatingNewItem = null;
        this._updateItems();
      })
      .catch(() => {
        itemController.shake();
      });

  }

  onNewItem(item, itemController) {
    this._onNewItem(item, itemController);
  }

  _onNewItem(item, itemController) {
    this._api.createItem(item)
      .then((itemModel) => {
        this._itemsModel.addItem(itemModel);
        this._creatingNewItem = null;
        this._updateItems();
      })
      .catch(() => {
        itemController.shake();
      });
  }

  _setButtonAbleStat(button) {
    button.removeAttribute(`disabled`);
  }


  createNewItem() {
    if (this._creatingNewItem) {
      return;
    }
    this._newItemButton.setAttribute(`disabled`, `disabled`);

    this._onViewChange();

    this._creatingNewItem = new ItemController(this._tripDaysListComponent, this.onDataChange, this.onViewChange, this.onDeleteItem, this.onNewItem, this.offerMap, this.destinationMap);
    this._creatingNewItem.render(Object.assign({}, EmptyTask), `new`);
    this._showedItemControllers.push(this._creatingNewItem);


  }

}
