import {createOffersMap, createDestinationsMap} from "../utils/common.js";
import {getItemsByFilter} from "../utils/filter.js";
import {MAIN_FILTER} from "../const.js";


export default class ItemsModel {
  constructor() {
    this._items = [];
    this._offersMap = {};
    this._destinationsMap = {};
    this._onDataChangeHandlers = [];
    this._filterChangeHandlers = [];
    this._activeFilter = MAIN_FILTER.ALL;
  }

  getItems() {
    return getItemsByFilter(this._items, this._activeFilter);
  }

  getItemsAll() {
    return this._items;
  }

  setItems(items) {
    this._items = Array.from(items);
    this._callHandlers(this._onDataChangeHandlers);
  }

  getOfferMap() {
    return this._offersMap;
  }

  setOffers(offers) {
    this._offersMap = createOffersMap(offers);
  }

  getDestinationMap() {
    return this._destinationsMap;
  }

  setDestinations(destinations) {
    this._destinationsMap = createDestinationsMap(destinations);
  }

  updateItem(id, modifiedItem) {
    const index = this._items.findIndex((item) => item.id === id);

    if (index === -1) {
      return false;
    }

    this._items = [].concat(this._items.slice(0, index), modifiedItem, this._items.slice(index + 1));
    this._callHandlers(this._onDataChangeHandlers);

    return true;
  }

  removeItem(itemId) {
    if (this._items.some(({id}) => id === itemId)) {
      this._items = this._items.filter(({id}) => itemId !== id);
      this._callHandlers(this._onDataChangeHandlers);
    }
  }

  addItem(item) {
    this._items = [].concat(item, this._items);
    this._callHandlers(this._onDataChangeHandlers);
  }

  setFilter(filter) {
    this._activeFilter = filter;
    this._callHandlers(this._filterChangeHandlers);
  }

  onDataChange(cb) {
    if (this._onDataChangeHandlers.indexOf(cb) === -1) {
      this._onDataChangeHandlers.push(cb);
    }
  }

  onFilterChange(cb) {
    this._filterChangeHandlers.push(cb);
  }

  removeDataChangeHandler(cb) {
    const index = this._onDataChangeHandlers.indexOf(cb);
    this._onDataChangeHandlers.splice(index, 1);
  }

  _callHandlers(callbacks) {
    callbacks.forEach((cb) => cb());
  }
}
