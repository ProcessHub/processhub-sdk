export function sleep(ms = 0): Promise<any> {
    return new Promise(r => setTimeout(r, ms));
}

export function getFormattedDate(date: Date): string {
  // all dates are UTC -> convert to local time
  const offset = new Date().getTimezoneOffset() / 60;
  let localDT = date;
  localDT.setHours(date.getHours() - offset);

  const days: string = localDT.getDate() < 10 ? "0" + localDT.getDate().toString() : localDT.getDate().toString();
  const months: string = localDT.getMonth() + 1 < 10 ? "0" + (localDT.getMonth() + 1).toString() : (localDT.getMonth() + 1).toString();

  return days + "." + months + "." + localDT.getFullYear();
}

export function getFormattedDateTime(dateTime: Date): string {
  // all dates are UTC -> convert to local time
  const offset = new Date().getTimezoneOffset() / 60;
  let localDT = dateTime;
  localDT.setHours(dateTime.getHours() - offset);

  const hours: string = localDT.getHours() < 10 ? "0" + localDT.getHours().toString() : localDT.getHours().toString();
  const minutes: string = localDT.getMinutes() < 10 ? "0" + localDT.getMinutes().toString() : localDT.getMinutes().toString();

  return getFormattedDate(localDT) + " " + hours + ":" + minutes;
}