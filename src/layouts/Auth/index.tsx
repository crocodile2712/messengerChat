import Box from '@mui/material/Box';
import type { FCC } from 'types/react';
import Header from '../Header';
import Container from '@mui/material/Container';

const AuthLayout: FCC = (props) => {
  const { children } = props;

  return (
    <Box sx={{ bgcolor: 'background.paper', flexGrow: 1 }}>
      <Header />
      <Container
        maxWidth="lg"
        sx={{
          pt: 10,
          height: 1,
        }}
      >
        {children}
      </Container>
    </Box>
  );
};

export default AuthLayout;
