import { format, formatDistanceToNow } from 'date-fns';
import moment from 'moment';

// ----------------------------------------------------------------------

export function fDate(date: string | number | Date, formatStr: string = 'dd/MM/yyy') {
  return format(new Date(date), formatStr);
}

export function fDateTime(date: string | number | Date) {
  return format(new Date(date), 'dd/MM/yyyy HH:mm');
}

export function fDateTimeSuffix(date: string | number | Date) {
  return format(new Date(date), 'dd/MM/yyyy hh:mm p');
}

export function fToNow(date: string | number | Date) {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
  });
}

export const DATE_FORMAT = 'DD/MM/YYYY';

export const convertStrToDate = (string: string, format = DATE_FORMAT) => moment(string, format);

export const convertDateToStr = (date: string, format = DATE_FORMAT) =>
  moment(date).isValid() ? moment(date).format(format).toString() : '-';
