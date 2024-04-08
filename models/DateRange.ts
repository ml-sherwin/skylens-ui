import { format } from 'date-fns';
import type IDateRange from '@/interface/IDateRange';

class DateRange implements IDateRange {
  start: Date;
  end: Date;
  
  constructor(start: Date, end: Date) {
    this.start = start;
    this.end = end;
  }

  toString() {
    return `${format(this.start, 'yyyy/MM/dd')} - ${format(
      this.end,
      'yyyy/MM/dd'
    )}`;
  }
}

export default DateRange;
