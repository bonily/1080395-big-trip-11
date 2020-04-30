import {MAIN_FILTERS} from "../const.js";
import {getItemsByFilter} from "../utils/filter.js";

export default class ItemsModel {
  constructor() {
    this._items = [];
    this._activeFilter = MAIN_FILTERS.ALL;

    this._onDataChangeHandlers = [];
    this._filterChangeHandlers = [];

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

  setDataChangeHandler(handler) {
    this._onDataChangeHandlers.push(handler);
  }

  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }
}
