import Box from '@mui/material/Box';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import Typography from '@mui/material/Typography';
import Currency from 'utils/Currency';
import useAuth from 'hooks/useAuth';

const CartWallet = () => {
  const { user } = useAuth();

  return (
    <Box sx={{ backgroundColor: 'background.paper', mb: 2, p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <AccountBalanceWalletIcon />
        <Typography variant="h6" sx={{ ml: 1 }}>
          Ví của tôi
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', s465: 'row' },
          ml: { xs: 0, s465: 2 },
          mt: 1,
        }}
      >
        <Typography variant="h6" sx={{ ml: { xs: 0, s465: 2 } }}>
          Số dư tài khoản của tôi:{' '}
        </Typography>
        <Typography variant="h6" sx={{ ml: 2, color: 'vShip.text.lightBlue' }}>
          {' '}
          {Currency.templatePriceVI(user?.cashAmount)} VND
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          ml: { xs: 0, s465: 4 },
        }}
      >
        <Typography variant="h6">Thông tin nạp tiền: </Typography>
        <Box sx={{ ml: { xs: 2, s465: 4 } }}>
          <Typography variant="body1">Số tài khoản:</Typography>
          <Typography variant="body1">Tên tài khoản:</Typography>
          <Typography variant="body1">Ngân hàng: </Typography>
          <Typography variant="body1">Cú pháp: </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default CartWallet;
