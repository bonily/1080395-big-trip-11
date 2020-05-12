import AbstractComponent from "./abstract-component.js";


const createNoItemTeplate = () => {
  return (
    `<p class="trip-events__msg">Click New Event to create your first point</p>`
  );
};

export default class NoItem extends AbstractComponent {

  getTemplate() {
    return createNoItemTeplate();
  }
}

