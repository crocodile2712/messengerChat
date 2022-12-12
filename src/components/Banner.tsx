import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { A11y, Autoplay, Navigation, Pagination, Scrollbar } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { BannerType } from 'types/banner';
import Image from './Image';
import RouteLink from './RouteLink';

interface Props {
  banners: BannerType[];
}

const Banner = (props: Props) => {
  const { banners } = props;

  return (
    <Box
      sx={{
        backgroundColor: 'background.paper',
        mt: { xs: 18, sm: 22 },
        mb: 4,
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          height: 250,
        }}
        disableGutters
      >
        <Swiper
          modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
          style={{ width: '100%', height: '100%' }}
          spaceBetween={50}
          slidesPerView={1}
          loop={true}
          navigation
          pagination={{ clickable: true }}
          autoplay={{
            delay: 2000,
            disableOnInteraction: false,
          }}
        >
          {banners?.map((item, index) => (
            <SwiperSlide key={index}>
              <RouteLink href={item.bannerUrl || ''}>
                <Image
                  src={item.imageUrl || ''}
                  alt={item.name}
                  sx={{ objectFit: 'cover', cursor: 'pointer' }}
                />
              </RouteLink>
            </SwiperSlide>
          ))}
        </Swiper>
      </Container>
    </Box>
  );
};

export default Banner;
