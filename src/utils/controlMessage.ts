import { AxiosError } from 'axios';

type ErrorCode =
  | 'IEM1'
  | 'IEM2'
  | 'IEM3'
  | 'IEM4'
  | 'IEM5'
  | 'IEM6'
  | 'IEM7'
  | 'IEM8'
  | 'IEM9'
  | 'IEM10'
  | 'IEM11'
  | 'IEM12'
  | 'IEM13'
  | 'IEM14'
  | 'IEM15'
  | 'IEM16'
  | 'IEM17'
  | 'IEM18'
  | 'IEM19'
  | 'IEM20'
  | 'IEM21'
  | 'IEM22'
  | 'IEM23'
  | 'IEM24'
  | 'IEM25'
  | 'IEM26'
  | 'IEM27'
  | 'IEM28'
  | 'IEM29'
  | 'IEM30'
  | 'IEM31'
  | 'IEM32'
  | 'IEM33'
  | 'IEM34'
  | 'IEM35'
  | 'IEM36'
  | 'IEM37'
  | 'IEM38'
  | 'IEM39'
  | 'IEM40'
  | 'IEM41'
  | 'IEM42'
  | 'IEM43'
  | 'IEM44'
  | 'IEM45'
  | 'IEM46'
  | 'IEM47'
  | 'IEM48'
  | 'IEM49'
  | 'IEM50';

const messages: Record<ErrorCode, string> = {
  IEM1: 'messageByCode.IEM1',
  IEM2: 'messageByCode.IEM2',
  IEM3: 'messageByCode.IEM3',
  IEM4: 'messageByCode.IEM4',
  IEM5: 'messageByCode.IEM5',
  IEM6: 'messageByCode.IEM6',
  IEM7: 'messageByCode.IEM7',
  IEM8: 'messageByCode.IEM8',
  IEM9: 'messageByCode.IEM9',
  IEM10: 'messageByCode.IEM10',
  IEM11: 'messageByCode.IEM11',
  IEM12: 'messageByCode.IEM12',
  IEM13: 'messageByCode.IEM13',
  IEM14: 'messageByCode.IEM14',
  IEM15: 'messageByCode.IEM15',
  IEM16: 'messageByCode.IEM16',
  IEM17: 'messageByCode.IEM17',
  IEM18: 'messageByCode.IEM18',
  IEM19: 'messageByCode.IEM19',
  IEM20: 'messageByCode.IEM20',
  IEM21: 'messageByCode.IEM21',
  IEM22: 'messageByCode.IEM22',
  IEM23: 'messageByCode.IEM23',
  IEM24: 'messageByCode.IEM24',
  IEM25: 'messageByCode.IEM25',
  IEM26: 'messageByCode.IEM26',
  IEM27: 'messageByCode.IEM27',
  IEM28: 'messageByCode.IEM28',
  IEM29: 'messageByCode.IEM29',
  IEM30: 'messageByCode.IEM30',
  IEM31: 'messageByCode.IEM31',
  IEM32: 'messageByCode.IEM32',
  IEM33: 'messageByCode.IEM33',
  IEM34: 'messageByCode.IEM34',
  IEM35: 'messageByCode.IEM35',
  IEM36: 'messageByCode.IEM36',
  IEM37: 'messageByCode.IEM37',
  IEM38: 'messageByCode.IEM38',
  IEM39: 'messageByCode.IEM39',
  IEM40: 'messageByCode.IEM40',
  IEM41: 'messageByCode.IEM41',
  IEM42: 'messageByCode.IEM42',
  IEM43: 'messageByCode.IEM43',
  IEM44: 'messageByCode.IEM44',
  IEM45: 'messageByCode.IEM45',
  IEM46: 'messageByCode.IEM46',
  IEM47: 'messageByCode.IEM47',
  IEM48: 'messageByCode.IEM48',
  IEM49: 'messageByCode.IEM49',
  IEM50: 'messageByCode.IEM50',
};

const getMessageError = (error: any) => {
  if (error instanceof AxiosError) {
    const code = (error?.response?.data?.message as ErrorCode) || '';
    return code in messages ? messages[code] : null;
  }
  return 'message.systemError';
};

export default getMessageError;
