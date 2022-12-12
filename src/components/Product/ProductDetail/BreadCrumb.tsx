import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import RouteLink from 'components/RouteLink';
import { SEARCH_BREAD_CRUMB_PATH } from 'constant/route-path';
import type { ProductDetail } from 'types/product';

interface Props {
  productDetail: ProductDetail | null;
}

const BreadcrumbsProductDetail = (props: Props) => {
  const { productDetail } = props;
  return (
    <Breadcrumbs
      separator={<NavigateNextIcon fontSize="small" />}
      sx={{ mb: 2, px: { xs: 2, lg: 0 } }}
    >
      <RouteLink
        href="/"
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
      {productDetail?.item_category?.root_category_id && (
        <RouteLink
          href={
            SEARCH_BREAD_CRUMB_PATH +
            productDetail?.item_category?.root_category_id
          }
          sx={{
            display: 'flex',
            alignItems: 'center',
            color: 'primary.main',
          }}
        >
          <Typography variant="body2" sx={{ mt: 0.5 }}>
            {productDetail?.item_category?.root_category_name}
          </Typography>
        </RouteLink>
      )}
      {productDetail?.item_category?.parent_category_id && (
        <RouteLink
          href={
            SEARCH_BREAD_CRUMB_PATH +
            productDetail?.item_category?.parent_category_id
          }
          sx={{
            display: 'flex',
            alignItems: 'center',
            color: 'primary.main',
          }}
        >
          <Typography variant="body2" sx={{ mt: 0.5 }}>
            {productDetail?.item_category?.parent_category_name}
          </Typography>
        </RouteLink>
      )}
      {productDetail?.item_category?.id && (
        <RouteLink
          href={SEARCH_BREAD_CRUMB_PATH + productDetail?.item_category?.id}
          sx={{
            display: 'flex',
            alignItems: 'center',
            color: 'primary.main',
          }}
        >
          <Typography variant="body2" sx={{ mt: 0.5 }}>
            {productDetail?.item_category?.name}
          </Typography>
        </RouteLink>
      )}
    </Breadcrumbs>
  );
};

export default BreadcrumbsProductDetail;
