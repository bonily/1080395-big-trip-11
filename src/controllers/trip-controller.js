import ItemController, {EmptyTask} from "./item-controller.js";
import {groupTripItemsByKey} from "../utils/common.js";
import {render, RenderPosition, remove} from "../utils/render.js";
import TripDay from "../components/trip-day";
import TripDaysList from "../components/trip-days-list.js";
import NoItem from "../components/no-item.js";
import TripItemsList from "../components/trip-items-list.js";
import Sorting from "../components/sorting.js";
import {SORT_FILTERS, MAIN_FILTER, FormState, KeyMap, ItemRenderModeMap} from "../const.js";


const SortTypeMap = {
  EVENT: `event`,
  PRICE: `price`,
  TIME: `time`,
};


const renderDayItemsList = ({tripComponent, day, index, items, onItemChange, instans, onViewChange, onDeleteItem, onNewItem, OfferMap, DestinationMap}) => {

  const tripDayComponent = new TripDay(day, index);
  const itemListElement = new TripItemsList();

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
  const sortedItems = [];
  const showingItems = items.slice();

  switch (sortType) {
    case SortTypeMap.PRICE:
      return showingItems.sort((a, b) => b.price - a.price);
    case SortTypeMap.TIME:
      return showingItems.sort((a, b) => durationMs(b) - durationMs(a));
  }
  return sortedItems;
};


export default class TripController {
  constructor(container, itemsModel, api, newItemButton, filterController) {
    this._container = container.getElement();
    this._itemsModel = itemsModel;
    this._api = api;
    this._newItemButton = newItemButton;
    this._filterController = filterController;

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

    this._itemsModel.onFilterChange(this._onFilterChange);
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
      if (this._itemsModel.getItemsAll().length === 0) {
        this._tripNoItemComponent = new NoItem();
        render(this._container, this._tripNoItemComponent, RenderPosition.BEFOREEND);
        return;
      }
      this._filterController.onFilterChange(MAIN_FILTER.ALL);
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
    this._daysComponent = new TripDaysList();
    this._tripDaysListComponent = this._daysComponent.getElement();
    render(this._container, this._daysComponent, RenderPosition.BEFOREEND);
  }

  _renderSortFltersComponent() {
    this._sortListComponent = new Sorting(SORT_FILTERS);
    this._sortListComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    render(this._container, this._sortListComponent, RenderPosition.BEFOREEND);
  }

  _renderItems(items) {
    const groupedItems = Object.entries(groupTripItemsByKey(items, KeyMap.START)).sort();

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
        itemController.changeFormState(FormState.ENABLED);
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
        itemController.changeFormState(FormState.ENABLED);
      });

  }

  _onViewChange() {
    if (this._creatingNewItem) {
      this._creatingNewItem = null;
      this._setButtonAbleStat(this._newItemButton);
    }

    if (!this.checkIsListItemsFull) {
      if (this._itemsModel.getItemsAll.length === 0) {
        this._tripNoItemComponent = new NoItem();
        render(this._container, this._tripNoItemComponent, RenderPosition.BEFOREEND);
      }
      this._filterController.onFilterChange(MAIN_FILTER.ALL);
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
