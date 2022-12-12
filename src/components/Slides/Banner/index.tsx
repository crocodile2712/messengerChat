import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Autoplay from 'embla-carousel-autoplay';
import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import Slide from '../components/Slide';
import SlideImage from '../components/SlideImage';
import SlideInner from '../components/SlideInner';
import SlideViewport from '../components/SlideViewport';
import SlideWrapper from '../components/SlideWrapper';
import SlideContainer from '../components/SlideContainer';
import Navigation from './Navigation';
import NextButton from './NextButton';
import PrevButton from './PrevButton';

interface Props {
  banners: any[];
}

const BannerSlide = (props: Props) => {
  const { banners } = props;
  const autoplay = useRef(
    Autoplay(
      { delay: 4500, stopOnInteraction: false },
      (root) => root.parentElement
    )
  );
  const [ref, embla] = useEmblaCarousel({ skipSnaps: false }, [
    autoplay.current,
  ]);

  const [prevEnabled, setPrevEnabled] = useState<boolean>(false);
  const [nextEnabled, setNextEnabled] = useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(() => {
    if (!embla) return;
    embla.scrollPrev();
    autoplay.current.reset();
  }, [embla]);

  const scrollNext = useCallback(() => {
    if (!embla) return;
    embla.scrollNext();
    autoplay.current.reset();
  }, [embla]);

  const scrollTo = useCallback(
    (index: number) => {
      if (!embla) return;
      embla.scrollTo(index);
    },
    [embla]
  );

  const onSelect = useCallback(() => {
    if (!embla) return;
    setSelectedIndex(embla.selectedScrollSnap());
    setPrevEnabled(embla.canScrollPrev());
    setNextEnabled(embla.canScrollNext());
  }, [embla]);

  useEffect(() => {
    if (!embla) return;

    embla.reInit();

    onSelect();
    setScrollSnaps(embla.scrollSnapList());
    embla.on('select', onSelect);
  }, [embla, banners, onSelect]);

  return (
    <Box sx={{ pt: { xs: 16, sm: 22 }, mb: 4 }}>
      <Container maxWidth="lg">
        <SlideWrapper>
          <SlideViewport ref={ref}>
            <SlideContainer>
              {banners.map((banner, i) => (
                <Slide key={i}>
                  <SlideInner
                    sx={{ width: 1, aspectRatio: '4 / 1', height: 'auto' }}
                  >
                    <SlideImage src={banner.imageUrl} alt={banner.name} />
                  </SlideInner>
                </Slide>
              ))}
            </SlideContainer>
          </SlideViewport>
          <PrevButton onPrev={scrollPrev} enabled={prevEnabled} />
          <NextButton onNext={scrollNext} enabled={nextEnabled} />
          <Navigation
            index={selectedIndex}
            length={scrollSnaps.length}
            scrollTo={scrollTo}
          />
        </SlideWrapper>
      </Container>
    </Box>
  );
};

export default BannerSlide;
