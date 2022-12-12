import type { BoxProps } from '@mui/material/Box';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

const DialogContent = (props: BoxProps) => {
  const { children, ...rest } = props;
  return <Wrapper {...rest}>{children}</Wrapper>;
};

const Wrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
}));

export default DialogContent;
