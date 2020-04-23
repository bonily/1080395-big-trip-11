import TripEditComponent from "../components/tripEdit.js";
import TripItemComponent from "../components/tripItem.js";
import {render, RenderPosition, replace} from "../utils/render.js";

const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`,
};

export default class ItemController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._itemComponent = null;
    this._itemEditComponent = null;
    this._mode = Mode.DEFAULT;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(item) {

    // const oldItemComponent = this._itemComponent;
    const oldItemEditComponent = this._itemEditComponent;

    this._itemComponent = new TripItemComponent(item);
    this._itemEditComponent = new TripEditComponent(item);

    this._itemEditComponent.setFavoriteButtonClickHandler(() => {
      this._onDataChange(this.render, item, Object.assign({}, item, {
        isFavorite: !item.isFavorite,
      }));
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

    this._itemEditComponent.setOnChangeTransferHandler();


    if (oldItemEditComponent) {
      // replace(oldItemComponent, this._itemComponent);
      replace(this._itemEditComponent, oldItemEditComponent);
    } else {
      render(this._container, this._itemComponent, RenderPosition.BEFOREEND);
    }
  }

  _replaceItemToEdit() {
    this._onViewChange();
    replace(this._itemEditComponent, this._itemComponent);
    this._mode = Mode.EDIT;
  }

  _replaceEditToItem() {
    replace(this._itemComponent, this._itemEditComponent);
    this._mode = Mode.DEFAULT;
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      this._replaceEditToItem();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToItem();
    }
  }
}
