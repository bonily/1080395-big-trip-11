import {createElement, capitalize} from "../utils/common.js";


const craeteMainFilterMarkup = ({name, count}, activeFilter) => {
  const isFilterAktive = () => name === activeFilter ? `checked` : ``;
  const isFilterAble = count > 0;
  return (
    `<div class="trip-filters__filter">
      <input id="filter-${name}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${name}" ${isFilterAktive()} ${isFilterAble ? `` : `disabled`}>
      <label class="trip-filters__filter-label ${isFilterAble ? `` : `trip-filters__filter-label--disabled`}" for="filter-${name}">${capitalize(name)}</label>
   </div>`
  );
};

const createTripMainFilterTemlate = (filters, activeFilter) => {
  const mainFiltersMarkup = filters.map((filter) => craeteMainFilterMarkup(filter, activeFilter)).join(``);
  return (
    `<form class="trip-filters" action="#" method="get">
      ${mainFiltersMarkup}
      <button class="visually-hidden" type="submit">Accept filter</button>
     </form>`
  );
};


export default class TripFilterComponent {
  constructor(filters, activeFilter) {
    this._filters = filters;
    this._element = null;
    this._activeFilter = activeFilter;
  }

  getTemplate() {
    return createTripMainFilterTemlate(this._filters, this._activeFilter);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  setFilterTypeChangeHandler(cb) {
    this.getElement().addEventListener(`change`, (evt) => {
      evt.preventDefault();
      cb(evt.target.value);
    });
  }

  removeElement() {
    this._element = null;
  }


}
