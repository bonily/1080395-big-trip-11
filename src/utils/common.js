/**
 * @param {number} value - добавляет 0 перед месяцем или числом, для отображения даты согласно разметки
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


export {getCurrentDateValue, getSimpleDate, createElement, groupTripItems};
