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
 * @param {any[]} items - получает массив объектов (точки маршрута) из Main, преобразует в объект формата ключ (день путешествия, дата) : значение (массив точек маршрута для этого дня)
 * @param {string} key - ключ, по которому будет происходить группировка
 * @return {array} - возвращает массив объектов (ключ: значения (массив точек маршрута), отсортированный по датам)
 */
const groupTripItemsByKey = (items, key) => {

  if (key === KeyMap.START) {
    return items.reduce((acc, item) => {
      if (acc[getSimpleDate(item[key])] === undefined) {
        acc[getSimpleDate(item[key])] = [];
      }
      acc[getSimpleDate(item[key])].push(item);
      return acc;
    }, {});
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
  return type.charAt(0).toUpperCase() + type.slice(1);
};

const createOffersMap = (items) => {
  return items.reduce((acc, item) => {
    acc[item.type] = item.offers;
    return acc;
  }, {});
};

const createDestinationsMap = (items) => {
  return items.reduce((acc, item) => {
    acc[item.name] = item;
    return acc;
  }, {});
};

/**
 * @param {string} value  - дата из flatpicr, которая не парсится без доп функций
 * @return {string}  - возвращает дату в формате yyyy-mm-ddTHH:MM
 */

const getCurrentDateFromValue = (value) => {
  const [day, month, shortYear, hours, minutes] = value.split(/[.,\/ - :]/);
  const dateString = `20${shortYear}-${month}-${day}T${hours}:${minutes}`;
  return dateString;
};

export {getCurrentDateValue, getSimpleDate, createElement, groupTripItemsByKey, capitalize, getDateTime, createOffersMap, createDestinationsMap, getEventDuration, getCurrentDateFromValue};
