const craeteMainFilterMarkup = (filter) => {
  const isFilterAktive = () => filter.isActive ? `checked` : ``;
  return (
    `<div class="trip-filters__filter">
      <input id="filter-${filter.name}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filter.name}" ${isFilterAktive()}>
      <label class="trip-filters__filter-label" for="filter-${filter.name}">${filter.name.charAt(0).toUpperCase() + filter.name.slice(1)}</label>
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
