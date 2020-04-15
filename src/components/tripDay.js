import {MONTH_NAMES} from "../const.js";
import {createElement} from "../utils.js";


/**
 * @param {array} day - массив точек маршрута для текущего дня
 * @param {number} dayIndex - порядковый номер дня путешествия
 * @return {string} - возращает разметку для 1 дня птешествия;
 */

const createTripDayTemplate = (day, dayIndex) => {
  const currentDate = day[0];
  const shortDate = currentDate
    .split(`-`)
    .slice(1)
    .map((element, i) => {
      element = i === 0 ? MONTH_NAMES[Number(element - 1)] : element;
      return element;
    })
    .join(` `);

  return (
    `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${dayIndex}</span>
        <time class="day__date" datetime="${currentDate}">${shortDate}</time>
      </div>
      <ul class="trip-events__list">

      </ul>
    </li>`
  );
};


export default class TripDayComponent {
  constructor(day, dayIndex) {
    this._day = day;
    this._element = null;
    this._index = dayIndex;
  }

  getTemplate() {
    return createTripDayTemplate(this._day, this._index);
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

