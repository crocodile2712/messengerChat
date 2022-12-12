import { yupResolver } from '@hookform/resolvers/yup';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import LoadingButton from '@mui/lab/LoadingButton';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import ControllerDatePicker from 'components/Form/ControllerDatePicker';
import ControllerRadio from 'components/Form/ControllerRadio';
import ControllerTextField from 'components/Form/ControllerTextField';
import Form from 'components/Form/Form';
import FormGroup from 'components/Form/FormGroup';
import FormLabel from 'components/Form/FormLabel';
import TypographyWrap from 'components/TypographyWrap';
import VerifyForm from 'components/VerifyForm';
import {
  FILE_TYPES,
  GENDERS,
  STEP_1,
  STEP_3,
  STEP_4,
  UPLOAD_TYPE_PROFILE,
} from 'constant/common';
import withPrivateRoute from 'hocs/withPrivateRoute';
import useAuth from 'hooks/useAuth';
import useNotification from 'hooks/useNotification';
import UserProfileLayout from 'layouts/UserProfile';
import type { ChangeEvent } from 'react';
import { Fragment, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Users from 'services/users';
import getMessageError from 'utils/controlMessage';
import DateFns from 'utils/DateFns';
import Regexs from 'utils/Regexs';
import wait from 'utils/wait';
import * as yup from 'yup';

interface FormValue {
  username: string;
  fullName: string;
  email: string;
  mobile: string;
  gender: number | null;
  dateOfBirth: Date | null;
  imageUrl: string | null;
}

const validationSchema = yup.object().shape({
  fullName: yup
    .string()
    .trim('schema.trim')
    .max(50, 'schema.textMax50')
    .required('schema.requiredFullname')
    .default(''),
  mobile: yup
    .string()
    .trim('schema.trim')
    .required('schema.requiredPhone')
    .matches(Regexs.phoneNumber, 'schema.validPhone')
    .default(''),
  gender: yup.number().nullable().default(1),
  dateOfBirth: yup
    .date()
    .nullable()
    .max(DateFns.format(Date.now(), 'yyyy-MM-dd'), 'schema.validDate')
    .typeError('schema.validDate')
    .default(null),
});

const options = [
  { value: 1, label: 'Nam' },
  { value: 2, label: 'Nữ' },
];

const Profile = () => {
  const { t } = useTranslation();
  const [openSuccessDialog, setOpenSuccessDialog] = useState<boolean>(false);
  const [isUpdateSuccess, setUpdateSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('sm'));
  const { sendOtpAgain, refetch, checkEmailPhoneExist, user } = useAuth();
  const setNotification = useNotification();
  const [activeStep, setActiveStep] = useState<number>(STEP_1);
  const [emailNew, setEmailNew] = useState<string>('');
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const { control, handleSubmit, reset, getValues } = useForm<FormValue>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
    defaultValues: validationSchema.getDefault(),
  });

  useEffect(() => {
    if (!user) return;
    const { dateOfBirth, gender } = user;
    reset({
      email: user.email || '',
      fullName: user.fullName || '',
      mobile: user.mobile || '',
      username: user.username || '',
      gender: GENDERS.includes(gender) ? gender : null,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
    });
  }, [user, reset]);

  useEffect(() => {
    if (user?.imageUrl) {
      setAvatarUrl(user.imageUrl);
    }
  }, [user?.imageUrl]);

  const handleClose = () => {
    setOpenSuccessDialog(false);
  };

  const updateUser = async (data: FormValue) => {
    const { dateOfBirth, gender, email, ...rest } = data;

    if (!user) {
      return;
    }

    setLoading(true);
    await wait(1000);
    try {
      let image: string | null = null;
      if (avatarFile) {
        const formData = new FormData();
        formData.append('file', avatarFile as File);
        formData.append('fileType', UPLOAD_TYPE_PROFILE);
        const { data } = await Users.getAvatarUrl(formData);
        if (data) {
          image = data;
        }
      }

      const updateUserResponse = await Users.updateUser({
        ...rest,
        id: user.id || -1,
        email: email || null,
        gender: gender || null,
        dateOfBirth: dateOfBirth
          ? DateFns.format(dateOfBirth, 'yyyy-MM-dd')
          : null,
        imageUrl: image || null,
      });
      if (updateUserResponse.success && updateUserResponse.data) {
        setUpdateSuccess(true);
        setOpenSuccessDialog(true);
        if (user.mobile !== data.mobile) {
          await wait(3000);
        }
        refetch();
      }
    } catch (error) {
      setUpdateSuccess(false);
      const message = getMessageError(error) || 'message.systemError';
      setNotification({
        message: t(message),
        severity: 'error',
      });
    } finally {
      setLoading(false);
      await wait(3000);
      setOpenSuccessDialog(false);
    }
  };

  const onSubmit = async (data: FormValue) => {
    await updateUser(data);
  };

  const handleSendMailOtp = async () => {
    try {
      setLoading(true);
      if (activeStep === STEP_3) {
        await checkEmailPhoneExist({ email: emailNew, mobile: null });
        await sendOtpAgain({ email: emailNew || '' });
        setActiveStep(STEP_4);
      }
      setNotification({
        message: t('message.sendMailOtpSuccess'),
        severity: 'success',
      });
    } catch (error) {
      const message = getMessageError(error) || 'message.systemError';
      setNotification({
        message: t(message),
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = (param: FormValue) => {
    return updateUser(param);
  };

  const handleChangeNewMail = (event: ChangeEvent<HTMLInputElement>) =>
    setEmailNew(event.target.value);

  const changeStep3 = () => {
    setActiveStep(STEP_3);
  };

  const changeStep1 = () => {
    setActiveStep(STEP_1);
  };

  const handleUploadAvatar = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files?.length !== 0) {
      const file = event.target.files[0];
      if (!FILE_TYPES.includes(file.type)) {
        setNotification({
          message: t('Ảnh phải có định dạng: .JPEG, .JPG, .PNG'),
          severity: 'error',
        });
        return;
      }

      if (file.size / 1024 / 1024 > 5) {
        setNotification({
          message: t('Dụng lượng file tối đa 5 MB'),
          severity: 'error',
        });
        return;
      }
      setAvatarFile(file);
      setAvatarUrl(URL.createObjectURL(file as Blob));
    }
  };

  return (
    <UserProfileLayout changeStepProfile1={changeStep1}>
      <Container
        maxWidth="md"
        sx={{
          backgroundColor: 'background.paper',
          p: 2.5,
          boxShadow: '1px 1px 3px #ccc,-1px -1px 3px #ccc',
        }}
      >
        <Box sx={{ mb: 1.8 }}>
          <Typography variant="h5" sx={{ fontWeight: 'inherit' }}>
            {t('title.myProfile')}
          </Typography>
          <Typography variant="body2">{t('title.manageToProtect')}</Typography>
        </Box>
        <Divider variant="fullWidth" />
        <Box>
          {activeStep === STEP_1 && (
            <Fragment>
              <Grid
                container
                spacing={1}
                sx={{
                  flexDirection: {
                    alignItems: 'center',
                    md: 'row',
                    xs: 'column-reverse',
                    minHeight: 300,
                  },
                  my: 3,
                }}
              >
                <Grid
                  item
                  xs={12}
                  md={9}
                  lg={9}
                  sx={{
                    width: 1,
                    borderRight: { md: '1px solid #E6E8F0' },
                  }}
                >
                  <Container maxWidth="md">
                    <Form
                      sx={{
                        mt: { xs: 2, sm: 'unset' },
                      }}
                      onSubmit={handleSubmit(onSubmit)}
                      autoComplete="off"
                    >
                      <FormGroup>
                        <Grid container spacing={1}>
                          <Grid item xs={12} sm={12} md={3}>
                            <FormLabel
                              title={t('label.fullName')}
                              name="fullName"
                              gutterBottom
                              required
                            />
                          </Grid>
                          <Grid item xs={12} sm={12} md={9}>
                            <ControllerTextField
                              fullWidth={false}
                              name="fullName"
                              control={control}
                              type="text"
                              placeholder={t('placeholder.fullName')}
                            />
                          </Grid>
                        </Grid>
                      </FormGroup>

                      <FormGroup>
                        <Grid container spacing={1}>
                          <Grid item xs={12} sm={12} md={3}>
                            <FormLabel
                              title={t('label.phone')}
                              name="phone"
                              gutterBottom
                              required
                            />
                          </Grid>
                          <Grid item xs={12} sm={12} md={9}>
                            <ControllerTextField
                              fullWidth={false}
                              name="mobile"
                              control={control}
                              type="text"
                              placeholder={t('label.phone')}
                            />
                          </Grid>
                        </Grid>
                      </FormGroup>

                      <FormGroup>
                        <Grid container spacing={1}>
                          <Grid item xs={12} sm={12} md={3}>
                            <FormLabel
                              title={t('label.email')}
                              name="email"
                              gutterBottom
                            />
                          </Grid>
                          <Grid container item xs={12} sm={12} md={9}>
                            {user?.email ? (
                              <Fragment>
                                <Grid
                                  item
                                  xs={12}
                                  sm={5}
                                  md={7}
                                  sx={{
                                    display: 'flex',
                                    justifyContent: 'flex-start',
                                    px: { lg: 0.5 },
                                    width: { md: 0.9, sm: 0.8, xs: 0.9 },
                                  }}
                                >
                                  <TypographyWrap
                                    variant="body1"
                                    sx={{
                                      whiteSpace: 'nowrap',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                    }}
                                  >
                                    {user?.email}
                                  </TypographyWrap>
                                </Grid>
                                <Grid item xs={12} sm={7} md={5}>
                                  <Typography
                                    variant="body1"
                                    sx={{
                                      color: 'vShip.link.main',
                                      textDecoration: 'underline',
                                      cursor: 'pointer',
                                      pl: { sm: 3 },
                                    }}
                                    onClick={changeStep3}
                                  >
                                    {t('button.change')}
                                  </Typography>
                                </Grid>
                              </Fragment>
                            ) : (
                              <Typography
                                variant="body1"
                                sx={{
                                  color: 'vShip.link.main',
                                  textDecoration: 'underline',
                                  cursor: 'pointer',
                                }}
                                onClick={changeStep3}
                              >
                                {t('button.add')}
                              </Typography>
                            )}
                          </Grid>
                        </Grid>
                      </FormGroup>

                      <FormGroup>
                        <Grid container spacing={1}>
                          <Grid item xs={12} sm={12} md={3}>
                            <FormLabel
                              title={t('label.gender')}
                              name="gender"
                              gutterBottom
                            />
                          </Grid>
                          <Grid item xs={12} sm={12} md={9}>
                            <ControllerRadio
                              row
                              control={control}
                              name="gender"
                              options={options}
                              defaultValue={1}
                            />
                          </Grid>
                        </Grid>
                      </FormGroup>

                      <FormGroup>
                        <Grid container spacing={1}>
                          <Grid item xs={12} sm={12} md={3}>
                            <FormLabel
                              title={t('label.dob')}
                              name="dateOfBirth"
                              gutterBottom
                            />
                          </Grid>
                          <Grid item xs={12} sm={12} md={9}>
                            <ControllerDatePicker
                              name="dateOfBirth"
                              control={control}
                            />
                          </Grid>
                        </Grid>
                      </FormGroup>

                      <Box
                        sx={{
                          mt: 2.5,
                          mb: 5,
                          display: 'flex',
                          justifyContent: 'center',
                        }}
                      >
                        <LoadingButton
                          loading={loading}
                          size={matches ? 'medium' : 'large'}
                          type="submit"
                        >
                          {t('button.save')}
                        </LoadingButton>
                      </Box>
                    </Form>
                  </Container>
                </Grid>

                <Grid
                  item
                  xs={12}
                  md={3}
                  lg={3}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <IconButton sx={{ p: 0 }}>
                    <Avatar
                      sx={{ width: 150, height: 150 }}
                      alt="avatar"
                      src={avatarUrl}
                    />
                  </IconButton>
                  {/* Upload Image */}
                  <Button
                    component="label"
                    sx={{ backgroundColor: 'primary.main', my: 2 }}
                  >
                    {t('button.selectImage')}
                    <input
                      hidden
                      accept="image/*"
                      multiple
                      type="file"
                      onChange={handleUploadAvatar}
                    />
                  </Button>
                  <Typography
                    sx={{ fontSize: 14, color: 'vShip.text.disabled' }}
                  >
                    {t('message.maxSizeImage')}
                  </Typography>
                  <Typography
                    sx={{ fontSize: 14, color: 'vShip.text.disabled' }}
                  >
                    {t('message.wrongFileType')}
                  </Typography>
                </Grid>
              </Grid>
            </Fragment>
          )}

          {activeStep === STEP_3 && (
            <Fragment>
              <Container
                maxWidth="sm"
                sx={{ ml: 0, mt: 2, minHeight: 350 }}
                disableGutters
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={12} md={12}>
                    <Typography variant="h5" sx={{ fontWeight: 'inherit' }}>
                      {t('title.changeEmailPage')}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} sx={{ mt: 1 }}>
                    <ControllerTextField
                      name="email"
                      control={control}
                      value={emailNew}
                      onChange={handleChangeNewMail}
                      placeholder={t('placeholder.newEmail')}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12}>
                    <LoadingButton
                      onClick={handleSendMailOtp}
                      loading={loading}
                      size={matches ? 'medium' : 'large'}
                    >
                      {t('button.next')}
                    </LoadingButton>
                  </Grid>
                </Grid>
              </Container>
            </Fragment>
          )}

          {activeStep === STEP_4 && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                margin: '0 auto',
              }}
            >
              <VerifyForm
                data={{
                  ...user,
                  dateOfBirth: getValues('dateOfBirth'),
                  email: emailNew || '',
                }}
                setActiveStep={setActiveStep}
                changeToStep={STEP_1}
                backStep={STEP_3}
                callbackNext={updateUserProfile}
              />
            </Box>
          )}
        </Box>
        <Dialog
          open={openSuccessDialog}
          onClose={handleClose}
          maxWidth="s465"
          fullWidth
        >
          <DialogContent
            sx={{
              textAlign: 'center',
              height: 200,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CheckCircleOutlineIcon
              sx={{
                color: isUpdateSuccess ? 'success.dark' : 'error.dark',
                width: 50,
                height: 50,
                mb: 2,
              }}
            />
            <DialogContentText
              variant="h5"
              color={isUpdateSuccess ? 'success.dark' : 'error.dark'}
            >
              {isUpdateSuccess
                ? t('message.updateProfileSuccess')
                : t('message.updateProfileError')}
            </DialogContentText>
          </DialogContent>
        </Dialog>
      </Container>
    </UserProfileLayout>
  );
};

export default withPrivateRoute(Profile);
