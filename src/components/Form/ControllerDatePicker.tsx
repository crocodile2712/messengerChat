import type { TextFieldProps } from '@mui/material/TextField';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import type { DatePickerProps } from '@mui/x-date-pickers/DatePicker';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

interface Props<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  TextFieldProps?: TextFieldProps;
  DatePickerProps?: Partial<DatePickerProps<Date | null, Date>>;
}

const ControllerDatePicker = <T extends FieldValues>(props: Props<T>) => {
  const { control, name, DatePickerProps, TextFieldProps } = props;

  const { t } = useTranslation();

  return (
    <Controller
      render={({ field: { ref, ...others }, fieldState: { error } }) => (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            {...others}
            {...DatePickerProps}
            renderInput={(props) => (
              <TextField
                {...props}
                {...TextFieldProps}
                fullWidth
                error={Boolean(error)}
                helperText={error?.message && t(error.message)}
                id={name}
              />
            )}
            InputAdornmentProps={{
              position: 'end',
            }}
            inputFormat="dd/MM/yyyy"
          />
        </LocalizationProvider>
      )}
      name={name}
      control={control}
    />
  );
};

export default ControllerDatePicker;
