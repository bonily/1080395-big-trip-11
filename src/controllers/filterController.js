import TripMainFilterComponent from "../components/tripMainFilter.js";
import {MAIN_FILTERS} from "../const.js";
import {render, RenderPosition} from "../utils/render.js";

export default class MainFiltersController {
  constructor(container, itemsModel) {
    this._container = container;

    this._itemsModel = itemsModel;
    this._filterComponent = null;
    this._activeFilter = MAIN_FILTERS.ALL;

    this._onDataChange = this._onDataChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    //this._itemsModel.setDataChangeHandler(this._onDataChange);
  }

  render() {
    const container = this._container;

    const filters = Object.values(MAIN_FILTERS).map((filter) => {
      return {
        name: filter,
        isActive: filter === this._activeFilter,
      };
    });

    this._filterComponent = new TripMainFilterComponent(filters);

    render(container, this._filterComponent, RenderPosition.BEFOREEND);
    this._filterComponent.setFilterTypeChangeHandler(this._onFilterChange);
  }

  _onFilterChange(filter) {

    this._itemsModel.setFilter(filter);
    this._activeFilter = filter;
  }

  _onDataChange() {
    this.render();
  }
}
