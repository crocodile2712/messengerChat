import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { A11y, Navigation, Scrollbar } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Product } from 'types/product';
import SwiperSliceCard from './SwiperSliceCard';

interface Props {
  title: string;
  items: Product[];
}

const ProductSuggestSlider = (props: Props) => {
  const { title, items } = props;

  return (
    <Container
      maxWidth="lg"
      sx={{
        height: 350,
        mt: 2,
      }}
      disableGutters
    >
      <Box
        sx={{
          height: 1,
          backgroundColor: 'background.paper',
          p: 2.25,
          '&:hover': {
            '.swiper-button-prev': {
              visibility: 'visible',
              width: 50,
              height: 260,
              top: 30,
              left: -15,
            },
            '.swiper-button-next': {
              visibility: 'visible',
              width: 50,
              height: 260,
              top: 30,
              right: -15,
            },
          },
          '& .swiper-button-prev': {
            visibility: 'hidden',
          },
          '& .swiper-button-prev::after': {
            fontSize: 36,
          },
          '& .swiper-button-next': {
            visibility: 'hidden',
          },
          '& .swiper-button-next::after': {
            fontSize: 36,
          },
        }}
      >
        <Typography variant="h5">{title}</Typography>
        <Divider variant="fullWidth" sx={{ mb: 1 }} />
        <Swiper
          modules={[Navigation, Scrollbar, A11y]}
          style={{ width: '100%', height: '100%' }}
          spaceBetween={10}
          slidesPerView={6}
          navigation
          breakpoints={{
            1200: {
              slidesPerView: 6,
              spaceBetween: 10,
            },
            1000: {
              slidesPerView: 5,
              spaceBetween: 10,
            },
            850: {
              slidesPerView: 4,
              spaceBetween: 10,
            },
            660: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
            460: {
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

export default ProductSuggestSlider;
