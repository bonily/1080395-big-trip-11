export const EVENT_TYPES = [`taxi`, `bus`, `train`, `ship`, `transport`, `drive`, `flight`, `check`, `sightseeing`, `restaurant`];
export const DESTINATIONS = [`Barcelona`, `Paris`, `Amsterdam`, `Portu`, `Lisboa`];
export const OFFERS = [
  {name: `car`, price: 200, discription: `Rent a car`},
  {name: `meal`, price: 50, discription: `Add a breakfast`},
  {name: `comfort`, price: 100, discription: `Switch to comfort`},
  {name: `luggage`, price: 30, discription: `Add luggage`},
  {name: `seat`, price: 5, discription: `Choose seats`},
  {name: `train`, price: 40, discription: `Travel by train`}];
export const MONTH_NAMES = [
  `January`,
  `February`,
  `March`,
  `APR`,
  `May`,
  `June`,
  `July`,
  `August`,
  `September`,
  `October`,
  `November`,
  `December`,
];

export const SORT_FILTERS = [
  {name: `event`, isActive: false},
  {name: `time`, isActive: true},
  {name: `price`, isActive: false},
];

export const MAIN_FILTERS = [
  {name: `everything`, isActive: true},
  {name: `future`, isActive: false},
  {name: `past`, isActive: false},
];
