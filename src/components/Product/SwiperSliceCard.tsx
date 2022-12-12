import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Image from 'components/Image';
import TypographyWrap from 'components/TypographyWrap';
import type { Product } from 'types/product';
import { useRouter } from 'next/router';
import { PRODUCT_DETAIL_PATH } from 'constant/route-path';
import currency from 'utils/Currency';
import useShoppingCart from 'hooks/useShoppingCart';

interface ProductExtend extends Product {
  thumbnails?: string[];
}
interface Props {
  item?: ProductExtend;
}

const SwiperSliceCard = (props: Props) => {
  const { item } = props;
  const router = useRouter();
  const { priceRate } = useShoppingCart();

  const handleClick = () => {
    if (!item?.id) return;
    router.push(PRODUCT_DETAIL_PATH + item?.id);
  };

  return (
    <Paper
      elevation={5}
      sx={{
        height: 0.9,
        p: 1.5,
        '&:hover': {
          backgroundColor: 'background.default',
          transition: 'all 0.3s ease',
          cursor: 'pointer',
          '.product-name': {
            color: 'vShip.product.hover',
          },
        },
      }}
      onClick={handleClick}
    >
      <Box sx={{ height: '60%' }}>
        <Image
          src={item?.thumbnailUrl || item?.thumbnails?.[0]}
          alt="product-item"
          sx={{ objectFit: 'contain' }}
        />
      </Box>
      <Box sx={{ mt: 1 }}>
        <TypographyWrap
          className="product-name"
          variant="body2"
          sx={{
            color: 'vShip.product.main',
            height: 20,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {item?.name}
        </TypographyWrap>

        <TypographyWrap variant="body1" sx={{ mt: 1, fontWeight: 'bold' }}>
          {item?.price && currency.templatePriceVI(item.price * priceRate)} VND
        </TypographyWrap>
        <TypographyWrap variant="body1" sx={{ fontWeight: 'bold' }}>
          {currency.templatePriceVI(item?.price)} JPY
        </TypographyWrap>
      </Box>
    </Paper>
  );
};
export default SwiperSliceCard;
