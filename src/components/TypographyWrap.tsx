import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

const TypographyWrap = styled(Typography)(() => ({
  wordBreak: 'break-all',
  whiteSpace: 'normal',
  overflowWrap: 'break-word',
}));

export default TypographyWrap;
