import {
  differenceInCalendarDays,
  differenceInCalendarMonths,
  isFirstDayOfMonth,
  isLastDayOfMonth,
  addDays,
  subDays,
  subMonths,
  endOfMonth,
  startOfMonth,
  getDay,
  getDate,
  getMonth,
  getYear,
  format as formatDate,
  getDaysInMonth,
} from 'date-fns';
import sortBy from 'lodash/sortBy';
import isEqual from 'lodash/isEqual';
import type IDateRange from '~ui/interface/IDateRange';
import { ScreenSize } from '~ui/interface/commons';
import ExcelJS from 'exceljs';
import { useGtm } from '@gtm-support/vue-gtm';

export const getUID = () => {
  return `uid-${Math.random().toString(36).substring(2)}`;
};

export const dateRangeToStatus = (dateRange: IDateRange | null, baseDate = new Date()) => {
  if (!dateRange || !dateRange.start || !dateRange.end) return 'custom';

  const { start, end } = dateRange;
  const diff = differenceInCalendarDays(end, start);
  const isYesterday = differenceInCalendarDays(baseDate, end) === 1;

  // if (diff === 0 && isYesterday) {
  //   return 'yesterday';
  // }
  if (diff === 6 && isYesterday) {
    return 'last7Days';
  } else if (diff === 29 && isYesterday) {
    return 'last30Days';
  } else if (diff === 89 && isYesterday) {
    return 'last90Days';
  } else if (
    getYear(start) === getYear(end) &&
    getMonth(start) === getMonth(end) &&
    isFirstDayOfMonth(start) &&
    isLastDayOfMonth(end) &&
    differenceInCalendarMonths(end, baseDate) === -1
  ) {
    return 'lastMonth';
  }

  return 'custom';
};

export const statusToDateRange = (status: string | null, baseDate = new Date()) => {
  const yesterday = subDays(baseDate, 1);
  const lastMonth = subMonths(baseDate, 1);

  switch (status) {
    // case 'yesterday':
    //   return { start: yesterday, end: yesterday };
    case 'last30Days':
      return { start: subDays(baseDate, 30), end: yesterday };
    case 'last90Days':
      return { start: subDays(baseDate, 90), end: yesterday };
    case 'lastMonth':
      return { start: startOfMonth(lastMonth), end: endOfMonth(lastMonth) };
    case 'last7Days':
      return { start: subDays(baseDate, 7), end: yesterday };
    default:
      return null;
  }
};

export const isPreviousDateRange = (leftDateRange: IDateRange | null, rightDateRange: IDateRange | null) => {
  if (!leftDateRange || !rightDateRange) {
    return 'custom';
  }

  const { start: leftStart, end: leftEnd } = leftDateRange;
  const { start: rightStart, end: rightEnd } = rightDateRange;

  if (!leftStart || !leftEnd || !rightStart || !rightEnd) {
    return 'custom';
  }

  const leftDiff = differenceInCalendarDays(leftEnd, leftStart);
  const rightDiff = differenceInCalendarDays(rightEnd, rightStart);
  const startDiff = differenceInCalendarDays(leftStart, rightStart);
  const endDiff = differenceInCalendarDays(leftEnd, rightEnd);
  const leftStartRightEndDiff = differenceInCalendarDays(leftStart, rightEnd);

  return leftStartRightEndDiff === 1 &&
    ((leftDiff === rightDiff && startDiff === endDiff) ||
      (isFirstDayOfMonth(leftStart) &&
        isLastDayOfMonth(leftEnd) &&
        isFirstDayOfMonth(rightStart) &&
        isLastDayOfMonth(rightEnd) &&
        differenceInCalendarMonths(leftStart, rightStart) === 1))
    ? 'previous'
    : 'custom';
};

export const previousDateRange = (dateRange: IDateRange | null) => {
  if (!dateRange) return null;

  const status = dateRangeToStatus(dateRange);
  const { start, end } = dateRange;
  const diff = differenceInCalendarDays(end, start);
  const lastMonth = subMonths(start, 1);

  switch (status) {
    // case 'yesterday':
    case 'last7Days':
    case 'last30Days':
    case 'last90Days':
    case 'custom':
      return {
        start: subDays(start, diff + 1),
        end: subDays(end, diff + 1),
      };
    case 'lastMonth':
      return {
        start: startOfMonth(lastMonth),
        end: endOfMonth(lastMonth),
      };
    default:
      return null;
  }
};

export const emailValidator = (value: string) => /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value);

export const hexToRgba = (hex: string, opacity: number) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(
        result[3],
        16
      )}, ${opacity})`
    : `rgba(255, 255, 255, 0)`;
};

export const formatDateRange = (dateRange: IDateRange | null) => {
  if (!dateRange) return '';

  return `${formatDate(dateRange.start, 'yyyy/MM/dd')} - ${formatDate(
    dateRange.end,
    'yyyy/MM/dd'
  )}`;
};

export const passwordValidator = (value: string) =>
  !(
    !!value &&
    value.length >= 5 &&
    value.length <= 202 &&
    /^[w.@]+$/.test(value)
  );

export const windowSize = () => {
  const windowWidth = window.innerWidth;
  let windowSize: ScreenSize = ScreenSize['2xl'];

  if (windowWidth < 1024) {
    windowSize = ScreenSize.md;
  } else if (windowWidth < 1280) {
    windowSize = ScreenSize.lg;
  } else if (windowWidth < 1366) {
    windowSize = ScreenSize.xl;
  } else if (windowWidth < 1536) {
    windowSize = ScreenSize['1.5xl'];
  }

  return windowSize;
};

const getCharLength = (char = '') => {
  const matched = HanRegex.test(char);
  return matched ? 2 : 1;
};

export const stringLength = (str: string) => {
  if (!str) return 0;
  let length = 0;
  for (const symbol of str) {
    length += getCharLength(symbol);
  }

  return length;
};

export function rankListBy<T>(list: T[], rankBy: keyof T, desc = true) {
  let currentRank = 0;
  let nextRank = 1;

  let sortedList = sortBy(list, rankBy);

  if (desc) {
    sortedList = [...sortedList].reverse();
  }

  return sortedList.map((item, i) => {
    if (i === 0) {
      currentRank += 1;
      nextRank += 1;
      return {
        ...item,
        rank: currentRank,
      };
    } else {
      const lastItem = sortedList[i - 1];
      if (isEqual(item[rankBy], lastItem[rankBy])) {
        nextRank += 1;
      } else {
        currentRank = nextRank;
        nextRank += 1;
      }
    }

    return {
      ...item,
      rank: currentRank,
    };
  });
}

export const getBarChartGridTop = (maxValue: number, showLabel = true) => {
  return (
    30 +
    (showLabel
      ? Number(maxValue).toLocaleString().length *
        8 *
        Math.sin((30 / 180) * Math.PI)
      : 0)
  );
};

export const getBarChartGridLeft = (value: number, min: number) => {
  const left = Number(value).toLocaleString().length * 12;
  if (min) return Math.max(left, min);
  return left;
};

export const getBarChartBarLabelHeight = (maxValue: string | number, showLabel = true) => {
  return (
    16 +
    (showLabel
      ? Number(maxValue).toLocaleString().length *
        8 *
        Math.sin((30 / 180) * Math.PI)
      : 0)
  );
};

export const getChartLabelWidth = (maxValue: string | number) => {
  return Number(maxValue).toLocaleString().length * 8;
};

export const getDayDatesMatchWeekDay = (dateRange1: IDateRange, dateRange2: IDateRange | null) => {
  const dayDates: {
    date: string,
    day: number,
    weekDay: string,
  }[] = [];

  if (!dateRange2) {
    const daysInMonth = getDaysInMonth(dateRange1.start);
    for (let i = 0; i < daysInMonth; i += 1) {
      const day = addDays(dateRange1.start, i);

      dayDates.push({
        date: formatDate(day, 'yyyy/MM/dd'),
        day: getDay(day),
        weekDay: translateDayToLocale(getDay(day)),
      });
    }
    return dayDates;
  }

  const weekDayOfRange1Start = getDay(dateRange1.start);
  const weekDayOfRange2Start = getDay(dateRange2.start);
  const weekDayDiff = weekDayOfRange1Start - weekDayOfRange2Start;

  if (
      (weekDayDiff > 0 && weekDayDiff <= 3)
      || (weekDayDiff < -3)
    ) {
      const iteratorTimes = weekDayDiff > 0 ? weekDayDiff : (weekDayDiff + 7);
    for(let i = 0; i < iteratorTimes; i += 1) {
      const day = addDays(dateRange2.start, i);
      dayDates.push({
        date: formatDate(day, 'yyyy/MM/dd'),
        day: getDay(day),
        weekDay: translateDayToLocale(getDay(day)),
      });
    }
  }

  const daysOfLastMonth = differenceInCalendarDays(dateRange1.end, dateRange1.start) + 1;
  for(let i = 0; i < daysOfLastMonth; i += 1) {
    const day = addDays(dateRange1.start, i);
    dayDates.push({
      date: formatDate(day, 'yyyy/MM/dd'),
      day: getDay(day),
      weekDay: translateDayToLocale(getDay(day)),
    });
  }

  const overMonth1Days = getDate(dateRange2.end) - getDate(dateRange1.end) - (7 - Math.abs(weekDayDiff));
  if (overMonth1Days > 0) {
    for(let j = overMonth1Days; j > 0; j -= 1) {
      const day = subDays(dateRange2.end, j);
      dayDates.push({
        date: formatDate(day, 'yyyy/MM/dd'),
        day: getDay(day),
        weekDay: translateDayToLocale(getDay(day)),
      });
    }
  }


  return dayDates;
}

export const translateDayToLocale = (day: number) => {
  switch(day) {
    case 0:
      return '日';
    case 1:
      return '一';
    case 2:
      return '二';
    case 3:
      return '三';
    case 4:
      return '四';
    case 5:
      return '五';
    default:
      return '六';
  }
}

export const numberToLocaleString = (value: number | null, { NaNString = '' } = {}, toNumber = false) => {
  if (value === null || isNaN(value)) {
    return NaNString || '';
  } else if (!toNumber) {
    return Number(value).toLocaleString();
  }

  return value;
}

export const toFixed = (value: number | null, fixedTo: number = 0, { NaNString = '', unsign = false, unit = '' } = {}, toNumber = false) => {
  if (value === null || isNaN(value)) {
    return NaNString || '';
  } else {
    let formatedValue = '';
    if (unsign) {
      formatedValue = Number(Math.abs(value)).toFixed(fixedTo);
    } else {
      formatedValue = Number(value).toFixed(fixedTo);
    }

    const valueParts = formatedValue.split('.');

    if (valueParts[1]) {
      if (toNumber) {
        return Number(`${Number(valueParts[0]).toLocaleString()}.${valueParts[1]}`);
      }
      return `${Number(valueParts[0]).toLocaleString()}.${valueParts[1]}${unit}`;
    }

    if (toNumber) {
      return Number(valueParts[0]);
    }
    return `${Number(valueParts[0]).toLocaleString()}${unit}`;
  }
}

export const downloadURL = (data: string, fileName: string) => {
  const downloadLink = document.createElement('a');
  downloadLink.href = data;
  downloadLink.download = fileName;
  downloadLink.click();
  downloadLink.remove();
};

export const downloadBlob = (data: ExcelJS.Buffer, fileName: string, mimeType: string) => {
  const blob = new Blob([data], {
    type: mimeType,
  });
  const url = window.URL.createObjectURL(blob);
  downloadURL(url, fileName);
  setTimeout(() => {
    window.URL.revokeObjectURL(url);
  }, 1000);
};

export const isDateRangesEqual = (dateRange1: IDateRange, dateRange2: IDateRange) => {
  return getYear(dateRange1.start) === getYear(dateRange2.start) && 
    getMonth(dateRange1.start) === getMonth(dateRange2.start) && 
    getDate(dateRange1.start) === getDate(dateRange2.start) && 
    getYear(dateRange1.end) === getYear(dateRange2.end) && 
    getMonth(dateRange1.end) === getMonth(dateRange2.end) && 
    getDate(dateRange1.end) === getDate(dateRange2.end);
}

export const gaev = ({ category, action, label, value, cb }: {
  category?: string,
  action?: string,
  label?: string,
  value?: number,
  cb?: () => void,
} = {}) => {
  const gtm = useGtm();

  if (gtm?.enabled() && !!event) {
    const data: {
      event: 'GAEV'
      EventCategory?: string,
      EventAction?: string,
      EventLabel?: string,
      EventValue?: number,
      eventCallback?: () => void,
    } = {
      event: 'GAEV',
      EventCategory: category,
      EventAction: action,
      EventLabel: label,
      EventValue: value,
    };

    if (typeof cb === 'function') {
      data.eventCallback = cb;
    }

    window.dataLayer?.push(data);
  }
};

export const ga4ev = ({ category, action, label, value, cb }: {
  category?: string,
  action?: string,
  label?: string,
  value?: number,
  cb?: () => void,
} = {}) => {
  const gtm = useGtm();

  if (gtm?.enabled() && !!event) {
    const data: {
      event: 'GA4EV',
      EventCategory?: string,
      EventAction?: string,
      EventLabel?: string,
      EventValue?: number,
      eventCallback?: () => void,
    } = {
      event: 'GA4EV',
      EventCategory: category,
      EventAction: action,
      EventLabel: label,
      EventValue: value,
    };

    if (typeof cb === 'function') {
      data.eventCallback = cb;
    }

    window.dataLayer?.push(data);
  }
};

export const getWebsiteFavico = (domain: string): Promise<{ domain: string; icoUrl: string; }> => {
  return new Promise((resolve) => {
    const icoUrl = `https://storage.googleapis.com/domains-favicon/${domain.replaceAll(
      '.',
      '_'
    )}.ico`;
    const canvas = document.createElement('canvas');
    canvas.width = 26;
    canvas.height = 26;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();

      ctx.lineWidth = 1;
      ctx.strokeStyle = '#BDBDBD';
      ctx.roundRect(1, 1, 24, 24, 6);
      ctx.stroke();
    }

    const image = new Image();
    image.setAttribute('crossOrigin', 'Anonymous');
    image.onload = () => {
      ctx?.drawImage(image, 0, 0, image.width, image.height, 6, 6, 14, 14);

      resolve({ domain, icoUrl: canvas.toDataURL('image/png', 1.0) });
    };
    image.onerror = () => {
      image.src = `${window.location.protocol}//${window.location.host}/assets/images/commons/default-favico.png`;
    };
    image.src = icoUrl;
  });
};

export const httpUrlValidate = (url: string) => /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/.test(url);
export const httpUrlToHost = (url: string) => {
  if (httpUrlValidate(url)) {
    try {
      const u = new URL(url);
      return u.host;
    } catch {
      return url;
    }
  }

  return url;
}

export const isValidDate = (d: any) => {
  if (Object.prototype.toString.call(d) === "[object Date]") {
    // it is a date
    if (isNaN(d)) { // d.getTime() or d.valueOf() will also work
      return false;
    } else {
      return true;
    }
  } else {
    return false;
  }
}
