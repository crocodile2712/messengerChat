import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import Image from 'components/Image';
import RouteLink from 'components/RouteLink';
import { PRODUCT_DETAIL_PATH } from 'constant/route-path';
import useShoppingCart from 'hooks/useShoppingCart';
import type { Product } from 'types/product';
import currency from 'utils/Currency';
interface Props {
  product: Product & {
    thumbnails?: string[];
  };
}

const ProductCard = (props: Props) => {
  const { product } = props;
  const { priceRate } = useShoppingCart();
  const theme = useTheme();
  const up465 = useMediaQuery(theme.breakpoints.up('s465'));
  const { id, thumbnailUrl, thumbnails, name, price } = product;

  return (
    <RouteLink href={`${PRODUCT_DETAIL_PATH}${id}`} underline="none">
      <Paper
        square
        elevation={5}
        sx={{
          overflow: 'hidden',
          '&:hover': {
            boxShadow: (theme) => theme.shadows[20],
          },
        }}
      >
        <Box sx={{ width: 1, aspectRatio: '1 / 1' }}>
          <Image
            src={thumbnailUrl || thumbnails?.[0]}
            alt="product-item"
            sx={{ objectFit: 'cover' }}
            loading="lazy"
          />
        </Box>
        <Box sx={{ mt: 1, p: 1.5 }}>
          <Typography
            variant="body2"
            sx={{ color: 'vShip.product.main' }}
            noWrap
          >
            {name}
          </Typography>
          <Typography
            noWrap
            variant={up465 ? 'body1' : 'body2'}
            sx={{ mt: 1, fontWeight: 'bold' }}
          >
            {price && currency.templatePriceVI(price * priceRate)} VND
          </Typography>
          <Typography
            noWrap
            variant={up465 ? 'body1' : 'body2'}
            sx={{ fontWeight: 'bold' }}
          >
            {currency.templatePriceVI(price)} JPY
          </Typography>
        </Box>
      </Paper>
    </RouteLink>
  );
};

export default ProductCard;
