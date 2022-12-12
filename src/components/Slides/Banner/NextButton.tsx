import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

interface Props {
  enabled: boolean;
  onNext: () => void;
}

const NextButton = (props: Props) => {
  const { enabled, onNext } = props;
  const theme = useTheme();
  const sm = useMediaQuery(theme.breakpoints.down('sm'));

  if (sm) {
    return null;
  }

  return (
    <Box
      sx={{
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        color: 'common.white',
        zIndex: 2,
        right: 10,
      }}
    >
      <IconButton
        disabled={!enabled}
        onClick={onNext}
        color="inherit"
        sx={{ borderRadius: '50%', p: 1.25 }}
      >
        <ArrowForwardIcon fontSize="medium" />
      </IconButton>
    </Box>
  );
};

export default NextButton;
