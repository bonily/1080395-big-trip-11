export default class Item {
  constructor(data) {
    this.id = data.id;
    this.eventType = data.type;
    this.destination = data.destination;
    this.price = data[`base_price`];
    this.startEventTime = new Date(data[`date_from`]);
    this.endEventTime = new Date(data[`date_to`]);
    this.offers = data[`offers`];
    this.isFavorite = Boolean(data[`is_favorite`]);
  }

  toRAW() {
    return {
      "id": this.id,
      "type": this.eventType,
      "destination": this.destination,
      "base_price": this.price,
      "date_from": this.startEventTime.toJSON(),
      "date_to": this.endEventTime.toJSON(),
      "offers": this.offers,
      "is_favorite": this.isFavorite,

    };
  }

  static parseItem(data) {
    // console.log(data)
    return new Item(data);
  }

  static parseItems(data) {
    // console.log(data)
    return data.map(Item.parseItem);
  }

  static clone(data) {
    return new Item(data.toRAW());
  }
}
