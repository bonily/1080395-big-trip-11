import AbstractCompinent from "./abstractComponent.js";

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


export default class TripDaysComponent extends AbstractCompinent {
  getTemplate() {
    return createTripDaysTemplate();
  }
}
