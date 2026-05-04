// The problem is that the function new Date() reads the system clock directly and a test can not know the current date.
// Because of that the expected return value changes daily.
// As fix we can inject the current date as a parameter, as in chapter 3 point 7 Time is mentioned.

const millisPerDay = 24 * 60 * 60 * 1000;

export function daysUntilChristmas(now) {
  const todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const christmasDay = new Date(now.getFullYear(), 12 - 1, 25);
  if (todayDate.getTime() > christmasDay.getTime()) {
    christmasDay.setFullYear(now.getFullYear() + 1);
  }
  const diffMillis = christmasDay.getTime() - todayDate.getTime();
  return Math.floor(diffMillis / millisPerDay);
}
