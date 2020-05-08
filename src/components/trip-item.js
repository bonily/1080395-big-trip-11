import AbstractComponent from "./abstract-component.js";
import {capitalize, getDateTime, getEventDuration} from "../utils/common.js";
import {EVENT_TYPES_TRANSPORT} from "../const.js";
import moment from "moment";
import "moment-duration-format";


const getShortTime = (date) => {
  return moment(date).format(`HH:mm`);
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
    .slice(0, 3)
    .map((offer) => {
      return (
        `<li class="event__offer event__offer--${offer.title}">
          <span class="event__offer-title">${offer.title}</span>
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
const createTripItemTemplate = ({eventType, destination, price, startEventTime, endEventTime, offers}) => {
  const eventDuration = getEventDuration(startEventTime, endEventTime);
  const offerMarkup = createOfferMarkup(offers);
  const isEventTypeTransport = EVENT_TYPES_TRANSPORT.indexOf(eventType) > -1;

  return (
    `<div class="event">
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${eventType}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${capitalize(eventType)} ${(isEventTypeTransport) ? `to` : `in`} ${destination.name}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${getDateTime(startEventTime)}">${getShortTime(startEventTime)}</time>
            &mdash;
          <time class="event__end-time" datetime="${getDateTime(endEventTime)}">${getShortTime(endEventTime)}</time>
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
    </div>`
  );
};


export default class TripItemComponent extends AbstractComponent {
  constructor(item) {
    super();

    this._item = item;
  }

  getTemplate() {
    return createTripItemTemplate(this._item);
  }

  setEditButtonClickHadler(cb) {
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, cb);
  }
}
