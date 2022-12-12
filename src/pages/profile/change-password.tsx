import { yupResolver } from '@hookform/resolvers/yup';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Typography from '@mui/material/Typography';
import ControllerTextField from 'components/Form/ControllerTextField';
import Form from 'components/Form/Form';
import FormGroup from 'components/Form/FormGroup';
import FormLabel from 'components/Form/FormLabel';
import RouteLink from 'components/RouteLink';
import { PASSWORD_RECOVERY_PATH } from 'constant/route-path';
import withPrivateRoute from 'hocs/withPrivateRoute';
import useAuth from 'hooks/useAuth';
import useNotification from 'hooks/useNotification';
import UserProfileLayout from 'layouts/UserProfile';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import User from 'services/users';
import { MouseEvent } from 'types/react';
import getMessageError from 'utils/controlMessage';
import wait from 'utils/wait';
import * as yup from 'yup';

interface FormValue {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

const validationSchema = yup.object().shape({
  currentPassword: yup
    .string()
    .trim('schema.trim')
    .max(50, 'schema.passwordMax')
    .required('schema.requiredPassword')
    .default(''),
  newPassword: yup
    .string()
    .trim('schema.trim')
    .max(50, 'schema.passwordMax')
    .required('schema.requiredPassword')
    .default(''),
  confirmNewPassword: yup
    .string()
    .trim('schema.trim')
    .required('schema.requiredPasswordConfirm')
    .default('')
    .test({
      name: 'confirmNewPassword',
      message: 'schema.passwordDoesNotMatch',
      test: (value, context) => {
        const { newPassword } = context.parent;
        return value === newPassword;
      },
    }),
});

const ChangePassword = () => {
  const [openSuccessDialog, setOpenSuccessDialog] = useState<boolean>(false);
  const setNotification = useNotification();
  const [loading, setLoading] = useState<boolean>(false);
  const { t } = useTranslation();
  const { logout } = useAuth();
  const [isChangePasswordSuccess, setChangePasswordSuccess] =
    useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const { control, handleSubmit } = useForm<FormValue>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
    defaultValues: validationSchema.getDefault(),
  });

  const handleClose = () => {
    setOpenSuccessDialog(false);
  };

  const onSubmit = async (data: FormValue) => {
    const { confirmNewPassword, currentPassword, newPassword } = data;

    if (!confirmNewPassword || !currentPassword || !newPassword) {
      return;
    }

    setLoading(true);
    User.changePassword({
      currentPassword: currentPassword || '',
      newPassword: newPassword || '',
      confirmNewPassword: confirmNewPassword || '',
    })
      .then(async (response) => {
        setChangePasswordSuccess(true);
        setOpenSuccessDialog(true);
        await wait(3000);
        logout();
      })
      .catch((error) => {
        setChangePasswordSuccess(false);
        const message = getMessageError(error) || 'message.systemError';
        setNotification({
          message: t(message),
          severity: 'error',
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleToggleShowPassword = () => {
    setShowPassword((state) => !state);
  };

  const handleToggleShowNewPassword = () => {
    setShowNewPassword((state) => !state);
  };

  const handleToggleShowConfirmPassword = () => {
    setShowConfirmPassword((state) => !state);
  };

  const handleMouseDownPassword: MouseEvent = (event) => {
    event.preventDefault();
  };
  return (
    <UserProfileLayout>
      <Container
        maxWidth="md"
        sx={{
          backgroundColor: 'background.paper',
          p: 2.5,
          boxShadow: '1px 1px 3px #ccc,-1px -1px 3px #ccc',
        }}
      >
        <Box sx={{ mb: 1.8 }}>
          <Typography variant="h5" sx={{ fontWeight: 'inherit' }}>
            {t('title.myProfile')}
          </Typography>
          <Typography variant="body2">{t('title.manageToProtect')}</Typography>
        </Box>
        <Divider variant="fullWidth" />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            my: 3,
            justifyContent: 'space-between',
          }}
        >
          <Container maxWidth="md">
            <Grid container>
              <Grid item xs={12} sm={12} md={9}>
                <Form noValidate onSubmit={handleSubmit(onSubmit)}>
                  <FormGroup>
                    <Grid container alignItems="center" spacing={1}>
                      <Grid item xs={12} sm={12} md={3}>
                        <FormLabel
                          title={t('label.oldPassword')}
                          name="currentPassword"
                          gutterBottom
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={9}>
                        <ControllerTextField
                          name="currentPassword"
                          control={control}
                          type={showPassword ? 'text' : 'password'}
                          placeholder={t('placeholder.oldPassword')}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={handleToggleShowPassword}
                                  onMouseDown={handleMouseDownPassword}
                                  edge="end"
                                >
                                  {showPassword ? (
                                    <VisibilityOff />
                                  ) : (
                                    <Visibility />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                    </Grid>
                  </FormGroup>

                  <FormGroup>
                    <Grid container alignItems="center" spacing={1}>
                      <Grid item xs={12} sm={12} md={3}>
                        <FormLabel
                          title={t('label.newPassword')}
                          name="newPassword"
                          gutterBottom
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={9}>
                        <ControllerTextField
                          name="newPassword"
                          control={control}
                          type={showNewPassword ? 'text' : 'password'}
                          placeholder={t('placeholder.newPassword')}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={handleToggleShowNewPassword}
                                  onMouseDown={handleMouseDownPassword}
                                  edge="end"
                                >
                                  {showNewPassword ? (
                                    <VisibilityOff />
                                  ) : (
                                    <Visibility />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                    </Grid>
                  </FormGroup>
                  <FormGroup>
                    <Grid container alignItems="center" spacing={1}>
                      <Grid item xs={12} sm={12} md={3}>
                        <FormLabel
                          title={t('label.confirmPassword')}
                          name="confirmNewPassword"
                          gutterBottom
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={9}>
                        <ControllerTextField
                          name="confirmNewPassword"
                          control={control}
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder={t('placeholder.confirmPassword')}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={handleToggleShowConfirmPassword}
                                  onMouseDown={handleMouseDownPassword}
                                  edge="end"
                                >
                                  {showConfirmPassword ? (
                                    <VisibilityOff />
                                  ) : (
                                    <Visibility />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                    </Grid>
                  </FormGroup>

                  <Box
                    sx={{
                      mt: 5,
                      mb: 5,
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    <LoadingButton loading={loading} size="large" type="submit">
                      {t('button.confirm')}
                    </LoadingButton>
                  </Box>
                </Form>
              </Grid>
              <Grid
                item
                xs={12}
                sm={12}
                md={3}
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <RouteLink
                  href={PASSWORD_RECOVERY_PATH}
                  variant="body1"
                  sx={{ maxHeight: 30 }}
                >
                  {t('title.forgotPassword')}
                </RouteLink>
              </Grid>
            </Grid>
          </Container>
        </Box>
        <Dialog
          open={openSuccessDialog}
          onClose={handleClose}
          maxWidth="s465"
          fullWidth
        >
          <DialogContent
            sx={{
              textAlign: 'center',
              height: 250,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CheckCircleOutlineIcon
              sx={{
                color: isChangePasswordSuccess ? 'success.dark' : 'error.dark',
                width: 50,
                height: 50,
                mt: 2,
              }}
            />
            <DialogContentText
              variant="h5"
              color={isChangePasswordSuccess ? 'success.dark' : 'error.dark'}
            >
              {isChangePasswordSuccess
                ? t('message.changePasswordSuccess')
                : t('message.changePasswordError')}
            </DialogContentText>
          </DialogContent>
        </Dialog>
      </Container>
    </UserProfileLayout>
  );
};

export default withPrivateRoute(ChangePassword);
