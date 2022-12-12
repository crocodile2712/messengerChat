import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';

interface Props {
  enabled: boolean;
  onNext: () => void;
}

const NextButton = (props: Props) => {
  const { enabled, onNext } = props;

  return (
    <Box
      sx={{
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        color: 'common.white',
        zIndex: 2,
        right: 5,
      }}
    >
      <IconButton
        disabled={!enabled}
        onClick={onNext}
        color="inherit"
        sx={{ borderRadius: '50%' }}
      >
        <NavigateNextIcon fontSize="large" />
      </IconButton>
    </Box>
  );
};

export default NextButton;
