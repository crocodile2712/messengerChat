import CloseIcon from '@mui/icons-material/Close';
import type { AlertProps } from '@mui/material/Alert';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import {
  createContext,
  forwardRef,
  Fragment,
  useCallback,
  useState,
} from 'react';
import type { PickUnion } from 'types/common';
import type { FCC } from 'types/react';

const FilledAlert = forwardRef<HTMLDivElement, AlertProps>(function FilledAlert(
  props,
  ref
) {
  return <Alert ref={ref} variant="filled" {...props} />;
});

interface Settings {
  message: string | null;
  error: string | null;
  severity?: AlertProps['severity'];
  onUndo?: () => Promise<void>;
}

export type NotificationContextValue = (config: PickUnion<Settings>) => void;

export const NotificationContext =
  createContext<NotificationContextValue | null>(null);

if (process.env.NODE_ENV === 'development') {
  NotificationContext.displayName = 'NotificationContext';
}

const initialSettings: Settings = {
  message: null,
  error: null,
};

const NotificationProvider: FCC = (props) => {
  const { children } = props;
  const [open, setOpen] = useState<boolean>(false);
  const [settings, setSettings] = useState<Settings>(initialSettings);

  const handleClose = (_event: any, reason?: string) => {
    if (reason === 'clickaway') return;
    setOpen(false);
    setSettings(initialSettings);
  };

  const setNotification = useCallback((settings: PickUnion<Settings>) => {
    setSettings((state) => ({
      ...state,
      ...settings,
    }));
    setOpen(true);
  }, []);

  const { message, error, severity, onUndo } = settings;

  const action = (
    <Fragment>
      {onUndo && (
        <Button variant="text" onClick={onUndo}>
          Undo
        </Button>
      )}
      <IconButton sx={{ ml: 0.5 }} color="inherit" onClick={handleClose}>
        <CloseIcon />
      </IconButton>
    </Fragment>
  );

  const content =
    error || (message && severity) ? (
      <FilledAlert onClose={handleClose} severity={error ? 'error' : severity}>
        {error || message}
      </FilledAlert>
    ) : (
      void 0
    );

  return (
    <NotificationContext.Provider value={setNotification}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        message={message}
        action={action}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        {content}
      </Snackbar>
    </NotificationContext.Provider>
  );
};

export { NotificationContext as default, NotificationProvider };
