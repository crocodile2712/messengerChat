import { styled } from '@mui/material/styles';

const SlideViewport = styled('div')({
  overflow: 'hidden',
  width: '100%',
  '&.is-draggable': {
    cursor: 'grab',
  },
  '&.is-dragging': {
    cursor: 'grabbing',
  },
});

export default SlideViewport;
