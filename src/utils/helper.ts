import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { parseColor } from 'tailwindcss/lib/util/color';
import { get, set } from 'lodash';
import { useTranslation } from 'react-i18next';

dayjs.extend(duration);

const cutText = (text: string, length: number) => {
  if (text.split(' ').length > 1) {
    const string = text.substring(0, length);
    const splitText = string.split(' ');
    splitText.pop();
    return splitText.join(' ') + '...';
  } else {
    return text;
  }
};

// const formatDate = (date: string, format: string) => {
//   return dayjs(date).format(format);
// };

const capitalizeFirstLetter = (string: string) => {
  if (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  } else {
    return '';
  }
};

const onlyNumber = (string: string) => {
  if (string) {
    return string.replace(/\D/g, '');
  } else {
    return '';
  }
};

const formatCurrency = (number: number) => {
  if (number) {
    const formattedNumber = number.toString().replace(/\D/g, '');
    const rest = formattedNumber.length % 3;
    let currency = formattedNumber.substr(0, rest);
    const thousand = formattedNumber.substr(rest).match(/\d{3}/g);
    let separator;

    if (thousand) {
      separator = rest ? ',' : '';
      currency += separator + thousand.join(',');
    }

    return currency;
  } else {
    return '';
  }
};

const timeAgo = (time: string) => {
  const date = new Date((time || '').replace(/-/g, '/').replace(/[TZ]/g, ' '));
  const diff = (new Date().getTime() - date.getTime()) / 1000;
  const dayDiff = Math.floor(diff / 86400);

  if (isNaN(dayDiff) || dayDiff < 0 || dayDiff >= 31) {
    return dayjs(time).format('MMMM DD, YYYY');
  }

  return (
    (dayDiff === 0 &&
      ((diff < 60 && 'just now') ||
        (diff < 120 && '1 minute ago') ||
        (diff < 3600 && Math.floor(diff / 60) + ' minutes ago') ||
        (diff < 7200 && '1 hour ago') ||
        (diff < 86400 && Math.floor(diff / 3600) + ' hours ago'))) ||
    (dayDiff === 1 && 'Yesterday') ||
    (dayDiff < 7 && dayDiff + ' days ago') ||
    (dayDiff < 31 && Math.ceil(dayDiff / 7) + ' weeks ago')
  );
};

const diffTimeByNow = (time: string) => {
  const startDate = dayjs(dayjs().format('YYYY-MM-DD HH:mm:ss').toString());
  const endDate = dayjs(dayjs(time).format('YYYY-MM-DD HH:mm:ss').toString());

  const duration = dayjs.duration(endDate.diff(startDate));
  const milliseconds = Math.floor(duration.asMilliseconds());

  const days = Math.round(milliseconds / 86400000);
  const hours = Math.round((milliseconds % 86400000) / 3600000);
  let minutes = Math.round(((milliseconds % 86400000) % 3600000) / 60000);
  const seconds = Math.round((((milliseconds % 86400000) % 3600000) % 60000) / 1000);

  if (seconds < 30 && seconds >= 0) {
    minutes += 1;
  }

  return {
    days: days.toString().length < 2 ? '0' + days : days,
    hours: hours.toString().length < 2 ? '0' + hours : hours,
    minutes: minutes.toString().length < 2 ? '0' + minutes : minutes,
    seconds: seconds.toString().length < 2 ? '0' + seconds : seconds
  };
};

const isset = (obj: object | string) => {
  if (obj !== null && obj !== undefined) {
    if (typeof obj === 'object' || Array.isArray(obj)) {
      return Object.keys(obj).length;
    } else {
      return obj.toString().length;
    }
  }

  return false;
};

const timeLine = (time: number) => {
  const hours = Math.floor(time / 60);
  const remainderMinutes = time % 60;
  const { t } = useTranslation();

  return `${hours} ${t('hours')}, ${remainderMinutes} ${t('minutes')}`;
};

const toRaw = (obj: object) => {
  return JSON.parse(JSON.stringify(obj));
};

const randomNumbers = (from: number, to: number, length: number) => {
  const numbers = [0];
  for (let i = 1; i < length; i++) {
    numbers.push(Math.ceil(Math.random() * (from - to) + to));
  }

  return numbers;
};

const toRGB = (value: string) => {
  return parseColor(value).color.join(' ');
};

const stringToHTML = (arg: string) => {
  const parser = new DOMParser(),
    DOM = parser.parseFromString(arg, 'text/html');
  return DOM.body.childNodes[0] as HTMLElement;
};

const slideUp = (el: HTMLElement, duration = 300, callback = (el: HTMLElement) => { }) => {
  el.style.transitionProperty = 'height, margin, padding';
  el.style.transitionDuration = duration + 'ms';
  el.style.height = el.offsetHeight + 'px';
  el.offsetHeight;
  el.style.overflow = 'hidden';
  el.style.height = '0';
  el.style.paddingTop = '0';
  el.style.paddingBottom = '0';
  el.style.marginTop = '0';
  el.style.marginBottom = '0';
  window.setTimeout(() => {
    el.style.display = 'none';
    el.style.removeProperty('height');
    el.style.removeProperty('padding-top');
    el.style.removeProperty('padding-bottom');
    el.style.removeProperty('margin-top');
    el.style.removeProperty('margin-bottom');
    el.style.removeProperty('overflow');
    el.style.removeProperty('transition-duration');
    el.style.removeProperty('transition-property');
    callback(el);
  }, duration);
};

const slideDown = (el: HTMLElement, duration = 300, callback = (el: HTMLElement) => { }) => {
  el.style.removeProperty('display');
  let display = window.getComputedStyle(el).display;
  if (display === 'none') display = 'block';
  el.style.display = display;
  let height = el.offsetHeight;
  el.style.overflow = 'hidden';
  el.style.height = '0';
  el.style.paddingTop = '0';
  el.style.paddingBottom = '0';
  el.style.marginTop = '0';
  el.style.marginBottom = '0';
  el.offsetHeight;
  el.style.transitionProperty = 'height, margin, padding';
  el.style.transitionDuration = duration + 'ms';
  el.style.height = height + 'px';
  el.style.removeProperty('padding-top');
  el.style.removeProperty('padding-bottom');
  el.style.removeProperty('margin-top');
  el.style.removeProperty('margin-bottom');
  window.setTimeout(() => {
    el.style.removeProperty('height');
    el.style.removeProperty('overflow');
    el.style.removeProperty('transition-duration');
    el.style.removeProperty('transition-property');
    callback(el);
  }, duration);
};

const paramsStrToObj = (paramsStr: string = '') => {
  const params = {};
  paramsStr = paramsStr?.slice(1);
  const paramsArr = paramsStr?.split('&');
  paramsArr?.forEach((item) => {
    const [key, value] = item?.split('=');
    if (get(params, key)) {
      let values: any[] = [];
      if (get(params, key) instanceof Array) {
        values.concat(get(params, key));
      } else {
        values = [get(params, key)];
      }
      values.push(value);
      set(params, key, values);
    } else {
      set(params, key, value);
    }
  });
  return params;
};

const getTimeDifference = (startTime: string, endTime?: string | null): string => {
  const start = new Date(startTime);

  // endTime bo‘lmasa — hozirgi vaqtni olamiz
  const end = endTime ? new Date(endTime) : new Date();

  // Vaqt farqini millisekundlarda hisoblaymiz
  const diffMs = Math.abs(end.getTime() - start.getTime());

  // Millisekundlarni soat va daqiqalarga aylantiramiz
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

  // Format: hh:mm
  const formattedHours = String(diffHours).padStart(2);
  const formattedMinutes = String(diffMinutes).padStart(2);

  return `${formattedHours} h ${formattedMinutes} min`;
};


function formatDate(date?: Date | string | null): string {
  if (!date) return ''; // Agar undefined yoki null bo‘lsa, bo‘sh satr qaytaradi

  const d = new Date(date);
  if (isNaN(d.getTime())) return ''; // Agar noto‘g‘ri sana bo‘lsa (invalid date)

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`
}

function toHHmm(totalMinutes: number | null | undefined): string {
  if (totalMinutes == null) return "-";
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const hh = String(hours).padStart(2, "0");
  const mm = String(minutes).padStart(2, "0");

  return `${hh}:${mm}`;
}


const addHours = (timeStr: any, hoursToAdd = 5) => {
  if (!timeStr) return "";

  const [h, m] = timeStr.split(":").map(Number);

  const date = new Date();
  date.setHours(h);
  date.setMinutes(m);

  date.setHours(date.getHours() + hoursToAdd);

  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");

  return `${hh}:${mm}`;
};

export {
  cutText,
  formatDate,
  capitalizeFirstLetter,
  onlyNumber,
  formatCurrency,
  timeAgo,
  diffTimeByNow,
  isset,
  toRaw,
  randomNumbers,
  toRGB,
  stringToHTML,
  slideUp,
  slideDown,
  paramsStrToObj,
  timeLine,
  getTimeDifference,
  toHHmm,
  addHours
};
