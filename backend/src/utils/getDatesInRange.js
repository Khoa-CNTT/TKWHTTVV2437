const getDatesInRange = (startDay, endDay) => {
  const start = new Date(startDay);
  const end = new Date(endDay);
  const dates = [];

  while (start < end) {
    dates.push(new Date(start)); // Push the current date
    start.setDate(start.getDate() + 1); // Move to the next day
  }

  return dates;
};

module.exports = getDatesInRange;
