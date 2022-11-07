export function checkDates(wantedDates: Date[], rentedDates: Date[]) {
  if (wantedDates[0] < rentedDates[0] && wantedDates[1] > rentedDates[0])
    return false;
  if (wantedDates[0] > rentedDates[0] && wantedDates[1] < rentedDates[1])
    return false;
  if (wantedDates[0] > rentedDates[0] && wantedDates[1] > rentedDates[1])
    return false;
  return true;
}
