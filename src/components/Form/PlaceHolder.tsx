import { styled } from '@mui/material/styles';

const PlaceHolder = styled('span')(({ theme }) => ({
  color: theme.palette.text.secondary,
  opacity: 1,
  // textOverflow: 'ellipsis',
  // userSelect: 'none',
  // pointerEvents: 'none',
}));

export default PlaceHolder;
