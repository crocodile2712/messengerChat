import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';

interface Props {
  index: number;
  selectedIndex: number;
  src: string;
  scrollTo: (index: number) => void;
}

const Thumb = (props: Props) => {
  const { index, selectedIndex, src, scrollTo } = props;

  const handleScrollTo = () => {
    scrollTo(index);
  };

  return (
    <ButtonBase
      onClick={handleScrollTo}
      sx={{
        position: 'relative',
        overflow: 'hidden',
        height: 100,
        touchAction: 'manipulation',
        cursor: 'pointer',
        border: 0,
        outline: 0,
        margin: 0,
        padding: 0,
        width: 1,
        backgroundColor: 'transparent',
        display: 'block',
      }}
    >
      <Box
        component="img"
        src={src}
        alt="Product image"
        sx={{
          position: 'absolute',
          opacity: index === selectedIndex ? 1 : 0.2,
          top: 0,
          bottom: 0,
          left: '-10000%',
          right: '-10000%',
          margin: 'auto',
          minWidth: '1000%',
          minHeight: '1000%',
          maxWidth: 'none',
          transform: 'scale(0.1)',
          transition: 'opacity 0.2s',
          height: 'auto',
        }}
      />
    </ButtonBase>
  );
};

export default Thumb;
