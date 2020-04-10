/**
 * @param {number} value - this is used for...
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

export {getCurrentDateValue, getSimpleDate};
