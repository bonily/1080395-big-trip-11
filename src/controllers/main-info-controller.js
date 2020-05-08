import {render, RenderPosition, remove} from "../utils/render.js";
import TripMainInfoComponent from "../components/trip-main-info.js";

export default class MainInfoController {
  constructor(container, itemsModel) {
    this._container = container;
    this._itemsModel = itemsModel;

    this._mainInfoComponent = null;
    this.rerender = this.rerender.bind(this);
  }

  render() {
    const container = this._container;
    const allItems = this._itemsModel.getItems();

    this._mainInfoComponent = new TripMainInfoComponent(allItems);
    this._itemsModel.setDataChangeHandler(this.rerender);

    render(container, this._mainInfoComponent, RenderPosition.AFTERBEGIN);

  }

  rerender() {
    remove(this._mainInfoComponent);
    this.render();
  }
}
