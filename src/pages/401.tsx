import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import Page from 'components/Page';
import type { NextPage } from 'next';
import NextLink from 'next/link';

const AuthorizationRequired: NextPage = () => {
  const theme = useTheme();
  const mobileDevice = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Page title="Lỗi: Truy cập bị từ chối">
      <Box
        component="main"
        sx={{
          display: 'grid',
          placeContent: 'center',
          flexGrow: 1,
          backgroundColor: 'background.paper',
        }}
      >
        <Container maxWidth="lg">
          <Typography
            align="center"
            variant={mobileDevice ? 'h4' : 'h1'}
            gutterBottom
          >
            Lỗi 401 - Truy cập bị từ chối
          </Typography>
          <Typography
            align="center"
            sx={{ color: 'text.secondary' }}
            variant="subtitle2"
          >
            Bạn không có quyền để truy cập trang này, vui lòng thử lại với trang
            khác hoặc trở về trang chủ.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
            <NextLink href="/" passHref>
              <Button component="a" variant="outlined">
                Trở lại Trang chủ
              </Button>
            </NextLink>
          </Box>
        </Container>
      </Box>
    </Page>
  );
};

export default AuthorizationRequired;
