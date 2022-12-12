import { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { useTranslation } from 'react-i18next';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import MinimizeIcon from '@mui/icons-material/Minimize';
import NumberInput from 'components/Form/NumberInput';
import InputAdornment from '@mui/material/InputAdornment';
import CategoryMenu from './CategoryMenu';
import type { ParsedUrlQuery } from 'querystring';
import type { ChangeEvent, ClickEvent } from 'types/react';
import useNotification from 'hooks/useNotification';
import isString from 'lodash.isstring';
import sortBy from 'lodash.sortby';
import type { SeachProductParams } from 'types/product';
import filter from 'lodash.filter';
import LocalStorage from 'utils/LocalStorage';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { PRODUCT_STATUS } from 'constant/common';
import useCategory from 'hooks/useCategory';

interface SearchMenuBarProps {
  query: ParsedUrlQuery;
  onChangeCategory: (value: string, idTrack: string[]) => void;
  onChangePrice: (value: {
    priceFrom: number | null;
    priceTo: number | null;
  }) => void;
  search: SeachProductParams;
  onChangeStatus: (value: number) => void;
}

const SearchMenuBar = (props: SearchMenuBarProps) => {
  const { query, onChangeCategory, onChangePrice, search, onChangeStatus } =
    props;
  const { t } = useTranslation();
  const { categoryList } = useCategory();
  const [yenPrice, setYenPrice] = useState<{
    priceFrom: number | null;
    priceTo: number | null;
  }>({ priceFrom: null, priceTo: null });
  const setNotification = useNotification();
  const categoryTrack = LocalStorage.get('categoryTrack');

  useEffect(() => {
    setYenPrice({
      priceFrom: search.priceFrom,
      priceTo: search.priceTo,
    });
  }, [search]);

  const checkQuery = (id: string, category?: string | string[]) => {
    if (category) {
      if (isString(category)) {
        return category === id;
      } else {
        return category.includes(id);
      }
    }
    return false;
  };

  const handleChangePrice: ChangeEvent = (e) => {
    setYenPrice({
      ...yenPrice,
      [e.target.name]: e.target.value ? parseInt(e.target.value) : null,
    });
  };

  const applyPriceChange: ClickEvent = (e) => {
    e.preventDefault();
    if (
      yenPrice.priceFrom &&
      yenPrice.priceTo &&
      yenPrice.priceFrom > yenPrice.priceTo
    ) {
      setNotification({
        error: t('message.maxPriceHigherThanMinPrice'),
      });
    } else {
      onChangePrice(yenPrice);
    }
  };

  const handleChangeStatus: ChangeEvent = (e) => {
    onChangeStatus(parseInt(e.target.value));
  };

  return (
    <Container
      maxWidth="s300"
      disableGutters
      sx={{
        p: 2.5,
        backgroundColor: 'background.paper',
        position: 'relative',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          backgroundColor: 'vShip.border.lightBlue',
          width: 1,
          left: 0,
          top: 0,
          color: 'primary.contrastText',
          textAlign: 'center',
          p: 1.5,
          display: { sx: 'block', md: 'none' },
        }}
      >
        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
          Lọc sản phẩm
        </Typography>
      </Box>

      <Typography
        variant="body1"
        sx={{ width: 1, fontWeight: 'bold', mt: { xs: 5, md: 0 } }}
      >
        {t('label.category')}
      </Typography>

      {categoryList &&
        categoryList[0]?.length > 0 &&
        sortBy(
          filter(categoryList[0], (category) => {
            // const forcus = LocalStorage.get('categoryForcus');
            if (categoryTrack?.length > 0) {
              return category.id === categoryTrack[0];
            }
            return true;
          }),
          (category) => {
            return parseInt(category.displayOrder);
          }
        ).map((category) => (
          <CategoryMenu
            id={category.id}
            name={category.name}
            key={category.id}
            defaultOpen={checkQuery(category.id, query?.category)}
            onChangeCategory={onChangeCategory}
            idTrack={[]}
            query={query}
          />
        ))}

      <Divider variant="fullWidth" sx={{ mt: 2, mb: 2 }} />
      <Typography variant="body1" sx={{ width: 1, fontWeight: 'bold' }}>
        {t('label.priceFilterRangeYen')}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          py: 1.25,
        }}
      >
        <NumberInput
          id="priceFrom"
          name="priceFrom"
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">JPY</InputAdornment>
            ),
          }}
          placeholder={'Từ'}
          onChange={handleChangePrice}
          value={yenPrice.priceFrom ?? ''}
        />
        <MinimizeIcon />
        <NumberInput
          id="priceTo"
          name="priceTo"
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">JPY</InputAdornment>
            ),
          }}
          placeholder={'Đến'}
          onChange={handleChangePrice}
          value={yenPrice.priceTo ?? ''}
        />
      </Box>
      <Button fullWidth color="inherit" onClick={applyPriceChange}>
        {t('button.apply')}
      </Button>
      <Divider variant="fullWidth" sx={{ mt: 2, mb: 2 }} />
      <FormControl>
        <FormLabel sx={{ color: 'neutral.900', fontWeight: 'bold' }}>
          {t('label.filterByStatus')}
        </FormLabel>
        <RadioGroup
          name="status"
          value={search.status}
          onChange={handleChangeStatus}
        >
          <FormControlLabel
            value={PRODUCT_STATUS.ON_SALE}
            control={<Radio />}
            label={t('label.onSale')}
          />
          <FormControlLabel
            value={PRODUCT_STATUS.SOLD_OUT}
            control={<Radio />}
            label={t('label.soldOut')}
          />
        </RadioGroup>
      </FormControl>

      {/* <Divider variant="fullWidth" sx={{ m: '20px 0 10px' }} />
      <Typography variant="body1" sx={{ width: '100%' }}>
        {t('label.priceFilterRangeVND')}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          p: '10px 0',
        }}
      >
        <NumberInput
          id="outlined-basic"
          variant="outlined"
          InputProps={{
            startAdornment: <InputAdornment position="start">đ</InputAdornment>,
          }}
          placeholder={'Từ'}
        />
        <MinimizeIcon />
        <NumberInput
          id="outlined-basic"
          variant="outlined"
          InputProps={{
            startAdornment: <InputAdornment position="start">đ</InputAdornment>,
          }}
          placeholder={'Đến'}
        />
      </Box>
      <Button variant="contained" fullWidth color="inherit">
        {t('button.apply')}
      </Button> */}
    </Container>
  );
};

export default SearchMenuBar;
