import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import useAuth from 'hooks/useAuth';
import useNotification from 'hooks/useNotification';
import { useRouter } from 'next/router';
import { Fragment, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { CommonResponse } from 'types/common';
import type { UpdateUserParams } from 'types/user';
import getMessageError from 'utils/controlMessage';
import wait from 'utils/wait';
import OTPInput from './OTPInput';

interface Data
  extends Partial<Omit<UpdateUserParams, 'dateOfBirth' | 'fullName'>> {
  dateOfBirth: Date | null;
}

interface Props {
  email?: string;
  data?: Data;
  setActiveStep?: (step: number) => void;
  callbackNext?: (param: any) => Promise<CommonResponse> | Promise<void>;
  navigateUrl?: string;
  changeToStep?: number;
  backStep?: number;
}

const VerifyForm = (props: Props) => {
  const {
    data,
    setActiveStep,
    callbackNext,
    email,
    navigateUrl,
    changeToStep,
    backStep,
  } = props;
  const { t } = useTranslation();
  const setNotification = useNotification();
  const { confirmAccount, sendOtpAgain } = useAuth();
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
  const [time, setTime] = useState<number>(60);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const timer =
      time > 0 &&
      setInterval(() => {
        setTime(() => time - 1);
      }, 1000);

    return () => clearInterval(timer as NodeJS.Timer);
  }, [time]);

  const handleConfirmAccount = async () => {
    try {
      setLoading(true);
      await wait(1000);
      await confirmAccount({
        email: data?.email || email || '',
        otp: otp.join(''),
      });

      await callbackNext?.(data || email);
      setNotification({
        message: t('message.confirmAccountSuccess'),
        severity: 'success',
      });
      navigateUrl && router.push(navigateUrl);
      changeToStep && setActiveStep?.(changeToStep);
      setTime(60);
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

  const handleSendOtpAgain = async () => {
    try {
      if (time === 0) {
        setTime(60);
        await wait(1000);
        await sendOtpAgain({ email: data?.email || email || '' });
        setNotification({
          message: t('message.sendMailOtpSuccess'),
          severity: 'success',
        });
      }
    } catch (error) {
      const message = getMessageError(error) || 'message.systemError';
      setNotification({
        message: t(message),
        severity: 'error',
      });
    }
  };

  const handleChangeStep = () => {
    setActiveStep?.(backStep || 1);
  };

  return (
    <Fragment>
      <Box>
        <Typography variant="h4" align="center" sx={{ mt: 3, mb: 8 }}>
          {t('title.confirmAccount')}
        </Typography>
      </Box>
      <Box sx={{ mt: 3 }}>
        <Box
          sx={{
            display: 'flex',
            align: 'center',
            justifyContent: 'center',
          }}
        >
          <OTPInput values={otp} setValues={setOtp} />
        </Box>
        <Box sx={{ mt: 6, mb: 6, display: 'flex', justifyContent: 'center' }}>
          <LoadingButton
            loading={loading}
            onClick={handleConfirmAccount}
            size="large"
            type="submit"
          >
            {t('button.next')}
          </LoadingButton>
        </Box>
        <Box sx={{ mt: 3, mb: 8, display: 'flex', justifyContent: 'center' }}>
          <Typography
            variant="h6"
            align="center"
            sx={{
              color: time > 0 ? 'primary.main' : 'vShip.link.main',
              cursor: 'pointer',
            }}
            onClick={handleSendOtpAgain}
          >
            {t('title.sendOtpAgain')}: ({time}s){' '}
          </Typography>
        </Box>
        <Typography
          align="left"
          variant="h6"
          sx={{
            color: 'vShip.link.main',
            cursor: 'pointer',
            fontWeight: 'inherit',
            mb: 3,
            display: 'flex',
            alignItems: 'center',
          }}
          onClick={handleChangeStep}
        >
          <ArrowBackIosIcon />
          <Typography>{t('button.back')}</Typography>
        </Typography>
      </Box>
    </Fragment>
  );
};

export default VerifyForm;
