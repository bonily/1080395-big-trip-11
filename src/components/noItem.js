import AbstractComponent from "./abstrackComponent.js";


const createNoItemTeplate = () => {
  return (
    `<p class="trip-events__msg">Click New Event to create your first point</p>`
  );
};

export default class TripNoItemComponent extends AbstractComponent {
  getTemplate() {
    return createNoItemTeplate();
  }
}

