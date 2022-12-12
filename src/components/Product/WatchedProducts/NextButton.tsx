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

  return (
    <Box
      sx={{
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 2,
        right: {
          xs: 8,
          sm: 10,
          md: -24,
        },
      }}
    >
      <IconButton
        disabled={!enabled}
        onClick={onNext}
        color="inherit"
        sx={{
          borderRadius: '50%',
          p: {
            xs: 1,
            sm: 1.25,
            md: 1.5,
          },
          bgcolor: 'grey.200',
          '&:hover': {
            bgcolor: 'grey.300',
          },
          '&.Mui-disabled': {
            bgcolor: 'grey.100',
          },
        }}
      >
        <ArrowForwardIcon fontSize={sm ? 'small' : 'medium'} />
      </IconButton>
    </Box>
  );
};

export default NextButton;
