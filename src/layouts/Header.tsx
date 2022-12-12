import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CloseIcon from '@mui/icons-material/Close';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import HelpIcon from '@mui/icons-material/Help';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import KeyIcon from '@mui/icons-material/Key';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import SearchIcon from '@mui/icons-material/Search';
import SettingsIcon from '@mui/icons-material/Settings';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LoadingButton from '@mui/lab/LoadingButton';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonBase from '@mui/material/ButtonBase';
import Container from '@mui/material/Container';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import { linkClasses } from '@mui/material/Link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { outlinedInputClasses } from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import SelectMenu from 'components/Header/SelectMenu';
import Image from 'components/Image';
import RouteLink, { NextLinkComposed } from 'components/RouteLink';
import { SEARCH_BAR_ROUTE } from 'constant/common';
import {
  ADDRESS_PATH,
  CART_PATH,
  CHANGE_PASSWORD_PROFILE_PATH,
  LOGIN_PATH,
  PROFILE_PATH,
  TRANSACTION_HISTORY_PATH,
} from 'constant/route-path';
import useAuth from 'hooks/useAuth';
import useCategory from 'hooks/useCategory';
import useNotification from 'hooks/useNotification';
import useShoppingCart from 'hooks/useShoppingCart';
import { useRouter } from 'next/router';
import { Fragment, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { ChangeEvent, KeyDownEvent, MouseEvent } from 'types/react';
import LocalStorage from 'utils/LocalStorage';
import wait from 'utils/wait';

interface Props {
  changeStepProfile1?: () => void;
}

const Header = (props: Props) => {
  const { changeStepProfile1 } = props;
  const { t } = useTranslation();
  const { logout, isAuthenticated, user } = useAuth();
  const [anchorElUser, setAnchorElUser] = useState<HTMLElement | null>(null);
  const router = useRouter();
  const setNotification = useNotification();
  const [openLogoutPopup, setOpenLogoutPopup] = useState<boolean>(false);
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const [loadingLogout, setLoadingLogout] = useState<boolean>(false);
  const theme = useTheme();
  const mediaMinMd = useMediaQuery(theme.breakpoints.up('md'));
  const [searchText, setSearchText] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const { shoppingCart } = useShoppingCart();
  const { rootCategory, getCategoryRoot } = useCategory();

  useEffect(() => {
    getCategoryRoot();
  }, [getCategoryRoot]);

  useEffect(() => {
    if (SEARCH_BAR_ROUTE.includes(router.route)) {
      setShowSearch(true);
    } else {
      setShowSearch(false);
    }
    if (router.query?.name) {
      setSearchText(router.query?.name as string);
    }
    if (router.query?.category) {
      const categoryTrack = LocalStorage.get('categoryTrack');
      setCategory(categoryTrack[0] ?? '');
    }
  }, [router]);

  const handleOpenLogoutPopup = () => {
    setOpenLogoutPopup(true);
  };

  const handleCloseLogoutPopup = () => {
    setOpenLogoutPopup(false);
  };

  const handleOpenUserMenu: MouseEvent = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleOpenMenu: MouseEvent = (event) => {
    setAnchor(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchor(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleKeyDown: KeyDownEvent = (event) => {
    if (event.key === 'Enter') {
      LocalStorage.set('categoryTrack', category ? [category] : []);
      LocalStorage.set('categoryForcus', category);
      router.push({
        pathname: '/search',
        query: {
          name: searchText,
          category: [category],
        },
      });
    }
  };

  const handleChangeToProfilePage = () => {
    handleCloseUserMenu();
    handleCloseMenu();
    changeStepProfile1 && changeStepProfile1();
  };

  const handleLogout = async () => {
    try {
      setLoadingLogout(true);
      setAnchorElUser(null);
      setAnchor(null);
      await wait(1500);
      await logout();
      setOpenLogoutPopup(false);
      setNotification({
        message: t('message.logoutSuccess'),
        severity: 'success',
      });
      router.push(LOGIN_PATH);
    } catch (error) {
      setNotification({ message: t('message.logoutError'), severity: 'error' });
    } finally {
      setLoadingLogout(false);
    }
  };

  const handleSearch = () => {
    LocalStorage.set('categoryTrack', category ? [category] : []);
    LocalStorage.set('categoryForcus', category);
    router.push({
      pathname: '/search',
      query: {
        name: searchText,
        category: [category],
      },
    });
  };

  const handleChangeSearch: ChangeEvent = (event) => {
    setSearchText(event.target.value);
  };

  const handleChangeCategory = (value: string) => {
    setCategory(value);
  };

  return (
    <AppBar>
      <Toolbar
        sx={{
          backgroundColor: 'primary.main',
          height: { xs: 50, sm: 80 },
        }}
        disableGutters
      >
        <Container
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            lineHeight: 1.25,
            p: { xs: 0.2, sm: 1 },
          }}
          maxWidth="lg"
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              '&:hover': {
                cursor: 'pointer',
              },
            }}
            onClick={() => router.push('/')}
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
                variant="h4"
                sx={{ ml: 0.625, color: 'common.white' }}
              >
                VSHIP
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
            }}
          >
            {isAuthenticated ? (
              <Fragment>
                <Box>
                  <RouteLink href="#" sx={{ color: 'common.white' }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        flexDirection: 'column',
                        px: 1.125,
                      }}
                    >
                      <HelpIcon />
                      <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                        Hỗ trợ
                      </Typography>
                    </Box>
                  </RouteLink>
                </Box>
                <Box>
                  <RouteLink href="#" sx={{ color: 'common.white' }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        flexDirection: 'column',
                        px: 1.125,
                      }}
                    >
                      <Badge badgeContent={100} color="error">
                        <NotificationsIcon />
                      </Badge>
                      <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                        Thông báo
                      </Typography>
                    </Box>
                  </RouteLink>
                </Box>
                <Box>
                  <RouteLink href={CART_PATH} sx={{ color: 'common.white' }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        flexDirection: 'column',
                        px: 1.125,
                      }}
                    >
                      <Badge badgeContent={shoppingCart?.length} color="error">
                        <ShoppingCartIcon />
                      </Badge>
                      <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                        Giỏ hàng
                      </Typography>
                    </Box>
                  </RouteLink>
                </Box>
                <Box>
                  <Box
                    sx={{
                      flexGrow: 0,
                      px: 1.125,
                    }}
                  >
                    <Tooltip title="Open settings">
                      <ButtonBase onClick={handleOpenUserMenu}>
                        <Avatar
                          sx={{ width: 45, height: 45 }}
                          alt="avatar"
                          src={user?.imageUrl}
                        />
                      </ButtonBase>
                    </Tooltip>
                    {/* user menu */}
                    {mediaMinMd && (
                      <Menu
                        anchorEl={anchorElUser}
                        open={Boolean(anchorElUser)}
                        onClose={handleCloseUserMenu}
                        anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'right',
                        }}
                        transformOrigin={{
                          vertical: 'top',
                          horizontal: 'right',
                        }}
                        PaperProps={{
                          sx: {
                            width: 200,
                            mt: 1,
                          },
                        }}
                      >
                        <MenuItem
                          onClick={handleChangeToProfilePage}
                          component={NextLinkComposed}
                          to={PROFILE_PATH}
                        >
                          <ListItemIcon>
                            <AccountCircleIcon />
                          </ListItemIcon>
                          <ListItemText>Tài khoản của tôi</ListItemText>
                        </MenuItem>
                        <MenuItem
                          onClick={handleChangeToProfilePage}
                          component={NextLinkComposed}
                          to={ADDRESS_PATH}
                        >
                          <ListItemIcon>
                            <HomeWorkIcon />
                          </ListItemIcon>
                          <ListItemText>Địa chỉ</ListItemText>
                        </MenuItem>
                        <MenuItem
                          onClick={handleCloseUserMenu}
                          component={NextLinkComposed}
                          to={CHANGE_PASSWORD_PROFILE_PATH}
                        >
                          <ListItemIcon>
                            <KeyIcon />
                          </ListItemIcon>
                          <ListItemText>Đổi mật khẩu</ListItemText>
                        </MenuItem>
                        <MenuItem
                          onClick={handleCloseUserMenu}
                          component={NextLinkComposed}
                          to="/order"
                        >
                          <ListItemIcon>
                            <ShoppingCartIcon />
                          </ListItemIcon>
                          <ListItemText>Đơn hàng</ListItemText>
                        </MenuItem>
                        <MenuItem
                          onClick={handleCloseUserMenu}
                          component={NextLinkComposed}
                          to={TRANSACTION_HISTORY_PATH}
                        >
                          <ListItemIcon>
                            <AccountBalanceWalletIcon sx={{ mr: 2.5 }} />
                          </ListItemIcon>
                          <ListItemText>Ví của tôi</ListItemText>
                        </MenuItem>
                        <MenuItem
                          onClick={handleCloseUserMenu}
                          component={NextLinkComposed}
                          to="/settings"
                        >
                          <ListItemIcon>
                            <SettingsIcon />
                          </ListItemIcon>
                          <ListItemText>Cài đặt</ListItemText>
                        </MenuItem>
                        <Divider component="li" />
                        <MenuItem onClick={handleOpenLogoutPopup}>
                          <ListItemIcon>
                            <LogoutIcon />
                          </ListItemIcon>
                          <ListItemText>Đăng xuất</ListItemText>
                        </MenuItem>
                      </Menu>
                    )}
                  </Box>
                </Box>
              </Fragment>
            ) : (
              <Fragment>
                <List
                  disablePadding
                  sx={{
                    display: { xs: 'none', sm: 'flex' },
                    '& > * + *': { ml: 3 },
                    [`& .${linkClasses.root}`]: {
                      color: 'common.white',
                      whiteSpace: 'nowrap',
                    },
                  }}
                >
                  <ListItem disablePadding>
                    <RouteLink href="#">Hỗ trợ</RouteLink>
                  </ListItem>
                  <ListItem disablePadding>
                    <RouteLink href="#">Thông báo</RouteLink>
                  </ListItem>
                  <ListItem disablePadding>
                    <RouteLink href="/auth/login">Đăng nhập</RouteLink>
                  </ListItem>
                  <ListItem disablePadding>
                    <RouteLink
                      href="/auth/register"
                      sx={{
                        border: 1,
                        borderColor: 'divider',
                        px: 1,
                        py: 0.5,
                        borderRadius: 1.5,
                      }}
                    >
                      Đăng ký
                    </RouteLink>
                  </ListItem>
                </List>
              </Fragment>
            )}
          </Box>
          <Box sx={{ mr: 2, display: { md: 'none' } }}>
            {!mediaMinMd && (
              <Fragment>
                <RouteLink href="#" sx={{ color: 'common.white', px: 1 }}>
                  <Badge badgeContent={0} color="error">
                    <ContactSupportIcon />
                  </Badge>
                </RouteLink>
                {isAuthenticated && (
                  <Fragment>
                    <RouteLink href="#" sx={{ color: 'common.white', px: 1 }}>
                      <Badge badgeContent={100} color="error">
                        <NotificationsIcon />
                      </Badge>
                    </RouteLink>
                    <RouteLink
                      href={CART_PATH}
                      sx={{ color: 'common.white', px: 1 }}
                    >
                      <Badge badgeContent={shoppingCart?.length} color="error">
                        <ShoppingCartIcon />
                      </Badge>
                    </RouteLink>
                  </Fragment>
                )}
              </Fragment>
            )}
            <IconButton onClick={handleOpenMenu} color="inherit">
              <MenuIcon />
            </IconButton>
          </Box>
          <Menu
            anchorEl={anchor}
            open={Boolean(anchor)}
            onClose={handleCloseMenu}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            PaperProps={{ sx: { mt: 1, display: { md: 'none' }, width: 200 } }}
            MenuListProps={{ dense: true }}
          >
            {isAuthenticated ? (
              <Box>
                <MenuItem
                  onClick={handleChangeToProfilePage}
                  component={NextLinkComposed}
                  to={PROFILE_PATH}
                >
                  <ListItemIcon>
                    <AccountCircleIcon />
                  </ListItemIcon>
                  <ListItemText>Tài khoản của tôi</ListItemText>
                </MenuItem>
                <MenuItem
                  onClick={handleChangeToProfilePage}
                  component={NextLinkComposed}
                  to={ADDRESS_PATH}
                >
                  <ListItemIcon>
                    <HomeWorkIcon />
                  </ListItemIcon>
                  <ListItemText>Địa chỉ</ListItemText>
                </MenuItem>
                <MenuItem
                  onClick={handleChangeToProfilePage}
                  component={NextLinkComposed}
                  to={CHANGE_PASSWORD_PROFILE_PATH}
                >
                  <ListItemIcon>
                    <KeyIcon />
                  </ListItemIcon>
                  <ListItemText>Đổi mật khẩu</ListItemText>
                </MenuItem>
                <MenuItem
                  onClick={handleCloseMenu}
                  component={NextLinkComposed}
                  to="/support"
                >
                  <ListItemIcon>
                    <ContactSupportIcon sx={{ mr: 2.5 }} />
                  </ListItemIcon>
                  <ListItemText>Hỗ trợ</ListItemText>
                </MenuItem>

                <MenuItem
                  onClick={handleCloseMenu}
                  component={NextLinkComposed}
                  to="#"
                >
                  <ListItemIcon>
                    <ReceiptLongIcon sx={{ mr: 2.5 }} />
                  </ListItemIcon>
                  <ListItemText>Đơn hàng</ListItemText>
                </MenuItem>
                <MenuItem
                  onClick={handleCloseMenu}
                  component={NextLinkComposed}
                  to={TRANSACTION_HISTORY_PATH}
                >
                  <ListItemIcon>
                    <AccountBalanceWalletIcon sx={{ mr: 2.5 }} />
                  </ListItemIcon>
                  <ListItemText>Ví của tôi</ListItemText>
                </MenuItem>
                <MenuItem
                  onClick={handleCloseMenu}
                  component={NextLinkComposed}
                  to="#"
                >
                  <ListItemIcon>
                    <SettingsIcon sx={{ mr: 2.5 }} />
                  </ListItemIcon>
                  <ListItemText>Cài đặt</ListItemText>
                </MenuItem>
                <MenuItem
                  onClick={handleOpenLogoutPopup}
                  component={NextLinkComposed}
                  to="#"
                >
                  <ListItemIcon>
                    <LogoutIcon sx={{ mr: 2.5 }} />
                  </ListItemIcon>
                  <ListItemText>Đăng xuất</ListItemText>
                </MenuItem>
              </Box>
            ) : (
              <Box>
                <MenuItem
                  onClick={handleCloseMenu}
                  component={NextLinkComposed}
                  to="/support"
                >
                  <ListItemIcon>
                    <ContactSupportIcon />
                  </ListItemIcon>
                  <ListItemText>Hỗ trợ</ListItemText>
                </MenuItem>
                <MenuItem
                  onClick={handleCloseMenu}
                  component={NextLinkComposed}
                  to="/notification"
                >
                  <ListItemIcon>
                    <NotificationsIcon />
                  </ListItemIcon>
                  <ListItemText>Thông báo</ListItemText>
                </MenuItem>
                <MenuItem
                  onClick={handleCloseMenu}
                  component={NextLinkComposed}
                  to="/auth/login"
                >
                  <ListItemIcon>
                    <LoginIcon />
                  </ListItemIcon>
                  <ListItemText>Đăng nhập</ListItemText>
                </MenuItem>
                <MenuItem
                  onClick={handleCloseMenu}
                  component={NextLinkComposed}
                  to="/auth/register"
                >
                  <ListItemIcon>
                    <HowToRegIcon />
                  </ListItemIcon>
                  <ListItemText>Đăng ký</ListItemText>
                </MenuItem>
              </Box>
            )}
          </Menu>
        </Container>
      </Toolbar>
      {showSearch && (
        <Toolbar
          sx={{
            backgroundColor: 'background.paper',
            height: { xs: 56, sm: 80 },
          }}
        >
          <Container maxWidth="lg" sx={{ display: 'flex' }} disableGutters>
            <Box>
              <Image
                sx={{
                  objectFit: 'contain',
                  display: { sm: 'block', xs: 'none' },
                }}
                src="/static/imgs/mercari-logo.png"
                alt="mercari-logo"
              />
            </Box>
            <Container maxWidth="s700" sx={{ px: { xs: 0, sm: 2 } }}>
              <Box
                sx={{
                  display: 'flex',
                  bgcolor: 'common.white',
                  borderRadius: { xs: 0, s465: 1 },
                  overflow: 'hidden',
                }}
              >
                <SelectMenu
                  value={category}
                  data={rootCategory ?? []}
                  onChange={handleChangeCategory}
                />
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    width: 1,
                  }}
                >
                  <TextField
                    fullWidth
                    onKeyDown={handleKeyDown}
                    onChange={handleChangeSearch}
                    placeholder={t('placeholder.search')}
                    value={searchText}
                    InputProps={{
                      inputProps: {
                        sx: {
                          py: { xs: 1 },
                        },
                      },
                      sx: {
                        [`& .${outlinedInputClasses.notchedOutline}`]: {
                          border: 'none',
                        },
                        fontSize: {
                          xs: theme.typography.caption.fontSize,
                          s465: theme.typography.body2.fontSize,
                        },
                        background: (theme) => theme.palette.neutral[100],
                        borderRadius: 0,
                      },
                    }}
                  />
                  <IconButton
                    sx={{
                      backgroundColor: 'primary.main',
                      borderRadius: {
                        xs: '0px 5px 5px 0px',
                        s465: '0px 10px 10px 0px',
                      },
                      color: 'common.white',
                      width: { xs: 35, s465: 51 },
                      '&:hover': {
                        backgroundColor: 'primary.main',
                      },
                    }}
                    onClick={handleSearch}
                  >
                    <SearchIcon />
                  </IconButton>
                </Box>
              </Box>
            </Container>
          </Container>
        </Toolbar>
      )}
      <Dialog
        fullWidth
        maxWidth="xs"
        open={openLogoutPopup}
        onClose={handleCloseLogoutPopup}
        scroll="body"
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            p: 3,
          }}
        >
          {<LogoutIcon sx={{ fontSize: 70, color: 'text.secondary' }} />}
        </Box>
        <Divider />
        <DialogContent>
          <Typography variant="subtitle1" sx={{ textAlign: 'center' }}>
            Bạn có muốn đăng xuất ngay bây giờ không?
          </Typography>
        </DialogContent>
        <Divider />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 2, py: 2 }}>
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              startIcon={<CloseIcon />}
              onClick={handleCloseLogoutPopup}
              color="error"
            >
              Hủy bỏ
            </Button>
            <LoadingButton
              loading={loadingLogout}
              loadingPosition="start"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
            >
              Đăng xuất
            </LoadingButton>
          </Stack>
        </Box>
      </Dialog>
    </AppBar>
  );
};

export default Header;
