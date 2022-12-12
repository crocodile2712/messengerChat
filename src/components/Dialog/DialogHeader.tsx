import type { SvgIconComponent } from '@mui/icons-material';
import type { BoxProps } from '@mui/material/Box';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';

interface Props extends BoxProps {
  title: string;
  icon?: SvgIconComponent;
  description?: string;
  divider?: boolean;
  centerIcon?: ReactNode;
}

const DialogHeader = (props: Props) => {
  const {
    title,
    icon: Icon,
    centerIcon,
    description,
    divider = true,
    ...rest
  } = props;
  return (
    <Box>
      <Wrapper {...rest}>
        {Icon && <Icon sx={{ fontSize: 70, color: 'text.secondary' }} />}
        {centerIcon}
        <Typography
          sx={{ mt: 1 }}
          variant="h6"
          color="text.secondary"
          gutterBottom
        >
          {title}
        </Typography>
        {description && (
          <Typography variant="subtitle2">{description}</Typography>
        )}
      </Wrapper>
      {divider && <Divider />}
    </Box>
  );
};

const Wrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(3),
}));

export default DialogHeader;
