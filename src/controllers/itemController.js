import TripEditComponent from "../components/tripEdit.js";
import TripItemComponent from "../components/tripItem.js";
import {render, RenderPosition, replace, remove} from "../utils/render.js";
import {OFFERS} from "../const.js";


const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`,
  NEW: `new`
};

export const EmptyTask = {
  id: 0,
  eventType: `flight`,
  destination: ``,
  price: 0,
  startEventTime: new Date(),
  endEventTime: new Date(),
  offers: OFFERS.map((offer) => {
    offer.checked = false;
    return offer;
  })
};

export default class ItemController {
  constructor(container, onDataChange, onViewChange, onDeleteItem, onNewItem) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._onDeleteItem = onDeleteItem;
    this._onNewItem = onNewItem;
    this.isItemControllerActive = false;

    this._itemComponent = null;
    this._itemEditComponent = null;
    this._mode = Mode.DEFAULT;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(item, mode) {

    // const oldItemComponent = this._itemComponent;
    const oldItemEditComponent = this._itemEditComponent;

    this._itemComponent = new TripItemComponent(item);
    this._itemEditComponent = new TripEditComponent(item);

    this._itemEditComponent.setFavoriteButtonClickHandler(() => {
      this._onDataChange(this, item, Object.assign({}, item, {
        isFavorite: !item.isFavorite,
      }));
    });

    this._itemComponent.setEditButtonHadler((evt) => {
      evt.preventDefault();
      this.isItemControllerActive = true;
      this._replaceItemToEdit();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._itemEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      const data = this._itemEditComponent.getData();
      if (mode === `new`) {
        this._onNewItem(data);
        return;
      }
      this.isItemControllerActive = false;
      this._onDataChange(this, item, data);
      this._replaceEditToItem();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    });

    this._itemEditComponent.setOnChangeTransferHandler();

    this._itemEditComponent.setDeleteHandler((evt) => {
      this._onDeleteItem(item.id);
      evt.preventDefault();
    });

    if (mode === `new`) {
      render(this._container, this._itemEditComponent, RenderPosition.AFTERBEGIN);
    }


    if (oldItemEditComponent) {
      // replace(oldItemComponent, this._itemComponent);
      replace(this._itemEditComponent, oldItemEditComponent);
    } else {
      render(this._container, this._itemComponent, RenderPosition.BEFOREEND);
    }
  }

  destroy() {
    remove(this._itemEditComponent);
    remove(this._itemComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
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
