import AbstractSmartComponent from "./abstract-smart-component.js";
import {capitalize, getDateTime, getCurrentDateFromValue} from "../utils/common.js";
import {EVENT_TYPES_TRANSPORT, EVENT_TYPES_ACTIVITY, FormState} from "../const.js";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

const DefaultButtonMap = {
  deleteButtonText: `Delete`,
  saveButtonText: `Save`,
  isButtonAble: true,
};

const FormChangeMap = {
  TYPE: `event-type`,
  DESTINATION: `event-destination`,
  START: `event-start-time`,
  END: `event-end-time`,
  FAVORITE: `event-favorite`,
};


const createOffersMarkup = (avaiblableOffers, offers) => {
  const offersMarkup = avaiblableOffers.map((offer) => createOfferMarkup(offer, offers)).join(`\n`);
  return (
    `<section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
      ${offersMarkup}
      </div>
    </section>`
  );
};

const createOfferMarkup = (offer, currentOffers) => {
  const isOfferChecked = () => currentOffers.some((currentOffer) => currentOffer.title === offer.title) ? `checked` : ``;
  return (
    `
        <div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.title}" type="checkbox" name="event-offer" value="${offer.title}" ${isOfferChecked()}>
          <label class="event__offer-label" for="event-offer-${offer.title}">
          <span class="event__offer-title">${offer.title}</span>
          &plus;
        &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
        </label>
        </div>
 `
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

const createTripEditTemplate = ({id, eventType, destination, price, startEventTime, endEventTime, offers, isFavorite}, OffersMap, DestinationMap, _eexternalButtonData) => {
  const notNewItemElementMarkup = (id) ? createNotNewItemElementMarkup(isFavorite) : ` `;
  const avaiblableOffers = OffersMap[eventType];
  const offersMarkup = avaiblableOffers.length > 0 ? createOffersMarkup(avaiblableOffers, offers) : ``;
  const descriptionMarup = destination === `` ? ` ` : createDestinationMarkup(destination);
  const dataListMarkup = Object.keys(DestinationMap).map((destinationForData) => createDataListMarkup(destinationForData)).join(`\n`);
  const eventTransferTypesMarkup = EVENT_TYPES_TRANSPORT.map((type) => createEventTypesMatkup(type, eventType)).join(`\n`);
  const eventActivityTypesMarkup = EVENT_TYPES_ACTIVITY.map((type) => createEventTypesMatkup(type, eventType)).join(`\n`);
  const isEventTypeTransport = EVENT_TYPES_TRANSPORT.indexOf(eventType) > -1;
  const isButtonAbleMarkup = _eexternalButtonData.isButtonAble ? `` : `disabled`;


  return (
    `<form class="trip-events__item event  event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1" >
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
              ${capitalize(eventType)} ${(isEventTypeTransport) ? `to` : `in`}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination === `` ? `` : destination.name}" list="destination-list-1">
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
            <button class="event__save-btn  btn  btn--blue" type="submit" ${isButtonAbleMarkup}>${_eexternalButtonData.saveButtonText}</button>
            <button class="event__reset-btn" type="reset" ${isButtonAbleMarkup}>${id ? _eexternalButtonData.deleteButtonText : `Cancel`}</button>
            ${notNewItemElementMarkup}
          </header>
          <section class="event__details">
            ${offersMarkup}
            ${descriptionMarup}
          </section>
        </form>
        </li>`
  );
};

const checkDestinationValue = (value, component, DestinationMap) => {
  if (Object.keys(DestinationMap).indexOf(value) !== -1) {
    component.setCustomValidity(``);
    return true;
  }
  component.setCustomValidity(`Select destination from data-list`);
  return false;
};

const checkDateValue = (start, end, component) => {
  if (end >= start) {
    return true;
  }
  component.setCustomValidity(`Travel end date cannot be less than the start date`);
  return false;
};


export default class TripEdit extends AbstractSmartComponent {
  constructor(item, OfferMap, DestinationMap) {
    super();

    this._item = item;
    this._submitCb = null;
    this._deleteCb = null;
    this._rollUpCb = null;
    this._itemCopy = this._item;

    this.offerMap = OfferMap;
    this.destinationMap = DestinationMap;
    this._externalButton = DefaultButtonMap;

    this._flatpickr = null;
    this._applyflatpickr();
    this._selectedStartTime = this._item.startEventTime;
    this._selectedEndTime = this._item.endEventTime;

    this.rerender = this.rerender.bind(this);
  }

  getTemplate() {
    return createTripEditTemplate(this._item, this.offerMap, this.destinationMap, this._externalButton);
  }

  getFormData() {
    const form = this.getElement();
    const formData = new FormData(form);
    return formData;
  }

  shake(timeout) {
    this.getElement().style.animation = `shake ${timeout / 1000}s`;


    setTimeout(() => {
      this.getElement().style.animation = ``;

      this.setNewButtonData({
        saveButtonText: `Save`,
        deleteButtonText: `Delete`,
        isButtonAble: true,
      });
    }, timeout);
  }

  setNewButtonData(newButtonData) {
    this._externalButton = Object.assign({}, DefaultButtonMap, newButtonData);
    this.rerender();
  }

  rerender() {
    super.rerender();

    this._applyflatpickr();
  }

  resetChanges() {
    const isItemFavorite = this._item.isFavorite;
    this._item = Object.assign(this._item, this._itemCopy, {
      isFavorite: isItemFavorite,
    });
    this.reset();
  }

  recoveryListeners() {
    this.setFormSubmitHandler(this._submitCb);
    this.setDeleteClickHandler(this._deleteCb);
    this.setFormChangeHandler();
    this.setRollUpClickHandler(this._rollUpCb);
    this.setCheckValueHandler();
  }

  reset() {
    this.rerender();
  }

  changeFormState(state) {
    if (state === FormState.DISABLED) {
      this.getElement().querySelectorAll(`.event__input, .event__type-toggle, .event__offer-checkbox, .event__favorite-checkbox`)
      .forEach((elem) => {
        elem.setAttribute(FormState.DISABLED, FormState.DISABLED);
      });
    }
  }

  _applyflatpickr() {
    if (this._flatpickr) {
      this._flatpickr.destroy();
      this._flatpickr = null;
    }

    const dateElements = this.getElement().querySelectorAll(`.event__input--time`);

    dateElements.forEach((dateElement) => {
      const typeDate = dateElement.name.split(`-`)[1];
      const typeEventDate = `${typeDate}EventTime`;
      this._flatpickr = flatpickr(dateElement, {
        allowInput: true,
        defaultDate: this._item[typeEventDate],
        enableTime: true,
        dateFormat: `d/m/y H:i`,
      });
    });
  }

  _checkDestinationValue() {
    const destinationComponent = this.getElement().querySelector(`#event-destination-1`);
    const result = checkDestinationValue(destinationComponent.value, destinationComponent, this.destinationMap);
    return result;
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

  setCheckValueHandler() {
    const endTime = this.getElement().querySelector(`#event-end-time-1`);

    this.getElement().addEventListener(`click`, () => {
      this._checkDestinationValue();
      checkDateValue(this._selectedStartTime, this._selectedEndTime, endTime);
    });
  }


  setFormSubmitHandler(cb) {
    this.getElement().addEventListener(`submit`, cb);

    this._submitCb = cb;
  }

  setDeleteClickHandler(cb) {
    const deleteButton = this.getElement().querySelector(`.event__reset-btn`);

    deleteButton.addEventListener(`click`, cb);
    this._deleteCb = cb;
  }

  setFormChangeHandler() {
    this.getElement().addEventListener(`change`, (evt) => {
      this._itemCopy = Object.assign({}, this._item);
      switch (evt.target.name) {
        case FormChangeMap.TYPE:
          if (evt.target.value === `on`) {
            return;
          }
          this._item.eventType = evt.target.value;
          this.rerender();
          break;

        case FormChangeMap.DESTINATION:
          if (checkDestinationValue(evt.target.value, evt.target, this.destinationMap)) {
            this._item.destination = this.destinationMap[evt.target.value];
            this.rerender();
          }
          break;

        case FormChangeMap.START:
          if (this._checkDestinationValue()) {
            this._selectedStartTime = new Date(getCurrentDateFromValue(evt.target.value));
          }
          break;

        case FormChangeMap.END:
          if (this._checkDestinationValue()) {
            this._selectedEndTime = new Date(getCurrentDateFromValue(evt.target.value));
            evt.target.setCustomValidity(``);
          }
          break;

        case FormChangeMap.FAVORITE:
          this._item.isFavorite = evt.target.checked;
          break;
      }
    });
  }

  setRollUpClickHandler(cb) {
    const rollUpButton = this.getElement().querySelector(`.event__rollup-btn`);
    this._rollUpCb = cb;

    if (rollUpButton) {
      rollUpButton.addEventListener(`click`, () => {
        this.resetChanges();
        cb();
      });
    }
  }
}
