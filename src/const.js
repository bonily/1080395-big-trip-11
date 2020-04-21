export const EVENT_TYPES = [`taxi`, `bus`, `train`, `ship`, `transport`, `drive`, `flight`, `check`, `sightseeing`, `restaurant`];
export const DESTINATIONS = [`Barcelona`, `Paris`, `Amsterdam`, `Portu`, `Lisboa`];

export const OFFERS = [
  {name: `car`, price: 200, description: `Rent a car`},
  {name: `meal`, price: 50, description: `Add a breakfast`},
  {name: `comfort`, price: 100, description: `Switch to comfort`},
  {name: `luggage`, price: 30, description: `Add luggage`},
  {name: `seat`, price: 5, description: `Choose seats`},
  {name: `train`, price: 40, description: `Travel by train`}];

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

export const MAIN_FILTERS = [
  {name: `everything`, isActive: true},
  {name: `future`, isActive: false},
  {name: `past`, isActive: false},
];
