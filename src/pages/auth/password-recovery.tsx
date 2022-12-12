import { useTheme } from '@mui/material/styles';
import { yupResolver } from '@hookform/resolvers/yup';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LoadingButton from '@mui/lab/LoadingButton';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import InputAdornment from '@mui/material/InputAdornment';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import ControllerTextField from 'components/Form/ControllerTextField';
import Form from 'components/Form/Form';
import FormGroup from 'components/Form/FormGroup';
import FormLabel from 'components/Form/FormLabel';
import Image from 'components/Image';
import Page from 'components/Page';
import useAuth from 'hooks/useAuth';
import useNotification from 'hooks/useNotification';
import AuthLayout from 'layouts/Auth';
import { useRouter } from 'next/router';
import { Fragment, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { MouseEvent } from 'types/react';
import Regexs from 'utils/Regexs';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { STEP_1, STEP_2, STEP_3 } from 'constant/common';
import getMessageError from 'utils/controlMessage';
import OTPInput from 'components/OTPInput';

interface ForgotPasswordFormValue {
  email: string;
}

interface ChangePasswordFormValue {
  newPassword: string;
  renewPassword: string;
}

const forgotPasswordValidation = yup.object().shape({
  email: yup
    .string()
    .trim('schema.trim')
    .required('schema.requiredEmail')
    .matches(Regexs.email, 'schema.validEmail')
    .email('schema.validEmail')
    .default(''),
});

const changePasswordValidation = yup.object().shape({
  newPassword: yup
    .string()
    .trim('schema.trim')
    .max(50, 'schema.passwordMax')
    .required('schema.requiredPassword')
    .default(''),
  renewPassword: yup
    .string()
    .trim('schema.trim')
    .required('schema.requiredPasswordConfirm')
    .default('')
    .test({
      name: 'passwordConfirm',
      message: 'schema.passwordDoesNotMatch',
      test: (value, context) => {
        const { newPassword } = context.parent;
        return value === newPassword;
      },
    }),
});

const ForgotPassword = () => {
  const { t } = useTranslation();
  const setNotification = useNotification();
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const {
    sendMailOtp,
    confirmAccount,
    changePasswordAuth,
    sendOtpAgain,
    user,
  } = useAuth();
  const [activeStep, setActiveStep] = useState<number>(1);
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
  const [time, setTime] = useState<number>(60);
  const [emailConfirm, setEmailConfirm] = useState<string>('');
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('sm'));

  const {
    control: forgotPasswordControl,
    handleSubmit: handleSubmitForgotPasswordForm,
  } = useForm<ForgotPasswordFormValue>({
    mode: 'onChange',
    resolver: yupResolver(forgotPasswordValidation),
    defaultValues: forgotPasswordValidation.getDefault(),
  });

  const {
    control: changePasswordControl,
    handleSubmit: handleSubmitChangePasswordControl,
  } = useForm<ChangePasswordFormValue>({
    mode: 'onChange',
    resolver: yupResolver(changePasswordValidation),
    defaultValues: changePasswordValidation.getDefault(),
  });

  useEffect(() => {
    const timer =
      time > 0 &&
      setInterval(() => {
        setTime(() => time - 1);
      }, 1000);

    return () => clearInterval(timer as NodeJS.Timer);
  }, [time]);

  const onForgotPasswordFormSubmit = async (data: ForgotPasswordFormValue) => {
    try {
      setTime(60);
      setLoading(true);
      if (user && user.email && user.email !== data.email) {
        setNotification({
          message: t('message.emailAndAccountNotSimilar'),
          severity: 'error',
        });
        return;
      }
      await sendMailOtp(data);
      setNotification({
        message: t('message.sendMailOtp'),
        severity: 'success',
      });
      setActiveStep(STEP_2);
      setEmailConfirm(data.email);
    } catch (error) {
      const message = getMessageError(error) || 'message.systemError';
      setNotification({
        message: t(message),
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmAccount = async () => {
    try {
      setLoading(true);
      await confirmAccount({ email: emailConfirm, otp: otp.join('') });
      setNotification({
        message: t('message.confirmAccountSuccess'),
        severity: 'success',
      });
      setActiveStep(3);
    } catch (error) {
      const message = getMessageError(error) || 'message.systemError';
      setNotification({
        message: t(message),
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const onChangePasswordFormSubmit = async (data: ChangePasswordFormValue) => {
    try {
      setLoading(true);
      await changePasswordAuth({
        ...data,
        email: emailConfirm,
        otp: otp.join(''),
      });
      setNotification({
        message: t('message.changePasswordSuccess2'),
        severity: 'success',
      });
      router.push('/auth/change-password-success');
    } catch (error) {
      const message = getMessageError(error) || 'message.systemError';
      setNotification({
        message: t(message),
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtpAgain = async () => {
    try {
      if (time === 0) {
        setTime(60);
        await sendOtpAgain({ email: emailConfirm });
        setNotification({
          message: t('message.sendMailOtpSuccess'),
          severity: 'success',
        });
      }
    } catch (error) {
      const message = getMessageError(error) || 'message.systemError';
      setNotification({
        message: t(message),
        severity: 'error',
      });
    }
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
    <Page title={t('title.forgotPassword2')}>
      <AuthLayout>
        <Box sx={{ display: 'flex', alignItems: 'center', height: 1, py: 3 }}>
          <Grid container justifyContent="center" alignItems="center">
            <Grid item xs={false} sm={false} md={6}>
              <Box sx={{ display: { xs: 'none', sm: 'none', md: 'flex' } }}>
                <Image
                  sx={{ objectFit: 'contain' }}
                  src="/static/imgs/forgot-password.png"
                  alt="forgot-password"
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={8} md={6}>
              <Container maxWidth="sm" disableGutters={matches}>
                <Paper
                  elevation={24}
                  sx={{
                    p: { xs: 3, sm: 4 },
                    borderRadius: 3,
                    width: { md: 400 },
                    margin: '0 auto',
                  }}
                >
                  {activeStep === STEP_1 && (
                    <Fragment>
                      <Box>
                        <Typography variant="h4" align="center" sx={{ mt: 3 }}>
                          {t('title.forgotPassword2')}
                        </Typography>
                      </Box>
                      <Box sx={{ mt: 3 }}>
                        <Form
                          noValidate
                          onSubmit={handleSubmitForgotPasswordForm(
                            onForgotPasswordFormSubmit
                          )}
                        >
                          <FormGroup>
                            <FormLabel
                              title={t('label.email')}
                              name="email"
                              gutterBottom
                            />
                            <ControllerTextField
                              name="email"
                              control={forgotPasswordControl}
                              type="email"
                              placeholder={t('placeholder.registerEmail')}
                            />
                          </FormGroup>

                          <Box sx={{ mt: 6, mb: 6 }}>
                            <LoadingButton
                              loading={loading}
                              fullWidth
                              size="large"
                              type="submit"
                            >
                              {t('button.next')}
                            </LoadingButton>
                          </Box>
                        </Form>
                      </Box>
                      <Box>
                        <Typography variant="body2">
                          Nếu không có Email vui lòng gọi về tổng đài CSKH để
                          được hỗ trợ
                        </Typography>
                        <Typography variant="body1" sx={{ my: 2 }}>
                          Hotline CSKH:
                          <Typography
                            component="span"
                            sx={{ fontWeight: 'bold' }}
                          >
                            {' '}
                            0123456798
                          </Typography>
                        </Typography>
                      </Box>
                    </Fragment>
                  )}
                  {activeStep === STEP_2 && (
                    <Fragment>
                      <Box>
                        <Typography
                          variant="h4"
                          align="center"
                          sx={{ mt: 3, mb: 2 }}
                        >
                          {t('title.confirmAccount')}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography
                          variant="body2"
                          align="center"
                          sx={{ mb: 4 }}
                        >
                          Mã xác thực đã được gửi đến email đã đăng ký. Vui lòng
                          kiểm tra email của bạn.
                        </Typography>
                      </Box>
                      <Box sx={{ mt: 3 }}>
                        <Box
                          sx={{
                            display: 'flex',
                            align: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <OTPInput values={otp} setValues={setOtp} />
                        </Box>
                        <Box sx={{ mt: 6, mb: 6 }}>
                          <LoadingButton
                            loading={loading}
                            onClick={handleConfirmAccount}
                            fullWidth
                            size="large"
                            type="submit"
                          >
                            {t('button.next')}
                          </LoadingButton>
                        </Box>
                        <Box
                          sx={{
                            mt: 3,
                            mb: 8,
                            display: 'flex',
                            justifyContent: 'center',
                          }}
                        >
                          <Typography
                            variant="h6"
                            align="center"
                            sx={{
                              color:
                                time > 0 ? 'primary.main' : 'vShip.link.main',
                              cursor: 'pointer',
                            }}
                            onClick={handleSendOtpAgain}
                          >
                            {t('title.sendOtpAgain')}: ({time}s){' '}
                          </Typography>
                        </Box>
                      </Box>
                    </Fragment>
                  )}
                  {activeStep === STEP_3 && (
                    <Fragment>
                      <Box>
                        <Typography variant="h4" align="center" sx={{ mt: 3 }}>
                          {t('title.changePassword')}
                        </Typography>
                      </Box>
                      <Box sx={{ mt: 3 }}>
                        <Form
                          noValidate
                          onSubmit={handleSubmitChangePasswordControl(
                            onChangePasswordFormSubmit
                          )}
                        >
                          <FormGroup>
                            <FormLabel
                              title={t('label.newPassword')}
                              name="newPassword"
                              gutterBottom
                            />
                            <ControllerTextField
                              name="newPassword"
                              control={changePasswordControl}
                              type={showNewPassword ? 'text' : 'password'}
                              placeholder={t('placeholder.newPassword')}
                              InputProps={{
                                size: matches ? 'small' : 'medium',
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
                          </FormGroup>
                          <FormGroup>
                            <FormLabel
                              title={t('label.confirmPassword')}
                              name="renewPassword"
                              gutterBottom
                            />
                            <ControllerTextField
                              name="renewPassword"
                              control={changePasswordControl}
                              type={showConfirmPassword ? 'text' : 'password'}
                              placeholder={t('placeholder.confirmPassword')}
                              InputProps={{
                                size: matches ? 'small' : 'medium',
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
                          </FormGroup>

                          <Box sx={{ mt: 2.5, mb: 5 }}>
                            <LoadingButton
                              loading={loading}
                              fullWidth
                              size="large"
                              type="submit"
                            >
                              {t('button.changePassword')}
                            </LoadingButton>
                          </Box>
                        </Form>
                      </Box>
                    </Fragment>
                  )}
                </Paper>
              </Container>
            </Grid>
          </Grid>
        </Box>
      </AuthLayout>
    </Page>
  );
};
export default ForgotPassword;
