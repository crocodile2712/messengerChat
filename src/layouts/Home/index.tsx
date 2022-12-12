import { styled } from '@mui/material';
import Box from '@mui/material/Box';
import Facebook from 'components/FaceBook';
import React from 'react';
import Footer from '../Footer';
import Header from '../Header';

interface Props {
  children: React.ReactNode;
  changeStepProfile1?: () => void;
}

const HomeLayout = (props: Props) => {
  const { children, changeStepProfile1 } = props;

  return (
    <HomeLayoutRoot>
      <Header changeStepProfile1={changeStepProfile1} />
      {children}
      <Footer />
      <Facebook />
    </HomeLayoutRoot>
  );
};

const HomeLayoutRoot = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  height: '100%',
}));

export default HomeLayout;
