import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

interface Props {
  enabled: boolean;
  onPrev: () => void;
}

const PrevButton = (props: Props) => {
  const { enabled, onPrev } = props;
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
        left: 10,
      }}
    >
      <IconButton
        disabled={!enabled}
        onClick={onPrev}
        color="inherit"
        sx={{ borderRadius: '50%', p: 1.25 }}
      >
        <ArrowBackIcon fontSize="medium" />
      </IconButton>
    </Box>
  );
};

export default PrevButton;
