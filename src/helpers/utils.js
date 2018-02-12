import moment from 'moment';

const isBetween = (point, start, end) => moment(point).isBetween(moment(start), moment(end));

const isSame = (point, start) => moment(point).isSame(moment(start));

const LIMITS = {
  start: '8:30:00',
  end: '18:30:00',
};
const format = 'hh:mm:ss';

export const min = moment(LIMITS.start, format);
export const max = moment(LIMITS.end, format);

export const utils = {
  isBusy: (start, end, events) => {
    return events.some(event => {
      if(isBetween(event.start, start, end)){
        return true;
      }
      if(isBetween(event.end, start, end)){
        return true;
      }
      if(isBetween(start, event.start, event.end)){
        return true;
      }
      if (isBetween(end, event.start, event.end)){
        return true;
      }
      if (isSame(end, event.end)){
        return true;
      }
      if (isSame(start, event.start)){
        return true;
      }
      return false;
      }
    )
  },

  isWorkTime: (start, end) => {
    const time = (date) => [date.getHours(), date.getMinutes(), '00'].join(':');

    if(moment(time(start), format).isBetween(min, max) && moment(time(end), format).isBetween(min, max)){
      return true;
    }
    return false;
  },

  isInFuture: (start, end) => {
    const now = moment();
    if(moment(start).isAfter(now) && moment(end).isAfter(now)){
      return true;
    }
    return false;
  },

  isWeekend: (date) => {
    const day = date.getDay();
    return [0,6].includes(day);
  },

  isSame: (start, end, event) => {
    return isSame(start, event.start) && isSame(end, event.end);
  },

  transformDate: (arr) => arr.map(el =>{
    el.start = new Date(el.start);
    el.end = new Date(el.end);
    return el;
  }),

}
