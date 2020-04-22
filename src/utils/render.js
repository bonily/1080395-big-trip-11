const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`,
  BEFOREELEMENT: `before`
};

const render = (container, component, place, specialPlace) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(component.getElement());
      break;
    case RenderPosition.BEFOREEND:
      container.append(component.getElement());
      break;
    case RenderPosition.BEFOREELEMENT:
      container.insertBefore(component.getElement(), specialPlace);
      break;
  }
};

/**
 * @param {Object} newComponent
 * @param {Object} oldComponent
 */
const replace = (newComponent, oldComponent) => {
  let parentElement = oldComponent.getElement().parentElement;
  const newElement = newComponent.getElement();
  const oldElement = oldComponent.getElement();
console.log(parentElement);
console.log(newComponent.getElement().parentElement)

  const isExistElements = !!(parentElement && newElement && oldElement);
  parentElement.replaceChild(newElement, oldElement);

  if (isExistElements && parentElement.contains(oldElement)) {
    parentElement.replaceChild(newElement, oldElement);
  }
};

// const remove = (component) => {
//   component.getElement().remove();
//   component.removeElement();
// };

export {RenderPosition, render, replace};
