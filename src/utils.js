/**
 * @param {number} value - this is used for...
 * @return {string}
 */
const getCurrentDateValue = (value) => {
  return value > 9 ? value : (`0` + value);
};

const getSimpleDate = (date) => {
  const targetDate = new Date(date);
  const resultDate = `${targetDate.getFullYear()}-${getCurrentDateValue(targetDate.getMonth() + 1)}-${getCurrentDateValue(targetDate.getDate())}`;
  return resultDate;
};

const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`,
  BEFOREELEMENT: `before`
};

const render = (container, element, place, specialPlace) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
    case RenderPosition.BEFOREELEMENT:
      container.insertBefore(element, specialPlace);
      break;
  }
};

export {getCurrentDateValue, getSimpleDate, createElement, RenderPosition, render};
