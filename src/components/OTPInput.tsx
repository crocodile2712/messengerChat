import Box from '@mui/material/Box';
import { outlinedInputClasses } from '@mui/material/OutlinedInput';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import { useEffect, useRef } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { ChangeEvent, ClipboardEvent } from 'types/react';
import Regexs from 'utils/Regexs';

interface Props {
  values: string[];
  setValues: Dispatch<SetStateAction<string[]>>;
}

const OTPInput = (props: Props) => {
  const { values, setValues } = props;

  const refs = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null));

  const handleChange: (index: number) => ChangeEvent = (index) => (event) => {
    const value = event.target.value.trim();
    const nextIndex = index + 1;
    const prevIndex = index - 1;

    // Accept only number
    if (!Regexs.number.test(value)) {
      return;
    }

    setValues((state) => {
      const values = [...state];
      values[index] = value;
      return values;
    });

    if (value && !values[nextIndex]) {
      refs.current[nextIndex]?.focus();
    } else if (!value && !values[nextIndex]) {
      refs.current[prevIndex]?.focus();
    } else if (!value) {
      setValues((state) => {
        const values = [...state];
        values.splice(index, 1);
        values.push('');
        return values;
      });
    }
  };

  const handlePaste: ClipboardEvent = (event) => {
    event.preventDefault();
    const text = event.clipboardData.getData('text/plain');
    const values = [...text];

    const isNumber = values.every((value) => Regexs.number.test(value));

    if (values.length === 6 && isNumber) {
      setValues(values);
    }
  };

  // Auto focus
  useEffect(() => {
    if (refs.current) {
      refs.current[0]?.focus();
    }
  }, []);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      {values.map((value, i) => (
        <Input
          key={i}
          inputRef={(ref: HTMLInputElement) => {
            refs.current[i] = ref;
          }}
          inputProps={{ maxLength: 1 }}
          variant="outlined"
          value={value}
          onChange={handleChange(i)}
          onPaste={handlePaste}
        />
      ))}
    </Box>
  );
};

const Input = styled(TextField)({
  [`& .${outlinedInputClasses.input}`]: {
    fontWeight: 500,
    textAlign: 'center',
    padding: 0,
    width: 50,
    height: 50,
  },
  '& + &': {
    marginLeft: 8,
  },
});

export default OTPInput;
