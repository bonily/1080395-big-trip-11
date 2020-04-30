import {capitalize, getDateTime} from "../utils/common.js";
import AbstractComponent from "./abstractComponent.js";
import moment from "moment";
import "moment-duration-format";


/**
 * @param {Date} start - дата начала путешествия
 * @param {Date} end - дата конца путешествия
 * @return {string} - возвращает текствовое представление продолжительности путешествия;
 */
const getEventDuration = (start, end) => {
  const duretionMs = end.getTime() - start.getTime();
  return moment.duration(duretionMs, `milliseconds`).format(`DD[D] hh[H] mm[M]`);
};


const getShortTime = (date) => {
  return moment(date).format(`hh:mm`);
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
          <span class="event__offer-title">${offer.description}</span>
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
  const offerMarkup = createOfferMarkup(offers.filter((offer) => offer.checked === true));


  return (
    `<li class="trip-events__item">
        <div class="event">
          <div class="event__type">
            <img class="event__type-icon" width="42" height="42" src="img/icons/${eventType}.png" alt="Event type icon">
          </div>
          <h3 class="event__title">${capitalize(eventType)} to ${destination}</h3>
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
        </div>
      </li>`
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

  setEditButtonHadler(cb) {
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, cb);

  }
}
