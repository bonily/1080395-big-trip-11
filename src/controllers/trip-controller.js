import ItemController, {EmptyTask} from "./item-сontroller.js";
import {groupTripItemsByKey} from "../utils/common.js";
import {render, RenderPosition, remove} from "../utils/render.js";
import TripDayComponent from "../components/trip-day";
import TripDaysComponent from "../components/trip-days-list.js";
import TripNoItemComponent from "../components/no-item.js";
import TripItemsListTemplate from "../components/trip-items-list.js";
import SortingComponent from "../components/sorting.js";
import {SORT_FILTERS, FormState, KeyMap, ItemRenderModeMap} from "../const.js";


const SortTypeMap = {
  EVENT: `event`,
  PRICE: `price`,
  TIME: `time`,
};


const renderDayItemsList = ({tripComponent, day, index, items, onItemChange, instans, onViewChange, onDeleteItem, onNewItem, OfferMap, DestinationMap}) => {

  const tripDayComponent = new TripDayComponent(day, index);
  const itemListElement = new TripItemsListTemplate();

  const dayItems = (day) ? day[1] : items;

  render(tripComponent, tripDayComponent, RenderPosition.BEFOREEND);
  render(tripDayComponent.getElement(), itemListElement, RenderPosition.BEFOREEND);

  return dayItems.map((item) => {
    const itemController = new ItemController(itemListElement.getElement(), onItemChange, onViewChange, onDeleteItem, onNewItem, OfferMap, DestinationMap);

    itemController.render(item, ItemRenderModeMap.DEFAULT);

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
    case SortTypeMap.PRICE:
      sortedItems = showingItems.sort((a, b) => b.price - a.price);
      break;
    case SortTypeMap.TIME:
      sortedItems = showingItems.sort((a, b) => durationMs(b) - durationMs(a));
      break;
  }
  return sortedItems;
};


export default class TripController {
  constructor(container, itemsModel, api, newItemButton) {
    this._container = container.getElement();
    this._itemsModel = itemsModel;
    this._api = api;
    this._newItemButton = newItemButton;

    this.offerMap = {};
    this.destinationMap = {};

    this._defaultSortMode = SortTypeMap.EVENT;

    this._tripNoItemComponent = null;
    this._sortListComponent = null;
    this._daysComponent = null;
    this._tripDaysListComponent = null;
    this._creatingNewItem = null;
    this._groupedItems = [];
    this._showedItemControllers = [];

    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this.onItemChange = this._onItemChange.bind(this);
    this.onViewChange = this._onViewChange.bind(this);
    this.onDeleteItem = this._onDeleteItem.bind(this);
    this.onNewItem = this._onNewItem.bind(this);

    this._itemsModel.setFilterChangeHandler(this._onFilterChange);
  }

  render() {
    if (this._daysComponent) {
      remove(this._daysComponent);
      this._daysComponent = null;
    }

    if (this._sortListComponent) {
      remove(this._sortListComponent);
      this._sortListComponent = null;
    }

    const items = this._itemsModel.getItems();
    this.offerMap = this._itemsModel.getOfferMap();
    this.destinationMap = this._itemsModel.getDestinationMap();

    if (items.length === 0) {
      this._tripNoItemComponent = new TripNoItemComponent();
      render(this._container, this._tripNoItemComponent, RenderPosition.BEFOREEND);
      return;
    }

    this._renderSortFltersComponent();
    this._renderDayListComponent();
    this._renderItems(items);
  }

  createNewItem() {
    if (this._creatingNewItem) {
      return;
    }

    this._newItemButton.setAttribute(FormState.DISABLED, FormState.DISABLED);

    if (!this.checkIsListItemsFull()) {
      remove(this._tripNoItemComponent);
      this._creatingNewItem = new ItemController(this._container, this.onItemChange, this.onViewChange, this.onDeleteItem, this.onNewItem, this.offerMap, this.destinationMap);
      this._creatingNewItem.render(Object.assign({}, EmptyTask), ItemRenderModeMap.FIRST);
    } else {
      this._onViewChange();
      this._creatingNewItem = new ItemController(this._tripDaysListComponent, this.onItemChange, this.onViewChange, this.onDeleteItem, this.onNewItem, this.offerMap, this.destinationMap);
      this._creatingNewItem.render(Object.assign({}, EmptyTask), ItemRenderModeMap.NEW, this._tripDaysListComponent);
    }
    this._showedItemControllers.push(this._creatingNewItem);
  }

  checkIsListItemsFull() {
    return this._itemsModel.getItems().length > 0;
  }

  _renderParametr() {
    return {
      onItemChange: this.onItemChange,
      instans: this._showedItemControllers,
      onViewChange: this.onViewChange,
      onDeleteItem: this.onDeleteItem,
      onNewItem: this._onNewItem,
      OfferMap: this.offerMap,
      DestinationMap: this.destinationMap,
    };
  }

  _renderDayListComponent() {
    this._daysComponent = new TripDaysComponent();
    this._tripDaysListComponent = this._daysComponent.getElement();
    render(this._container, this._daysComponent, RenderPosition.BEFOREEND);
  }

  _renderSortFltersComponent() {
    this._sortListComponent = new SortingComponent(SORT_FILTERS);
    this._sortListComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    render(this._container, this._sortListComponent, RenderPosition.BEFOREEND);
  }

  _renderItems(items) {
    const groupedItems = groupTripItemsByKey(items, KeyMap.START);

    groupedItems.forEach((item, i) => renderDayItemsList(
        Object.assign({
          tripComponent: this._tripDaysListComponent,
          day: item,
          index: (i + 1),
        }, this._renderParametr())));
  }

  _removeItems() {
    this._showedItemControllers.forEach((itemController) => itemController.destroy());
    this._showedItemControllers = [];
    if (this._daysComponent) {
      remove(this._daysComponent);
    }
  }

  _onSortTypeChange(sortType) {
    const items = this._itemsModel.getItems();
    this._removeItems();
    this._renderDayListComponent();
    this._setButtonAbleStat(this._newItemButton);

    if (sortType === SortTypeMap.EVENT) {
      this._renderItems(items);
    }

    renderDayItemsList(Object.assign({
      tripComponent: this._tripDaysListComponent,
      items: gerSortedItems(items, sortType),
    }, this._renderParametr()));
  }

  _updateTripView() {
    if (!this._sortListComponent) {
      this._renderSortFltersComponent();
      this._renderDayListComponent();
    }

    if (!this.checkIsListItemsFull()) {
      remove(this._daysComponent);
      remove(this._sortListComponent);
    }

  }

  _updateItems() {
    this._removeItems();
    this._updateTripView();
    this.render();
  }

  _onFilterChange() {
    this._updateItems();
    this._onSortTypeChange(this._defaultSortMode);
    this._sortListComponent.rerender();
    this._sortListComponent.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  _setButtonAbleStat(button) {
    button.removeAttribute(FormState.DISABLED);
    this._creatingNewItem = null;
  }

  _onItemChange(itemController, oldItem, newItem, favorite) {
    this._api.updateItem(oldItem.id, newItem)
      .then((item) => {
        const isSuccess = this._itemsModel.updateItem(oldItem.id, item);

        if (isSuccess) {
          if (favorite) {
            return;
          }
          itemController.render(item, ItemRenderModeMap.DEFAULT);
        }
      })
      .catch(() => {
        itemController.shake();
      });
  }

  _onNewItem(item, itemController) {
    this._api.createItem(item)
      .then((itemModel) => {
        this._itemsModel.addItem(itemModel);
        this._creatingNewItem = null;
        this._updateItems();
        this._setButtonAbleStat(this._newItemButton);
      })
      .catch(() => {
        itemController.shake();
        itemController.changeFormState(FormState.abled);
      });
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
        itemController.changeFormState(FormState.abled);
      });

  }

  _onViewChange() {
    if (this._creatingNewItem) {
      this._creatingNewItem = null;
      this._setButtonAbleStat(this._newItemButton);
    }

    if (!this.checkIsListItemsFull()) {
      this._tripNoItemComponent = new TripNoItemComponent();
      render(this._container, this._tripNoItemComponent, RenderPosition.BEFOREEND);
    }

    this._showedItemControllers.forEach((it) => it.setDefaultView());
  }

  onItemChange(itemController, oldItem, newItem, favorite) {
    this._onItemChange(itemController, oldItem, newItem, favorite);
  }

  onNewItem(item, itemController) {
    this._onNewItem(item, itemController);
  }

  onDeleteItem(id, itemController) {
    this._onDeleteItem(id, itemController);
  }

  onViewChange() {
    this._onViewChange();
  }


}
