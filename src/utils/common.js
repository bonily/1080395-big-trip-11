/**
 * @param {number} value - добавляет 0 перед месяцем или числом, для отображения даты согласно разметки
 * @return {string}
 */
const getCurrentDateValue = (value) => {
  return String(value).padStart(2, `0`);
};

const getSimpleDate = (date) => {
  const resultDate = `${date.getFullYear()}-${getCurrentDateValue(date.getMonth() + 1)}-${getCurrentDateValue(date.getDate())}`;
  return resultDate;
};

const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};


/**
 * @param {array} items - получает массив объектов (точки маршрута) из Main, преобразует в объект формата ключ (день путешествия, дата) : значение (массив точек маршрута для этого дня)
 * @return {array} - возвращает массив объектов (ключ(дата): значения (массив точек маршрута), отсортированный по датам)
 */
const groupTripItems = (items) => {
  const transformItems = items.reduce((acc, item) => {
    if (acc[getSimpleDate(item.startEventTime)] === undefined) {
      acc[getSimpleDate(item.startEventTime)] = [];
    }
    acc[getSimpleDate(item.startEventTime)].push(item);
    return acc;
  }, {});
  return Object.entries(transformItems).sort();
};

const capitalize = (type) => {
  type = type === `check` ? `check-in` : type;
  return type.charAt(0).toUpperCase() + type.slice(1);
};


export {getCurrentDateValue, getSimpleDate, createElement, groupTripItems, capitalize};
