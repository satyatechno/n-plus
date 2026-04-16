// utils/dateTimeFormatter.ts
import moment from 'moment-timezone';
import 'moment/locale/es';

import i18n from '@src/config/localization/i18n';
import { ProgramacionItem } from '@src/models/main/Home/LiveTV';

moment.updateLocale('es-no-dot', {
  monthsShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
});

export type DateTimeFormatType = 'date' | 'time' | 'datetime' | 'dateTimeObject';

export const mexicoCurrentTime = moment().tz('America/Mexico_City');

export const formatMexicoDateTime = (
  utcDate: string,
  type: DateTimeFormatType = 'datetime'
): string | { time: string; date: string } => {
  const mexicoTime = moment.utc(utcDate).tz('America/Mexico_City');
  mexicoTime.locale('es-no-dot');

  switch (type) {
    case 'date':
      return mexicoTime.format('DD MMM YYYY'); // ex: 12 ago 2025
    case 'time':
      return mexicoTime.format('HH:mm [CST]'); // ex: 14:49 CST
    case 'dateTimeObject':
      return {
        time: mexicoTime.format('HH:mm [CST]'),
        date: mexicoTime.format('DD.MMM.YY').toLowerCase()
      };
    case 'datetime':
    default:
      return `${mexicoTime.format('DD MMM YYYY').toLowerCase()} | ${mexicoTime.format('HH:mm [CST]')}`;
  }
};

/**
 * Format updated time according to the following rules:
 * - If updated within 60 seconds → show: "Actualizado hace un momento"
 * - If updated within 12 hours → show: "Actualizado hace X minutos" or "Actualizado hace X horas"
 * - If updated more than 12 hours → show: "Actualizado DD MMM YYYY | HH:mm CST"
 * @param updatedAt - ISO date string of the update time
 * @returns Formatted update time string
 */

export const formatUpdatedTime = (updatedAt?: string): string => {
  if (!updatedAt) return '';

  const now = moment();
  const updatedTime = moment(updatedAt);
  const diffMinutes = now.diff(updatedTime, 'minutes');
  const diffHours = now.diff(updatedTime, 'hours');
  const diffSeconds = now.diff(updatedTime, 'seconds');

  // If updated within the last minute
  if (diffSeconds < 60) {
    return i18n.t('screens.common.updated.momentAgo');
  }

  // If updated within 12 hours
  if (diffHours < 12) {
    if (diffMinutes < 60) {
      return diffMinutes === 1
        ? i18n.t('screens.common.updated.oneMinuteAgo')
        : i18n.t('screens.common.updated.minutesAgo', { count: diffMinutes });
    } else {
      return diffHours === 1
        ? i18n.t('screens.common.updated.oneHourAgo')
        : i18n.t('screens.common.updated.hoursAgo', { count: diffHours });
    }
  }

  return i18n.t('screens.common.updated.fullDate', {
    date: moment(updatedAt)
      .tz('America/Mexico_City')
      .locale('es-no-dot')
      .format('DD MMM YYYY | HH:mm [CST]')
  });
};

export function getUpcomingOrLiveShows(schedule: ProgramacionItem[]): ProgramacionItem[] {
  const currentTime = moment().tz('America/Mexico_City');
  return schedule.filter((item) => {
    const startTime = moment.tz(
      `${currentTime.format('YYYY-MM-DD')}T${item.airtime}`,
      'YYYY-MM-DDTHH:mm:ss',
      'America/Mexico_City'
    );

    const endTime = startTime.clone().add(parseInt(item.duration, 10), 'minutes');

    if (endTime.isBefore(startTime)) {
      endTime.add(1, 'day');
    }

    return currentTime.isSameOrBefore(endTime);
  });
}

export function getShowsTimeRange(airTime: string, durationMinutes: number) {
  let [hours, minutes] = airTime.split(':').map(Number);

  const startHours = hours;
  const startMinutes = minutes;

  minutes += durationMinutes;

  while (minutes >= 60) {
    minutes -= 60;
    hours += 1;
  }
  if (hours >= 24) hours -= 24;

  const startTotalMinutes = startHours * 60 + startMinutes;
  const endTotalMinutes = (startTotalMinutes + durationMinutes) % (24 * 60);
  const startH = Math.floor(startTotalMinutes / 60) % 24;
  const startM = startTotalMinutes % 60;
  const endH = Math.floor(endTotalMinutes / 60);
  const endM = endTotalMinutes % 60;

  const format = (h: number, m: number) =>
    h.toString().padStart(2, '0') + ':' + m.toString().padStart(2, '0');

  return `${format(startH, startM)} - ${format(endH, endM)} CST`;
}

export const formatMexicoDateOnly = (utcDate: string): string => {
  const mexicoTime = moment.utc(utcDate).tz('America/Mexico_City');
  mexicoTime.locale('es-no-dot');
  return mexicoTime.format('DD MMM YYYY');
};

export const formatEventDate = (dateString: string) => {
  const date = new Date(dateString);

  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: 'long'
  }).format(date);
};

export const getDayFromDate = (dateString: string) => {
  const date = new Date(dateString);

  const day = date.toLocaleDateString('es-ES', {
    weekday: 'long'
  });

  return day.charAt(0).toUpperCase() + day.slice(1);
};

/**
 * Returns the current timestamp formatted as YYYY-MM-DD HH:mm:ss
 * This utility function can be used anywhere in the app to get signal time format
 *
 * @example
 * signalTime: getCurrentSignalTime() // → "2025-09-02 14:27:09"
 */

export const getCurrentSignalTime = (): string =>
  moment().tz('America/Mexico_City').format('YYYY-MM-DD HH:mm:ss');

export const getDayandWeeekdayFromDate = (dateString: string) => {
  const date = new Date(dateString);

  const day = date.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: '2-digit'
  });

  return day;
};
