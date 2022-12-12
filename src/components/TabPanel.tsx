import type { FCC } from 'types/react';
import Box from '@mui/material/Box';

interface TabPanelProps {
  index: number;
  value: number;
}

const TabPanel: FCC<TabPanelProps> = (props) => {
  const { index, value, children, ...other } = props;
  return (
    <Box hidden={value !== index} id={`vertical-tabpanel-${index}`} {...other}>
      <Box sx={{ p: 3 }}>{children}</Box>
    </Box>
  );
};

export default TabPanel;
