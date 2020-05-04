import AbstractCompinent from "./abstractComponent.js";
import AbstractSmartComponent from "./abstractSmartComponent.js";

import {capitalize} from "../utils/common.js";


const createFlterMarkup = (filter) => {
  const isFilterAktive = () => filter.isActive ? `checked` : ``;
  return (
    `<div class="trip-sort__item  trip-sort__item--${filter.name}">
      <input id="sort-${filter.name}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${filter.name}" ${isFilterAktive()}>
      <label class="trip-sort__btn" for="sort-${filter.name}" data="${filter.name}">${capitalize(filter.name)}</label>
    </div>`
  );
};


const createListSortTemplate = (filters) => {
  const filtersMarkup = filters.map((filter) => createFlterMarkup(filter)).join(`\n`);
  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
        <span class="trip-sort__item  trip-sort__item--day">Day</span>
        ${filtersMarkup}
        
        <span class="trip-sort__item  trip-sort__item--offers">Offers</span>
      </form>`
  );
};

export default class SortListComponent extends AbstractSmartComponent {
  constructor(filters) {
    super();

    this._filters = filters;
    this._activeFilter = `sort-event`;
    this._typeChangeCb = null;
  }

  getTemplate() {
    return createListSortTemplate(this._filters);
  }

  setSortTypeChangeHandler(cb) {
    this.getElement().addEventListener(`change`, (evt) => {
      evt.preventDefault();

      this._activeFilter = evt.target.value;
      const sortType = evt.target.value.split(`-`)[1];
      
      const daySortComponent = this.getElement().querySelector(`.trip-sort__item--day`);

      daySortComponent.innerHTML = sortType !== `event` ? `` : `Day`;
      this._typeChangeCb = cb;

      cb(sortType);

    });
  }

  recoveryListeners() {

  }
}

