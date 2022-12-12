import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Image from 'components/Image';
import RouteLink from 'components/RouteLink';
import { LOGIN_PATH } from 'constant/route-path';
import AuthLayout from 'layouts/Auth';
import { useTranslation } from 'react-i18next';

const ChangePasswordSuccess = () => {
  const { t } = useTranslation();
  return (
    <AuthLayout>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          verticalAlign: 'middle',
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
            src="/static/imgs/change-password-success.png"
            alt="change-password-success"
          />
        </Box>
        <Box>
          <Typography
            variant="h1"
            sx={{
              textAlign: 'center',
              color: 'vShip.link.main',
            }}
          >
            {t('title.changePasswordSuccess')}
          </Typography>
        </Box>
        <Box sx={{ mt: 3 }}>
          <RouteLink
            href={LOGIN_PATH}
            sx={{
              backgroundColor: '#000924',
              borderRadius: 10,
              padding: '10px 20px',
              color: '#FFFFFF',
            }}
          >
            {t('button.loginNow')}
          </RouteLink>
        </Box>
      </Box>
    </AuthLayout>
  );
};

export default ChangePasswordSuccess;
