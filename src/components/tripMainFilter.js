import {createElement, capitalize} from "../utils/common.js";

const craeteMainFilterMarkup = (filter) => {
  const isFilterAktive = () => filter.isActive ? `checked` : ``;
  return (
    `<div class="trip-filters__filter">
      <input id="filter-${filter.name}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filter.name}" ${isFilterAktive()}>
      <label class="trip-filters__filter-label" for="filter-${filter.name}">${capitalize(filter.name)}</label>
   </div>`
  );
};

export const createTripMainFilterTemlate = (filters) => {
  const mainFiltersMarkup = filters.map((filter) => craeteMainFilterMarkup(filter)).join(``);
  return (
    `<form class="trip-filters" action="#" method="get">
      ${mainFiltersMarkup}
      <button class="visually-hidden" type="submit">Accept filter</button>
     </form>`
  );
};

export default class TripMainFilterComponent {
  constructor(filters) {
    this._filters = filters;
    this._element = null;
  }

  getTemplate() {
    return createTripMainFilterTemlate(this._filters);
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
