import DeleteIcon from '@mui/icons-material/Delete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import CartBreadCrumb from 'components/Cart/BreadCrumb';
import BuyItemsTable from 'components/Cart/BuyItemsTable';
import MessageDialog from 'components/Dialog/MessageDialog';
import Popconfirm from 'components/Dialog/Popconfirm';
import Image from 'components/Image';
import RouteLink from 'components/RouteLink';
import TypographyWrap from 'components/TypographyWrap';
import { ON_SALE_PRODUCT } from 'constant/common';
import { BUY_NOW_PATH, PRODUCT_DETAIL_PATH } from 'constant/route-path';
import withPrivateRoute from 'hocs/withPrivateRoute';
import useAuth from 'hooks/useAuth';
import useShoppingCart from 'hooks/useShoppingCart';
import HomeLayout from 'layouts/Home';
import { useRouter } from 'next/router';
import type { ChangeEvent } from 'react';
import { Fragment, useEffect, useState } from 'react';
import product from 'services/product';
import type { CartItem } from 'types/product';
import Currency from 'utils/Currency';
import DateFns from 'utils/DateFns';
import LocalStorage from 'utils/LocalStorage';
import wait from 'utils/wait';

const CartPage = () => {
  const {
    shoppingCart,
    refetch: refetchShoppingCart,
    priceRate,
    buyItems,
    setBuyItems,
  } = useShoppingCart();
  const { user, refetch: refetchUser } = useAuth();
  const [openRemoveMessageDialog, setOpenRemoveMessageDialog] =
    useState<boolean>(false);
  const [openConfirmRemoveDialog, setOpenConfirmRemoveDialog] =
    useState<boolean>(false);

  const [removeItem, setRemoveItem] = useState<string>('');
  const [isRemoveSuccess, setRemoveSuccess] = useState<boolean>(false);
  const [idBuyItems, setIdBuyItems] = useState<string[]>([]);
  const [onSaleProduct, setOnSaleProduct] = useState<CartItem[]>([]);
  const [isSelectAll, setSelectAll] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    if (shoppingCart.length > 0)
      setOnSaleProduct(
        shoppingCart.filter((item) => item.status === ON_SALE_PRODUCT)
      );
    setBuyItems([]);
  }, [shoppingCart, setBuyItems]);

  const onRemoveItemCart = async () => {
    product
      .removeFromCart(removeItem)
      .then((response) => {
        setRemoveSuccess(true);
        setBuyItems(buyItems.filter((item) => item.id !== removeItem));
        setIdBuyItems(idBuyItems.filter((itemId) => itemId !== removeItem));
        refetchShoppingCart();
        if (buyItems.length === onSaleProduct.length) {
          if (onSaleProduct.length - 1 === 0) {
            setSelectAll(false);
            return;
          }
          setSelectAll(true);
        }
      })
      .catch((error) => {
        setRemoveSuccess(false);
      })
      .finally(async () => {
        setOpenRemoveMessageDialog(true);
        await wait(3000);
        setOpenRemoveMessageDialog(false);
      });
  };
  const onShowConfirmRemove = (id: string) => () => {
    setOpenConfirmRemoveDialog(true);
    setRemoveItem(id);
  };

  const handleCloseRemoveMessageModal = () => {
    setOpenRemoveMessageDialog(false);
  };

  const handleCloseConfirmRemoveDialog = () => {
    setOpenConfirmRemoveDialog(false);
  };

  const handleSelectItem = (value: boolean, item: CartItem) => {
    if (item?.status === ON_SALE_PRODUCT) {
      if (value) {
        setBuyItems([...buyItems, item]);
        setIdBuyItems([...idBuyItems, item.id]);
        LocalStorage.set('buy-items', [...buyItems, item]);
        if (buyItems.length === onSaleProduct.length - 1) {
          setSelectAll(true);
        }
      } else {
        setSelectAll(false);
        const filterItem = buyItems.filter((b_item) => item.id !== b_item.id);
        setBuyItems(filterItem);
        LocalStorage.set('buy-items', filterItem);
        setIdBuyItems(idBuyItems.filter((id) => id !== item.id));
      }
    }
  };

  const handleSelectAllItems = (checked: boolean) => {
    let collection = [];
    let collectionId = [];
    if (checked) {
      for (const item of shoppingCart) {
        if (item?.status === ON_SALE_PRODUCT) {
          collection.push(item);
          collectionId.push(item.id);
        }
      }
    }
    LocalStorage.set('buy-items', collection);
    setBuyItems(collection);
    setIdBuyItems(collectionId);
    setSelectAll(checked);
  };

  const handleSelectAllTimeEvent = (
    event: ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => handleSelectAllItems(checked);

  const showProductDetail = (id: string) => () => {
    router.push(PRODUCT_DETAIL_PATH + id);
  };

  const makeOpacity = (item: CartItem) => {
    return item?.status !== ON_SALE_PRODUCT ? 0.5 : 1;
  };

  return (
    <HomeLayout>
      <Container maxWidth="lg" sx={{ mt: 12, px: { xs: 0.5, sm: 1 } }}>
        <CartBreadCrumb />
        <Grid
          container
          sx={{
            flexDirection: { xs: 'column-reverse', sm: 'row' },
          }}
        >
          <Grid
            item
            xs={12}
            sm={9}
            md={9}
            lg={9}
            sx={{
              minHeight: 200,
              backgroundColor: 'background.paper',
              p: 2,
            }}
          >
            <BuyItemsTable />
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                py: 3,
                pb: 1,
              }}
            >
              <Typography variant="h6">TỔNG CỘNG</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <TypographyWrap variant="h6" align="right">
                  {Currency.templatePriceVI(
                    Currency.calculateTotalPrice(
                      buyItems,
                      user?.feeRatio || null,
                      priceRate
                    )
                  )}{' '}
                  VND
                </TypographyWrap>
                <TypographyWrap
                  variant="h6"
                  sx={{ color: 'vShip.product.important' }}
                  align="right"
                >
                  {Currency.calculateTotalPriceJA(
                    buyItems,
                    user?.feeRatio || null,
                    priceRate
                  )}{' '}
                  JPY
                </TypographyWrap>
              </Box>
            </Box>
            <Divider variant="fullWidth" />
            <RouteLink href={BUY_NOW_PATH}>
              <Button
                sx={{
                  backgroundColor: 'vShip.product.important',
                  '&:disabled': {
                    backgroundColor: 'vShip.product.important2',
                    color: 'common.white',
                  },
                  float: 'right',
                  mt: 2,
                }}
                size="medium"
                disabled={buyItems.length === 0}
                onClick={refetchUser}
              >
                Mua hàng
              </Button>
            </RouteLink>
          </Grid>
          <Grid
            item
            xs={12}
            sm={3}
            md={3}
            lg={3}
            sx={{
              pl: { s465: 2 },
            }}
          >
            <Box
              component={Paper}
              sx={{
                border: 1,
                borderColor: 'vShip.border.lightBlue',
                backgroundColor: 'vShip.background.lightBlue',
                p: 2,
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 2 }}>
                Tỷ giá hiện tại{' '}
              </Typography>
              <Typography variant="body2">
                {DateFns.getDateStringNow()}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 'bold', mt: 3 }}>
                1 JPY = {priceRate} VND
              </Typography>
            </Box>
          </Grid>
        </Grid>
        <Grid container sx={{ mt: 2 }}>
          <Grid item xs={12} sm={12} md={12}>
            <FormControlLabel
              label={
                <Typography variant="h6">
                  Chọn tất cả - {onSaleProduct?.length} sản phẩm
                </Typography>
              }
              control={
                <Checkbox
                  size="medium"
                  checked={isSelectAll}
                  onChange={handleSelectAllTimeEvent}
                />
              }
            />
          </Grid>
          <Grid container item xs={12} sm={12} md={12}>
            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              sx={{
                backgroundColor: 'background.paper',
                p: { xs: 0, sm: 3 },
              }}
            >
              {shoppingCart?.map((item, index) => (
                <Fragment key={index}>
                  <Divider variant="fullWidth" />
                  <Grid
                    key={index}
                    item
                    container
                    xs={12}
                    sm={12}
                    md={12}
                    sx={{
                      my: 2,
                      opacity: makeOpacity(item),
                    }}
                  >
                    <Grid item container xs={4} sm={4} md={4}>
                      <Grid
                        item
                        xs={2}
                        sm={2}
                        md={2}
                        sx={{ display: 'flex', alignItems: 'center' }}
                      >
                        <Checkbox
                          size="medium"
                          checked={idBuyItems.includes(item.id)}
                          disabled={item?.status !== ON_SALE_PRODUCT}
                          onChange={(
                            event: ChangeEvent<HTMLInputElement>,
                            checked: boolean
                          ) => handleSelectItem(checked, item)}
                        />
                      </Grid>
                      <Grid
                        item
                        xs={10}
                        sm={10}
                        md={10}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: { xs: 'flex-end', s465: 'center' },
                        }}
                      >
                        <Image
                          src={item?.image}
                          alt="product"
                          sx={{
                            width: { xs: 0.7, s465: 116 },
                            height: { xs: 'auto', s465: 100 },
                            objectFit: 'cover',
                            '&:hover': { opacity: 0.5, cursor: 'pointer' },
                          }}
                          onClick={showProductDetail(item.id)}
                        />
                      </Grid>
                    </Grid>
                    <Grid container item xs={8} sm={8} md={8}>
                      <Grid
                        item
                        xs={12}
                        sm={9}
                        md={9}
                        sx={{ pl: { xs: 1, sm: 0 } }}
                      >
                        <TypographyWrap
                          variant="body2"
                          sx={{
                            maxWidth: 550,
                            '&:hover': {
                              opacity: 0.5,
                              cursor: 'pointer',
                            },
                          }}
                          onClick={showProductDetail(item.id)}
                        >
                          {item.name}
                        </TypographyWrap>
                        <TypographyWrap
                          variant="body2"
                          sx={{ color: 'vShip.product.main' }}
                        >
                          {item?.brand}
                        </TypographyWrap>
                        <TypographyWrap variant="body2">XL</TypographyWrap>
                        <TypographyWrap variant="body2">
                          {item?.condition}
                        </TypographyWrap>
                        <TypographyWrap variant="body2">
                          Đã bao gồm thuế tại Nhật
                        </TypographyWrap>
                        <TypographyWrap variant="body2">
                          Phí vận chuyển: Người bán chịu
                        </TypographyWrap>
                        {item?.status !== ON_SALE_PRODUCT && (
                          <TypographyWrap
                            variant="body2"
                            sx={{ color: 'vShip.product.important' }}
                          >
                            Sản phẩm đã hết hàng vui lòng chọn sản phẩm khác
                          </TypographyWrap>
                        )}
                      </Grid>

                      <Grid
                        item
                        container
                        xs={12}
                        sm={3}
                        md={3}
                        sx={{
                          alignItems: 'center',
                          justifyContent: 'center',
                          pl: { xs: 1, sm: 0 },
                        }}
                      >
                        <Grid item xs={12} sm={12} md={12}>
                          <TypographyWrap
                            variant="body2"
                            align="right"
                            sx={{ textAlign: { xs: 'left', sm: 'right' } }}
                          >
                            {Currency.templatePriceVI(item?.price * priceRate)}{' '}
                            VND
                          </TypographyWrap>
                          <TypographyWrap
                            variant="body2"
                            sx={{ textAlign: { xs: 'left', sm: 'right' } }}
                          >
                            {Currency.templatePriceVI(item?.price)} JPY
                          </TypographyWrap>
                          <Typography
                            variant="h6"
                            sx={{
                              display: 'flex',
                              justifyContent: {
                                xs: 'flex-start',
                                sm: 'flex-end',
                              },
                              mt: 1,
                            }}
                          >
                            <Box
                              onClick={onShowConfirmRemove(item?.id)}
                              sx={{
                                display: 'flex',
                                cursor: 'pointer',
                                '&:hover': {
                                  color: 'vShip.product.important',
                                },
                              }}
                            >
                              <Typography>Xoá</Typography>
                              <DeleteIcon sx={{ fontSize: 20 }} />
                            </Box>
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Fragment>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>
      <MessageDialog
        isSuccess={isRemoveSuccess}
        onClose={handleCloseRemoveMessageModal}
        successMessage="Xoá sản phẩm khỏi giỏ hàng thành công"
        errorMessage="Xoá sản phẩm thất bại"
        isOpen={openRemoveMessageDialog}
      />
      <Popconfirm
        onRefresh={refetchShoppingCart}
        content={{
          cancelLabel: 'Không',
          submitLabel: 'Xóa',
          title: 'Xóa sản phẩm khỏi giỏ',
          description: 'Bạn có muốn xóa sản phẩm khỏi giỏ hàng không?',
        }}
        onSubmit={onRemoveItemCart}
        open={openConfirmRemoveDialog}
        onClose={handleCloseConfirmRemoveDialog}
      />
    </HomeLayout>
  );
};

export default withPrivateRoute(CartPage);
