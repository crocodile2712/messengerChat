import Container from '@mui/material/Container';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import Typography from '@mui/material/Typography';
import Image from 'components/Image';

interface NoResultProps {
  message?: ReactNode;
  imageWidth?: number;
}

const NoResult = (props: NoResultProps) => {
  const { message, imageWidth } = props;
  const { t } = useTranslation();

  return (
    <Container sx={{ textAlign: 'center' }}>
      <Image
        src={'/static/imgs/no_result.png'}
        alt={'No result'}
        sx={{ width: imageWidth, margin: 'auto' }}
      />
      <Typography variant="h6">{message ?? t('title.noResult')}</Typography>
    </Container>
  );
};

export default NoResult;
