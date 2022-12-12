import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import KeyIcon from '@mui/icons-material/Key';
import PersonIcon from '@mui/icons-material/Person';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import RouteLink from 'components/RouteLink';
import {
  ADDRESS_PATH,
  CHANGE_PASSWORD_PROFILE_PATH,
  PROFILE_PATH,
  TRANSACTION_HISTORY_PATH,
} from 'constant/route-path';
import useAuth from 'hooks/useAuth';
import HomeLayout from 'layouts/Home';
import { useRouter } from 'next/router';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  children: ReactNode;
  changeStepProfile1?: () => void;
}

const UserProfileLayout = (props: Props) => {
  const { t } = useTranslation();
  const { children, changeStepProfile1 } = props;
  const { user } = useAuth();
  const theme = useTheme();
  const mediaMinLg = useMediaQuery(theme.breakpoints.up('lg'));
  const router = useRouter();

  return (
    <HomeLayout changeStepProfile1={changeStepProfile1}>
      <Container
        maxWidth="lg"
        sx={{
          mt: 12,
          mb: 5,
          p: { lg: 'unset', xs: 2 },
          display: 'flex',
        }}
      >
        {mediaMinLg && (
          <Box
            sx={{
              width: 300,
              flexDirection: 'column',
              p: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <IconButton sx={{ p: 0 }}>
                <Avatar
                  sx={{ width: 60, height: 60 }}
                  alt="avatar"
                  src={user?.imageUrl}
                />
              </IconButton>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <RouteLink
                  href={PROFILE_PATH}
                  sx={{ px: 1.125, py: 0, color: 'primary.main' }}
                >
                  <Typography variant="body1">{user?.fullName}</Typography>
                </RouteLink>
                <RouteLink
                  href={PROFILE_PATH}
                  sx={{
                    px: 1.125,
                    py: 0,
                    color: 'primary.main',
                  }}
                >
                  <Typography variant="body2">
                    {t('title.changeProfile')}
                  </Typography>
                </RouteLink>
              </Box>
            </Box>
            <Divider variant="fullWidth" />
            <RouteLink
              href={PROFILE_PATH}
              sx={{
                color:
                  router.pathname === PROFILE_PATH
                    ? 'vShip.product.main'
                    : 'vShip.text.gray',
                p: 1,
                display: 'flex',
              }}
              onClick={changeStepProfile1}
            >
              <PersonIcon sx={{ mr: 2.5 }} />
              <Typography component="span">{t('title.profile')}</Typography>
            </RouteLink>
            <Divider variant="fullWidth" />
            <RouteLink
              href={CHANGE_PASSWORD_PROFILE_PATH}
              sx={{
                color:
                  router.pathname === CHANGE_PASSWORD_PROFILE_PATH
                    ? 'vShip.product.main'
                    : 'vShip.text.gray',
                p: 1,
                display: 'flex',
              }}
            >
              <KeyIcon sx={{ mr: 2.5 }} />
              <Typography component="span">
                {t('title.changePassword')}
              </Typography>
            </RouteLink>
            <Divider variant="fullWidth" />
            <RouteLink
              href={ADDRESS_PATH}
              sx={{
                color:
                  router.pathname === ADDRESS_PATH
                    ? 'vShip.product.main'
                    : 'vShip.text.gray',
                p: 1,
                display: 'flex',
              }}
            >
              <HomeWorkIcon sx={{ mr: 2.5 }} />
              <Typography component="span">{t('title.address')}</Typography>
            </RouteLink>
            <Divider variant="fullWidth" />
            <RouteLink
              href={TRANSACTION_HISTORY_PATH}
              sx={{
                color:
                  router.pathname === TRANSACTION_HISTORY_PATH
                    ? 'vShip.product.main'
                    : 'vShip.text.gray',
                p: 1,
                display: 'flex',
              }}
            >
              <AccountBalanceWalletIcon sx={{ mr: 2.5 }} />
              <Typography component="span">{t('title.transaction')}</Typography>
            </RouteLink>
            <Divider variant="fullWidth" />
            <RouteLink
              href="#"
              sx={{
                color:
                  router.pathname === '#'
                    ? 'vShip.product.main'
                    : 'vShip.text.gray',
                p: 1,
                display: 'flex',
              }}
            >
              <ReceiptLongIcon sx={{ mr: 2.5 }} />
              <Typography component="span">{t('title.order')}</Typography>
            </RouteLink>
          </Box>
        )}
        <Divider variant="fullWidth" />
        {children}
      </Container>
    </HomeLayout>
  );
};

export default UserProfileLayout;
