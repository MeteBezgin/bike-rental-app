export function getAllDaysInMonth(year: number, month: number) {
  const date = new Date(year, month, 1);
  const dates = [];

  while (date.getMonth() === month) {
    dates.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }

  return dates;
}

export function checkDates(wantedDates: Date[], rentedDates: Date[]) {
  if (wantedDates[0] < rentedDates[0] && wantedDates[1] > rentedDates[0]) {
    return false;
  }

  if (wantedDates[0] > rentedDates[0] && wantedDates[1] < rentedDates[1]) {
    return false;
  }

  if (
    wantedDates[0] > rentedDates[0] &&
    wantedDates[0] < rentedDates[1] &&
    wantedDates[1] > rentedDates[1]
  ) {
    return false;
  }
  if (
    wantedDates[0].toISOString() == rentedDates[0].toISOString() ||
    wantedDates[0].toISOString() == rentedDates[1].toISOString() ||
    wantedDates[1].toISOString() == rentedDates[0].toISOString() ||
    wantedDates[1].toISOString() == rentedDates[1].toISOString()
  ) {
    return false;
  }
  return true;
}

export function getDaysInRange(startDate: Date, endDate: Date) {
  const date = new Date(new Date(startDate).getTime());

  const dates = [];

  while (date <= endDate) {
    dates.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }

  return dates;
}

export function getDatesInRange(startDate: Date, endDate: Date) {
  let date = new Date(new Date(startDate).getTime());
  endDate = new Date(endDate);
  const dates = [];

  while (date <= endDate) {
    dates.push(date.toISOString().split("T")[0]);
    date.setDate(date.getDate() + 1);
  }

  return dates;
}
