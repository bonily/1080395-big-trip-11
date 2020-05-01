import Item from "./models/item.js";
import EventType from "./models/eventTypes.js";


const API = class {
  constructor(authorization) {
    this._authorization = authorization;

  }
  getItems() {
    const headers = new Headers();
    headers.append(`Authorization`, this._authorization);
    return fetch(`https://11.ecmascript.pages.academy/big-trip/points`, {headers})
      .then((response) => response.json())
      .then(Item.parseItems);
  }

  getOffers() {
    const headers = new Headers();
    headers.append(`Authorization`, this._authorization);
    return fetch(`https://11.ecmascript.pages.academy/big-trip/offers`, {headers})
      .then((response) => response.json())
      //.then(EventType.parseTypes);
  }
};

export default API;
