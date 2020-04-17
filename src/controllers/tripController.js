import TripDayComponent from "../components/tripDay";
import TripItemComponent from "../components/tripItem.js";
import TripDaysComponent from "../components/tripDays.js";
import TripEditComponent from "../components/tripEdit.js";
import TripNoItemComponent from "../components/noItem.js";
import {render, RenderPosition, replace} from "../utils/render.js";


const renderItem = (itemListElement, item) => {

  const onEscKeyDown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      replaceEditToItem();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  const itemComponent = new TripItemComponent(item);
  const itemEditComponent = new TripEditComponent(item);

  const replaceItemToEdit = () => replace(itemComponent, itemEditComponent);

  const replaceEditToItem = () => replace(itemEditComponent, itemComponent);

  itemComponent.setEditButtonHadler((evt) => {
    evt.preventDefault();
    replaceItemToEdit();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  itemEditComponent.setSubmitHandler((evt) => {
    evt.preventDefault();
    replaceEditToItem();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  render(itemListElement, itemComponent, RenderPosition.BEFOREEND);
};


const renderDayItemsList = (tripComponent, day, index) => {
  const dayContainer = new TripDayComponent(day, index);
  const dayItems = day[1];

  render(tripComponent, dayContainer, RenderPosition.BEFOREEND);

  const itemListElement = dayContainer.getElement().querySelector(`.trip-events__list`);

  dayItems.forEach((dayItem) => renderItem(itemListElement, dayItem));
};


export default class TripController {
  constructor(container) {
    this._container = container;

    this._tripNoItemComponent = new TripNoItemComponent();
    this._tripDaysComponent = new TripDaysComponent();
  }

  render(items) {
    if (items.length === 0) {
      render(this._container, this._tripNoItemComponent, RenderPosition.BEFOREEND);
      return;
    }
    render(this._container, this._tripDaysComponent, RenderPosition.BEFOREEND);

    const tripDaysList = this._tripDaysComponent.getElement();

    items.forEach((item, i) => renderDayItemsList(tripDaysList, item, i + 1));
  }
}
