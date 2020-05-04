import TripEditComponent from "../components/tripEdit.js";
import TripItemComponent from "../components/tripItem.js";
import {render, RenderPosition, replace, remove} from "../utils/render.js";
import Item from "../models/item.js";
import momentDurationFormatSetup from "moment-duration-format";


const getCurrentDateFromValue = (value) => {
  const dateValue = value.split(/[.,\/ - :]/);
  const dateString = `20` + dateValue[2] + `-` + dateValue[1] + `-` + dateValue[0] + `T` + dateValue[3] + `:` + dateValue[4];
  return dateString;
};

const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`,
  NEW: `new`
};

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
  });
};

export default class ItemController {
  constructor(container, onDataChange, onViewChange, onDeleteItem, onNewItem, offerMap, destinationMap) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._onDeleteItem = onDeleteItem;
    this._onNewItem = onNewItem;
    this.isItemControllerActive = false;
    this.offerMap = offerMap;
    this.destinationMap = destinationMap;

    this._itemComponent = null;
    this._itemEditComponent = null;
    this._mode = Mode.DEFAULT;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(item, mode) {
    const OfferMap = this.offerMap;
    const DestinationMap = this.destinationMap;


    const oldItemComponent = this._itemComponent;
    const oldItemEditComponent = this._itemEditComponent;

    this._itemComponent = new TripItemComponent(item);
    this._itemEditComponent = new TripEditComponent(item, OfferMap, DestinationMap);

    this._itemEditComponent.setFavoriteButtonClickHandler(() => {
      const data = Item.clone(item);
      data.isFavorite = !data.isFavorite;
      this._onDataChange(this, item, data);
    });

    this._itemComponent.setEditButtonHadler((evt) => {
      evt.preventDefault();
      this.isItemControllerActive = true;
      this._replaceItemToEdit();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._itemEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();

      const newItem = parseFormData(this._itemEditComponent.getData(), OfferMap, DestinationMap);
      newItem.id = item.id;
      newItem.isFavorite = item.isFavorite;
      this._itemEditComponent.setData({
        saveButtonText: `Saving...`,
      }, `disable`);


      if (mode === Mode.NEW) {

        this._onNewItem(newItem, this);
        return;
      }

      this.isItemControllerActive = false;

      this._onDataChange(this, item, newItem);

    });

    this._itemEditComponent.setOnChangeTransferHandler();
    this._itemEditComponent.setCheckValueHandler();

    this._itemEditComponent.setDeleteHandler((evt) => {
      evt.preventDefault();

      if (mode === Mode.NEW) {
        this.setDefaultView();
        this._onViewChange();
        return;
      }

      this._itemEditComponent.setData({
        deleteButtonText: `Deleting...`,
      }, `disable`);

      this._onDeleteItem(item.id, this);
    });


    switch (mode) {
      case Mode.DEFAULT:
        if (oldItemEditComponent) {
        //   //replace(this._itemComponent, oldItemComponent);
        replace(this._itemEditComponent, oldItemEditComponent);
        this._replaceEditToItem();
         } else {
          render(this._container, this._itemComponent, RenderPosition.BEFOREEND);
        }
        break;
      case Mode.NEW:
        if (oldItemEditComponent && oldItemComponent) {
          remove(oldItemComponent);
          remove(oldItemEditComponent);
        }
        this._mode = Mode.NEW;
        document.addEventListener(`keydown`, this._onEscKeyDown);
        render(this._container, this._itemEditComponent, RenderPosition.AFTERBEGIN);
        break;
    }


    // if (oldItemEditComponent) {
    //   // replace(oldItemComponent, this._itemComponent);
    //   replace(this._itemEditComponent, oldItemEditComponent);
    // } else {
    //   render(this._container, this._itemComponent, RenderPosition.BEFOREEND);
    // }
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
      if (this._mode === Mode.NEW) {
        this.destroy();
        this._onViewChange();
      }
      this._replaceEditToItem();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }

  setDefaultView() {
    if (this._mode === Mode.NEW) {
      this.destroy();
    } else if (this._mode === Mode.EDIT) {
      this._replaceEditToItem();
    }
  }

  shake() {
    this._itemEditComponent.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    this._itemComponent.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;

    setTimeout(() => {
      this._itemEditComponent.getElement().style.animation = ``;
      this._itemComponent.getElement().style.animation = ``;

      this._itemEditComponent.setData({
        saveButtonText: `Save`,
        deleteButtonText: `Delete`,
      }, `able`);
    }, SHAKE_ANIMATION_TIMEOUT);
  }

}
