import {EVENT_TYPES, DESTINATIONS, OFFERS} from "../const.js";

const descriptionText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus`;

const descriptionSentences = descriptionText.split(`. `);

const getRandomIntegerNumber = (min, max) => {
  return min + Math.floor(Math.random() * (max - min));
};

const getRandomArrayItem = (array) => {
  const randomIndex = getRandomIntegerNumber(0, array.length);

  return array[randomIndex];
};

const getRandomArray = (array, start, end = array.length) => {
  const count = getRandomIntegerNumber(start, end);
  return new Array(count)
    .fill(``)
    .map(() => getRandomArrayItem(array));
};

const getRandomTimeFromCurrent = (date) => {
  const resultData = new Date(date);
  resultData.setMilliseconds(getRandomIntegerNumber(1500000, 860000000));
  return resultData;
};

const generateEventItem = () => {
  const targetDate = getRandomTimeFromCurrent(new Date());
  const aviableOffers = getRandomArray(OFFERS, 0);
  return {
    eventType: getRandomArrayItem(EVENT_TYPES),
    destination: getRandomArrayItem(DESTINATIONS),
    price: getRandomIntegerNumber(0, 300),
    startEventTime: targetDate,
    endEventTime: getRandomTimeFromCurrent(targetDate),
    offers: getRandomArray(aviableOffers, 0),
    aviableOffers,
    description: getRandomArray(descriptionSentences, 1, 5).join(`. `),
    photos: new Array(getRandomIntegerNumber(1, 8))
      .fill(``)
      .map(() => `http://picsum.photos/248/152?r=${Math.random()}`)
  };
};

const generateItems = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateEventItem);
};

export {generateEventItem, generateItems};
