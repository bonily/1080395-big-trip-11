import {getCurrentDateValue, createElement} from "../utils.js";


/**
 * @param {Date} start - дата начала путешествия
 * @param {Date} end - дата конца путешествия
 * @return {string} - возвращает текствовое представление продолжительности путешествия;
 */
const getEventDuration = (start, end) => {
  const duretionMs = end.getTime() - start.getTime();
  const durationTime = new Date(`1970-01-01T00:00`);
  durationTime.setMilliseconds(duretionMs);
  const days = durationTime.getDate() - 1;
  const hours = durationTime.getHours();
  const minutes = durationTime.getMinutes();
  return `${days > 0 ? getCurrentDateValue(days) + `D` : ``} ${hours > 0 ? getCurrentDateValue(hours) + `H` : ``} ${minutes > 0 ? getCurrentDateValue(minutes) + `M` : ``}`;
};

/**
 * @param {Date} date
 * @return {string} - возвращает строковой представление даты для атрибута datetime;
 */
const getDateTime = (date) => {
  const month = date.getMonth() + 1;
  return `${date.getFullYear()}-${getCurrentDateValue(month)}-${getCurrentDateValue(date.getDate())}T${getCurrentDateValue(date.getHours())}:${getCurrentDateValue(date.getMinutes())}`;
};

/** @typedef {Object} Offer
 * @property {string} name
 * @property {string} price
 */

/**
 * @param {Offer[]} offers
 * @return {string}
 */
const createOfferMarkup = (offers) => {
  return offers
    .map((offer) => {
      return (
        `<li class="event__offer event__offer--${offer.name}">
      <span class="event__offer-title">${offer.discription}</span>
      &plus;
      &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
     </li>`);
    })
    .join(`\n`);
};


/** @typedef {Object} TripItem
 * @property {string} eventType
 * @property {string} destination
 * @property {number} price
 * @property {Date} startEventTime
 * @property {Date} endEventTime
 */


/**
 * @param {TripItem} item
 * @return {string} - возвращает разметку для точки маршрта
 */
const createTripItemTemplate = (item) => {
  const {eventType, destination, price, startEventTime, endEventTime, offers} = item;
  const eventDuration = getEventDuration(startEventTime, endEventTime);
  const offerMarkup = createOfferMarkup(offers);

  return (
    `<li class="trip-events__item">
          <div class="event">
            <div class="event__type">
              <img class="event__type-icon" width="42" height="42" src="img/icons/${eventType}.png" alt="Event type icon">
            </div>
            <h3 class="event__title">${eventType.charAt(0).toUpperCase() + eventType.slice(1)} to ${destination}</h3>

            <div class="event__schedule">
              <p class="event__time">
                <time class="event__start-time" datetime="${getDateTime(startEventTime)}">${getCurrentDateValue(startEventTime.getHours()) + `:` + getCurrentDateValue(startEventTime.getMinutes())}</time>
                &mdash;
                <time class="event__end-time" datetime="${getDateTime(endEventTime)}">${getCurrentDateValue(endEventTime.getHours()) + `:` + getCurrentDateValue(endEventTime.getMinutes())}</time>
              </p>
              <p class="event__duration">${eventDuration}</p>
            </div>

            <p class="event__price">
              &euro;&nbsp;<span class="event__price-value">${price}</span>
            </p>

            <h4 class="visually-hidden">Offers:</h4>
            <ul class="event__selected-offers">
            ${offerMarkup}

            </ul>

            <button class="event__rollup-btn" type="button">
              <span class="visually-hidden">Open event</span>
            </button>
          </div>
        </li>`
  );
};


export default class TripItemComponent {
  constructor(item) {
    this._item = item;

    this._element = null;
  }

  getTemplate() {
    return createTripItemTemplate(this._item);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }
  removeElement() {
    this._element = null;
  }
}
