import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import Box from '@mui/material/Box';
import Image from 'components/Image';
import { FreeMode, Navigation, Thumbs } from 'swiper';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

interface Props {
  items?: string[];
}

const ThumbsGallery = (props: Props) => {
  const { items } = props;
  const [activeThumb, setActiveThumb] = useState();

  return (
    <Box
      sx={{
        width: { xs: 1, s700: 0.95, md: 400 },
        height: 400,
        '.mySwiper .swiper-slide': {
          width: '25%',
          height: '100%',
          opacity: 0.4,
        },
        '.mySwiper .swiper-slide-thumb-active': {
          opacity: 1,
        },
        '&:hover': {
          '.swiper-button-prev': {
            visibility: 'visible',
            width: 60,
            height: 300,
            top: 20,
            left: -15,
          },
          '.swiper-button-next': {
            visibility: 'visible',
            width: 60,
            height: 300,
            top: 20,
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
      <Swiper
        style={{ height: '75%' }}
        spaceBetween={10}
        navigation={true}
        thumbs={{
          // @ts-ignore
          swiper: activeThumb && !activeThumb.destroyed ? activeThumb : null,
        }}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mySwiper2"
      >
        {items?.map((item, index) => (
          <SwiperSlide key={index}>
            <Image sx={{ objectFit: 'contain' }} src={item} alt="" />
          </SwiperSlide>
        ))}
      </Swiper>
      <Swiper
        // @ts-ignore
        onSwiper={setActiveThumb}
        style={{ height: '25%', marginTop: 10 }}
        // loop={true}
        spaceBetween={10}
        slidesPerView={4}
        freeMode={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mySwiper"
      >
        {items?.map((item, index) => (
          <SwiperSlide key={index}>
            <Image sx={{ objectFit: 'cover' }} src={item} alt="" />
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
};

export default ThumbsGallery;
