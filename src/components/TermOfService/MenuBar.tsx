import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import styled from '@mui/system/styled';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import type { SyntheticEvent } from 'react';
import { tabClasses } from '@mui/material/Tab';
import { useTranslation } from 'react-i18next';

interface TermOfServiceMenuBarProps {
  tab: number;
  handleChange: (event: SyntheticEvent, newValue: number) => void;
}

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

const TermOfServiceMenuBar = (props: TermOfServiceMenuBarProps) => {
  const { handleChange, tab } = props;
  const { t } = useTranslation();

  return (
    <Box sx={{ backgroundColor: 'background.paper' }}>
      <Box
        sx={{
          backgroundImage: (theme) => theme.palette.vShip.tos.menuBackground,
          p: 2,
        }}
      >
        <Typography sx={{ fontWeight: 'bold' }}>
          {t('title.termAndPolicy')}
        </Typography>
      </Box>
      <Tabs
        orientation="vertical"
        value={tab}
        onChange={handleChange}
        TabIndicatorProps={{ hidden: true }}
        sx={{
          [`& .${tabClasses.root}.${tabClasses.selected} `]: {
            color: 'vShip.text.orange',
          },
          [`& .${tabClasses.root}`]: {
            textAlign: 'left',
            textTransform: 'none',
            p: 2,
            alignItems: 'start',
            color: 'neutral.900',
            fontWeight: 'normal',
            fontSize: '1rem',
          },
        }}
      >
        <Tab label={t('label.buyTerm')} {...a11yProps(0)} />
        <Tab label={t('label.privatePolicy')} {...a11yProps(1)} />
      </Tabs>
      <Box
        sx={{
          backgroundImage: (theme) => theme.palette.vShip.tos.menuBackground,
          p: 2,
        }}
      >
        <Typography sx={{ fontWeight: 'bold' }}>
          {t('label.hotlineInfo')}
        </Typography>
      </Box>
      <TextContainer>
        <Typography>Hotline: 0988.012.345</Typography>
      </TextContainer>
      <Divider />
      <TextContainer>
        <Typography>Hotline: 0988.012.345</Typography>
      </TextContainer>
      <Divider />
      <TextContainer>
        <Typography>Email: vship@vship.com</Typography>
      </TextContainer>
      <Divider />
      <TextContainer sx={{ pb: 2 }}>
        <Typography>{t('label.contact')}</Typography>
      </TextContainer>
    </Box>
  );
};

const TextContainer = styled(Box)(() => ({
  paddingLeft: 16,
  paddingTop: 16,
}));

export default TermOfServiceMenuBar;
