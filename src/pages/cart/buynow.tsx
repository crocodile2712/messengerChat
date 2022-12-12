import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import CartAddress from 'components/Cart/Address';
import BuyItemsTable from 'components/Cart/BuyItemsTable';
import CartWallet from 'components/Cart/Wallet';
import MessageDialog from 'components/Dialog/MessageDialog';
import Popconfirm from 'components/Dialog/Popconfirm';
import TypographyWrap from 'components/TypographyWrap';
import withPrivateRoute from 'hocs/withPrivateRoute';
import useAddress from 'hooks/useAddress';
import useAuth from 'hooks/useAuth';
import useShoppingCart from 'hooks/useShoppingCart';
import HomeLayout from 'layouts/Home';
import { useState } from 'react';
import Currency from 'utils/Currency';
import DateFns from 'utils/DateFns';
import LocalStorage from 'utils/LocalStorage';

const BuyNow = () => {
  const { refetch, priceRate, buyItems, setBuyItems } = useShoppingCart();
  const { user } = useAuth();
  const { addressDefault, listAddress } = useAddress();
  const [isOrderSuccess, setOrderSuccess] = useState<boolean>(false);
  const [openOrderMessageDialog, setOpenOrderMessageDialog] =
    useState<boolean>(false);
  const [openConfirmOrderDialog, setOpenConfirmOrderDialog] =
    useState<boolean>(false);
  const [isShowAddAddress, setShowAddAddress] = useState<boolean>(false);

  const onShowAddAddress = () => {
    setShowAddAddress(true);
  };
  const onOrder = async () => {
    setOpenOrderMessageDialog(true);
    LocalStorage.remove('buy-items');
    setBuyItems([]);
    setOrderSuccess(true);
  };

  const onShowConfirmOrder = () => {
    if (buyItems.length === 0) return;
    setOpenConfirmOrderDialog(true);
  };
  const handleCloseOrderMessageModal = () => {
    setOpenOrderMessageDialog(false);
  };

  const handleCloseConfirmOrderDialog = () => {
    setOpenConfirmOrderDialog(false);
  };

  return (
    <HomeLayout>
      <Container maxWidth="lg" sx={{ mt: 12, px: { xs: 0.5, sm: 1 } }}>
        <CartAddress
          showAddAddress={isShowAddAddress}
          setShowAddAddress={setShowAddAddress}
        />
        <CartWallet />
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

            <Button
              onClick={
                addressDefault && listAddress.length > 0
                  ? onShowConfirmOrder
                  : onShowAddAddress
              }
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
            >
              Đặt hàng
            </Button>
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
      </Container>
      <MessageDialog
        isSuccess={isOrderSuccess}
        onClose={handleCloseOrderMessageModal}
        successMessage="Đặt hàng thành công"
        errorMessage="Đặt hàng thất bại"
        isOpen={openOrderMessageDialog}
      />
      <Popconfirm
        onRefresh={refetch}
        content={{
          cancelLabel: 'Không',
          submitLabel: 'Có',
          title: 'Đặt hàng',
          description: 'Bạn có muốn đặt hàng không?',
        }}
        onSubmit={onOrder}
        open={openConfirmOrderDialog}
        onClose={handleCloseConfirmOrderDialog}
      />
    </HomeLayout>
  );
};

export default withPrivateRoute(BuyNow);
