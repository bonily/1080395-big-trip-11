import {MONTH_NAMES} from "../const.js";
import AbstractComponent from "./abstractComponent.js";


/**
 * @param {array} day - массив точек маршрута для текущего дня
 * @param {number} dayIndex - порядковый номер дня путешествия
 * @return {string} - возращает разметку для 1 дня путешествия;
 */

const createTripDayTemplate = (day, dayIndex) => {
  if (day) {
    const currentDate = day[0];
    const shortDate = currentDate
       .split(`-`)
       .slice(1) // Обрезает год, оставляя только месяц-день (согласно макету)
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
      </li>`);
  } else {
    return (
      `<li class="trip-days__item  day">
        <div class="day__info">
        </div>
      </li>`);
  }
};


export default class TripDayComponent extends AbstractComponent {
  constructor(day, dayIndex) {
    super();

    this._day = day;

    this._index = dayIndex;
  }

  getTemplate() {
    return createTripDayTemplate(this._day, this._index);
  }
}

