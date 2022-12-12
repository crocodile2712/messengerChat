import { yupResolver } from '@hookform/resolvers/yup';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import ControllerTextField from 'components/Form/ControllerTextField';
import Form from 'components/Form/Form';
import FormGroup from 'components/Form/FormGroup';
import FormLabel from 'components/Form/FormLabel';
import Image from 'components/Image';
import TypographyWrap from 'components/TypographyWrap';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Regexs from 'utils/Regexs';
import * as yup from 'yup';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import useNotification from 'hooks/useNotification';
import getMessageError from 'utils/controlMessage';
import Product from 'services/product';
import type { GetServerSideProps, NextPage } from 'next';
import TextField from '@mui/material/TextField';
import { inputBaseClasses } from '@mui/material/InputBase';

interface FormValue {
  yen: string;
  vnd: string;
  weight: string;
}

const validationSchema = yup.object().shape({
  yen: yup
    .string()
    .trim('schema.trim')
    .matches(Regexs.number, 'schema.validNumber')
    .default('')
    .required('schema.requiredNumber'),
  vnd: yup
    .string()
    .trim('schema.trim')
    .matches(Regexs.number, 'schema.validNumber')
    .default('')
    .required('schema.requiredNumber'),
  weight: yup
    .string()
    .trim('schema.trim')
    .matches(Regexs.number, 'schema.validNumber')
    .default('')
    .required('schema.requiredNumber'),
});

interface Props {
  rate: number | null;
}

const EstimatePrice: NextPage<Props> = (props: Props) => {
  const { rate } = props;
  const { t } = useTranslation();
  const { control, handleSubmit, setValue } = useForm<FormValue>({
    mode: 'onSubmit',
    resolver: yupResolver(validationSchema),
    defaultValues: validationSchema.getDefault(),
  });
  const { query } = useRouter();
  const { price } = query;
  const [estimatePrice, setEstimatePrice] = useState<number>(0);
  const setNotification = useNotification();
  const [yenPrice, setYenPrice] = useState<number>(0);
  const [vndPrice, setVndPrice] = useState<number>(0);

  useEffect(() => {
    if (price && typeof price === 'string') {
      setYenPrice(parseInt(price));
      setVndPrice(parseInt(price) * (rate ? Math.round(rate) : 0));
      setValue('yen', price);
      setValue('vnd', `${parseInt(price) * (rate ? Math.round(rate) : 0)}`);
    }
  }, [price, rate, setValue]);

  const onSubmit = (data: FormValue) => {
    Product.estimatePrice({
      totalPrice: parseInt(data.vnd),
      weight: parseInt(data.weight),
    })
      .then((res) => {
        if (res.httpStatusCode === '200' && res.data) {
          setEstimatePrice(res.data);
        }
      })
      .catch((error) => {
        const message = getMessageError(error) || 'message.systemError';
        setNotification({
          message: t(message),
          severity: 'error',
        });
      });
  };

  return (
    <Container
      maxWidth="md"
      sx={{ backgroundColor: 'background.paper', minHeight: 1 }}
    >
      <Grid container spacing={1} justifyContent="center">
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            mt: 5,
            mb: 1,
          }}
        >
          <Typography variant="h4">{t('title.estimatePriceTool')}</Typography>
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <Divider
            variant="fullWidth"
            sx={{ borderColor: 'vShip.border.lightGray' }}
          />
        </Grid>
        <Grid item xs={9}>
          <Typography variant="body1">
            {t('message.estimateMessage')}
          </Typography>
        </Grid>
        <Grid item xs={12} md={6} sx={{ display: { xs: 'none', md: 'block' } }}>
          <Image
            src="/static/imgs/estimate_image2.png"
            alt="estimate"
            sx={{
              width: 200,
              height: 200,
              position: 'relative',
              top: 57,
              left: 0,
            }}
          />
          <Image
            src="/static/imgs/estimate_image1.png"
            alt="estimate"
            sx={{ width: 350, height: 350, float: 'right' }}
          />
          <Image
            src="/static/imgs/estimate_image3.png"
            alt="estimate"
            sx={{
              width: 120,
              height: 120,
              position: 'relative',
              top: '-80px',
              left: 30,
            }}
          />
        </Grid>
        <Grid item xs={12} md={6} sx={{ mt: 3 }}>
          <Typography component="span" sx={{ mb: 2 }}>
            {t('title.yenExchangeRate')}
            <Typography component="span" sx={{ fontWeight: 'bold' }}>
              {' '}
              1 JPY = {rate ? Math.round(rate) : 0} VND
            </Typography>
          </Typography>
          <Form noValidate onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12} md={12}>
                <FormGroup>
                  <Grid container alignItems="center">
                    <Grid item xs={12} sm={12} md={12}>
                      <FormLabel
                        title={t('label.product.yen')}
                        name="yen"
                        gutterBottom
                        // required
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12}>
                      {/* <ControllerTextField
                        name="yen"
                        control={control}
                        placeholder={t('placeholder.yen')}
                        disabled
                      /> */}
                      <TextField
                        disabled
                        value={Intl.NumberFormat('en').format(yenPrice)}
                        placeholder={t('placeholder.yen')}
                        fullWidth
                        sx={{
                          [`& .${inputBaseClasses.input}.${inputBaseClasses.disabled}`]:
                            {
                              WebkitTextFillColor: 'black',
                            },
                        }}
                      />
                    </Grid>
                  </Grid>
                  <Grid xs={12} sm={12} md={12} sx={{ mt: 0.5 }}>
                    <Divider
                      variant="fullWidth"
                      sx={{ borderColor: 'vShip.border.lightGray' }}
                    />
                  </Grid>
                </FormGroup>
              </Grid>
              <Grid item xs={12} sm={12} md={12}>
                <FormGroup>
                  <Grid container alignItems="center">
                    <Grid item xs={12} sm={12} md={12}>
                      <FormLabel
                        title={t('label.product.vnd')}
                        name="vnd"
                        gutterBottom
                        // required
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12}>
                      {/* <ControllerTextField
                        name="vnd"
                        control={control}
                        placeholder={t('placeholder.vnd')}
                        disabled
                      /> */}
                      <TextField
                        disabled
                        value={Intl.NumberFormat('en').format(vndPrice)}
                        placeholder={t('placeholder.yen')}
                        fullWidth
                        sx={{
                          [`& .${inputBaseClasses.input}.${inputBaseClasses.disabled}`]:
                            {
                              WebkitTextFillColor: 'black',
                            },
                        }}
                      />
                    </Grid>
                  </Grid>
                  <Grid xs={12} sm={12} md={12} sx={{ mt: 0.5 }}>
                    <Divider
                      variant="fullWidth"
                      sx={{ borderColor: 'vShip.border.lightGray' }}
                    />
                  </Grid>
                </FormGroup>
              </Grid>
              <Grid item xs={12} sm={12} md={12}>
                <FormGroup>
                  <Grid container alignItems="center">
                    <Grid item xs={12} sm={12} md={12}>
                      <FormLabel
                        title={t('label.product.weight')}
                        name="weight"
                        gutterBottom
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12}>
                      <ControllerTextField
                        name="weight"
                        control={control}
                        placeholder={t('placeholder.weight')}
                      />
                    </Grid>
                  </Grid>
                  <Grid xs={12} sm={12} md={12} sx={{ mt: 0.5 }}>
                    <Divider
                      variant="fullWidth"
                      sx={{ borderColor: 'vShip.border.lightGray' }}
                    />
                  </Grid>
                </FormGroup>
              </Grid>
              <Grid item xs={12} sm={12} md={12}>
                <Button
                  size="large"
                  fullWidth
                  sx={{ backgroundColor: 'success.dark', mt: 3 }}
                  type="submit"
                >
                  <Typography variant="h6">{t('button.estimate')}</Typography>
                </Button>
              </Grid>
              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                sx={{
                  mt: 3,
                  minHeight: 40,
                }}
              >
                <TypographyWrap
                  sx={{
                    backgroundColor: 'vShip.border.main',
                    color: 'error.dark',
                    p: 3,
                    fontWeight: 'bold',
                  }}
                  align="center"
                  variant="h5"
                >
                  {Intl.NumberFormat('en').format(estimatePrice)}VND
                </TypographyWrap>
              </Grid>
            </Grid>
          </Form>
        </Grid>
      </Grid>
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { data } = await Product.getPriceRate().catch(() => {
    return { data: null };
  });

  return {
    props: {
      rate: data,
    },
  };
};

export default EstimatePrice;
