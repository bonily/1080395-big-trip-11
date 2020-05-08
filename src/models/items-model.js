import {createOffersMap, createDestinationsMap} from "../utils/common.js";
import {getItemsByFilter} from "../utils/filter.js";
import {MAIN_FILTERS} from "../const.js";


export default class ItemsModel {
  constructor() {
    this._items = [];
    this._offersMap = {};
    this._destinationsMap = {};
    this._onDataChangeHandlers = [];
    this._filterChangeHandlers = [];
    this._activeFilter = MAIN_FILTERS.ALL;
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

  updateItem(id, item) {
    const index = this._items.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._items = [].concat(this._items.slice(0, index), item, this._items.slice(index + 1));
    this._callHandlers(this._onDataChangeHandlers);

    return true;
  }

  removeItem(id) {
    const index = this._items.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._items = [].concat(this._items.slice(0, index), this._items.slice(index + 1));
    this._callHandlers(this._onDataChangeHandlers);

    return true;
  }

  addItem(item) {
    this._items = [].concat(item, this._items);
    this._callHandlers(this._onDataChangeHandlers);
  }

  setFilter(filter) {
    this._activeFilter = filter;
    this._callHandlers(this._filterChangeHandlers);
  }

  setDataChangeHandler(cb) {
    this._onDataChangeHandlers.push(cb);
  }

  setFilterChangeHandler(cb) {
    this._filterChangeHandlers.push(cb);
  }

  _callHandlers(callbacks) {
    callbacks.forEach((cb) => cb());
  }
}
