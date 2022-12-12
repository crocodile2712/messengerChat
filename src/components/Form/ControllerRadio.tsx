import FormControl from '@mui/material/FormControl';
import type { FormControlLabelProps } from '@mui/material/FormControlLabel';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Radio from '@mui/material/Radio';
import type { RadioGroupProps } from '@mui/material/RadioGroup';
import RadioGroup from '@mui/material/RadioGroup';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

interface Option {
  value: string | number;
  label: string;
}

interface Props<T extends FieldValues>
  extends Omit<FormControlLabelProps, 'control' | 'label'> {
  control: Control<T>;
  name: FieldPath<T>;
  options: Option[];
  row?: RadioGroupProps['row'];
  onChangeSelect?: (value: string) => void;
}

const ControllerRadio = <T extends FieldValues>(props: Props<T>) => {
  const { control, name, options, row, onChangeSelect, ...rest } = props;
  const { t } = useTranslation();

  return (
    <Controller
      render={({ field, fieldState: { error } }) => (
        <FormControl error={Boolean(error)}>
          <RadioGroup
            row={row}
            {...field}
            onChange={(event) => {
              const value = event.target.value;
              field.onChange(value);
              if (onChangeSelect) {
                onChangeSelect(value);
              }
            }}
          >
            {options.map(({ value, label }) => (
              <FormControlLabel
                {...rest}
                key={value}
                value={value}
                control={<Radio />}
                label={label}
              />
            ))}
          </RadioGroup>
          {error?.message && (
            <FormHelperText variant="standard">
              {t(error.message)}
            </FormHelperText>
          )}
        </FormControl>
      )}
      name={name}
      control={control}
    />
  );
};

export default ControllerRadio;
