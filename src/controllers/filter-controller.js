import {getItemsByFilter} from "../utils/filter.js";
import {MAIN_FILTERS} from "../const.js";
import {render, RenderPosition, remove} from "../utils/render.js";
import TripFilterComponent from "../components/trip-filter.js";


export default class FilterController {
  constructor(container, itemsModel, tripMainControlComponent) {
    this._container = container;
    this._itemsModel = itemsModel;
    this._tripMainControlComponent = tripMainControlComponent;

    this._filterComponent = null;
    this.activeFilter = MAIN_FILTERS.ALL;

    this._onFilterChange = this._onFilterChange.bind(this);
    this.onFilterChange = this._onFilterChange.bind(this);
    this.rerender = this.rerender.bind(this);
  }

  render() {
    const container = this._container;
    const allItems = this._itemsModel.getItemsAll();
    const filters = Object.values(MAIN_FILTERS).map((filter) => {
      return {
        name: filter,
        count: getItemsByFilter(allItems, filter).length,
      };
    });

    this._filterComponent = new TripFilterComponent(filters, this.activeFilter);

    render(container, this._filterComponent, RenderPosition.BEFOREEND);

    this._filterComponent.setFilterTypeChangeHandler(this._onFilterChange);
    this._itemsModel.onDataChange(this.rerender);
  }

  _onFilterChange(filter) {
    this._tripMainControlComponent.rerender();
    this._itemsModel.setFilter(filter);
    this.activeFilter = filter;
    this.rerender();
  }

  onFilterChange(filter) {
    this._onFilterChange(filter);
  }

  rerender() {
    remove(this._filterComponent);
    this.render();
  }
}
