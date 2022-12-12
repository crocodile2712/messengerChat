import { styled } from '@mui/material/styles';

const SlideImage = styled('img')({
  position: 'absolute',
  display: 'block',
  top: '50%',
  left: '50%',
  height: '100%',
  width: 'auto',
  minHeight: '100%',
  minWidth: '100%',
  maxWidth: 'none',
  transform: 'translate(-50%, -50%)',
  objectFit: 'cover',
});

export default SlideImage;
