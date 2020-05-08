import AbstractComponent from "./abstract-component.js";


const createItemsTemplate = () => {
  return (
    `<ul class="trip-events__list">
    </ul>`
  );
};

export default class TripItemsListTemplate extends AbstractComponent {
  getTemplate() {
    return createItemsTemplate();
  }
}
