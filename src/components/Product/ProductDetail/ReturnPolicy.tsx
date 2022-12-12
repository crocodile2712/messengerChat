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

const ReturnPolicy = (props: Props) => {
  const { open, handleClose } = props;
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { m: 1, width: { xs: 1 } } }}
    >
      <DialogContent
        sx={{
          height: 450,
          width: 900,
          overflowX: 'auto',
        }}
      >
        <Typography variant="h6">ĐỔI TRẢ XUYÊN BIÊN GIỚI</Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          Vship “KHÔNG CÓ” trách nhiệm thực hiện đổi trả đối với các tình huống
          thuộc trường hợp sau:
        </Typography>
        <Divider variant="fullWidth" />
        <Box sx={{ display: 'flex', px: 1, py: 2 }}>
          <Box>
            <Box>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                01. Do người bán:
              </Typography>
              <Typography variant="body1">
                - Thông tin sản phẩm không đúng mô tả
              </Typography>
              <Typography variant="body1">
                - Thông tin sản phẩm cố ý gây hiểu lầm cho người mua
              </Typography>
              <Typography variant="body1">
                - Thiếu thông tin cần thiết
              </Typography>
              <Typography variant="body1">
                - Sản phẩm không đúng thông số đặt hàng
              </Typography>
            </Box>
            <Box>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                02. Sản phẩm không hoàn thiện:
              </Typography>
              <Typography variant="body1">
                - Bị giảm sút về mặt thẩm mỹ
              </Typography>
              <Typography variant="body1">- Sản phẩm lỗi.</Typography>
              <Typography variant="body1">- Không hoạt động.</Typography>
            </Box>
            <Box>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                03. Hỗ trợ từ Vship:
              </Typography>
              <Typography variant="body1">
                Vship có thể hỗ trợ người mua đàm phán tìm giải pháp hiệu quả
                nhất (Quý khách vui lòng liên hệ để được hỗ trợ một cách nhanh
                nhất)
              </Typography>
            </Box>
          </Box>
          <Box>
            <Image
              src="/static/imgs/return-policy.png"
              alt="return-policy"
              sx={{ width: 300, height: 300 }}
            />
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ReturnPolicy;
