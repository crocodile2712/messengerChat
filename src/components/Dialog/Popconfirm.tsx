import type { SvgIconComponent } from '@mui/icons-material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import { useState } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: () => Promise<void>;
  onRefresh: () => void;
  content: {
    title: string;
    description: string;
    cancelLabel: string;
    submitLabel: string;
    cancelIcon?: SvgIconComponent;
    submitIcon?: SvgIconComponent;
  };
}

const Popconfirm = (props: Props) => {
  const { open, onClose, onSubmit, onRefresh, content } = props;
  const [loading, setLoading] = useState<boolean>(false);

  const {
    title,
    description,
    cancelLabel,
    submitLabel,
    cancelIcon: CancelIcon = CloseIcon,
    submitIcon: SubmitIcon = CheckIcon,
  } = content;

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await onSubmit();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      onRefresh();
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs">
      <DialogContent sx={{ pb: 1.5 }}>
        <Typography variant="h6" align="center" gutterBottom>
          {title}
        </Typography>
        <Typography variant="subtitle2" align="center">
          {description}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ p: 1.5 }}>
        <Button
          size="small"
          variant="outlined"
          startIcon={<CancelIcon />}
          onClick={onClose}
        >
          {cancelLabel}
        </Button>
        <LoadingButton
          size="small"
          loading={loading}
          loadingPosition="start"
          startIcon={<SubmitIcon />}
          onClick={handleSubmit}
        >
          {submitLabel}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default Popconfirm;
