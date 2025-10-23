import { MarkedDates } from "react-native-calendars/src/types";

function dateKey(d: Date) {
  return d.toISOString().slice(0, 10);
}

export function eachDayUTC(start: Date, end: Date) {
  const days: Date[] = [];
  const s = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate()));
  const e = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate()));
  for (let d = s; d <= e; d = new Date(d.getTime() + 86400_000)) days.push(new Date(d));
  return days;
}

export function buildUnavailableMarks(blocks: { start: Date; end: Date }[]): MarkedDates {
  const marks: MarkedDates = {};
  for (const b of blocks) {
    const days = eachDayUTC(b.start, b.end);
    days.forEach((d, i) => {
      const key = dateKey(d);
      const start = i === 0;
      const end = i === days.length - 1;
      marks[key] = {
        disabled: true,
        disableTouchEvent: true,
        color: "#fecaca",        // light red background
        textColor: "#7f1d1d",    // deep red text
        startingDay: start,
        endingDay: end,
      };
    });
  }
  return marks;
}

export function mergeMarks(a: MarkedDates, b: MarkedDates): MarkedDates {
  return { ...a, ...b };
}

export function buildSelectedRangeMark(start?: Date, end?: Date): MarkedDates {
  if (!start || !end) return {};
  const marks: MarkedDates = {};
  const days = eachDayUTC(start, end);
  days.forEach((d, i) => {
    const key = d.toISOString().slice(0, 10);
    const start = i === 0;
    const end = i === days.length - 1;
    marks[key] = {
      color: "#ef4444",
      textColor: "white",
      startingDay: start,
      endingDay: end,
    };
  });
  return marks;
}
