import AbstractComponent from "./abstract-component.js";


const createDayItemsTemplate = () => {
  return (
    `<li class="trip-events__item">
    </li>`
  );
};


export default class TripDayItems extends AbstractComponent {
  getTemplate() {
    return createDayItemsTemplate();
  }
}
