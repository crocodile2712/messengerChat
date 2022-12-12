import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import Image from 'components/Image';
import TypographyWrap from 'components/TypographyWrap';
import { Fragment } from 'react';
import { version } from 'utils/config';
import RouteLink from 'components/RouteLink';
import { TERM_OF_SERVICE } from 'constant/route-path';

const Footer = () => {
  const theme = useTheme();
  const mediaMinMd = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <Box
      sx={{
        backgroundColor: 'background.paper',
        mt: 5,
      }}
    >
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Grid
          container
          spacing={1}
          sx={{
            alignItems: 'flex-start',
          }}
        >
          <Grid container item xs={12} s465={6} md={3} rowSpacing={1}>
            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              sx={{
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <Box sx={{ width: { md: 80 }, height: { md: 80 } }}>
                <Image
                  sx={{ objectFit: 'cover' }}
                  src="/static/imgs/logo_footer.png"
                  alt="logo_footer"
                />
              </Box>
            </Grid>
            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              sx={{
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <Typography variant="h4">VSHIP</Typography>
            </Grid>
          </Grid>
          {mediaMinMd ? (
            <Fragment>
              <Grid
                container
                item
                xs={12}
                sm={9}
                md={3}
                rowSpacing={1}
                sx={{ textAlign: 'left' }}
              >
                <Grid item xs={12} sm={12} md={12}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    Về chúng tôi
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                  <Typography variant="body1">Về VSHIP</Typography>
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                  <RouteLink
                    href={TERM_OF_SERVICE + '?type=1'}
                    color={'primary.dark'}
                  >
                    <Typography variant="body1">Chính sách bảo mật</Typography>
                  </RouteLink>
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                  <RouteLink href={TERM_OF_SERVICE} color={'primary.dark'}>
                    <Typography variant="body1">Điều khoản dịch vụ</Typography>
                  </RouteLink>
                </Grid>
              </Grid>
              <Grid
                container
                item
                xs={12}
                sm={9}
                md={3}
                rowSpacing={1}
                sx={{ textAlign: 'left' }}
              >
                <Grid item xs={12} sm={12} md={12}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    Dành cho khách hàng
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                  <RouteLink href={TERM_OF_SERVICE} color={'primary.dark'}>
                    <Typography variant="body1">Trung tâm hỗ trợ</Typography>
                  </RouteLink>
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                  <Typography variant="body1">Hướng dẫn đặt hàng</Typography>
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                  <Typography variant="body1">Câu hỏi thường gặp</Typography>
                </Grid>
              </Grid>
              <Grid
                container
                item
                xs={12}
                sm={9}
                md={3}
                rowSpacing={1}
                sx={{ textAlign: 'left' }}
              >
                <Grid item xs={12} sm={12} md={12}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    Theo dõi chúng tôi trên
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                  <Typography variant="body1">Facebook</Typography>
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                  <Typography variant="body1">Instagram</Typography>
                </Grid>
              </Grid>
            </Fragment>
          ) : (
            <Grid
              container
              item
              xs={12}
              s465={6}
              md={9}
              sx={{ textAlign: 'left', flexDirection: 'column' }}
            >
              <Accordion elevation={1}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{ px: 0 }}
                >
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    Về chúng tôi
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ p: { xs: 0 } }}>
                  <Typography variant="body1">Về VSHIP</Typography>
                  <RouteLink
                    href={TERM_OF_SERVICE + '?type=1'}
                    color={'primary.dark'}
                  >
                    <Typography variant="body1">Chính sách bảo mật</Typography>
                  </RouteLink>
                  <RouteLink href={TERM_OF_SERVICE} color={'primary.dark'}>
                    <Typography variant="body1">Điều khoản dịch vụ</Typography>
                  </RouteLink>
                </AccordionDetails>
              </Accordion>
              <Accordion elevation={0}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{ px: 0 }}
                >
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    Dành cho khách hàng
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ p: { xs: 0 } }}>
                  <RouteLink href={TERM_OF_SERVICE} color={'primary.dark'}>
                    <Typography variant="body1">Trung tâm hỗ trợ</Typography>
                  </RouteLink>
                  <Typography variant="body1">Hướng dẫn đặt hàng</Typography>
                  <Typography variant="body1">Câu hỏi thường gặp</Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion elevation={0}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{ px: 0 }}
                >
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    Theo dõi chúng tôi trên
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ p: { xs: 0 } }}>
                  <Typography variant="body1">Facebook</Typography>
                  <Typography variant="body1">Instagram</Typography>
                </AccordionDetails>
              </Accordion>
            </Grid>
          )}
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mt: 2,
            }}
          >
            <TypographyWrap variant="subtitle1">
              <Typography component="span" sx={{ fontWeight: 'bold' }}>
                Trụ sở:{' '}
              </Typography>
              Số [], đường [], phường [], quận [], Hà Nội.
            </TypographyWrap>
          </Grid>
          <Grid
            container
            item
            xs={12}
            sm={12}
            md={12}
            rowSpacing={2}
            textAlign={{ xs: 'center' }}
          >
            <Grid item xs={12} sm={12} md={12}>
              <Typography variant="body1">Version {version}</Typography>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;
