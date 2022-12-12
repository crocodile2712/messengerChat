import Box from '@mui/material/Box';
import type { FormHTMLAttributes } from 'react';

const DialogForm = (props: FormHTMLAttributes<HTMLFormElement>) => {
  return <Box component="form" noValidate {...props} />;
};

export default DialogForm;
