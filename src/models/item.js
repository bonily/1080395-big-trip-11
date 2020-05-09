export default class Item {
  constructor(item) {
    this.id = item.id;
    this.eventType = item.type;
    this.destination = item.destination;
    this.price = item.base_price;
    this.startEventTime = new Date(item.date_from);
    this.endEventTime = new Date(item.date_to);
    this.offers = item.offers;
    this.isFavorite = Boolean(item.is_favorite);
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

  static parseItem(item) {
    return new Item(item);
  }

  static parseItems(items) {
    return items.map(Item.parseItem);
  }

  static clone(item) {
    return new Item(item.toRAW());
  }
}
