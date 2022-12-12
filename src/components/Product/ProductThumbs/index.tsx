import Box from '@mui/material/Box';
import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useState } from 'react';
import Slide from 'components/Slides/components/Slide';
import SlideImage from 'components/Slides/components/SlideImage';
import SlideInner from 'components/Slides/components/SlideInner';
import SlideViewport from 'components/Slides/components/SlideViewport';
import SlideWrapper from 'components/Slides/components/SlideWrapper';
import SlideContainer from 'components/Slides/components/SlideContainer';
import NextButton from './NextButton';
import PrevButton from './PrevButton';
import Thumb from './Thumb';

interface Props {
  photos: string[];
}

const ProductThumbsSlide = (props: Props) => {
  const { photos } = props;
  const [main, embla] = useEmblaCarousel({ skipSnaps: false });
  const [thumb, emblaThumbs] = useEmblaCarousel({
    containScroll: 'keepSnaps',
    dragFree: true,
  });

  const [prevEnabled, setPrevEnabled] = useState<boolean>(false);
  const [nextEnabled, setNextEnabled] = useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const scrollPrev = useCallback(() => {
    if (!embla) return;
    embla.scrollPrev();
  }, [embla]);

  const scrollNext = useCallback(() => {
    if (!embla) return;
    embla.scrollNext();
  }, [embla]);

  const scrollTo = useCallback(
    (index: number) => {
      if (!embla || !emblaThumbs) return;
      if (emblaThumbs.clickAllowed()) {
        embla.scrollTo(index);
      }
    },
    [embla, emblaThumbs]
  );

  const onSelect = useCallback(() => {
    if (!embla || !emblaThumbs) return;
    setSelectedIndex(embla.selectedScrollSnap());
    emblaThumbs.scrollTo(embla.selectedScrollSnap());
    setPrevEnabled(embla.canScrollPrev());
    setNextEnabled(embla.canScrollNext());
  }, [embla, emblaThumbs]);

  useEffect(() => {
    if (!embla || !emblaThumbs) return;

    embla.reInit();
    emblaThumbs.reInit();

    onSelect();
    embla.on('select', onSelect);
  }, [embla, emblaThumbs, photos, onSelect]);

  return (
    <Box sx={{ p: { xs: 0, sm: 1.5 } }}>
      <SlideWrapper sx={{ height: 300 }}>
        <SlideViewport ref={main}>
          <SlideContainer>
            {photos.map((photo, i) => (
              <Slide key={i}>
                <SlideInner sx={{ height: 300 }}>
                  <SlideImage src={photo} alt="Photo image" />
                </SlideInner>
              </Slide>
            ))}
          </SlideContainer>
        </SlideViewport>
        <PrevButton onPrev={scrollPrev} enabled={prevEnabled} />
        <NextButton onNext={scrollNext} enabled={nextEnabled} />
      </SlideWrapper>
      <SlideWrapper sx={{ height: 100, mt: 2 }}>
        <SlideViewport ref={thumb}>
          <SlideContainer sx={{ cursor: 'default' }}>
            {photos.map((photo, i) => (
              <Slide key={i} sx={{ minWidth: '20%' }}>
                <Thumb
                  src={photo}
                  index={i}
                  scrollTo={scrollTo}
                  selectedIndex={selectedIndex}
                />
              </Slide>
            ))}
          </SlideContainer>
        </SlideViewport>
      </SlideWrapper>
    </Box>
  );
};

export default ProductThumbsSlide;
