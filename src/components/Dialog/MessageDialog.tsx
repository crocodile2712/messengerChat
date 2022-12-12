import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  isSuccess: boolean;
  successMessage: string;
  errorMessage: string;
}

const MessageDialog = (props: Props) => {
  const { isOpen, isSuccess, onClose, errorMessage, successMessage } = props;
  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="s465" fullWidth>
      <DialogContent
        sx={{
          textAlign: 'center',
          height: 200,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CheckCircleOutlineIcon
          sx={{
            color: isSuccess ? 'success.dark' : 'error.dark',
            width: 50,
            height: 50,
            mb: 2,
          }}
        />
        <DialogContentText
          variant="h5"
          color={isSuccess ? 'success.dark' : 'error.dark'}
        >
          {isSuccess ? successMessage : errorMessage}
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
};

export default MessageDialog;
