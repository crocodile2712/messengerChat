import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Slide from 'components/Slides/components/Slide';
import SlideContainer from 'components/Slides/components/SlideContainer';
import SlideInner from 'components/Slides/components/SlideInner';
import SlideViewport from 'components/Slides/components/SlideViewport';
import SlideWrapper from 'components/Slides/components/SlideWrapper';
import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useState } from 'react';
import type { Product } from 'types/product';
import NextButton from './NextButton';
import PrevButton from './PrevButton';
import ProductCard from './ProductCard';

interface Props {
  products: Product[];
}

const FeaturedProductsSlide = (props: Props) => {
  const { products } = props;
  const [ref, embla] = useEmblaCarousel({
    slidesToScroll: 2,
    skipSnaps: false,
    align: 'start',
  });

  const [prevEnabled, setPrevEnabled] = useState<boolean>(false);
  const [nextEnabled, setNextEnabled] = useState<boolean>(false);

  const scrollPrev = useCallback(() => {
    if (!embla) return;
    embla.scrollPrev();
  }, [embla]);

  const scrollNext = useCallback(() => {
    if (!embla) return;
    embla.scrollNext();
  }, [embla]);

  const onSelect = useCallback(() => {
    if (!embla) return;
    setPrevEnabled(embla.canScrollPrev());
    setNextEnabled(embla.canScrollNext());
  }, [embla]);

  useEffect(() => {
    if (!embla) return;

    embla.reInit();

    onSelect();
    embla.on('select', onSelect);
  }, [embla, products, onSelect]);

  return (
    <Container maxWidth="lg" sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', mt: 3 }}>
        <Typography variant="h6" sx={{ ml: 1.5, textTransform: 'uppercase' }}>
          Sản phẩm nổi bật
        </Typography>
        <Divider variant="fullWidth" sx={{ mb: 2 }} />
        <SlideWrapper>
          <SlideViewport ref={ref}>
            <SlideContainer sx={{ gap: 1.5 }}>
              {products.map((product, i) => (
                <Slide
                  key={i}
                  sx={{
                    minWidth: {
                      xs: `calc((100% - ${1 * 12}px) / 2)`,
                      sm: `calc((100% - ${3 * 12}px) / 4)`,
                      lg: `calc((100% - ${5 * 12}px) / 6)`,
                    },
                  }}
                >
                  <SlideInner sx={{ overflow: 'revert', my: 1.25 }}>
                    <ProductCard product={product} />
                  </SlideInner>
                </Slide>
              ))}
            </SlideContainer>
          </SlideViewport>
          <PrevButton onPrev={scrollPrev} enabled={prevEnabled} />
          <NextButton onNext={scrollNext} enabled={nextEnabled} />
        </SlideWrapper>
      </Box>
    </Container>
  );
};

export default FeaturedProductsSlide;
