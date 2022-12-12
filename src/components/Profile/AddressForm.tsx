import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import DialogContent from 'components/Dialog/DialogContent';
import DialogFooter from 'components/Dialog/DialogFooter';
import DialogForm from 'components/Dialog/DialogForm';
import ControllerCheckbox from 'components/Form/ControllerCheckbox';
import ControllerSelect from 'components/Form/ControllerSelect';
import ControllerTextField from 'components/Form/ControllerTextField';
import FormGroup from 'components/Form/FormGroup';
import FormLabel from 'components/Form/FormLabel';
import {
  ADDRESS_DEFAULT,
  ADDRESS_UN_DEFAULT,
  TYPE_FORM,
} from 'constant/common';
import useNotification from 'hooks/useNotification';
import { DispatchWithoutAction, useEffect, useState } from 'react';
import type {
  Control,
  FieldValues,
  UseFormGetValues,
  UseFormHandleSubmit,
  UseFormReset,
} from 'react-hook-form/dist/types';
import { useTranslation } from 'react-i18next';
import User from 'services/users';
import type { Address, City, District, Ward } from 'types/user';
import getMessageError from 'utils/controlMessage';
import Regexs from 'utils/Regexs';
import wait from 'utils/wait';
import * as yup from 'yup';

export interface AddressFormValue extends FieldValues {
  id: number;
  fullName: string;
  mobile: string;
  address: string;
  province: number;
  district: number;
  ward: number;
  isDefaultAddress: boolean;
}
interface Props {
  open: boolean;
  handleSubmit: UseFormHandleSubmit<AddressFormValue>;
  control: Control<AddressFormValue>;
  typeForm: string;
  updateItem?: Address | null;
  handleClose: () => void;
  reset: UseFormReset<AddressFormValue>;
  refetch: DispatchWithoutAction;
  getUpdateFormValues?: UseFormGetValues<AddressFormValue>;
}

export const validationAddressSchema = yup.object().shape({
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

const AddressForm = (props: Props) => {
  const {
    handleClose,
    control,
    open,
    handleSubmit,
    updateItem,
    typeForm,
    reset,
    refetch,
    getUpdateFormValues,
  } = props;
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);
  const setNotification = useNotification();
  const [listCity, setListCity] = useState<City[]>([]);
  const [listDistrict, setListDistrict] = useState<District[]>([]);
  const [listWard, setListWard] = useState<Ward[]>([]);
  const [selectCity, setSelectCity] = useState<number>(0);
  const [selectDistrict, setSelectDistrict] = useState<number>(0);

  useEffect(() => {
    if (!updateItem) return;
    reset({
      address: updateItem.specificAddress || '',
      district: updateItem.districtId || 0,
      fullName: updateItem.fullName || '',
      isDefaultAddress: updateItem.addressDefault === ADDRESS_DEFAULT,
      mobile: updateItem.mobile || '',
      province: updateItem.cityId || 0,
      ward: updateItem.wardsId || 0,
    });
    setSelectCity(updateItem.cityId);
    setSelectDistrict(updateItem.districtId);
  }, [updateItem, reset]);

  useEffect(() => {
    if (!open) return;
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
  }, [open, setNotification, t]);

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
    if (!selectDistrict) return;
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
  }, [selectDistrict, setNotification, t]);

  const onCreateSubmit = async (values: AddressFormValue) => {
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

  const onUpdateSubmit = (values: AddressFormValue) => {
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

  const handleResetCreateForm = async () => {
    handleClose();
    await wait(350);
    reset(validationAddressSchema.getDefault());
  };

  const handleResetUpdateForm = async () => {
    handleClose();
    await wait(350);
    reset(validationAddressSchema.getDefault());
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
    <Dialog
      open={open}
      onClose={
        typeForm === TYPE_FORM.CREATE
          ? handleResetCreateForm
          : handleResetUpdateForm
      }
      fullWidth={true}
      maxWidth="sm"
    >
      <DialogTitle
        variant="h4"
        sx={{ textAlign: 'center', fontWeight: 400, my: 2 }}
      >
        {t('title.addAddress')}
      </DialogTitle>
      <DialogForm
        onSubmit={handleSubmit(
          typeForm === TYPE_FORM.CREATE ? onCreateSubmit : onUpdateSubmit
        )}
      >
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
                  control={control}
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
                  control={control}
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
                  control={control}
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
                  control={control}
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
                  control={control}
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
                  control={control}
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
                disabled={
                  getUpdateFormValues && getUpdateFormValues('isDefaultAddress')
                }
                name="isDefaultAddress"
                control={control}
                label={
                  <Typography
                    variant="h6"
                    sx={{
                      color:
                        getUpdateFormValues &&
                        getUpdateFormValues('isDefaultAddress')
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
          <Box>
            <Button
              onClick={handleClose}
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
  );
};

export default AddressForm;
