import AbstractCompinent from "./abstrackComponent.js";

const createFlterMarkup = (filter) => {
  const isFilterAktive = () => filter.isActive ? `checked` : ``;
  return (
    `<div class="trip-sort__item  trip-sort__item--${filter.name}">
      <input id="sort-event" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${filter.name}" ${isFilterAktive()}>
      <label class="trip-sort__btn" for="sort-event">${filter.name.charAt(0).toUpperCase() + filter.name.slice(1)}</label>
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

export default class SortListComponent extends AbstractCompinent {
  constructor(filters) {
    super();

    this._filters = filters;
  }

  getTemplate() {
    return createListSortTemplate(this._filters);
  }
}
