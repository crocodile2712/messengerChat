import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import RouteLink from 'components/RouteLink';
import { CART_PATH, HOME_PATH, PROFILE_PATH } from 'constant/route-path';

const CartBreadCrumb = () => {
  return (
    <Breadcrumbs
      separator={<NavigateNextIcon fontSize="small" />}
      sx={{ mb: 2 }}
    >
      <RouteLink
        href={HOME_PATH}
        sx={{
          display: 'flex',
          alignItems: 'center',
          color: 'primary.main',
        }}
      >
        <HomeIcon />
        <Typography variant="body2" sx={{ mt: 0.5 }}>
          Trang chủ
        </Typography>
      </RouteLink>
      <RouteLink
        href={PROFILE_PATH}
        sx={{
          display: 'flex',
          alignItems: 'center',
          color: 'primary.main',
        }}
      >
        <Typography variant="body2" sx={{ mt: 0.5 }}>
          Trang cá nhân
        </Typography>
      </RouteLink>

      <RouteLink
        href={CART_PATH}
        sx={{
          display: 'flex',
          alignItems: 'center',
          color: 'primary.main',
        }}
      >
        <Typography variant="body2" sx={{ mt: 0.5 }}>
          Giỏ hàng
        </Typography>
      </RouteLink>
    </Breadcrumbs>
  );
};

export default CartBreadCrumb;
