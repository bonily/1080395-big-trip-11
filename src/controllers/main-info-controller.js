import {render, RenderPosition, remove} from "../utils/render.js";
import TripMainInfo from "../components/trip-main-info.js";

export default class MainInfoController {
  constructor(container, itemsModel) {
    this._container = container;
    this._itemsModel = itemsModel;

    this._mainInfoComponent = null;
    this.rerender = this.rerender.bind(this);
  }

  render() {
    const container = this._container;


    this._mainInfoComponent = new TripMainInfo(this._itemsModel.getItemsAll());
    this._itemsModel.onDataChange(this.rerender);

    render(container, this._mainInfoComponent, RenderPosition.AFTERBEGIN);

  }

  rerender() {
    remove(this._mainInfoComponent);
    this.render();
  }
}
