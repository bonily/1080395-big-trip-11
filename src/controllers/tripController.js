import TripDayComponent from "../components/tripDay";
import TripItemComponent from "../components/tripItem.js";
import TripDaysComponent from "../components/tripDays.js";
import TripEditComponent from "../components/tripEdit.js";
import TripNoItemComponent from "../components/noItem.js";
import {render, RenderPosition, replace} from "../utils/render.js";
import TripItemsListTemplate from "../components/tripItems.js";
import SortListComponent from "../components/listSort.js";
import {SORT_FILTERS} from "../const.js";
import {groupTripItems} from "../utils/common.js";


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


  const replaceItemToEdit = () => {
    replace(itemEditComponent, itemComponent);
  };

  const replaceEditToItem = () => {
    replace(itemComponent, itemEditComponent);
  };

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


const renderDayItemsList = ({tripComponent, day, index, items}) => {
  const dayContainer = new TripDayComponent(day, index);
  console.log(day)

  const dayItems = (day) ? day[1] : items;

  render(tripComponent, dayContainer, RenderPosition.BEFOREEND);

  const itemListElement = new TripItemsListTemplate();

  dayItems.forEach((dayItem) => renderItem(itemListElement.getElement(), dayItem));
  render(dayContainer.getElement(), itemListElement, RenderPosition.BEFOREEND);
};

const gerSortedItems = (items, sortType) => {
  const durationMs = (item) => item.endEventTime.getTime() - item.startEventTime.getTime();
  let sortedItems = [];
  const showingItems = items.slice();
  switch (sortType) {
    case `price`:
      sortedItems = showingItems.sort((a, b) => a.price - b.price);
      break;
    case `time` :
      sortedItems = showingItems.sort((a, b) => durationMs(a) - durationMs(b));
      break;
  }
  return sortedItems;
};


export default class TripController {
  constructor(container) {
    this._container = container;

    this._tripNoItemComponent = new TripNoItemComponent();
    this._daysComponent = new TripDaysComponent();
    this._sortListComponent = new SortListComponent(SORT_FILTERS);
  }

  render(items) {
    if (items.length === 0) {
      render(this._container, this._tripNoItemComponent, RenderPosition.BEFOREEND);
      return;
    }

    render(this._container, this._sortListComponent, RenderPosition.AFTERBEGIN);

    render(this._container, this._daysComponent, RenderPosition.BEFOREEND);

    const tripDaysListComponent = this._daysComponent.getElement();
    const groupedItems = groupTripItems(items);

    groupedItems.forEach((item, i) => renderDayItemsList({
      tripComponent: tripDaysListComponent,
      day: item,
      index: (i + 1)
    }));

    this._sortListComponent.setSortTypeChangeHandler((sortType) => {
      tripDaysListComponent.innerHTML = ``;
      if (sortType === `event`) {
        groupedItems.forEach((item, i) => renderDayItemsList({
          tripComponent: tripDaysListComponent,
          day: item,
          index: (i + 1)
        }));
      }
      renderDayItemsList({
        tripComponent: tripDaysListComponent,
        items: gerSortedItems(items, sortType)
      });
    });

  }
}
