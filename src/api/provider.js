import Item from "../models/item.js";
import {nanoid} from "nanoid";


const isOnline = () => {
  return window.navigator.onLine;
};

const getSyncedItems = (items) => {
  return items.filter(({success}) => success)
    .map(({payload}) => payload.task);
};

const createStoreStructure = (items) => {
  return items.reduce((acc, current) => {
    return Object.assign({}, acc, {
      [current.id]: current,
    });
  }, {});
};


export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getItems() {
    if (isOnline()) {
      return this._api.getItems()
        .then((items) => {
          const rawItems = createStoreStructure(items.map((item) => item.toRAW()));
          this._store.setItems(rawItems);

          return items;
        });
    }

    const storeItems = Object.values(this._store.getItems());

    return Promise.resolve(Item.parseItems(storeItems));
  }

  getOffers() {
    if (isOnline()) {
      return this._api.getOffers()
      .then((offers) => {
        this._store.setOffers(offers);

        return offers;
      });
    }

    return Promise.resolve(this._store.getOffers());
  }

  getDestinations() {
    if (isOnline()) {
      return this._api.getDestinations()
      .then((destinations) => {
        this._store.setDestinations(destinations);

        return destinations;
      });
    }

    return Promise.resolve(this._store.getDestinations());
  }

  createItem(item) {
    if (isOnline()) {
      return this._api.createItem(item)
      .then((newItem) => {
        this._store.setItem(newItem.id, newItem.toRAW());

        return newItem;
      });
    }

    const localNewItemId = nanoid();
    const localNewItem = Item.clone(Object.assign(item, {id: localNewItemId}));

    this._store.setItem(localNewItem.id, localNewItem.toRAW());

    return Promise.resolve(localNewItem);
  }

  updateItem(id, item) {
    if (isOnline()) {
      return this._api.updateItem(id, item)
      .then((newItem) => {
        this._store.setItem(newItem.id, newItem.toRAW());

        return newItem;
      });
    }

    const localItem = Item.clone(Object.assign(item, {id}));

    this._store.setItem(id, localItem.toRAW());

    return Promise.resolve(localItem);
  }

  deleteItem(id) {
    if (isOnline()) {
      return this._api.deleteItem(id)
        .then(() => this._store.removeItem(id));
    }

    this._store.removeItem(id);

    return Promise.resolve();
  }

  sync() {
    if (isOnline()) {
      const storeItems = Object.values(this._store.getItems());

      return this._api.sync(storeItems)
        .then((response) => {
          // Забираем из ответа синхронизированные задачи
          const createdItems = getSyncedItems(response.created);
          const updatedItems = getSyncedItems(response.updated);

          // Добавляем синхронизированные задачи в хранилище.
          // Хранилище должно быть актуальным в любой момент.
          const items = createStoreStructure([...createdItems, ...updatedItems]);

          this._store.setItems(items);
        });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }
}
