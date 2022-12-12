import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import type { SelectChangeEvent, SelectProps } from '@mui/material/Select';
import Select from '@mui/material/Select';
import { Fragment } from 'react';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import PlaceHolder from './PlaceHolder';

interface Option extends FieldValues {
  id: number;
}

interface Label extends Option {
  name: string;
}

interface Props<T, O extends Option[]>
  extends Omit<SelectProps<number>, 'name'> {
  control: Control<T>;
  name: FieldPath<T>;
  options: O;
  selector: (option: O[number]) => string;
  onChangeSelect?: (id: number) => Promise<void> | void;
  getOptionDisabled?: (option: O[number]) => boolean;
  placeholder: string;
  prerequisiteText?: string;
}

const ControllerSelect = <T extends FieldValues, O extends Option[]>(
  props: Props<T, O>
) => {
  const {
    control,
    name,
    options,
    selector,
    onChangeSelect,
    disabled,
    label,
    placeholder,
    prerequisiteText,
    getOptionDisabled,
    ...rest
  } = props;

  const { t } = useTranslation();

  const labels = options.reduce<Record<number, Label>>((acc, option) => {
    const { id } = option;
    acc[id] = { id, name: selector(option) };
    return acc;
  }, {});

  return (
    <Controller
      render={({ field: { value, ...others }, fieldState: { error } }) => (
        <FormControl fullWidth size="small" error={Boolean(error)}>
          {label && <InputLabel id={`${name}-label`}>{label}</InputLabel>}
          <Select<number>
            id={name}
            label={label}
            labelId={`${name}-label`}
            disabled={disabled}
            {...(disabled && {
              IconComponent: () => null,
            })}
            multiple={false}
            renderValue={(value) => {
              if (!value || value === -1 || !(value in labels)) {
                return <PlaceHolder>{!disabled && placeholder}</PlaceHolder>;
              }
              return <Fragment>{labels[value].name}</Fragment>;
            }}
            {...others}
            {...rest}
            value={typeof value === 'number' && value in labels ? value : -1}
            onChange={(event: SelectChangeEvent<number>) => {
              others.onChange(event);
              if (onChangeSelect) {
                onChangeSelect(Number(event.target.value));
              }
            }}
          >
            {options.length > 0 && placeholder && (
              <MenuItem value={-1} disabled>
                {placeholder}
              </MenuItem>
            )}
            {!options.length && !prerequisiteText && (
              <MenuItem value={-1} disabled>
                {t('placeholder.noOptions')}
              </MenuItem>
            )}
            {!options.length && prerequisiteText && (
              <MenuItem value={-1} disabled>
                {prerequisiteText}
              </MenuItem>
            )}
            {options.map((option, i) => {
              const { id } = option;
              const disabled = getOptionDisabled
                ? getOptionDisabled(option)
                : void 0;
              return (
                <MenuItem key={i} value={id} disabled={disabled}>
                  {labels[id].name}
                </MenuItem>
              );
            })}
          </Select>
          {error?.message && (
            <FormHelperText variant="outlined">
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

export default ControllerSelect;
