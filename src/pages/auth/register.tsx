import { yupResolver } from '@hookform/resolvers/yup';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import LoginIcon from '@mui/icons-material/Login';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import ControllerCheckbox from 'components/Form/ControllerCheckbox';
import ControllerTextField from 'components/Form/ControllerTextField';
import Form from 'components/Form/Form';
import FormGroup from 'components/Form/FormGroup';
import FormLabel from 'components/Form/FormLabel';
import Image from 'components/Image';
import RouteLink from 'components/RouteLink';
import Page from 'components/Page';
import useAuth from 'hooks/useAuth';
import useNotification from 'hooks/useNotification';
import AuthLayout from 'layouts/Auth';
import { useRouter } from 'next/router';
import { Fragment, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import type { MouseEvent } from 'types/react';
import Regexs from 'utils/Regexs';
import wait from 'utils/wait';
import * as yup from 'yup';
import getMessageError from 'utils/controlMessage';
import { LOGIN_PATH, TERM_OF_SERVICE } from 'constant/route-path';
import { STEP_1 } from 'constant/common';
import OTPInput from 'components/OTPInput';

interface FormValue {
  fullName: string;
  mobile: string;
  email: string;
  password: string;
  passwordConfirm: string;
  isCheckedTerm: boolean;
}

const validationSchema = yup.object().shape({
  fullName: yup
    .string()
    .max(50, 'schema.textMax50')
    .trim('schema.trim')
    .required('schema.requiredFullname')
    .default(''),
  mobile: yup
    .string()
    .trim('schema.trim')
    .required('schema.requiredPhone')
    .matches(Regexs.phoneNumber, 'schema.validPhone')
    .default(''),
  email: yup
    .string()
    .trim('schema.trim')
    .max(50, 'schema.textMax50')
    .matches(Regexs.optionalEmail, 'schema.validEmail')
    .default(''),
  password: yup
    .string()
    .max(50, 'schema.passwordMax')
    .trim('schema.trim')
    .required('schema.requiredPassword')
    .default(''),
  passwordConfirm: yup
    .string()
    .trim('schema.trim')
    .required('schema.requiredPasswordConfirm')
    .default('')
    .test({
      name: 'passwordConfirm',
      message: 'schema.passwordDoesNotMatch',
      test: (value, context) => {
        const { password } = context.parent;
        return value === password;
      },
    }),
  isCheckedTerm: yup
    .boolean()
    .oneOf([true], 'schema.acceptTerm')
    .default(false),
});

const Register = () => {
  const { t } = useTranslation();
  const setNotification = useNotification();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('sm'));
  const { register, confirmAccount, sendOtpAgain, checkEmailPhoneExist } =
    useAuth();
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<number>(1);
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
  const [time, setTime] = useState<number>(60);
  const [isClickSubmit, setIsClickSubmit] = useState<boolean>(false);
  const [registerData, setRegisterData] = useState<FormValue>({
    email: '',
    fullName: '',
    mobile: '',
    password: '',
    passwordConfirm: '',
    isCheckedTerm: false,
  });

  useEffect(() => {
    const timer =
      time > 0 &&
      setInterval(() => {
        setTime(() => time - 1);
      }, 1000);

    return () => clearInterval(timer as NodeJS.Timer);
  }, [time]);

  useEffect(() => {
    if (registerData.email && isClickSubmit) {
      sendOtpAgain({ email: registerData.email });
      wait(1500);
      setIsClickSubmit(false);
    }
  }, [registerData.email, isClickSubmit, sendOtpAgain]);

  const { control, handleSubmit } = useForm<FormValue>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
    defaultValues: validationSchema.getDefault(),
  });

  const onSubmit = async (data: FormValue) => {
    try {
      setLoading(true);
      setRegisterData(data);
      await wait(1000);
      const { email, fullName, mobile, passwordConfirm, password } = data;
      if (!email) {
        if (!fullName || !mobile || !passwordConfirm || !password) return;

        await register({
          email: email || null,
          fullName,
          mobile,
          password,
          passwordConfirm,
        });

        router.push('/auth/register-success');
        setNotification({
          message: t('message.registerSuccess'),
          severity: 'success',
        });
      } else {
        setTime(60);
        await checkEmailPhoneExist({ email, mobile });
        await setNotification({
          message: t('message.registerSuccess2'),
          severity: 'success',
        });
        setActiveStep(2);
      }
      setIsClickSubmit(true);
      setLoading(false);
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
      await wait(1000);
      await confirmAccount({ email: registerData.email, otp: otp.join('') });
      await register(registerData);
      setNotification({
        message: t('message.confirmRegisterAccountSuccess'),
        severity: 'success',
      });

      router.push('/auth/register-success');
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
        await wait(1000);
        await sendOtpAgain({ email: registerData.email });
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

  const changeStep1 = () => {
    setActiveStep(STEP_1);
  };

  return (
    <Page title="Đăng ký">
      <AuthLayout>
        <Box sx={{ display: 'flex', alignItems: 'center', height: 1, py: 2 }}>
          <Grid container justifyContent="center" alignItems="center">
            <Grid item xs={false} sm={false} md={6}>
              <Box sx={{ display: { xs: 'none', sm: 'none', md: 'flex' } }}>
                <Image
                  sx={{ objectFit: 'contain' }}
                  src="/static/imgs/register-write.png"
                  alt="Đăng ký"
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <Container maxWidth="sm" disableGutters={matches}>
                <Paper
                  elevation={24}
                  sx={{
                    px: { xs: 3, sm: 4 },
                    py: { xs: 2, sm: 3 },
                    my: 3,
                    borderRadius: 3,
                  }}
                >
                  {activeStep === 1 && (
                    <Fragment>
                      <Typography
                        variant="h4"
                        align="center"
                        sx={{ mt: 3, textTransform: 'uppercase' }}
                      >
                        Đăng ký
                      </Typography>
                      <Form
                        autoComplete="off"
                        noValidate
                        onSubmit={handleSubmit(onSubmit)}
                        sx={{ mt: 3 }}
                      >
                        <FormGroup>
                          <FormLabel
                            title={t('label.fullName')}
                            name="fullName"
                            gutterBottom
                            gutterLeft
                            required
                          />
                          <ControllerTextField
                            name="fullName"
                            control={control}
                            placeholder={t('placeholder.fullName')}
                            InputProps={{
                              size: matches ? 'small' : 'medium',
                            }}
                          />
                        </FormGroup>

                        <FormGroup>
                          <FormLabel
                            title={t('label.email')}
                            name="email"
                            gutterBottom
                            gutterLeft
                          />
                          <ControllerTextField
                            name="email"
                            control={control}
                            placeholder={t('placeholder.email')}
                            InputProps={{
                              size: matches ? 'small' : 'medium',
                            }}
                          />
                        </FormGroup>
                        <FormGroup>
                          <FormLabel
                            title={t('label.phone')}
                            name="mobile"
                            gutterBottom
                            gutterLeft
                            required
                          />
                          <ControllerTextField
                            name="mobile"
                            control={control}
                            placeholder={t('placeholder.phone')}
                            InputProps={{
                              size: matches ? 'small' : 'medium',
                            }}
                          />
                        </FormGroup>
                        <FormGroup>
                          <FormLabel
                            title={t('label.password')}
                            name="password"
                            gutterBottom
                            gutterLeft
                            required
                          />
                          <ControllerTextField
                            name="password"
                            control={control}
                            margin="normal"
                            type={showNewPassword ? 'text' : 'password'}
                            placeholder={t('placeholder.password')}
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
                            name="passwordConfirm"
                            gutterBottom
                            gutterLeft
                            required
                          />
                          <ControllerTextField
                            name="passwordConfirm"
                            control={control}
                            margin="normal"
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
                        <FormGroup>
                          <ControllerCheckbox
                            name="isCheckedTerm"
                            control={control}
                            label={
                              <Typography variant="body2">
                                {t('message.termMes1')}
                                <RouteLink
                                  href={TERM_OF_SERVICE}
                                  variant="body2"
                                >
                                  {' '}
                                  {t('message.termMes2')}
                                </RouteLink>
                              </Typography>
                            }
                          />
                        </FormGroup>
                        <Box sx={{ mt: 5, mb: 2.5 }}>
                          <LoadingButton
                            loading={loading}
                            loadingPosition="start"
                            startIcon={<LoginIcon />}
                            fullWidth
                            size={matches ? 'medium' : 'large'}
                            type="submit"
                          >
                            {t('button.register')}
                          </LoadingButton>
                        </Box>
                      </Form>
                      <RouteLink
                        href={LOGIN_PATH}
                        variant="body2"
                        align="center"
                        display="block"
                      >
                        {t('title.login')}
                      </RouteLink>
                    </Fragment>
                  )}
                  {activeStep === 2 && (
                    <Fragment>
                      <Box>
                        <Typography
                          variant="h4"
                          align="center"
                          sx={{ mt: 3, mb: 8 }}
                        >
                          {t('title.confirmAccount')}
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
                        <Typography
                          variant="h6"
                          align="center"
                          sx={{
                            mt: 3,
                            mb: 8,
                            color:
                              time > 0 ? 'primary.main' : 'vShip.link.main',
                            cursor: 'pointer',
                          }}
                          onClick={handleSendOtpAgain}
                        >
                          {t('title.sendOtpAgain')}: ({time}s){' '}
                        </Typography>
                        <Typography
                          align="left"
                          variant="h6"
                          sx={{
                            color: 'vShip.link.main',
                            cursor: 'pointer',
                            fontWeight: 'inherit',
                            mb: 3,
                            display: 'flex',
                            alignItems: 'center',
                          }}
                          onClick={changeStep1}
                        >
                          <ArrowBackIosIcon />
                          <Typography component="span">
                            {t('button.back')}
                          </Typography>
                        </Typography>
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

export default Register;
