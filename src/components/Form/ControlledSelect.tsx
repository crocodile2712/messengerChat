import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import type { SelectChangeEvent, SelectProps } from '@mui/material/Select';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import type { Dictionary } from 'types/common';
import PlaceHolder from './PlaceHolder';

interface Option extends Dictionary {
  id: number;
}

interface Label extends Option {
  name: string;
}

interface Props<O extends Option[]>
  extends Omit<SelectProps<number | null>, 'name'> {
  options: O;
  selector: (option: O[number]) => string;
  onChangeSelect: (id: number) => Promise<void> | void;
  value: number | null;
  name: string;
  title?: string;
}

const ControlledSelect = <O extends Option[]>(props: Props<O>) => {
  const {
    options,
    selector,
    onChangeSelect,
    value,
    title,
    name,
    placeholder,
    label,
    disabled,
    ...rest
  } = props;

  const { t } = useTranslation();

  const labels = options.reduce<Record<number, Label>>((acc, option) => {
    const { id } = option;
    acc[id] = { id, name: selector(option) };
    return acc;
  }, {});

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      {title ? (
        <FormLabel htmlFor={name}>
          <Typography
            variant="subtitle2"
            gutterBottom
            sx={{ ml: 0.5, color: 'text.primary' }}
          >
            {title}
          </Typography>
        </FormLabel>
      ) : null}
      <FormControl fullWidth size="small">
        {label && <InputLabel id={`${name}-label`}>{label}</InputLabel>}
        <Select<number | null>
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
          value={typeof value === 'number' && value in labels ? value : -1}
          onChange={(event: SelectChangeEvent<number | null>) => {
            onChangeSelect(Number(event.target.value));
          }}
          {...rest}
        >
          {options.length && placeholder && (
            <MenuItem value={-1} disabled>
              {placeholder}
            </MenuItem>
          )}
          {!options.length && (
            <MenuItem value={-1} disabled>
              {t('placeholder.noOptions')}
            </MenuItem>
          )}
          {options.map((option, i) => {
            const { id } = option;
            return (
              <MenuItem key={i} value={id}>
                {labels[id].name}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </Box>
  );
};

export default ControlledSelect;
