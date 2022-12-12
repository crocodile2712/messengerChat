import TextField from '@mui/material/TextField';
import { styled } from '@mui/system';
import type {TextFieldProps} from '@mui/material/TextField';

const NumberInput = (props: TextFieldProps) => {
  return <Input type='number' {...props}/>
}

const Input = styled(TextField)(({
  '& input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button':
    {
      WebkitAppearance: 'none',
      margin: 0,
    },
}));

export default NumberInput;
