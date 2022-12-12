import { yupResolver } from '@hookform/resolvers/yup';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import DialogContent from 'components/Dialog/DialogContent';
import DialogFooter from 'components/Dialog/DialogFooter';
import DialogForm from 'components/Dialog/DialogForm';
import ControllerCheckbox from 'components/Form/ControllerCheckbox';
import ControllerSelect from 'components/Form/ControllerSelect';
import ControllerTextField from 'components/Form/ControllerTextField';
import FormGroup from 'components/Form/FormGroup';
import FormLabel from 'components/Form/FormLabel';
import TypographyWrap from 'components/TypographyWrap';
import { ADDRESS_DEFAULT, ADDRESS_UN_DEFAULT } from 'constant/common';
import withPrivateRoute from 'hocs/withPrivateRoute';
import useAddress from 'hooks/useAddress';
import useNotification from 'hooks/useNotification';
import UserProfileLayout from 'layouts/UserProfile';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import User from 'services/users';
import type { Address, City, District, Ward } from 'types/user';
import getMessageError from 'utils/controlMessage';
import Regexs from 'utils/Regexs';
import wait from 'utils/wait';
import * as yup from 'yup';

interface CreateFormValue {
  fullName: string;
  mobile: string;
  address: string;
  province: number;
  district: number;
  ward: number;
  isDefaultAddress: boolean;
}

interface UpdateFormValue {
  id: number;
  fullName: string;
  mobile: string;
  address: string;
  province: number;
  district: number;
  ward: number;
  isDefaultAddress: boolean;
}

const validationCreateSchema = yup.object().shape({
  fullName: yup
    .string()
    .max(50, 'schema.textMax50')
    .trim('schema.trim')
    .required('schema.requiredFullname')
    .default(''),
  mobile: yup
    .string()
    .trim('schema.trim')
    .required('schema.requiredPhone')
    .matches(Regexs.phoneNumber, 'schema.validPhone')
    .default(''),
  address: yup.string().required('schema.requiredAddress').default(''),
  province: yup.number().required('schema.requiredCity'),
  district: yup.number().required('schema.requiredCity'),
  ward: yup.number().required('schema.requiredWard'),
  isDefaultAddress: yup.boolean().oneOf([true, false]).default(false),
});

const validationUpdateSchema = yup.object().shape({
  fullName: yup
    .string()
    .max(50, 'schema.textMax50')
    .trim('schema.trim')
    .required('schema.requiredFullname')
    .default(''),
  mobile: yup
    .string()
    .trim('schema.trim')
    .required('schema.requiredPhone')
    .matches(Regexs.phoneNumber, 'schema.validPhone')
    .default(''),
  address: yup.string().required('schema.requiredAddress').default(''),
  province: yup.number().required('schema.requiredCity'),
  district: yup.number().required('schema.requiredCity'),
  ward: yup.number().required('schema.requiredWard'),
  isDefaultAddress: yup.boolean().oneOf([true, false]).default(false),
});

const AddressPage = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);
  const setNotification = useNotification();
  const [openCreateModal, setOpenCreateModal] = useState<boolean>(false);
  const [openUpdateModal, setOpenUpdateModal] = useState<boolean>(false);
  const [openRemoveModal, setOpenRemoveModal] = useState<boolean>(false);
  const { listAddress, refetch } = useAddress();
  const [listCity, setListCity] = useState<City[]>([]);
  const [listDistrict, setListDistrict] = useState<District[]>([]);
  const [listWard, setListWard] = useState<Ward[]>([]);
  const [selectCity, setSelectCity] = useState<number>(0);
  const [selectDistrict, setSelectDistrict] = useState<number>(0);
  const [removeItem, setRemoveItem] = useState<number>(0);
  const theme = useTheme();
  const up465 = useMediaQuery(theme.breakpoints.up('s465'));
  const [updateItem, setUpdateItem] = useState<Address>({
    id: 0,
    addressDefault: ADDRESS_UN_DEFAULT,
    districtId: 0,
    fullName: '',
    mobile: '',
    cityId: 0,
    wardsId: 0,
    specificAddress: '',
    addressLine: '',
  });

  const {
    control: createControl,
    handleSubmit: handleSubmitCreateModal,
    reset: resetCreateForm,
  } = useForm<CreateFormValue>({
    mode: 'onChange',
    resolver: yupResolver(validationCreateSchema),
    defaultValues: validationCreateSchema.getDefault(),
  });

  const {
    control: updateControl,
    handleSubmit: handleSubmitUpdateModal,
    reset: resetUpdateForm,
    getValues,
  } = useForm<UpdateFormValue>({
    mode: 'onChange',
    resolver: yupResolver(validationUpdateSchema),
    defaultValues: validationUpdateSchema.getDefault(),
  });

  useEffect(() => {
    if (updateItem) {
      resetUpdateForm({
        address: updateItem.specificAddress || '',
        district: updateItem.districtId || 0,
        fullName: updateItem.fullName || '',
        isDefaultAddress:
          updateItem.addressDefault === ADDRESS_DEFAULT ? true : false,
        mobile: updateItem.mobile || '',
        province: updateItem.cityId || 0,
        ward: updateItem.wardsId || 0,
      });
      setSelectCity(updateItem.cityId);
      setSelectDistrict(updateItem.districtId);
    }
  }, [updateItem, resetUpdateForm]);

  useEffect(() => {
    if (openCreateModal || openUpdateModal) {
      User.getListCity()
        .then((response) => {
          setListCity(response.data);
        })
        .catch((error) => {
          const message = getMessageError(error) || 'message.systemError';
          setNotification({
            message: t(message),
            severity: 'error',
          });
        });
    }
  }, [openCreateModal, openUpdateModal, setNotification, t]);

  useEffect(() => {
    if (selectCity) {
      User.getListDistrict(selectCity)
        .then((response) => {
          setListDistrict(response.data);
        })
        .catch((error) => {
          const message = getMessageError(error) || 'message.systemError';
          setNotification({
            message: t(message),
            severity: 'error',
          });
        });
    }
  }, [selectCity, setNotification, t]);

  useEffect(() => {
    if (selectDistrict) {
      User.getListWard(selectDistrict)
        .then((response) => {
          setListWard(response.data);
        })
        .catch((error) => {
          const message = getMessageError(error) || 'message.systemError';
          setNotification({
            message: t(message),
            severity: 'error',
          });
        });
    }
  }, [selectDistrict, setNotification, t]);

  const handleResetCreateForm = async () => {
    handleCloseCreateModal();
    await wait(350);
    resetCreateForm(validationCreateSchema.getDefault());
  };

  const handleResetUpdateForm = async () => {
    handleCloseUpdateModal();
    await wait(350);
    resetUpdateForm(validationUpdateSchema.getDefault());
  };

  const onCreateSubmit = async (values: CreateFormValue) => {
    const { address, district, fullName, mobile, province, ward } = values;
    if (!fullName || !mobile || !province || !district || !ward || !address) {
      return;
    }

    setLoading(true);
    User.createAddress({
      id: null,
      fullName,
      mobile,
      cityId: province,
      districtId: district,
      wardsId: ward,
      specificAddress: address,
      addressDefault: values.isDefaultAddress
        ? ADDRESS_DEFAULT
        : ADDRESS_UN_DEFAULT,
    })
      .then((response) => {
        setNotification({
          message: t('message.createAddressSuccess'),
          severity: 'success',
        });

        refetch();
        handleResetCreateForm();
      })
      .catch((error) => {
        const message = getMessageError(error) || 'message.systemError';

        setNotification({
          message: t(message),
          severity: 'error',
        });
      })
      .finally(() => {
        setLoading(false);
        setSelectCity(0);
        setSelectDistrict(0);
      });
  };

  const onUpdateSubmit = (values: UpdateFormValue) => {
    const { address, district, fullName, mobile, province, ward } = values;

    if (
      !fullName ||
      !mobile ||
      !province ||
      !district ||
      !ward ||
      !address ||
      !updateItem
    ) {
      return;
    }

    setLoading(true);

    User.updateAddress({
      id: updateItem.id,
      fullName,
      mobile,
      cityId: province,
      districtId: district,
      wardsId: ward,
      specificAddress: address,
      addressDefault: values.isDefaultAddress
        ? ADDRESS_DEFAULT
        : ADDRESS_UN_DEFAULT,
    })
      .then((response) => {
        setNotification({
          message: t('message.updateAddressSuccess'),
          severity: 'success',
        });

        refetch();
        handleResetUpdateForm();
      })
      .catch((error) => {
        const message = getMessageError(error) || 'message.systemError';

        setNotification({
          message: t(message),
          severity: 'error',
        });
      })
      .finally(() => {
        setLoading(false);
        setSelectCity(0);
        setSelectDistrict(0);
      });
  };

  const handleRemoveAddress = () => {
    setLoading(true);
    User.removeAddress(removeItem)
      .then((response) => {
        setNotification({
          message: t('message.removeAddressSuccess'),
          severity: 'success',
        });

        refetch();
      })
      .catch((error) => {
        const message = getMessageError(error) || 'message.systemError';

        setNotification({
          message: t(message),
          severity: 'error',
        });
      })
      .finally(() => {
        setLoading(false);
        setRemoveItem(0);
        setOpenRemoveModal(false);
      });
  };

  const handleOpenCreateItem = () => {
    setOpenCreateModal(true);
  };

  const handleOpenUpdateItem = (updateItemId: number) => () => {
    setSelectCity(0);
    setSelectDistrict(0);
    User.getAddress(updateItemId)
      .then((response) => {
        setUpdateItem(response.data);
      })
      .catch((error) => {
        const message = getMessageError(error) || 'message.systemError';
        setNotification({
          message: t(message),
          severity: 'error',
        });
      })
      .finally(() => {
        setLoading(false);
        setRemoveItem(0);
        setOpenRemoveModal(false);
        setOpenUpdateModal(true);
      });
  };

  const handleOpenRemoveDialog = (removeItem: number) => () => {
    setRemoveItem(removeItem);
    setOpenRemoveModal(true);
  };

  const handleCloseCreateModal = () => {
    setOpenCreateModal(false);
    resetCreateForm(validationCreateSchema.getDefault());
  };

  const handleCloseUpdateModal = () => {
    setOpenUpdateModal(false);
  };

  const handleCloseRemoveModal = () => {
    setOpenRemoveModal(false);
  };

  const onChangeSelectCity = (value: number) => {
    setSelectCity(value);
    setListDistrict([]);
    setListWard([]);
  };

  const onChangeSelectDistrict = (value: number) => {
    setSelectDistrict(value);
  };

  return (
    <UserProfileLayout>
      <Container
        maxWidth="md"
        sx={{
          backgroundColor: 'background.paper',
          p: 2.5,
          boxShadow: '1px 1px 3px #ccc,-1px -1px 3px #ccc',
          minHeight: 500,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: { xs: 1, sm: 4.3 },
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 'inherit' }}>
            {t('title.myAddress')}
          </Typography>
          <Button
            size={up465 ? 'medium' : 'small'}
            startIcon={<AddIcon />}
            sx={{
              backgroundColor: 'vShip.product.main',
            }}
            onClick={handleOpenCreateItem}
          >
            {up465 ? t('title.addAddress') : 'Địa chỉ'}
          </Button>
        </Box>
        <Divider variant="fullWidth" />
        <Grid container spacing={1} sx={{ mt: 1, mb: 3 }}>
          <Grid item xs={12} sm={12} md={12}>
            <Typography variant="h5" sx={{ fontWeight: 'inherit' }}>
              {t('title.address')}
            </Typography>
          </Grid>
          {listAddress.map((item, index) => (
            <Grid
              key={index}
              container
              item
              xs={12}
              sm={12}
              md={12}
              spacing={1}
              sx={{ mt: 1 }}
            >
              <Grid container item xs={12} sm={9} md={9} spacing={1}>
                <Grid container item xs={12} sm={12} md={12} spacing={1}>
                  <Grid item>
                    <TypographyWrap variant="body2" sx={{ fontWeight: 'bold' }}>
                      {item.fullName}
                    </TypographyWrap>
                  </Grid>
                  {item.addressDefault === ADDRESS_DEFAULT && (
                    <Grid
                      item
                      sx={{ color: 'vShip.product.main', display: 'flex' }}
                    >
                      <CheckCircleOutlineRoundedIcon
                        sx={{ width: 20, height: 20, mr: 1 }}
                      />
                      <TypographyWrap variant="body2">
                        {t('title.defaultAddress')}
                      </TypographyWrap>
                    </Grid>
                  )}
                </Grid>
                <Grid
                  container
                  alignItems="center"
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  spacing={1}
                >
                  <Grid item>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {t('label.address')}:
                    </Typography>
                  </Grid>
                  <Grid item sx={{ width: { md: 0.9, sm: 0.8, xs: 0.9 } }}>
                    <TypographyWrap
                      variant="body2"
                      sx={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {item.addressLine}
                    </TypographyWrap>
                  </Grid>
                </Grid>
                <Grid
                  container
                  alignItems="center"
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  spacing={1}
                >
                  <Grid item>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {t('label.phone')}:
                    </Typography>
                  </Grid>
                  <Grid item>
                    <TypographyWrap variant="body2">
                      {item.mobile}
                    </TypographyWrap>
                  </Grid>
                </Grid>
              </Grid>
              <Grid
                container
                item
                xs={12}
                sm={3}
                md={3}
                sx={{ color: 'vShip.text.gray', alignItems: 'center' }}
              >
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  sx={{
                    textAlign: { md: 'end', xs: 'start' },
                    mr: 2,
                  }}
                >
                  <Typography
                    component="span"
                    variant="body2"
                    sx={{
                      borderRight: 1,
                      pr: 1,
                      mr: 1,
                      cursor: 'pointer',
                      '&:hover': {
                        color: 'primary.main',
                        borderColor: 'vShip.text.gray',
                      },
                    }}
                    onClick={handleOpenUpdateItem(item.id)}
                  >
                    {t('button.change')}
                  </Typography>
                  <Typography
                    component="span"
                    variant="body2"
                    onClick={handleOpenRemoveDialog(item.id)}
                    sx={{
                      cursor: 'pointer',
                      '&:hover': {
                        color: 'primary.main',
                        borderColor: 'vShip.text.gray',
                      },
                    }}
                  >
                    {t('button.remove')}
                  </Typography>
                </Grid>
              </Grid>
              <Grid item xs={12} sm={12} md={12} sx={{ mt: 2 }}>
                <Divider variant="fullWidth" />
              </Grid>
            </Grid>
          ))}
        </Grid>
      </Container>
      {/* Address Create Form */}
      <Dialog
        open={openCreateModal}
        onClose={handleResetCreateForm}
        fullWidth={true}
        maxWidth="sm"
      >
        <DialogTitle
          variant="h4"
          sx={{ textAlign: 'center', fontWeight: 400, my: 2 }}
        >
          {t('title.addAddress')}
        </DialogTitle>
        <DialogForm onSubmit={handleSubmitCreateModal(onCreateSubmit)}>
          <DialogContent>
            <FormGroup>
              <Grid container alignItems="center" spacing={1}>
                <Grid item xs={12} sm={3} md={3}>
                  <FormLabel
                    title={t('label.fullName')}
                    name="fullName"
                    gutterBottom
                    gutterLeft
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={9} md={9}>
                  <ControllerTextField
                    name="fullName"
                    control={createControl}
                    placeholder={t('placeholder.fullName')}
                  />
                </Grid>
              </Grid>
            </FormGroup>
            <FormGroup>
              <Grid container alignItems="center" spacing={1}>
                <Grid item xs={12} sm={3} md={3}>
                  <FormLabel
                    title={t('label.phone')}
                    name="mobile"
                    gutterBottom
                    gutterLeft
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={9} md={9}>
                  <ControllerTextField
                    name="mobile"
                    control={createControl}
                    placeholder={t('placeholder.phone')}
                  />
                </Grid>
              </Grid>
            </FormGroup>
            <FormGroup>
              <Grid container alignItems="center" spacing={1}>
                <Grid item xs={12} sm={3} md={3}>
                  <FormLabel
                    title={t('label.province')}
                    name="province"
                    gutterBottom
                    gutterLeft
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={9} md={9}>
                  <ControllerSelect
                    name="province"
                    control={createControl}
                    placeholder={t('placeholder.province')}
                    options={listCity}
                    selector={(option) => option.name}
                    onChangeSelect={onChangeSelectCity}
                  />
                </Grid>
              </Grid>
            </FormGroup>
            <FormGroup>
              <Grid container alignItems="center" spacing={1}>
                <Grid item xs={12} sm={3} md={3}>
                  <FormLabel
                    title={t('label.district')}
                    name="district"
                    gutterBottom
                    gutterLeft
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={9} md={9}>
                  <ControllerSelect
                    name="district"
                    control={createControl}
                    placeholder={t('placeholder.district')}
                    options={listDistrict}
                    selector={(option) => option.name}
                    onChangeSelect={onChangeSelectDistrict}
                  />
                </Grid>
              </Grid>
            </FormGroup>
            <FormGroup>
              <Grid container alignItems="center" spacing={1}>
                <Grid item xs={12} sm={3} md={3}>
                  <FormLabel
                    title={t('label.ward')}
                    name="ward"
                    gutterBottom
                    gutterLeft
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={9} md={9}>
                  <ControllerSelect
                    name="ward"
                    control={createControl}
                    options={listWard}
                    selector={(option) => option.name}
                    placeholder={t('placeholder.ward')}
                  />
                </Grid>
              </Grid>
            </FormGroup>
            <FormGroup>
              <Grid container alignItems="center" spacing={1}>
                <Grid item xs={12} sm={3} md={3}>
                  <FormLabel
                    title={t('label.address')}
                    name="address"
                    gutterBottom
                    gutterLeft
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={9} md={9}>
                  <ControllerTextField
                    name="address"
                    control={createControl}
                    placeholder={t('placeholder.address')}
                    multiline
                    maxRows={3}
                    minRows={3}
                  />
                </Grid>
              </Grid>
            </FormGroup>
            <FormGroup>
              <Grid item sx={{ display: 'flex', justifyContent: 'center' }}>
                <ControllerCheckbox
                  name="isDefaultAddress"
                  control={createControl}
                  label={
                    <Typography
                      variant="h6"
                      sx={{ color: 'vShip.product.main' }}
                    >
                      {t('title.defaultAddress')}
                    </Typography>
                  }
                />
              </Grid>
            </FormGroup>
          </DialogContent>
          <DialogFooter>
            <Box>
              <Button
                onClick={handleCloseCreateModal}
                sx={{ backgroundColor: 'error.dark' }}
              >
                {t('button.cancel')}
              </Button>
              <LoadingButton
                size="medium"
                loading={loading}
                type="submit"
                sx={{ backgroundColor: 'success.dark', ml: 1 }}
              >
                {t('button.save')}
              </LoadingButton>
            </Box>
          </DialogFooter>
        </DialogForm>
      </Dialog>
      {/* Address Update Form */}
      <Dialog
        open={openUpdateModal}
        onClose={handleResetUpdateForm}
        fullWidth={true}
        maxWidth="sm"
      >
        <DialogTitle
          variant="h4"
          sx={{ textAlign: 'center', fontWeight: 400, my: 2 }}
        >
          {t('title.updateAddress')}
        </DialogTitle>
        <DialogForm onSubmit={handleSubmitUpdateModal(onUpdateSubmit)}>
          <DialogContent>
            <FormGroup>
              <Grid container alignItems="center" spacing={1}>
                <Grid item xs={12} sm={3} md={3}>
                  <FormLabel
                    title={t('label.fullName')}
                    name="fullName"
                    gutterBottom
                    gutterLeft
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={9} md={9}>
                  <ControllerTextField
                    name="fullName"
                    control={updateControl}
                    placeholder={t('placeholder.fullName')}
                  />
                </Grid>
              </Grid>
            </FormGroup>
            <FormGroup>
              <Grid container alignItems="center" spacing={1}>
                <Grid item xs={12} sm={3} md={3}>
                  <FormLabel
                    title={t('label.phone')}
                    name="mobile"
                    gutterBottom
                    gutterLeft
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={9} md={9}>
                  <ControllerTextField
                    name="mobile"
                    control={updateControl}
                    placeholder={t('placeholder.phone')}
                  />
                </Grid>
              </Grid>
            </FormGroup>
            <FormGroup>
              <Grid container alignItems="center" spacing={1}>
                <Grid item xs={12} sm={3} md={3}>
                  <FormLabel
                    title={t('label.province')}
                    name="province"
                    gutterBottom
                    gutterLeft
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={9} md={9}>
                  <ControllerSelect
                    name="province"
                    control={updateControl}
                    placeholder={t('placeholder.province')}
                    options={listCity}
                    selector={(option) => option.name}
                    onChangeSelect={onChangeSelectCity}
                  />
                </Grid>
              </Grid>
            </FormGroup>
            <FormGroup>
              <Grid container alignItems="center" spacing={1}>
                <Grid item xs={12} sm={3} md={3}>
                  <FormLabel
                    title={t('label.district')}
                    name="district"
                    gutterBottom
                    gutterLeft
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={9} md={9}>
                  <ControllerSelect
                    name="district"
                    control={updateControl}
                    placeholder={t('placeholder.district')}
                    options={listDistrict}
                    selector={(option) => option.name}
                    onChangeSelect={onChangeSelectDistrict}
                  />
                </Grid>
              </Grid>
            </FormGroup>
            <FormGroup>
              <Grid container alignItems="center" spacing={1}>
                <Grid item xs={12} sm={3} md={3}>
                  <FormLabel
                    title={t('label.ward')}
                    name="ward"
                    gutterBottom
                    gutterLeft
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={9} md={9}>
                  <ControllerSelect
                    name="ward"
                    control={updateControl}
                    options={listWard}
                    selector={(option) => option.name}
                    placeholder={t('placeholder.ward')}
                  />
                </Grid>
              </Grid>
            </FormGroup>
            <FormGroup>
              <Grid container alignItems="center" spacing={1}>
                <Grid item xs={12} sm={3} md={3}>
                  <FormLabel
                    title={t('label.address')}
                    name="address"
                    gutterBottom
                    gutterLeft
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={9} md={9}>
                  <ControllerTextField
                    name="address"
                    control={updateControl}
                    placeholder={t('placeholder.address')}
                    multiline
                    maxRows={3}
                    minRows={3}
                  />
                </Grid>
              </Grid>
            </FormGroup>
            <FormGroup>
              <Grid item sx={{ display: 'flex', justifyContent: 'center' }}>
                <ControllerCheckbox
                  disabled={getValues('isDefaultAddress')}
                  name="isDefaultAddress"
                  control={updateControl}
                  label={
                    <Typography
                      variant="h6"
                      sx={{
                        color: getValues('isDefaultAddress')
                          ? 'vShip.text.disabled'
                          : 'vShip.product.main',
                      }}
                    >
                      {t('title.defaultAddress')}
                    </Typography>
                  }
                />
              </Grid>
            </FormGroup>
          </DialogContent>
          <DialogFooter>
            <Button
              onClick={handleCloseUpdateModal}
              sx={{ backgroundColor: 'error.dark' }}
            >
              {t('button.cancel')}
            </Button>
            <LoadingButton
              size="medium"
              loading={loading}
              type="submit"
              sx={{ backgroundColor: 'success.dark' }}
            >
              {t('button.save')}
            </LoadingButton>
          </DialogFooter>
        </DialogForm>
      </Dialog>
      {/* Remove modal */}
      <Dialog
        open={openRemoveModal}
        onClose={handleCloseRemoveModal}
        fullWidth
        maxWidth="s300"
      >
        <DialogContent>
          <DialogContentText variant="h6" sx={{ textAlign: 'center', my: 1 }}>
            {t('message.removeAddress')}
          </DialogContentText>
        </DialogContent>
        <DialogActions
          sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}
        >
          <Button
            size="small"
            onClick={handleCloseRemoveModal}
            sx={{ backgroundColor: 'error.dark' }}
          >
            {t('button.back')}
          </Button>
          <Button
            size="small"
            onClick={handleRemoveAddress}
            sx={{ backgroundColor: 'success.dark' }}
          >
            {t('button.remove')}
          </Button>
        </DialogActions>
      </Dialog>
    </UserProfileLayout>
  );
};

export default withPrivateRoute(AddressPage);
