import moment from "moment";
import {KeyMap} from "../const.js";


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
  return moment(date).format(`YYYY-MM-DD`);
};

const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

/**
 * @param {any[]} items - получает массив объектов (точки маршрута) из Main, преобразует в объект формата ключ (день путешествия, дата) : значение (массив точек маршрута для этого дня)
 * @param {string} key - ключ, по которому будет происходить группировка
 * @return {array} - возвращает массив объектов (ключ: значения (массив точек маршрута), отсортированный по датам)
 */
const groupTripItemsByKey = (items, key) =>
  items.reduce((accumulator, item) => {
    const resultKey = key === KeyMap.START ? getSimpleDate(item[key]) : item[key];

    if (accumulator[resultKey] === undefined) {
      accumulator[resultKey] = [];
    }
    accumulator[resultKey].push(item);

    return accumulator;
  }, {});

const capitalize = (type) => {
  return type.charAt(0).toUpperCase() + type.slice(1);
};

const createOffersMap = (items) => {
  return items.reduce((accumulator, item) => {
    accumulator[item.type] = item.offers;
    return accumulator;
  }, {});
};

const createDestinationsMap = (items) => {
  return items.reduce((accumulator, item) => {
    accumulator[item.name] = item;
    return accumulator;
  }, {});
};

/**
 * @param {string} value  - дата из flatpickr, которая не парсится без доп функций
 * @return {string}  - возвращает дату в формате yyyy-mm-ddTHH:MM
 */

const getCurrentDateFromValue = (value) => {
  const [day, month, shortYear, hours, minutes] = value.split(/[.,\/ - :]/);
  const dateString = `20${shortYear}-${month}-${day}T${hours}:${minutes}`;
  return dateString;
};

export {getCurrentDateValue, getSimpleDate, createElement, groupTripItemsByKey, capitalize, getDateTime, createOffersMap, createDestinationsMap, getEventDuration, getCurrentDateFromValue};
