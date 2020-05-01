export default class Item {
  constructor(data) {
    this.id = data.id;
    this.eventType = data.type;
    this.destination = data.destination.name;
    this.price = data[`base_price`];
    this.startEventTime = new Date(data[`date_from`]);
    this.endEventTime = new Date(data[`date_to`]);
    this.offers = data[`offers`];
    this.isFavorite = Boolean(data[`is_favorite`]);
  }

  static parseItem(data) {
    return new Item(data);
  }

  static parseItems(data) {
    //console.log(data)
    return data.map(Item.parseItem);
  }
}

