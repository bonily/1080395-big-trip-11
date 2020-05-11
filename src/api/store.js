export default class Store {
  constructor(key, storage) {
    this._storage = storage;
    this._storeKey = key;
    this._storeOfferKey = `offers`;
    this._storeDestinationKey = `destinations`;
  }

  getItems() {
    try {
      return JSON.parse(this._storage.getItem(this._storeKey)) || {};
    } catch (err) {
      return {};
    }
  }

  setOffers(offers) {
    this._storage.setItem(this._storeOfferKey, JSON.stringify(offers));
  }

  getOffers() {
    try {
      return JSON.parse(this._storage.getItem(this._storeOffesKey)) || [];
    } catch (err) {
      return {};
    }
  }

  setDestinations(destinations) {
    this._storage.setItem(this._storeDestinationKey, JSON.stringify(destinations));
  }

  getDestinations() {
    try {
      return JSON.parse(this._storage.getItem(this._storeDestinationKey)) || [];
    } catch (err) {
      return {};
    }
  }

  setItem(key, value) {
    const store = this.getItems();

    this._storage.setItem(
        this._storeKey,
        JSON.stringify(
            Object.assign({}, store, {
              [key]: value
            })
        )
    );
  }

  setItems(items) {
    this._storage.setItem(
        this._storeKey,
        JSON.stringify(items)
    );
  }

  removeItem(key) {
    const store = this.getItems();

    delete store[key];

    this._storage.setItem(
        this._storeKey,
        JSON.stringify(store)
    );
  }
}
