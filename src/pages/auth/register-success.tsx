import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Image from 'components/Image';
import RouteLink from 'components/RouteLink';
import { LOGIN_PATH } from 'constant/route-path';
import AuthLayout from 'layouts/Auth';
import { useTranslation } from 'react-i18next';

const RegisterSuccess = () => {
  const { t } = useTranslation();
  return (
    <AuthLayout>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            width: { sm: 580, xs: '100%' },
            height: { sm: 400, xs: '100%' },
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Image
            sx={{ objectFit: 'contain' }}
            src="/static/imgs/register-write.png"
            alt=""
          />
        </Box>
        <Box>
          <Typography
            variant="h1"
            align="center"
            sx={{ color: 'vShip.link.main' }}
          >
            {t('title.registerSuccess')}
          </Typography>
        </Box>
        <Box sx={{ mt: 3 }}>
          <RouteLink
            href={LOGIN_PATH}
            sx={{
              backgroundColor: 'primary.main',
              borderRadius: 10,
              padding: '10px 20px',
              color: 'primary.contrastText',
            }}
          >
            {t('button.loginNow')}
          </RouteLink>
        </Box>
      </Box>
    </AuthLayout>
  );
};

export default RegisterSuccess;
