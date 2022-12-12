import { styled } from '@mui/system';
import { useState } from 'react';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import Grid from '@mui/material/Grid';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Button from '@mui/material/Button';
import type { TooltipProps } from '@mui/material/Tooltip';
import type { CategorySearch } from 'types/product';
import { useTranslation } from 'react-i18next';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

interface SelectMenuProps {
  value: string;
  onChange: (value: string) => void;
  data: CategorySearch[];
}

const SelectMenu = (props: SelectMenuProps) => {
  const { value, onChange, data } = props;
  const [open, setOpen] = useState<boolean>(false);
  const { t } = useTranslation();
  const theme = useTheme();
  const mediaMinS465 = useMediaQuery(theme.breakpoints.up('s465'));

  const handleToggleSelect = () => {
    setOpen(!open);
  };

  const handleClickAway = () => {
    setOpen(false);
  };

  const handleClick = (value: string) => () => {
    onChange(value);
    setOpen(false);
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box sx={{ position: 'relative' }}>
        <HtmlTooltip
          title={
            <Grid container spacing={0.5} sx={{ p: { xs: 0, s465: 1, sm: 3 } }}>
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                xl={2}
                sx={{ width: 195 }}
                key={0}
              >
                <Button
                  onClick={handleClick('')}
                  fullWidth
                  sx={{
                    backgroundColor: 'background.paper',
                    color: 'common.black',
                    '&:hover': { backgroundColor: 'background.paper' },
                  }}
                >
                  {t('label.allCategory')}
                </Button>
              </Grid>
              {data?.length > 0 &&
                data.map((item: CategorySearch) => (
                  <Grid
                    item
                    xs={6}
                    sm={6}
                    md={4}
                    lg={3}
                    xl={2}
                    sx={{ width: 195 }}
                    key={item.id}
                  >
                    <Button
                      onClick={handleClick(item.id)}
                      fullWidth
                      sx={{
                        backgroundColor: 'background.paper',
                        color: 'common.black',
                        px: { xs: 1 },
                        '&:hover': { backgroundColor: 'background.paper' },
                      }}
                    >
                      <Typography noWrap>{item.name}</Typography>
                    </Button>
                  </Grid>
                ))}
            </Grid>
          }
          open={open}
        >
          <IconButton
            sx={{
              backgroundColor: `neutral.300`,
              borderRadius: {
                xs: '5px 0px 0px 5px',
                s465: '10px 0px 0px 10px',
              },
              pl: { xs: 1, s465: 2 },
              color: 'common.black',
              height: '100%',
              '&:hover': {
                backgroundColor: `neutral.300`,
              },
              width: 'max-content',
            }}
            onClick={handleToggleSelect}
          >
            <Typography variant={mediaMinS465 ? 'body1' : 'caption'}>
              {data.find((item) => item.id === value)?.name ??
                t('label.allCategory')}
            </Typography>
            {open ? (
              <ExpandLess sx={{ ml: { xs: 0, s465: 2 } }} />
            ) : (
              <ExpandMore sx={{ ml: { xs: 0, s465: 2 } }} />
            )}
          </IconButton>
        </HtmlTooltip>
      </Box>
    </ClickAwayListener>
  );
};

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.vShip.searchCatagorySelect.background,
    color: theme.palette.vShip.searchCatagorySelect.color,
    border: theme.palette.vShip.searchCatagorySelect.border,
    maxWidth: 1440,
    margin: 'auto',
  },
  width: '100%',
  // maxWidth: '1440px',
}));

export default SelectMenu;
