export function sleep(ms = 0): Promise<any> {
    return new Promise(r => setTimeout(r, ms));
}

export function getFormattedDate(date: Date): string {
  if (typeof date === "string") {
    date = new Date(date);
  }
  const days: string = date.getDate() < 10 ? "0" + date.getDate().toString() : date.getDate().toString();
  const months: string = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1).toString() : (date.getMonth() + 1).toString();

  return days + "." + months + "." + date.getFullYear();
}

export function getFormattedDateTime(dateTime: Date): string {
  if (typeof dateTime === "string") {
    dateTime = new Date(dateTime);
  }
  const hours: string = dateTime.getHours() < 10 ? "0" + dateTime.getHours().toString() : dateTime.getHours().toString();
  const minutes: string = dateTime.getMinutes() < 10 ? "0" + dateTime.getMinutes().toString() : dateTime.getMinutes().toString();

  return getFormattedDate(dateTime) + " " + hours + ":" + minutes;
}