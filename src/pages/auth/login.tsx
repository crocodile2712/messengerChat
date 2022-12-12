import { yupResolver } from '@hookform/resolvers/yup';
import LoginIcon from '@mui/icons-material/Login';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Paper from '@mui/material/Paper';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import ControllerTextField from 'components/Form/ControllerTextField';
import Form from 'components/Form/Form';
import FormGroup from 'components/Form/FormGroup';
import FormLabel from 'components/Form/FormLabel';
import Image from 'components/Image';
import Page from 'components/Page';
import RouteLink from 'components/RouteLink';
import {
  PASSWORD_RECOVERY_PATH,
  PRODUCT_DETAIL_PATH,
  REGISTER_PATH,
} from 'constant/route-path';
import useAuth from 'hooks/useAuth';
import useNotification from 'hooks/useNotification';
import AuthLayout from 'layouts/Auth';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import type { MouseEvent } from 'types/react';
import getMessageError from 'utils/controlMessage';
import LocalStorage from 'utils/LocalStorage';
import wait from 'utils/wait';
import * as yup from 'yup';

interface FormValue {
  username: string;
  password: string;
}

const validationSchema = yup.object().shape({
  username: yup
    .string()
    .trim('schema.trim')
    .required('schema.requiredUsername')
    .default(''),
  password: yup
    .string()
    .trim('schema.trim')
    .required('schema.requiredPassword')
    .default(''),
});

const Login = () => {
  const { t } = useTranslation();
  const setNotification = useNotification();
  const router = useRouter();
  const { login } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('sm'));

  const { control, handleSubmit } = useForm<FormValue>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
    defaultValues: validationSchema.getDefault(),
  });

  const onSubmit = async (data: FormValue) => {
    try {
      setLoading(true);
      await wait(1000);
      await login(data);
      setNotification({
        message: t('message.loginSuccess'),
        severity: 'success',
      });
      if (LocalStorage.get('last-path') !== PRODUCT_DETAIL_PATH) {
        router.push('/');
      } else {
        router.push(PRODUCT_DETAIL_PATH + LocalStorage.get('last-product'));
        LocalStorage.remove('last-path');
        LocalStorage.remove('last-product');
      }
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

  const handleToggleShowPassword = () => {
    setShowPassword((state) => !state);
  };

  const handleMouseDownPassword: MouseEvent = (event) => {
    event.preventDefault();
  };

  return (
    <Page title={t('title.login')}>
      <AuthLayout>
        <Box sx={{ display: 'flex', alignItems: 'center', height: 1, py: 3 }}>
          <Grid container justifyContent="center" alignItems="center">
            <Grid item xs={false} sm={false} md={6}>
              <Box sx={{ display: { xs: 'none', sm: 'none', md: 'flex' } }}>
                <Image
                  sx={{ objectFit: 'contain' }}
                  src="/static/imgs/login_layout_image.png"
                  alt="Đăng nhập"
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <Container maxWidth="sm" disableGutters={matches}>
                <Paper
                  elevation={24}
                  sx={{ p: { xs: 3, sm: 4 }, borderRadius: 3 }}
                >
                  <Typography
                    variant="h4"
                    align="center"
                    sx={{ mt: 3, textTransform: 'uppercase' }}
                  >
                    {t('title.login')}
                  </Typography>
                  <Form
                    noValidate
                    onSubmit={handleSubmit(onSubmit)}
                    sx={{ mt: 3 }}
                  >
                    <FormGroup>
                      <FormLabel
                        title={t('label.username')}
                        name="username"
                        gutterBottom
                        gutterLeft
                        required
                      />
                      <ControllerTextField
                        name="username"
                        control={control}
                        type="text"
                        placeholder={t('placeholder.username')}
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
                        type={showPassword ? 'text' : 'password'}
                        placeholder={t('placeholder.password')}
                        InputProps={{
                          size: matches ? 'small' : 'medium',
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
                    </FormGroup>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        mt: 1.25,
                      }}
                    >
                      <RouteLink href={PASSWORD_RECOVERY_PATH} variant="body2">
                        {t('title.forgotPassword')}
                      </RouteLink>
                    </Box>
                    <Box sx={{ mt: 5, mb: 2.5 }}>
                      <LoadingButton
                        loading={loading}
                        loadingPosition="start"
                        startIcon={<LoginIcon />}
                        fullWidth
                        size={matches ? 'medium' : 'large'}
                        type="submit"
                      >
                        {t('button.login')}
                      </LoadingButton>
                    </Box>
                  </Form>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Typography sx={{ mr: 0.625 }} variant="body2">
                      {t('title.notHaveAccount')}
                    </Typography>
                    <RouteLink href={REGISTER_PATH} variant="body2">
                      {t('title.registerNow')}
                    </RouteLink>
                  </Box>
                </Paper>
              </Container>
            </Grid>
          </Grid>
        </Box>
      </AuthLayout>
    </Page>
  );
};

export default Login;
