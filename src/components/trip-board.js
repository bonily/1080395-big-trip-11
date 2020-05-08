import AbstractComponent from "./abstract-component.js";


const createTripBoardTemplate = () => {
  return (
    `<section class="trip-events">
      <h2 class="visually-hidden">Trip events</h2>
    </section>`
  );
};


export default class TripBoardComponent extends AbstractComponent {
  getTemplate() {
    return createTripBoardTemplate();
  }
}
