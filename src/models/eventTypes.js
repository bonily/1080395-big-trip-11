export default class EventType {
  constructor(data) {
    this.name = data.type;
    this.offers = data.offers;
  }

  static parseType(data) {
    return new EventType(data);
  }

  static parseTypes(data) {
    return data.map(Event.parseType);
  }
}
