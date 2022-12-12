import _compareDesc from 'date-fns/compareDesc';
import _format from 'date-fns/format';
import _isValid from 'date-fns/isValid';

class DateFns {
  public format(
    date: Date | number,
    pattern: string,
    options?: Parameters<typeof _format>[2]
  ) {
    return _format(date, pattern, options);
  }

  public compare(from: Date, to: Date): number {
    return _compareDesc(from, to);
  }

  public isValid(date: any): date is Date {
    return _isValid(date);
  }

  public getDateStringNow(): string {
    const date = new Date(Date.now());
    const days = [
      'Chủ Nhật',
      'Thứ Hai',
      'Thứ Ba',
      'Thứ Tư',
      'Thứ Năm',
      'Thứ Sáu',
      'Thứ Bảy',
    ];
    return (
      days[date.getDay()] +
      ', ngày ' +
      date.getDate() +
      ', tháng ' +
      (date.getMonth() + 1) +
      ', năm ' +
      date.getFullYear()
    );
  }
}

const instance = new DateFns();

// Implicit binding 'this' here
export const { isValid, format, compare } = instance;
export default instance;
