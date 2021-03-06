
import Item from "../models/item.js";
import {FormState, ItemRenderModeMap} from "../const.js";
import {getCurrentDateFromValue} from "../utils/common.js";
import {render, RenderPosition, replace, remove} from "../utils/render.js";
import TripDayItems from "../components/trip-day-items.js";
import TripEdit from "../components/trip-edit.js";
import TripItem from "../components/trip-item.js";


const SHAKE_ANIMATION_TIMEOUT = 600;

export const EmptyTask = {
  eventType: `flight`,
  destination: ``,
  price: 0,
  startEventTime: new Date(),
  endEventTime: new Date(),
  offers: [],
  isFavorite: false,
};

const parseFormData = (formData, OfferMap, DestinationMap) => {
  const eventType = formData.getAll(`event-type`)[0];
  const TypeOffers = OfferMap[eventType];
  const aviableOffersFromValue = formData.getAll(`event-offer`);
  const aviableOffers = TypeOffers.filter((offer) => aviableOffersFromValue.some((aviableOffer) => offer.title === aviableOffer));
  return new Item({
    "type": eventType,
    "destination": DestinationMap[formData.get(`event-destination`)],
    "base_price": Number(formData.get(`event-price`)),
    "date_from": new Date(getCurrentDateFromValue(formData.get(`event-start-time`))).toJSON(),
    "date_to": new Date(getCurrentDateFromValue(formData.get(`event-end-time`))).toJSON(),
    "offers": aviableOffers,
    "is_favorite": Boolean(formData.get(`event-favorite`)),
  });
};


export default class ItemController {
  constructor(container, onItemChange, onViewChange, onDeleteItem, onNewItem, offerMap, destinationMap) {
    this._container = container;
    this._onItemChange = onItemChange;
    this._onViewChange = onViewChange;
    this._onDeleteItem = onDeleteItem;
    this._onNewItem = onNewItem;
    this.isItemControllerActive = false;
    this.offerMap = offerMap;
    this.destinationMap = destinationMap;
    this._item = null;

    this._itemComponent = null;
    this._itemEditComponent = null;
    this.offerMap = offerMap;
    this.destinationMap = destinationMap;
    this._mode = ItemRenderModeMap.DEFAULT;
    this._replaceEditToItem = this._replaceEditToItem.bind(this);

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(item, mode, spesialPlace) {
    this._item = item;
    this._mode = mode;

    const itemContainer = new TripDayItems();

    const oldItemComponent = this._itemComponent;
    const oldItemEditComponent = this._itemEditComponent;

    this._itemComponent = new TripItem(item);
    this._itemEditComponent = new TripEdit(item, this.offerMap, this.destinationMap);

    this._setItemHandlers();


    switch (mode) {
      case ItemRenderModeMap.DEFAULT:
        if (oldItemEditComponent) {
          replace(this._itemEditComponent, oldItemEditComponent);
          this._replaceEditToItem();
        } else {
          render(this._container, itemContainer, RenderPosition.BEFOREEND);
          render(itemContainer.getElement(), this._itemComponent, RenderPosition.BEFOREEND);
        }
        break;

      case ItemRenderModeMap.NEW:
        if (oldItemEditComponent && oldItemComponent) {
          remove(oldItemComponent);
          remove(oldItemEditComponent);
        }
        this._mode = ItemRenderModeMap.NEW;
        const container = spesialPlace.parentElement;

        render(container, this._itemEditComponent, RenderPosition.BEFOREELEMENT, spesialPlace);
        document.addEventListener(`keydown`, this._onEscKeyDown);
        break;

      case ItemRenderModeMap.FIRST:
        this._mode = ItemRenderModeMap.NEW;
        if (oldItemEditComponent && oldItemComponent) {
          remove(oldItemComponent);
          remove(oldItemEditComponent);
        }
        render(this._container, this._itemEditComponent, RenderPosition.BEFOREEND);
        document.addEventListener(`keydown`, this._onEscKeyDown);
        break;
    }
  }

  destroy() {
    remove(this._itemEditComponent);
    remove(this._itemComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  shake() {
    this._itemEditComponent.shake(SHAKE_ANIMATION_TIMEOUT);
  }

  setDefaultView() {
    if (this._mode === ItemRenderModeMap.NEW) {
      this.destroy();
    } else if (this._mode === ItemRenderModeMap.EDIT) {
      this._replaceEditToItem();
    }
  }


  _setItemHandlers() {
    this._itemEditComponent.setFavoriteButtonClickHandler(() => {
      const newItem = Item.clone(this._item);
      newItem.isFavorite = !newItem.isFavorite;
      this._onItemChange(this, this._item, newItem, `favorite`);
    });

    this._itemComponent.setEditButtonClickHadler((evt) => {
      evt.preventDefault();
      this.isItemControllerActive = true;

      this._replaceItemToEdit();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._itemEditComponent.setFormSubmitHandler((evt) => {
      evt.preventDefault();
      const newItem = parseFormData(this._itemEditComponent.getFormData(), this.offerMap, this.destinationMap);
      newItem.id = this._item.id;
      this._itemEditComponent.setNewButtonData({
        saveButtonText: `Saving...`,
        isButtonAble: false,
      });

      this._itemEditComponent.changeFormState(FormState.DISABLED);

      if (this._mode === ItemRenderModeMap.NEW || this._mode === ItemRenderModeMap.FIRST) {
        this._onNewItem(newItem, this);
        return;
      }

      this.isItemControllerActive = false;

      this._onItemChange(this, this._item, newItem);

    });

    this._itemEditComponent.setDeleteClickHandler((evt) => {
      evt.preventDefault();

      if (this._mode === ItemRenderModeMap.NEW || this._mode === ItemRenderModeMap.FIRST) {
        this.setDefaultView();
        this._onViewChange();
        return;
      }

      this._itemEditComponent.setNewButtonData({
        deleteButtonText: `Deleting...`,
        isButtonAble: false,
      });

      this._itemEditComponent.changeFormState(FormState.DISABLED);

      this._onDeleteItem(this._item.id, this);
    });

    this._itemEditComponent.setFormChangeHandler();
    this._itemEditComponent.setCheckValueHandler();
    this._itemEditComponent.setRollUpClickHandler(this._replaceEditToItem);
  }

  _replaceItemToEdit() {
    this._onViewChange();
    replace(this._itemEditComponent, this._itemComponent);
    this._mode = ItemRenderModeMap.EDIT;
  }

  _replaceEditToItem() {
    replace(this._itemComponent, this._itemEditComponent);
    this._mode = ItemRenderModeMap.DEFAULT;
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      if (this._mode === ItemRenderModeMap.NEW) {
        this.destroy();
        this._onViewChange();
      }

      this._itemEditComponent.resetChanges();
      this._replaceEditToItem();

      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }
}
