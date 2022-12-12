import Page from 'components/Page';
import Container from '@mui/material/Container';
import Script from 'next/script';
import SimpleHeader from 'layouts/SimpleHeader';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import product from 'services/product';
import type { ProductDetail } from 'types/product';
import { Fragment, useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import { useTranslation } from 'react-i18next';
import getMessageError from 'utils/controlMessage';
import useNotification from 'hooks/useNotification';
import { useRouter } from 'next/router';

const Translate = () => {
  const { t } = useTranslation();
  const setNotification = useNotification();
  const { query } = useRouter();
  const { productId, type } = query;
  const [productDetail, setProductDetail] = useState<ProductDetail | null>(
    null
  );

  useEffect(() => {
    if (typeof productId === 'string') {
      product
        .getProductDetail(productId)
        .then((response) => {
          setProductDetail(response.data._source);
        })
        .catch((error) => {
          const message = getMessageError(error) || 'message.systemError';
          setNotification({
            message: t(message),
            severity: 'error',
          });
        });
    }
  }, [setNotification, t, productId]);

  return (
    <Page title="Dịch sản phẩm">
      <SimpleHeader />
      <Container sx={{ p: 2 }}>
        <Box component={Paper} sx={{ p: 2 }}>
          {type === 'description' ? (
            <Fragment>
              <Typography sx={{ mb: 2 }}>
                {t('title.productDescription')}:
              </Typography>
              <Typography>{productDetail?.description}</Typography>
            </Fragment>
          ) : type === 'comment' ? (
            <Fragment>
              <Typography sx={{ mb: 2 }}>{t('title.comment')}:</Typography>
              {productDetail?.comments?.map((comment) => (
                <Box
                  key={comment.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 2,
                    ml: 4,
                    maxWidth: '50%',
                  }}
                >
                  <Avatar
                    src={comment.user.photo_url}
                    sx={{ mr: 2, width: 30, height: 30 }}
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      borderRadius: 4,
                      backgroundColor: 'vShip.product.bg',
                      p: 1,
                    }}
                  >
                    {comment.message}
                  </Typography>
                </Box>
              ))}
            </Fragment>
          ) : (
            <Fragment></Fragment>
          )}
        </Box>
      </Container>

      <Script
        type="text/javascript"
        src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
      />
      <Script
        type="text/javascript"
        id="google-translate-init"
        dangerouslySetInnerHTML={{
          __html: `function setCookie(key, value, expiry) {
            var expires = new Date();
            expires.setTime(expires.getTime() + (expiry * 24 * 60 * 60 * 1000));
            document.cookie = key + '=' + value + ';expires=' + expires.toUTCString();
          } 
          function googleTranslateElementInit() {
            setCookie('googtrans', '/ja/vi',1);
            new google.translate.TranslateElement({pageLanguage: 'ja', layout: google.translate.TranslateElement.FloatPosition.TOP_LEFT}, 'google_translate_element');
          }`,
        }}
      />
    </Page>
  );
};

export default Translate;
