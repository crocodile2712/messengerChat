import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { A11y, Grid, Navigation, Scrollbar } from 'swiper';
import 'swiper/css';
import 'swiper/css/grid';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Product, SearchProduct } from 'types/product';
import SwiperSliceCard from './SwiperSliceCard';

interface Props {
  items: Product[] | SearchProduct[] | null;
  title: string;
  rows: number;
  height: number;
}

const ProductSimilarSlider = (props: Props) => {
  const { items, title, rows, height } = props;

  return (
    <Container
      maxWidth="lg"
      sx={{
        height,
        mt: 2,
      }}
      disableGutters
    >
      <Box
        sx={{
          height: 1,
          backgroundColor: 'background.paper',
          p: 2.25,
          '& .swiper-button-prev, & .swiper-button-next': {
            top: '43%',
          },
          '.swiper-slide': {
            marginTop: 0,
            height: 'calc((100% - 10px) / 3)',
          },
          '.swiper-wrapper': {
            height: 'auto',
          },
        }}
      >
        <Typography variant="h5">{title}</Typography>
        <Divider variant="fullWidth" sx={{ mb: 1 }} />
        <Swiper
          style={{
            width: '100%',
            height: '100%',
          }}
          spaceBetween={10}
          slidesPerView={6}
          navigation
          grid={{
            rows,
            fill: 'row',
          }}
          modules={[Navigation, Scrollbar, A11y, Grid]}
          breakpoints={{
            1200: {
              slidesPerView: 6,
              spaceBetween: 10,
            },
            900: {
              slidesPerView: 4,
              spaceBetween: 10,
            },
            600: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
            425: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            0: {
              slidesPerView: 1,
              spaceBetween: 20,
            },
          }}
        >
          {items?.map((item, index) => (
            <SwiperSlide key={index} style={{ height: '240px' }}>
              <SwiperSliceCard item={item} />
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>
    </Container>
  );
};

export default ProductSimilarSlider;
