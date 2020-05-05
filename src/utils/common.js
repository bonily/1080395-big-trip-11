import moment from "moment";


const KeyMap = {
  start: `startEventTime`,
  type: `eventType`,
};


/**
 * @param {Date} start - дата начала путешествия
 * @param {Date} end - дата конца путешествия
 * @return {string} - возвращает текствовое представление продолжительности путешествия;
 */
const getEventDuration = (start, end) => {
  const duretionMs = end.getTime() - start.getTime();
  return moment.duration(duretionMs, `milliseconds`).format(`DD[D] hh[H] mm[M]`);
};


/**
 * @param {Date} date
 * @return {string} - возвращает строковоу представление даты для атрибута datetime формата год-месяц-числоTчасы:минуты;
 */
const getDateTime = (date) => {
  return moment(date).format(`YYYY-MM-DDThh:mm`);
};

/**
 * @param {number} value - добавляет 0 перед месяцем или числом, для отображения даты согласно разметки
 * @return {string}
 */
const getCurrentDateValue = (value) => {
  return String(value).padStart(2, `0`);
};

const getSimpleDate = (date) => {
  // const resultDate = `${date.getFullYear()}-${getCurrentDateValue(date.getMonth() + 1)}-${getCurrentDateValue(date.getDate())}`;
  // console.log(resultDate)
  return moment(date).format(`YYYY-MM-DD`);
};

const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};


/**
 * @param {array} items - получает массив объектов (точки маршрута) из Main, преобразует в объект формата ключ (день путешествия, дата) : значение (массив точек маршрута для этого дня)
 * @param {String} key - ключ, по которому будет происходить группировка
 * @return {array} - возвращает массив объектов (ключ: значения (массив точек маршрута), отсортированный по датам)
 */
const groupTripItemsByKey = (items, key) => {

  if (key === KeyMap.start) {
    const transformItemGroup = items.reduce((acc, item) => {
      if (acc[getSimpleDate(item[key])] === undefined) {
        acc[getSimpleDate(item[key])] = [];
      }
      acc[getSimpleDate(item[key])].push(item);
      return acc;
    }, {});
    return Object.entries(transformItemGroup).sort();
  }


  return items.reduce((acc, item) => {
    if (acc[item[key]] === undefined) {
      acc[item[key]] = [];
    }
    acc[item[key]].push(item);
    return acc;
  }, {});

};

const capitalize = (type) => {
  type = type === `check` ? `check-in` : type;
  return type.charAt(0).toUpperCase() + type.slice(1);
};

const getRandomId = () => Date.parse(new Date()) + Math.random();

const createOffersMap = (data) => {
  return data.reduce((acc, item) => {
    if (acc[item.type] === undefined) {
      acc[item.type] = [];
    }
    acc[item.type] = item.offers;
    return acc;
  }, {});
};

const createDestinationsMap = (data) => {
  return data.reduce((acc, item) => {
    if (acc[item.name] === undefined) {
      acc[item.name] = [];
    }
    acc[item.name] = item;
    return acc;
  }, {});
};

export {getCurrentDateValue, getSimpleDate, createElement, groupTripItemsByKey, capitalize, getRandomId, getDateTime, createOffersMap, createDestinationsMap, getEventDuration};
