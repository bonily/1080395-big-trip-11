import {MONTH_NAMES} from "../const.js";
import {getCurrentDateValue, getSimpleDate, createElement} from "../utils.js";

const createTripDurationMarkup = (dates) => {
  const lastDateIndex = dates.length - 1;
  const startDate = `${MONTH_NAMES[dates[0].getMonth()]} ${getCurrentDateValue(dates[0].getDate())}`;
  const endDate = () => dates[lastDateIndex].getMonth() === dates[0].getMonth() ? getCurrentDateValue(dates[lastDateIndex].getDate()) : `${MONTH_NAMES[dates[lastDateIndex].getMonth()]} ${getCurrentDateValue(dates[lastDateIndex].getDate())}`;
  return (
    `<p class="trip-info__dates">${startDate} &mdash;&nbsp;${endDate()}</p>`
  );

};


export const createTripMainInfoTemplate = (items) => {
  const tripCost = items.map((item) => item.price).reduce((acc, price) => acc + price);
  const tripDestinationInfo = items.map((item) => item.destination).join(` - `);
  const tripDates = items
                    .map((item) => item.startEventTime)
                    .sort((a, b) => {
                      if (getSimpleDate(a) < getSimpleDate(b)) {
                        return -1;
                      }
                      if (getSimpleDate(a) > getSimpleDate(b)) {
                        return 1;
                      }
                      return 0;
                    });
  const tripDurationMarkup = createTripDurationMarkup(tripDates);

  return (
    `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${tripDestinationInfo}</h1>

      ${tripDurationMarkup}
    </div>

    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${tripCost}</span>
    </p>
  </section>`
  );
};

export default class TripMainComponent {
  constructor(items) {
    this._items = items;

    this._element = null;
  }

  getTemplate() {
    return createTripMainInfoTemplate(this._items);
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

