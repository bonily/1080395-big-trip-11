// import API from "./api.js";

// const AUTHORIZATION = `Basic dXNlckBwYXfghjSIUYBVCDSzd29yZAo=`;
// const api = new API(AUTHORIZATION);

// const getRandomIntegerNumber = (min, max) => {
//   return min + Math.floor(Math.random() * (max - min));
// };

export const EVENT_TYPES = [`taxi`, `bus`, `train`, `ship`, `transport`, `drive`, `flight`, `check`, `sightseeing`, `restaurant`];
export let OFFERS_MAP = {};

export const createEventTypesMap = (data) => {
  // EVENT_TYPES = data.map((item) => item.type);
  OFFERS_MAP = data.reduce((acc, item) => {
    if (acc[item.type] === undefined) {
      acc[item.type] = [];
    }
    acc[item.type] = item.offers;
    return acc;
  }, {});
};

export const DESTINATIONS = [`Barcelona`, `Paris`, `Amsterdam`, `Portu`, `Lisboa`];
export let DESTINATION_MAP = [];

export const createEventDestinationsMap = (data) => {
  data.forEach((item) => DESTINATIONS.push(item.name));
  DESTINATION_MAP = data.reduce((acc, item) => {
    if (acc[item.name] === undefined) {
      acc[item.name] = [];
    }
    acc[item.name] = item;
    return acc;
  }, {});
};


export const OFFERS = [
  {name: `car`, price: 200, description: `Rent a car`, checked: true},
  {name: `meal`, price: 50, description: `Add a breakfast`, checked: true},
  {name: `comfort`, price: 100, description: `Switch to comfort`, checked: false},
  {name: `luggage`, price: 30, description: `Add luggage`, checked: true},
  {name: `seat`, price: 5, description: `Choose seats`, checked: false},
  {name: `train`, price: 40, description: `Travel by train`, checked: true}];

export const OFFERS_MAPK = {
  car: {
    price: 200,
    description: `Rent a car`,
  },

  meal: {
    price: 50,
    description: `Add a breakfast`,
  },

  comfort: {
    price: 100,
    description: `Switch to comfort`,
  },

  luggage: {
    price: 30,
    description: `Add luggage`,
  },

  seat: {
    price: 5,
    description: `Choose seats`,
  },

  train: {
    price: 40,
    description: `Travel by train`,
  },

};

export const MONTH_NAMES = [
  `JAN`,
  `FEB`,
  `MAR`,
  `APR`,
  `MAY`,
  `JUNE`,
  `JULE`,
  `AUG`,
  `SEP`,
  `OСT`,
  `NOV`,
  `DEC`,
];

export const SORT_FILTERS = [
  {name: `event`, isActive: true},
  {name: `time`, isActive: false},
  {name: `price`, isActive: false},
];

export const MAIN_FILTERS = {
  ALL: `everything`,
  FUTURE: `future`,
  PAST: `past`,
};
