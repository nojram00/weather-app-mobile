const hourToMs = (hour: number) => {
  return hour * 60 * 60 * 1000;
};

const secondToMs = (second: number) => {
  return second * 1000;
};

const minuteToMs = (minute: number) => {
  return minute * 60 * 1000;
};

export { hourToMs, secondToMs, minuteToMs };
