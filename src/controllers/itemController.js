import TripEditComponent from "../components/tripEdit.js";
import TripItemComponent from "../components/tripItem.js";
import {render, RenderPosition, replace} from "../utils/render.js";


export default class ItemController {
  constructor(container, onDataChange) {
    this._container = container;
    this._onDataChange = onDataChange;

    this._itemComponent = null;
    this._itemEditComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(item) {
    this._itemComponent = new TripItemComponent(item);
    this._itemEditComponent = new TripEditComponent(item);

    this._itemEditComponent.setFavoriteButtonClickHandler(() => {
      this._onDataChange(this, item, Object.assign({}, item, {
        isFavorite: !item.isFavorite,
      }));
      console.log(this);
    });

    this._itemComponent.setEditButtonHadler((evt) => {
      evt.preventDefault();
      this._replaceItemToEdit();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._itemEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      this._replaceEditToItem();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    });

    render(this._container, this._itemComponent, RenderPosition.BEFOREEND);
  }

  _replaceItemToEdit() {
    replace(this._itemEditComponent, this._itemComponent);
  }

  _replaceEditToItem() {
    replace(this._itemComponent, this._itemEditComponent);
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      this._replaceEditToItem();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }
}
