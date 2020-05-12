import Item from "../models/item.js";

const INFORMATIONAL_STATUS = 200;
const REDIRECTION_STATUS = 300;


const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};


const checkStatus = (response) => {
  if (response.status >= INFORMATIONAL_STATUS && response.status < REDIRECTION_STATUS) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};


export default class API {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getItems() {
    return this._load({url: `points`})
      .then((response) => response.json())
      .then(Item.parseItems);
  }

  getOffers() {
    return this._load({url: `offers`})
      .then((response) => response.json());
  }

  getDestinations() {
    return this._load({url: `destinations`})
      .then((response) => response.json());
  }

  updateItem(id, item) {
    return this._load({
      url: `points/${id}`,
      method: `PUT`,
      body: JSON.stringify(item.toRAW()),
      headers: new Headers({"Content-Type": `application/json`}),
    })
      .then((response) => response.json())
      .then(Item.parseItem);
  }

  createItem(item) {
    return this._load({
      url: `points`,
      method: Method.POST,
      body: JSON.stringify(item.toRAW()),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then((response) => response.json())
      .then(Item.parseItem);
  }

  deleteItem(id) {
    return this._load({url: `points/${id}`, method: Method.DELETE});
  }

  sync(items) {
    return this._load({
      url: `points/sync`,
      method: Method.POST,
      body: JSON.stringify(items),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then((response) => response.json());
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        throw err;
      });
  }
}
