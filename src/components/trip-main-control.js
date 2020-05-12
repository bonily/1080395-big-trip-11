import {createElement} from "../utils/common.js";

const ControlMap = {
  TABLE: `Table`,
  STATS: `Stats`,
};

const createTripMainControlTemplate = () => {
  return (
    `<div>
      <h2 class="visually-hidden trip-controls__menu">Switch trip view</h2>
        <nav class="trip-controls__trip-tabs  trip-tabs">
        <a class="trip-tabs__btn trip-tabs__btn--table trip-tabs__btn--active" href="#">Table</a>
        <a class="trip-tabs__btn trip-tabs__btn--stat" href="#">Stats</a>
      </nav>
    </div>`
  );
};


export default class TripMainControl {
  constructor() {
    this._element = null;
    this._currentActiveControl = null;

    this._onControlClickCb = null;
    this._tableControl = null;
    this._statControl = null;

    this.rerender = this.rerender.bind(this);
  }

  getTemplate() {
    return createTripMainControlTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  rerender() {
    if (this._currentActiveControl === this._statControl) {
      this._onControlClickCb(ControlMap.TABLE);
      this._changeActiveControl(ControlMap.TABLE);
    }
  }

  removeElement() {
    this._element = null;
  }

  _changeActiveControl(type) {
    switch (type) {
      case ControlMap.TABLE:
        this._statControl.classList.remove(`trip-tabs__btn--active`);
        this._tableControl.classList.add(`trip-tabs__btn--active`);
        this._currentActiveControl = this._tableControl;
        break;
      case ControlMap.STATS:
        this._tableControl.classList.remove(`trip-tabs__btn--active`);
        this._statControl.classList.add(`trip-tabs__btn--active`);
        this._currentActiveControl = this._statControl;
    }
  }

  setOnControlClickHandler(cb) {
    this._tableControl = this.getElement().querySelector(`.trip-tabs__btn--table`);
    this._statControl = this.getElement().querySelector(`.trip-tabs__btn--stat`);

    this.getElement().addEventListener(`click`, (evt) => {
      const activeControlName = evt.target.text;
      this._changeActiveControl(activeControlName);
      cb(activeControlName);
      this._onControlClickCb = cb;

    });
  }
}
