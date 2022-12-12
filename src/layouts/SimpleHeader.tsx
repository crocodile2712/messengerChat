import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Image from 'components/Image';
import Container from '@mui/material/Container';

const SimpleHeader = () => {
  return (
    <AppBar sx={{ position: 'relative' }}>
      <Toolbar sx={{ backgroundColor: 'primary.main', height: 80 }}>
        <Container
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: 1200,
            lineHeight: 1.25,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Box sx={{ width: 45, height: 45 }}>
              <Image
                sx={{ objectFit: 'cover' }}
                src="/static/imgs/logo.png"
                alt="logo"
              />
            </Box>
            <Box>
              <Typography
                sx={{ ml: 0.625, color: 'common.white', fontSize: 30 }}
              >
                VSHIP
              </Typography>
            </Box>
          </Box>
        </Container>
      </Toolbar>
    </AppBar>
  );
};

export default SimpleHeader;
