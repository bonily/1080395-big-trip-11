import {capitalize, getDateTime} from "../utils/common.js";
import AbstractSmartComponent from "./abstractSmartComponent.js";
import flatpickr from "flatpickr";
import {DESTINATIONS, OFFERS_MAP, EVENT_TYPES, DESTINATION_MAP} from "../const.js";

import "flatpickr/dist/flatpickr.min.css";

const getCurrentDateFromValue = (value) => {
  const dateValue = value.split(/[.,\/ - :]/);
  const dateString = `20` + dateValue[2] + `-` + dateValue[1] + `-` + dateValue[0] + `T` + dateValue[3] + `:` + dateValue[4];
  return dateString;
};

const createOfferMarkup = (offer, currentOffers) => {

  const isOfferChecked = () => currentOffers.some((currentOffer) => currentOffer.title === offer.title) ? `checked` : ``;
  return (
    `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.title}" type="checkbox" name="event-offer-${offer.title}" value="${offer.title}" ${isOfferChecked()}>
      <label class="event__offer-label" for="event-offer-${offer.title}">
      <span class="event__offer-title">${offer.title}</span>
      &plus;
     &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
      </label>
     </div>`
  );
};

const createPhotosMarkup = (photo) => {
  return (
    `<img class="event__photo" src="${photo.src}" alt="${photo.description}">`
  );
};

const createDestinationMarkup = (destination) => {
  const photosMarkup = destination.pictures.map((photo) => createPhotosMarkup(photo)).join(`\n`);
  const description = destination.description;
  return (
    `<section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
    <p class="event__destination-description">${description}.</p>

    <div class="event__photos-container">
      <div class="event__photos-tape">
        ${photosMarkup}
      </div>
    </div>
  </section>`
  );
};

const createNotNewItemElementMarkup = (isFavorite) => {
  return (
    `<input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${isFavorite ? `checked` : ``}>
    <label class="event__favorite-btn" for="event-favorite-1">
      <span class="visually-hidden">Add to favorite</span>
      <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
        <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
      </svg>
    </label>
    <button class="event__rollup-btn" type="button">
    <span class="visually-hidden">Open event</span>
  </button>`
  );
};

const createDataListMarkup = (destination) => {
  return (
    `<option value="${destination}"></option>`
  );
};

const createEventTypesMatkup = (type, eventType) => {
  const isTypeCheced = type === eventType ? `checked` : ``;
  return (
    `<div class="event__type-item">
    <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${isTypeCheced}>
    <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${capitalize(type)}</label>
  </div>`
  );
};

const createTripEditTemplate = ({id, eventType, destinationName, price, startEventTime, endEventTime, offers, isFavorite}) => {
  const notNewItemElementMarkup = id !== 0 ? createNotNewItemElementMarkup(isFavorite) : ` `;
  const destination = DESTINATION_MAP[destinationName];
  const avaiblableOffers = OFFERS_MAP[eventType];
  const offersMarkup = avaiblableOffers.map((offer) => createOfferMarkup(offer, offers)).join(`\n`);
  const descriptionMarup = destination === `` ? ` ` : createDestinationMarkup(destination);
  const dataListMarkup = DESTINATIONS.map((destinationForData) => createDataListMarkup(destinationForData)).join(`\n`);
  const eventTransferTypesMarkup = EVENT_TYPES.slice(0, 7).map((type) => createEventTypesMatkup(type, eventType)).join(`\n`);
  const eventActivityTypesMarkup = EVENT_TYPES.slice(-3).map((type) => createEventTypesMatkup(type, eventType)).join(`\n`);

  return (
    `<li class="trip-events__item">
    <form class="trip-events__item event  event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${eventType}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Transfer</legend>

                ${eventTransferTypesMarkup}
              </fieldset>

              <fieldset class="event__type-group">
                <legend class="visually-hidden">Activity</legend>

                ${eventActivityTypesMarkup}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${capitalize(eventType)} to
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destinationName === `` ? ` ` : destinationName}" list="destination-list-1">
            <datalist id="destination-list-1">
              ${dataListMarkup}
             </datalist>
          </div>

           <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">
                From
            </label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${getDateTime(startEventTime)}">
             &mdash;
            <label class="visually-hidden" for="event-end-time-1">
                To
              </label>
              <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${getDateTime(endEventTime)}">
            </div>

            <div class="event__field-group  event__field-group--price">
              <label class="event__label" for="event-price-1">
                <span class="visually-hidden">Price</span>
                &euro;
              </label>
              <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="${price}">
            </div>

            <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
            <button class="event__reset-btn" type="reset">Delete</button>

          ${notNewItemElementMarkup}

          </header>

          <section class="event__details">
            <section class="event__section  event__section--offers">
              <h3 class="event__section-title  event__section-title--offers">Offers</h3>

              <div class="event__available-offers">
              ${offersMarkup}
              </div>
            </section>
            ${descriptionMarup}
          </section>
        </form>
        </li>`
  );
};

const parseFormData = (formData) => {
  return {
    eventType: formData.getAll(`event-type`)[0],
    destination: formData.get(`event-destination`),
    price: formData.get(`event-price`),
    startEventTime: new Date(getCurrentDateFromValue(formData.get(`event-start-time`))),
    endEventTime: new Date(getCurrentDateFromValue(formData.get(`event-end-time`))),
  };
};

const checkDestinationValue = (value, component) => {
  if (DESTINATIONS.indexOf(value) !== -1) {
    component.setCustomValidity(``);
    return true;
  }
  component.setCustomValidity(`Select destination from data-list`);
  return false;
};


export default class TripEditComponent extends AbstractSmartComponent {
  constructor(item) {
    super();

    this._item = item;
    this._submitCb = null;

    this._flatpickr = null;
    this._applyFlatpickr();

  }

  getTemplate() {
    return createTripEditTemplate(this._item);
  }

  setFavoriteButtonClickHandler(cb) {
    const setFavoriteButton = this.getElement().querySelector(`.event__favorite-checkbox`);
    if (setFavoriteButton) {
      setFavoriteButton.addEventListener(`change`, (evt) => {
        evt.preventDefault();
        cb();
      });
    }

  }

  rerender() {
    super.rerender();

    this._applyFlatpickr();
  }

  getData() {
    const form = this.getElement().querySelector(`.event--edit`);
    const formData = new FormData(form);
    const offers = [];
    this.getElement().querySelectorAll(`.event__offer-checkbox`).forEach((checbox) => {
      const offerName = checbox.value;
      offers.push({
        name: offerName,
        price: OFFERS_MAP[offerName].price,
        description: OFFERS_MAP[offerName].description,
        checked: checbox.checked
      });
    });
    const data = parseFormData(formData);
    data.offers = offers;

    return data;
  }

  setCheckValueHandler() {

    const component = this.getElement();
    const destination = component.querySelector(`#event-destination-1`);

    component.addEventListener(`click`, () => {
      checkDestinationValue(destination.value, destination);
    }
    );
  }

  setSubmitHandler(cb) {
    this.getElement().addEventListener(`submit`, cb);

    this._submitCb = cb;
  }

  setDeleteHandler(cb) {
    const deleteButton = this.getElement().querySelector(`.event__reset-btn`);

    deleteButton.addEventListener(`click`, cb);
  }

  setOnChangeTransferHandler() {
    this.getElement().addEventListener(`change`, (evt) => {
      switch (evt.target.name) {
        case `event-type`:
          if (evt.target.value === `on`) {
            return;
          }
          this._item.eventType = evt.target.value;
          this.rerender();
          break;
        case `event-destination`:
          if (checkDestinationValue(evt.target.value, evt.target)) {
            this._item.destinationName = evt.target.value;
            this.rerender();
          }

          break;
        case `event-start-time`:
          break;
        case `event-price`:
          this._item.price = evt.target.value;
          this.rerender();
          break;
      }


      // if (evt.target.name === `event-type`) {
      //   if (evt.target.value === `on`) {
      //     return;
      //   }
      //   this._item.eventType = evt.target.value;
      //   this.rerender();
      // } else if (evt.target.name === `event-destination`) {
      //   this._item.destination = evt.target.value;
      //   this.rerender();
      // }
    });
  }

  _applyFlatpickr() {
    if (this._flatpickr) {
      this._flatpickr.destroy();
      this._flatpickr = null;
    }

    const dateElements = this.getElement().querySelectorAll(`.event__input--time`);

    dateElements.forEach((dateElement) => {
      const typeEventDate = dateElement.name.split(`-`)[1] + `EventTime`;
      this._flatpickr = flatpickr(dateElement, {
        allowInput: true,
        defaultDate: this._item[typeEventDate],
        enableTime: true,
        dateFormat: `d/m/y H:i`
      });
    });
  }

  recoveryListeners() {
    this.setSubmitHandler(this._submitCb);
    this.setOnChangeTransferHandler();
  }

  reset() {
    this.rerender();
  }
}
