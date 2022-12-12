import type { BoxProps } from '@mui/material/Box';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import type { StackProps } from '@mui/material/Stack';
import Stack from '@mui/material/Stack';
import type { FCC } from 'types/react';

interface Props {
  BoxProps?: BoxProps;
  StackProps?: StackProps;
  divider?: boolean;
}

const DialogFooter: FCC<Props> = (props) => {
  const { children, BoxProps, StackProps, divider } = props;
  return (
    <Box {...BoxProps}>
      {divider && <Divider />}
      <Box sx={{ display: 'flex', justifyContent: 'center', px: 3, py: 2 }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1}
          sx={{ width: 1, justifyContent: 'flex-end', alignItems: 'center' }}
          {...StackProps}
        >
          {children}
        </Stack>
      </Box>
    </Box>
  );
};

export default DialogFooter;
