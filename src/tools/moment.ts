import * as Moment from "moment";
import { tl } from "../tl";

Moment.locale("de", {
  months: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
  monthsShort: ["Jan.", "Feb.", "März", "Apr.", "Mai", "Juni", "Juli", "Aug.", "Sept.", "Okt.", "Nov.", "Dez."],
  monthsParseExact: true,
  weekdays: ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"],
  weekdaysShort: ["So.", "Mo.", "Di.", "Mi.", "Do.", "Fr.", "Sa."],
  weekdaysMin: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
  longDateFormat: {
    LT: "HH:mm",
    LTS: "HH:mm:ss",
    L: "DD/MM/YYYY",
    LL: "D MMMM YYYY",
    LLL: "D MMMM YYYY HH:mm",
    LLLL: "dddd D MMMM YYYY HH:mm"
  },
  calendar: {
    sameDay: "[Heute um] LT",
    nextDay: "[Morgen um] LT",
    nextWeek: "dddd [um] LT",
    lastDay: "[Gestern um] LT",
    lastWeek: "[Letzten] dddd [um] LT",
    sameElse: "L"
  },
  relativeTime: {
    future: "in %s",
    past: "vor %s",
    s: "einigen Sekunden",
    m: "einer Minute",
    mm: "%d Minuten",
    h: "einer Stunde",
    hh: "%d Stunden",
    d: "einem Tag",
    dd: "%d Tagen",
    M: "einem Monat",
    MM: "%d Monaten",
    y: "einem Jahr",
    yy: "%d Jahren"
  },
});

export function momentFromUtcDate(dateInUtc: Date): string {
  if (typeof dateInUtc === "string") {
    dateInUtc = new Date(dateInUtc);
  }
  const now: Date = new Date();
  const timeNow: number = now.getTime();
  if (timeNow < dateInUtc.getTime() + 60 * 1000) {
    return tl("jetzt");
  }
  return Moment(dateInUtc).from(Moment(now));
}

export function momentToUtcDate(dateInUtc: Date): string {
  if (typeof dateInUtc === "string") {
    dateInUtc = new Date(dateInUtc);
  }
  const now: Date = new Date();

  if (dateInUtc.getDate() === now.getDate()) {
    return tl("heute");
  }
  return Moment(now).to(Moment(dateInUtc));
}