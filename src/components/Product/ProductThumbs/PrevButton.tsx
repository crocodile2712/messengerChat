import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';

interface Props {
  enabled: boolean;
  onPrev: () => void;
}

const PrevButton = (props: Props) => {
  const { enabled, onPrev } = props;

  return (
    <Box
      sx={{
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        color: 'common.white',
        zIndex: 2,
        left: 5,
      }}
    >
      <IconButton
        disabled={!enabled}
        onClick={onPrev}
        color="inherit"
        sx={{ borderRadius: '50%' }}
      >
        <NavigateBeforeIcon fontSize="large" />
      </IconButton>
    </Box>
  );
};

export default PrevButton;
