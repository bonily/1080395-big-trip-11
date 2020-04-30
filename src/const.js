const getRandomIntegerNumber = (min, max) => {
  return min + Math.floor(Math.random() * (max - min));
};

export const EVENT_TYPES = [`taxi`, `bus`, `train`, `ship`, `transport`, `drive`, `flight`, `check`, `sightseeing`, `restaurant`];
export const DESTINATIONS = [`Barcelona`, `Paris`, `Amsterdam`, `Portu`, `Lisboa`];
export const DESTINATION_PHOTOS = {
  Barcelona: new Array(getRandomIntegerNumber(1, 8))
              .fill(``)
              .map(() => `http://picsum.photos/248/152?r=${Math.random()}`),
  Paris: new Array(getRandomIntegerNumber(1, 8))
              .fill(``)
              .map(() => `http://picsum.photos/248/152?r=${Math.random()}`),
  Amsterdam: new Array(getRandomIntegerNumber(1, 8))
              .fill(``)
              .map(() => `http://picsum.photos/248/152?r=${Math.random()}`),
  Portu: new Array(getRandomIntegerNumber(1, 8))
              .fill(``)
              .map(() => `http://picsum.photos/248/152?r=${Math.random()}`),
  Lisboa: new Array(getRandomIntegerNumber(1, 8))
              .fill(``)
              .map(() => `http://picsum.photos/248/152?r=${Math.random()}`),
};

export const OFFERS = [
  {name: `car`, price: 200, description: `Rent a car`, checked: true},
  {name: `meal`, price: 50, description: `Add a breakfast`, checked: true},
  {name: `comfort`, price: 100, description: `Switch to comfort`, checked: false},
  {name: `luggage`, price: 30, description: `Add luggage`, checked: true},
  {name: `seat`, price: 5, description: `Choose seats`, checked: false},
  {name: `train`, price: 40, description: `Travel by train`, checked: true}];

export const OFFERS_MAP = {
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
