import CalculateIcon from '@mui/icons-material/Calculate';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import MailIcon from '@mui/icons-material/Mail';
import MoodIcon from '@mui/icons-material/Mood';
import MoodBadIcon from '@mui/icons-material/MoodBad';
import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import StoreIcon from '@mui/icons-material/Store';
import TranslateIcon from '@mui/icons-material/Translate';
import LoadingButton from '@mui/lab/LoadingButton';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import FeaturedProductsSlide from 'components/Product/FeaturedProducts';
import BreadcrumbsProductDetail from 'components/Product/ProductDetail/BreadCrumb';
import BuyingProcedure from 'components/Product/ProductDetail/BuyingProcedure';
import ReturnPolicy from 'components/Product/ProductDetail/ReturnPolicy';
import ProductThumbsSlide from 'components/Product/ProductThumbs';
import TypographyWrap from 'components/TypographyWrap';
import { ON_SALE_PRODUCT } from 'constant/common';
import {
  BUY_NOW_PATH,
  ESTIMATE_PRICE_PATH,
  LOGIN_PATH,
  PRODUCT_DETAIL_PATH,
} from 'constant/route-path';
import useAuth from 'hooks/useAuth';
import useNotification from 'hooks/useNotification';
import useShoppingCart from 'hooks/useShoppingCart';
import HomeLayout from 'layouts/Home';
import { useRouter } from 'next/router';
import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import product from 'services/product';
import type { Comment, Product, ProductDetail } from 'types/product';
import getMessageError from 'utils/controlMessage';
import currency from 'utils/Currency';
import LocalStorage from 'utils/LocalStorage';
import wait from 'utils/wait';

const ProductDetailPage = () => {
  const { t } = useTranslation();
  const setNotification = useNotification();
  const { query, push } = useRouter();
  const { isAuthenticated, refetch: refetchUserInfo } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [similarProduct, setSimilarProduct] = useState<Product[]>([]);
  const [productDetail, setProductDetail] = useState<ProductDetail | null>(
    null
  );
  const [isOpenBuyingProcedureDialog, setOpenBuyingProcedureDialog] =
    useState<boolean>(false);
  const [isOpenReturnPolicyDialog, setOpenReturnPolicyDialog] =
    useState<boolean>(false);
  const [isOpenSuccessDialog, setOpenSuccessDialog] = useState<boolean>(false);
  const [isAddToCartSuccess, setAddToCartSuccess] = useState<boolean>(false);
  const { productId } = query;
  let winRef: Window | null = null;
  const { refetch, priceRate, setBuyItems } = useShoppingCart();
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentShowed, setCommentShowed] = useState<Comment[]>([]);
  const [numberCommentShowed, setNumberCommentShowed] = useState<number>(5);
  const [isShowMoreDescription, setShowMoreDescription] =
    useState<boolean>(false);
  const refDes = useRef<HTMLSpanElement>(null);
  const theme = useTheme();
  const up465 = useMediaQuery(theme.breakpoints.up('s465'));

  const getProductDetail = useCallback(() => {
    if (typeof productId !== 'string') {
      return;
    }

    product.getProductDetail(productId).then((response) => {
      if (response.data) {
        setProductDetail(response.data._source || []);
        setComments(response.data._source?.comments || []);
      }
    });
  }, [productId]);

  const getRelatedProduct = useCallback(() => {
    if (typeof productId !== 'string') {
      return;
    }

    setSimilarProduct([]);
    product
      .getRelatedProduct({ id: [productId] })
      .then((response) => {
        if (response.data) {
          setSimilarProduct(response.data[0]?.items || []);
        }
      })
      .catch((error) => {});
  }, [productId]);

  useEffect(() => {
    if (typeof productId !== 'string') {
      return;
    }
    product
      .updateNewestProductDetail(productId)
      .then((res) => {
        if (res.data) {
          setProductDetail(res.data.product || null);
          setComments(res.data.product.comments || []);
          setSimilarProduct(res.data.relatedItem?.items || []);
        } else {
          getProductDetail();
          getRelatedProduct();
        }
      })
      .catch((error) => {
        getProductDetail();
        getRelatedProduct();
      });
  }, [productId, getProductDetail, getRelatedProduct]);

  useEffect(() => {
    if (!productDetail) return;
    product.addWatchedProduct({
      id: productDetail.id,
      name: productDetail.name,
      price: productDetail.price,
      thumbnailUrl: productDetail?.thumbnails?.[0],
    });
  }, [productDetail]);

  useEffect(() => {
    if (numberCommentShowed > 5) {
      const commentShow = comments.slice(0, numberCommentShowed);
      setCommentShowed(commentShow);
    } else {
      const commentShow = comments.slice(0, 5);
      setCommentShowed(commentShow);
    }

    if (numberCommentShowed > comments?.length) {
      setNumberCommentShowed(comments?.length);
    }
  }, [numberCommentShowed, comments]);

  const handleCloseSuccessDialog = () => {
    setOpenSuccessDialog(false);
  };

  const openEstimateWindow = () => {
    window.open(
      window.location.origin +
        ESTIMATE_PRICE_PATH +
        `?price=${productDetail?.price}`,
      '_blank',
      'toolbar=0,location=0,menubar=0'
    );
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      LocalStorage.set('last-path', PRODUCT_DETAIL_PATH);
      LocalStorage.set('last-product', productId || '');
      push(LOGIN_PATH);
      return;
    }

    if (!productDetail) return;
    setLoading(true);
    product
      .addToCart({
        id: productDetail.id,
        name: productDetail.name,
        price: productDetail.price,
        brand: productDetail?.item_brand?.name || '',
        size: productDetail?.item_size?.name || '',
        status: productDetail.status,
        image: productDetail?.thumbnails?.[0],
        condition: productDetail?.item_condition?.name || '',
        shippingDuration: productDetail?.shipping_duration?.name || '',
        shippingMethod: productDetail?.shipping_method?.name || '',
      })
      .then((response) => {
        setAddToCartSuccess(true);
        setOpenSuccessDialog(true);
        refetch();
      })
      .catch((error) => {
        const message = getMessageError(error) || 'message.systemError';
        setNotification({
          message: t(message),
          severity: 'error',
        });
      })
      .finally(async () => {
        setLoading(false);
        await wait(3000);
        setOpenSuccessDialog(false);
      });
  };

  const handleTranslate = (type: string) => () => {
    if (!productDetail) return;
    const url = `${window.location.origin}/translate/${productDetail.id}?type=${type}`;
    if (!winRef || winRef.closed || winRef.document.location.href !== url) {
      winRef = window.open('', 'winPop', 'toolbar=0,location=0,menubar=0');
      if (winRef === null || winRef.document.location.href !== url) {
        winRef = window.open(url, 'winPop');
      }
    } else {
      winRef.focus();
    }
  };

  const handleCloseBuyingProcedureDialog = () => {
    setOpenBuyingProcedureDialog(false);
  };

  const handleOpenOrderProcessDialog = () => {
    setOpenBuyingProcedureDialog(true);
  };
  const handleCloseReturnPolicyDialog = () => {
    setOpenReturnPolicyDialog(false);
  };

  const handleOpenReturnPolicyDialog = () => {
    setOpenReturnPolicyDialog(true);
  };

  const changeToBuyNow = () => {
    if (!isAuthenticated) {
      LocalStorage.set('last-path', PRODUCT_DETAIL_PATH);
      LocalStorage.set('last-product', productId || '');
      push(LOGIN_PATH);
      return;
    }

    refetchUserInfo();
    if (productDetail) {
      setBuyItems([
        {
          id: productDetail.id,
          name: productDetail.name,
          price: productDetail.price,
          brand: productDetail?.item_brand?.name || '',
          size: productDetail?.item_size?.name || '',
          status: productDetail.status,
          image: productDetail?.thumbnails?.[0],
          condition: productDetail?.item_condition?.name || '',
          shippingDuration: productDetail?.shipping_duration?.name || '',
          shippingMethod: productDetail?.shipping_method?.name || '',
        },
      ]);
    }
    push(BUY_NOW_PATH);
  };

  const showMoreComments = () => {
    const newNumberCommentShow = numberCommentShowed + 10;
    if (numberCommentShowed > comments?.length) {
      setNumberCommentShowed(comments?.length);
      return;
    }

    if (numberCommentShowed === comments?.length) {
      setNumberCommentShowed(5);
      return;
    }
    setNumberCommentShowed(newNumberCommentShow);
  };

  const toggleMoreDescription = () => {
    setShowMoreDescription(!isShowMoreDescription);
  };

  return (
    <HomeLayout>
      <Container
        maxWidth="lg"
        sx={{ py: 3, mt: { xs: 13, sm: 20 } }}
        disableGutters
      >
        <BreadcrumbsProductDetail productDetail={productDetail} />
        <Grid
          container
          spacing={1}
          sx={{
            bgcolor: 'background.paper',
            width: 1,
            ml: 0,
            p: 1,
            alignItems: 'flex-start',
          }}
        >
          <Grid item xs={12} s700={6} md={6} lg={5}>
            <ProductThumbsSlide photos={productDetail?.photos || []} />
          </Grid>
          <Grid
            container
            item
            xs={12}
            s700={6}
            md={6}
            lg={5}
            spacing={1}
            sx={{ mt: { xs: 2, s700: 0 } }}
          >
            <Grid item xs={12} sm={12} md={12}>
              <TypographyWrap variant="h5" sx={{ color: 'vShip.text.main' }}>
                {productDetail?.name}
              </TypographyWrap>
            </Grid>
            <Grid container item xs={12} sm={12} md={12} spacing={1}>
              <Grid item xs={4} sm={4} md={4}>
                <Typography>{t('label.product.price')}:</Typography>
              </Grid>
              <Grid item xs={8} sm={8} md={8}>
                <TypographyWrap variant="h5" sx={{ color: 'vShip.text.main' }}>
                  {(productDetail &&
                    currency.templatePriceVI(
                      productDetail.price * priceRate
                    )) ||
                    0}{' '}
                  VND
                </TypographyWrap>
                <TypographyWrap variant="h6" sx={{ color: 'vShip.text.main' }}>
                  {currency.templatePriceVI(productDetail?.price) || 0} JPY
                </TypographyWrap>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <Divider />
            </Grid>
            <Grid container item xs={12} sm={12} md={12}>
              <Grid
                item
                xs={6}
                sm={6}
                md={6}
                sx={{
                  minHeight: 35,
                  display: 'flex',
                  alignItems: 'center',
                  pl: 1.5,
                }}
              >
                <Typography variant="h6">
                  {t('label.product.branch')}
                </Typography>
              </Grid>
              <Grid
                item
                xs={6}
                sm={6}
                md={6}
                sx={{
                  minHeight: 35,
                  display: 'flex',
                  alignItems: 'center',
                  color: 'vShip.product.main',
                }}
              >
                <TypographyWrap>
                  {productDetail?.item_brand?.name}
                </TypographyWrap>
              </Grid>
            </Grid>
            <Grid container alignItems="center" item xs={12} sm={12} md={12}>
              <Grid
                item
                xs={6}
                sm={6}
                md={6}
                sx={{
                  backgroundColor: 'vShip.product.bg',
                  minHeight: 35,
                  display: 'flex',
                  alignItems: 'center',
                  pl: 1.5,
                }}
              >
                <Typography variant="h6">{t('label.product.size')}</Typography>
              </Grid>
              <Grid
                item
                xs={6}
                sm={6}
                md={6}
                sx={{
                  backgroundColor: 'vShip.product.bg',
                  minHeight: 35,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <TypographyWrap>
                  {productDetail?.item_size?.name}
                </TypographyWrap>
              </Grid>
            </Grid>
            <Grid container alignItems="center" item xs={12} sm={12} md={12}>
              <Grid
                item
                xs={6}
                sm={6}
                md={6}
                sx={{
                  minHeight: 35,
                  display: 'flex',
                  alignItems: 'center',
                  pl: 1.5,
                }}
              >
                <Typography variant="h6">
                  {t('label.product.condition')}
                </Typography>
              </Grid>
              <Grid
                item
                xs={6}
                sm={6}
                md={6}
                sx={{
                  minHeight: 35,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <TypographyWrap>
                  {productDetail?.item_condition?.name}
                </TypographyWrap>
              </Grid>
            </Grid>
            <Grid container alignItems="center" item xs={12} sm={12} md={12}>
              <Grid
                item
                xs={6}
                sm={6}
                md={6}
                sx={{
                  backgroundColor: 'vShip.product.bg',
                  minHeight: 35,
                  display: 'flex',
                  alignItems: 'center',
                  pl: 1.5,
                }}
              >
                <Typography variant="h6">
                  {t('label.product.japanTax')}
                </Typography>
              </Grid>
              <Grid
                item
                xs={6}
                sm={6}
                md={6}
                sx={{
                  backgroundColor: 'vShip.product.bg',
                  minHeight: 35,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <TypographyWrap>Đã bao gồm thuế</TypographyWrap>
              </Grid>
            </Grid>
            <Grid container alignItems="center" item xs={12} sm={12} md={12}>
              <Grid
                item
                xs={6}
                sm={6}
                md={6}
                sx={{
                  minHeight: 35,
                  display: 'flex',
                  alignItems: 'center',
                  pl: 1.5,
                }}
              >
                <Typography variant="h6">
                  {t('label.product.internalShipPrice')}
                </Typography>
              </Grid>
              <Grid
                item
                xs={6}
                sm={6}
                md={6}
                sx={{ minHeight: 35, display: 'flex', alignItems: 'center' }}
              >
                <TypographyWrap>
                  {productDetail?.shipping_payer?.name}
                </TypographyWrap>
              </Grid>
            </Grid>
            <Grid container alignItems="center" item xs={12} sm={12} md={12}>
              <Grid
                item
                xs={6}
                sm={6}
                md={6}
                sx={{
                  backgroundColor: 'vShip.product.bg',
                  minHeight: 35,
                  display: 'flex',
                  alignItems: 'center',
                  pl: 1.5,
                }}
              >
                <Typography variant="h6">
                  {t('label.product.status')}
                </Typography>
              </Grid>
              <Grid
                item
                xs={6}
                sm={6}
                md={6}
                sx={{
                  backgroundColor: 'vShip.product.bg',
                  minHeight: 35,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {productDetail?.status === ON_SALE_PRODUCT ? (
                  <Typography variant="h6" sx={{ color: 'success.dark' }}>
                    {t('title.inStock')}
                  </Typography>
                ) : (
                  <Typography variant="h6" sx={{ color: 'error.dark' }}>
                    {t('title.outStock')}
                  </Typography>
                )}
              </Grid>
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <Divider />
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <Grid
                container
                alignItems="center"
                item
                xs={12}
                sm={12}
                md={12}
                spacing={1}
              >
                <Grid item xs={12} s465={6} s700={8} md={6}>
                  <LoadingButton
                    sx={{
                      backgroundColor: 'vShip.product.important',
                      '&:disabled': {
                        backgroundColor: 'vShip.text.disabled2',
                        color: 'primary.contrastText',
                      },
                      px: { xs: 1 },
                    }}
                    fullWidth
                    loading={loading}
                    disabled={!(productDetail?.status === ON_SALE_PRODUCT)}
                    startIcon={<ShoppingCartIcon />}
                    loadingPosition="start"
                    size="large"
                    onClick={handleAddToCart}
                  >
                    {t('button.addToCart')}
                  </LoadingButton>
                </Grid>
                <Grid item xs={12} s465={6} s700={4} md={6}>
                  <Button
                    sx={{
                      backgroundColor: 'vShip.product.important',
                      '&:disabled': {
                        backgroundColor: 'vShip.text.disabled2',
                        color: 'primary.contrastText',
                      },
                      width: { xs: 1, md: 'auto' },
                      px: { xs: 1, s700: 2 },
                    }}
                    size="large"
                    disabled={!(productDetail?.status === ON_SALE_PRODUCT)}
                    onClick={changeToBuyNow}
                  >
                    {t('button.buyNow2')}
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid
            item
            container
            xs={12}
            sm={12}
            md={12}
            lg={2}
            sx={{ alignItems: 'center' }}
          >
            <Grid
              item
              container
              xs={12}
              s700={4}
              md={4}
              lg={12}
              sx={{
                maxHeight: 105,
                height: { xs: 140, lg: 1 },
                mt: { xs: 2, lg: 0 },
                px: { xs: 0, s700: 2, lg: 1 },
              }}
            >
              <Grid item xs={12} sm={12} md={12} sx={{ textAlign: 'center' }}>
                <Button
                  sx={{
                    color: 'vShip.product.main',
                    borderColor: 'vShip.product.main',
                  }}
                  onClick={openEstimateWindow}
                  fullWidth
                  size="medium"
                  variant="outlined"
                  startIcon={<CalculateIcon />}
                >
                  {t('button.predictPrice')}
                </Button>
              </Grid>
              <Grid item xs={12} sm={12} md={12} sx={{ textAlign: 'center' }}>
                <Button
                  sx={{
                    mt: 1,
                    color: 'vShip.product.main',
                    borderColor: 'vShip.product.main',
                  }}
                  fullWidth
                  size="medium"
                  variant="outlined"
                  endIcon={<KeyboardDoubleArrowRightIcon />}
                >
                  {t('button.watchInMercary')}
                </Button>
              </Grid>
            </Grid>
            <Grid
              item
              xs={6}
              s700={4}
              md={4}
              lg={12}
              sx={{ mt: 2, p: { xs: 1, lg: 0 }, pl: { xs: 0 } }}
            >
              <Box
                sx={{
                  backgroundColor: 'vShip.product.bg',
                  p: { xs: 1, s465: 2 },
                  minHeight: 140,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 'bold', height: { xs: 37, s465: 1 } }}
                >
                  {t('title.sellerInfo')}
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mt: { xs: 0, s465: 1 },
                  }}
                >
                  <StoreIcon sx={{ color: 'vShip.product.main', mr: 1 }} />
                  <TypographyWrap
                    variant="body2"
                    sx={{ color: 'vShip.product.main', fontSize: 11 }}
                  >
                    {productDetail?.seller?.name}
                  </TypographyWrap>
                </Box>
                <Grid
                  container
                  sx={{
                    my: 2,
                  }}
                >
                  <Grid
                    item
                    xs={4}
                    sm={4}
                    md={4}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <MoodIcon
                      sx={{ width: 15, height: 15, color: 'success.dark' }}
                    />
                    <TypographyWrap variant="body2" sx={{ fontSize: 11 }}>
                      {productDetail?.seller?.ratings?.good}
                    </TypographyWrap>
                  </Grid>
                  <Grid
                    item
                    xs={4}
                    sm={4}
                    md={4}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <SentimentNeutralIcon
                      sx={{ width: 15, height: 15, color: 'vShip.text.orange' }}
                    />
                    <TypographyWrap variant="body2" sx={{ fontSize: 11 }}>
                      {productDetail?.seller?.ratings?.normal}
                    </TypographyWrap>
                  </Grid>
                  <Grid
                    item
                    xs={4}
                    sm={4}
                    md={4}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <MoodBadIcon
                      sx={{ width: 15, height: 15, color: 'error.light' }}
                    />
                    <TypographyWrap variant="body2" sx={{ fontSize: 11 }}>
                      {productDetail?.seller?.ratings?.bad}
                    </TypographyWrap>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
            <Grid
              item
              xs={6}
              s700={4}
              md={4}
              lg={12}
              sx={{ mt: 2, p: { xs: 0, lg: 0 }, pr: { xs: 0 } }}
            >
              <Box
                sx={{
                  backgroundColor: 'vShip.product.bg',
                  p: { xs: 1, s465: 2 },
                  minHeight: 140,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 'bold', height: { xs: 37, s465: 1 } }}
                >
                  {t('title.help')}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <MailIcon
                    sx={{
                      color: 'vShip.product.main',
                      mr: { xs: 0.5, sm: 1 },
                      width: 20,
                    }}
                  />
                  <Typography
                    variant="body2"
                    sx={{ color: 'vShip.product.main' }}
                  >
                    cskh@vship.com
                  </Typography>
                </Box>
                <Grid
                  container
                  sx={{
                    my: 1,

                    color: 'vShip.text.lightBlue',
                  }}
                >
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <TypographyWrap
                      variant="body2"
                      onClick={handleOpenOrderProcessDialog}
                      sx={{
                        cursor: 'pointer',
                        '&:hover': { opacity: 0.5 },
                      }}
                    >
                      {t('title.buyingProcedure')}
                    </TypographyWrap>
                    {up465 && (
                      <KeyboardDoubleArrowRightIcon
                        sx={{ width: 20, height: 20 }}
                      />
                    )}
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <TypographyWrap
                      variant="body2"
                      sx={{ cursor: 'pointer', '&:hover': { opacity: 0.5 } }}
                      onClick={handleOpenReturnPolicyDialog}
                    >
                      {t('title.returnPolicy')}
                    </TypographyWrap>
                    {up465 && (
                      <KeyboardDoubleArrowRightIcon
                        sx={{ width: 20, height: 20 }}
                      />
                    )}
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={12} md={12} sx={{ mt: 5 }}>
            <Divider />
          </Grid>
          <Grid item xs={12} sm={12} md={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
              <Typography variant="h5">
                {t('title.productDescription')}
              </Typography>
              <Button
                sx={{
                  ml: 2,
                  color: 'vShip.product.main',
                  borderColor: 'vShip.product.main',
                }}
                size="small"
                variant="outlined"
                startIcon={<TranslateIcon />}
                onClick={handleTranslate('description')}
              >
                Dịch
              </Button>
            </Box>
            <TypographyWrap
              ref={refDes}
              variant="body2"
              sx={{
                overflowY: 'hidden',
                maxHeight: isShowMoreDescription ? 'fit-content' : 110,
              }}
            >
              {productDetail?.description}
            </TypographyWrap>
            {refDes?.current?.scrollHeight &&
              refDes.current.scrollHeight > 110 && (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    maxWidth: '50%',
                    mt: 2,
                  }}
                >
                  <Typography
                    variant="body1"
                    align="center"
                    onClick={toggleMoreDescription}
                    sx={{
                      cursor: 'pointer',
                      '&:hover': { opacity: 0.5 },
                      color: 'vShip.text.lightBlue',
                    }}
                  >
                    {isShowMoreDescription ? 'Thu gọn' : 'Xem tất cả'}
                  </Typography>
                </Box>
              )}
          </Grid>
          <Grid item xs={12} sm={12} md={12} sx={{ mt: 5 }}>
            <Divider />
          </Grid>
          <Grid item xs={12} sm={12} md={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
              <ChatBubbleOutlineIcon
                sx={{ width: 35, height: 35, color: 'vShip.product.main' }}
              />
              <Typography variant="h5" sx={{ mx: 2 }}>
                {t('title.comment')} ({productDetail?.num_comments})
              </Typography>
              <Button
                sx={{
                  color: 'vShip.product.main',
                  borderColor: 'vShip.product.main',
                }}
                size="small"
                variant="outlined"
                startIcon={<TranslateIcon />}
                onClick={handleTranslate('comment')}
              >
                {t('button.translate')}
              </Button>
            </Box>
            {commentShowed.map((comment, index) => (
              <Container
                key={index}
                maxWidth="sm"
                disableGutters
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mb: 2,
                  ml: 0,
                }}
              >
                <Avatar
                  src={comment.user.photo_url}
                  sx={{ mr: 2, width: 30, height: 30 }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    borderRadius: 2,
                    backgroundColor: 'vShip.product.bg',
                    p: 1,
                  }}
                >
                  {comment.message}
                </Typography>
              </Container>
            ))}
            {comments?.length > 5 && (
              <Fragment>
                <Container
                  maxWidth="sm"
                  disableGutters
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    mb: 2,
                    pl: 6,
                  }}
                >
                  <Typography
                    variant="body1"
                    align="center"
                    onClick={showMoreComments}
                    sx={{
                      cursor: 'pointer',
                      '&:hover': { opacity: 0.5 },
                      color: 'vShip.text.lightBlue',
                    }}
                  >
                    {numberCommentShowed < comments?.length
                      ? 'Xem thêm'
                      : 'Thu gọn'}
                  </Typography>
                </Container>
              </Fragment>
            )}
          </Grid>
        </Grid>
      </Container>
      {similarProduct.length > 0 && (
        <Box sx={{ mb: 14, mt: 3 }}>
          <FeaturedProductsSlide products={similarProduct} />
        </Box>
      )}
      <Dialog
        open={isOpenSuccessDialog}
        onClose={handleCloseSuccessDialog}
        maxWidth="s465"
        fullWidth
      >
        <DialogContent
          sx={{
            textAlign: 'center',
            height: 200,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CheckCircleOutlineIcon
            sx={{
              color: isAddToCartSuccess ? 'success.dark' : 'error.dark',
              width: 50,
              height: 50,
              mb: 2,
            }}
          />
          <DialogContentText
            variant="h5"
            color={isAddToCartSuccess ? 'success.dark' : 'error.dark'}
          >
            {isAddToCartSuccess
              ? t('message.addToCartSuccess')
              : t('message.addToCartError')}
          </DialogContentText>
        </DialogContent>
      </Dialog>
      <BuyingProcedure
        open={isOpenBuyingProcedureDialog}
        handleClose={handleCloseBuyingProcedureDialog}
      />
      <ReturnPolicy
        open={isOpenReturnPolicyDialog}
        handleClose={handleCloseReturnPolicyDialog}
      />
    </HomeLayout>
  );
};

export default ProductDetailPage;
