import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Image from 'components/Image';

interface Props {
  open: boolean;
  handleClose: () => void;
}

const BuyingProcedure = (props: Props) => {
  const { open, handleClose } = props;
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{ sx: { m: 1, width: { xs: 1 } } }}
    >
      <DialogContent
        sx={{
          height: 400,
          width: 1200,
          overflowX: 'auto',
        }}
      >
        <Typography variant="h5" sx={{ mb: 1 }}>
          Quy trình mua hàng
        </Typography>
        <Divider variant="fullWidth" />
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mt: 10,
          }}
        >
          <Box
            sx={{
              maxWidth: 150,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Image
              src="/static/imgs/buying-process-1.png"
              alt="buying-process"
              sx={{ width: 70, height: 70 }}
            />
            <Typography variant="body2" align="center">
              Quý khách đặt mua và thanh toán cho Vship
            </Typography>
          </Box>
          <Box
            sx={{
              maxWidth: 150,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography variant="body2" align="center">
              Ngay lập tức
            </Typography>
            <Box
              sx={{
                borderColor: 'vShip.product.main',
                borderBottom: '2px solid ',
                width: 1,
                position: 'relative',
                my: 1,
              }}
            >
              <FiberManualRecordIcon
                sx={{ position: 'absolute', left: -5, top: -3, fontSize: 9 }}
              />{' '}
              <FiberManualRecordIcon
                sx={{ position: 'absolute', right: -5, top: -3, fontSize: 9 }}
              />
            </Box>
            <Typography variant="body2" align="center">
              Vship thanh toán cho Seller
            </Typography>
          </Box>
          <Box
            sx={{
              maxWidth: 150,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Image
              src="/static/imgs/buying-process-2.png"
              alt="buying-process2"
              sx={{ width: 70, height: 70 }}
            />
            <Typography variant="body2" align="center">
              Seller chuẩn bị hàng từ 1 đến 3 ngày
            </Typography>
          </Box>
          <Box
            sx={{
              maxWidth: 150,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography variant="body2" align="center">
              Sau đó
            </Typography>
            <Box
              sx={{
                borderColor: 'vShip.product.main',
                borderBottom: '2px solid ',
                width: 1,
                position: 'relative',
                my: 1,
              }}
            >
              <FiberManualRecordIcon
                sx={{ position: 'absolute', left: -5, top: -3, fontSize: 9 }}
              />{' '}
              <FiberManualRecordIcon
                sx={{ position: 'absolute', right: -5, top: -3, fontSize: 9 }}
              />
            </Box>
            <Typography variant="body2" align="center">
              Hàng được vận chuyển về Việt Nam
            </Typography>
          </Box>
          <Box
            sx={{
              maxWidth: 150,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Image
              src="/static/imgs/buying-process-3.png"
              alt="buying-process3"
              sx={{ width: 70, height: 70 }}
            />
            <Typography variant="body2" align="center">
              Vship sẽ làm thủ tục thông quan từ 1 đến 2 ngày
            </Typography>
          </Box>
          <Box
            sx={{
              maxWidth: 150,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography variant="body2" align="center">
              Ngay lập tức
            </Typography>
            <Box
              sx={{
                borderColor: 'vShip.product.main',
                borderBottom: '2px solid ',
                width: 1,
                position: 'relative',
                my: 1,
              }}
            >
              <FiberManualRecordIcon
                sx={{ position: 'absolute', left: -5, top: -3, fontSize: 9 }}
              />{' '}
              <FiberManualRecordIcon
                sx={{ position: 'absolute', right: -5, top: -3, fontSize: 9 }}
              />
            </Box>
            <Typography variant="body2" align="center">
              Vship giao hàng đến quý khách
            </Typography>
          </Box>
          <Box
            sx={{
              maxWidth: 150,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Image
              src="/static/imgs/buying-process-4.png"
              alt="buying-process4"
              sx={{ width: 70, height: 70 }}
            />
            <Typography variant="body2" align="center">
              Vship giao hàng tại địa chỉ của quý khách
            </Typography>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default BuyingProcedure;
