/**
 * Returns a greeting translation key based on the current hour of the day.
 *
 * - Morning: 4:00 AM – 11:59 AM → `screens.myAccount.greetingMorning`
 * - Afternoon: 12:00 PM – 6:59 PM → `screens.myAccount.greetingNoon`
 * - Evening/Night: 7:00 PM – 3:59 AM → `screens.myAccount.greetingEvening`
 *
 * @returns A string key for the greeting message.
 */

const getGreetings = (): string => {
  const currentHour = new Date().getHours();
  if (currentHour >= 4 && currentHour < 12) {
    return 'screens.myAccount.greetingMorning';
  } else if (currentHour >= 12 && currentHour < 19) {
    return 'screens.myAccount.greetingNoon';
  } else {
    return 'screens.myAccount.greetingEvening';
  }
};

export default getGreetings;
