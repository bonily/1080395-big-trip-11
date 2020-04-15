import {createElement} from "../utils.js";

/**
 * @param {Object} trip  - объект с группированными по датам точкам путешествия, каждая уникальная дата = свойство
 * @return {string} - возвращает итоговую разметку раздела информации по маршруту
 */
const createTripDaysTemplate = () => {
  return (
    `<ul class="trip-days">
      
    </ul>`
  );
};


export default class TripDaysComponent {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createTripDaysTemplate();
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
