import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Pagination from '@mui/material/Pagination';
import Select from '@mui/material/Select';
import type { SelectChangeEvent } from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import Page from 'components/Page';
import SwiperSliceCard from 'components/Product/SwiperSliceCard';
import HomeLayout from 'layouts/Home';
import { Fragment, useEffect, useState } from 'react';
import { useRouter, withRouter } from 'next/router';
import type { NextRouter } from 'next/router';
import SearchMenuBar from '../../components/Search/MenuBar';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import RouteLink from 'components/RouteLink';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';
import product from 'services/product';
import type {
  CategorySearch,
  SeachProductParams,
  SearchProduct,
} from 'types/product';
import { PRODUCT_SORT } from 'constant/common';
import LinearProgress from '@mui/material/LinearProgress';
import { useTranslation } from 'react-i18next';
import LocalStorage from 'utils/LocalStorage';
import isString from 'lodash.isstring';
import isEmpty from 'lodash.isempty';
import type { ChangeEvent } from 'react';
import NoResult from 'components/NoResult';
import useCategory from 'hooks/useCategory';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface SearchResultProps {
  router: NextRouter;
}

const defaultSearch: SeachProductParams = {
  categoryIds: [],
  query: '',
  pageNumber: 0,
  pageSize: 100,
  priceFrom: null,
  priceTo: null,
  sortBy: 'created',
  sortDirection: 'DESC',
  status: 1,
};

const SearchResult = (props: SearchResultProps) => {
  const redirect = useRouter();
  const { router } = props;
  const [sort, setSort] = useState<string>('LATEST');
  const [products, setProducts] = useState<SearchProduct[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const { t } = useTranslation();
  const [categoryTrack, setCategoryTrack] = useState<string[]>(
    LocalStorage.get('categoryTrack')
  );
  const [search, setSearch] = useState<SeachProductParams>(defaultSearch);
  const { categoryList, getCategory } = useCategory();
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const theme = useTheme();
  const mediaMinMd = useMediaQuery(theme.breakpoints.up('md'));

  useEffect(() => {
    getCategory();
  }, [getCategory]);

  useEffect(() => {
    if (!isEmpty(router.query)) {
      fetchProduct({
        ...defaultSearch,
        categoryIds: router?.query?.category
          ? Array.isArray(router.query.category)
            ? router.query.category
            : [router.query.category]
          : [],
        query:
          router?.query?.name && isString(router.query.name)
            ? router.query.name
            : '',
        pageNumber:
          router?.query?.page && isString(router.query.page)
            ? parseInt(router.query.page)
            : 0,
        status:
          router?.query?.status && isString(router.query.status)
            ? parseInt(router.query.status)
            : 1,
        priceFrom:
          router?.query?.priceFrom && isString(router.query.priceFrom)
            ? parseInt(router.query.priceFrom)
            : null,
        priceTo:
          router?.query?.priceTo && isString(router.query.priceTo)
            ? parseInt(router.query.priceTo)
            : null,
        ...(router?.query?.sort && isString(router.query.sort)
          ? PRODUCT_SORT[router.query.sort]
          : PRODUCT_SORT['LATEST']),
      });
      setSearch({
        ...defaultSearch,
        categoryIds: router?.query?.category
          ? Array.isArray(router.query.category)
            ? router.query.category
            : [router.query.category]
          : [],
        query:
          router?.query?.name && isString(router.query.name)
            ? router.query.name
            : '',
        pageNumber:
          router?.query?.page && isString(router.query.page)
            ? parseInt(router.query.page)
            : 0,
        status:
          router?.query?.status && isString(router.query.status)
            ? parseInt(router.query.status)
            : 1,
        priceFrom:
          router?.query?.priceFrom && isString(router.query.priceFrom)
            ? parseInt(router.query.priceFrom)
            : null,
        priceTo:
          router?.query?.priceTo && isString(router.query.priceTo)
            ? parseInt(router.query.priceTo)
            : null,
        ...(router?.query?.sort && isString(router.query.sort)
          ? PRODUCT_SORT[router.query.sort]
          : PRODUCT_SORT['LATEST']),
      });
      setSort(
        router?.query?.sort && isString(router.query.sort)
          ? router.query.sort
          : 'LATEST'
      );
    }
    setCategoryTrack(LocalStorage.get('categoryTrack'));
  }, [router.query]); // eslint-disable-line

  const fetchProduct = (params: SeachProductParams) => {
    setLoading(true);
    product
      .searchProduct(params)
      .then((res) => {
        if (res.httpStatusCode === '200' && res.data) {
          setProducts(res.data);
          setTotal(res?.additionalInfo?.totalRecord);
        }
      })
      .catch((e) => {
        setProducts([]);
        setTotal(0);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSortChange = (event: SelectChangeEvent) => {
    setSort(event.target.value);
    redirect.push({
      pathname: '/search',
      query: {
        ...router.query,
        sort: event.target.value,
        page: 0,
      },
    });
  };

  const handleChangePage = (event: ChangeEvent<unknown>, value: number) => {
    redirect.push({
      pathname: '/search',
      query: {
        ...router.query,
        page: value - 1,
      },
    });
  };

  const handleChangeCategory = (value: string, idTrack: string[]) => {
    if (openMenu) {
      setOpenMenu(false);
    }
    LocalStorage.set('categoryTrack', idTrack);
    setSearch({
      ...defaultSearch,
      categoryIds: [value],
    });
    redirect.push({
      pathname: '/search',
      query: {
        ...router.query,
        name: null,
        category: [value],
      },
    });
  };

  const handleChangePrice = (value: {
    priceFrom: number | null;
    priceTo: number | null;
  }) => {
    if (openMenu) {
      setOpenMenu(false);
    }
    redirect.push({
      pathname: '/search',
      query: {
        ...router.query,
        ...value,
        page: 0,
      },
    });
  };

  const handleChangeStatus = (value: number) => {
    if (openMenu) {
      setOpenMenu(false);
    }
    redirect.push({
      pathname: '/search',
      query: {
        ...router.query,
        status: value,
        page: 0,
      },
    });
  };

  const handleRemoveCategoryTrack = (value: number) => () => {
    const tempTrack = LocalStorage.get('categoryTrack');
    LocalStorage.set('categoryTrack', tempTrack?.splice(0, value + 1));
  };

  const toggleOpenMenu = () => {
    setOpenMenu(!openMenu);
  };

  return (
    <HomeLayout>
      <Page title="Kết quả tìm kiếm">
        <Container
          maxWidth="lg"
          sx={{
            p: 2.25,
            display: 'flex',
            flexDirection: 'column',
            mt: { xs: 14, sm: 20 },
          }}
        >
          <Container>
            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
              <RouteLink
                href="/"
                sx={{ display: 'flex', alignItems: 'center' }}
                onClick={handleRemoveCategoryTrack(-1)}
              >
                <HomeIcon /> {t('label.home')}
              </RouteLink>
              {categoryList && categoryTrack && categoryTrack?.length > 0 ? (
                categoryTrack.map((id: string, index: number) => {
                  if (categoryList[index]?.length > 0) {
                    const cate = categoryList[index].find(
                      (item: CategorySearch) => item.id === id
                    );
                    if (cate) {
                      return (
                        <RouteLink
                          key={cate.id}
                          href={`/search?name=&category=${cate.id}`}
                          onClick={handleRemoveCategoryTrack(index)}
                        >
                          {cate.name}
                        </RouteLink>
                      );
                    }
                  }
                  return null;
                })
              ) : (
                <RouteLink
                  href={`/search?name=&category=`}
                  onClick={handleRemoveCategoryTrack(0)}
                >
                  {t('label.allCategory')}
                </RouteLink>
              )}
            </Breadcrumbs>
          </Container>

          <Container
            sx={{
              display: 'flex',
              flexDirection: 'row',
              pl: 0,
              pr: 0,
              mt: 2,
            }}
          >
            <Box
              maxWidth="s300"
              sx={{
                mr: 1,
                width: 1,
                display: { xs: 'none', md: 'block' },
              }}
            >
              <SearchMenuBar
                query={router.query}
                onChangeCategory={handleChangeCategory}
                onChangePrice={handleChangePrice}
                search={search}
                onChangeStatus={handleChangeStatus}
              />
            </Box>
            <Drawer
              sx={{ display: { sx: 'block', md: 'none' } }}
              open={!mediaMinMd && openMenu}
              onClose={toggleOpenMenu}
            >
              <SearchMenuBar
                query={router.query}
                onChangeCategory={handleChangeCategory}
                onChangePrice={handleChangePrice}
                search={search}
                onChangeStatus={handleChangeStatus}
              />
            </Drawer>

            <Container maxWidth="md" disableGutters>
              <Box
                sx={{
                  backgroundColor: 'background.paper',
                  p: 2.25,
                }}
              >
                <Box>
                  <Typography>
                    <Typography component="span" sx={{ fontWeight: 'bold' }}>
                      {total}
                    </Typography>
                    {' ' + t('label.searchResultFor')}{' '}
                    <Typography
                      component="span"
                      sx={{ color: 'vShip.link.main' }}
                    >
                      {'"'}
                      {router?.query?.name
                        ? router.query.name
                        : categoryList
                        ? categoryTrack.length > 0
                          ? categoryList[categoryTrack?.length - 1]?.find(
                              (category: CategorySearch) =>
                                category.id ===
                                categoryTrack[categoryTrack.length - 1]
                            )?.name
                          : t('label.allCategory')
                        : ''}
                      {'"'}
                    </Typography>
                  </Typography>
                </Box>
                <Divider />
                <Box
                  sx={{
                    display: 'flex',
                    mt: 1,
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 1,
                  }}
                >
                  <Box>
                    <IconButton
                      onClick={toggleOpenMenu}
                      sx={{ display: { sx: 'block', md: 'none' } }}
                    >
                      <FilterAltIcon />
                      {t('button.filter')}
                    </IconButton>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <Typography>{t('label.sortBy')}:</Typography>
                    <FormControl
                      sx={{ mr: 1, minWidth: 120, ml: 1 }}
                      size="small"
                    >
                      <Select
                        labelId="select-sort"
                        id="select-sort"
                        value={sort}
                        onChange={handleSortChange}
                      >
                        <MenuItem value={'PRICE_ASC'}>
                          {t('label.priceAsc')}
                        </MenuItem>
                        <MenuItem value={'PRICE_DESC'}>
                          {t('label.priceDesc')}
                        </MenuItem>
                        <MenuItem value={'LATEST'}>
                          {t('label.latest')}
                        </MenuItem>
                        <MenuItem value={'OLDEST'}>
                          {t('label.oldest')}
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}
                >
                  {loading ? (
                    <LinearProgress />
                  ) : (
                    <Fragment>
                      <Box
                        sx={{
                          display: 'grid',
                          gap: 2,
                          gridTemplateColumns:
                            products?.length > 0
                              ? 'repeat(auto-fill, minmax(min(100%, 130px), 1fr))'
                              : 'none',
                        }}
                      >
                        {products?.length > 0 ? (
                          products.map((product) => (
                            <Box key={product.id}>
                              <SwiperSliceCard item={product} />
                            </Box>
                          ))
                        ) : (
                          <NoResult
                            imageWidth={300}
                            message={
                              router?.query?.name ? (
                                <Fragment>
                                  {t('title.noResultForKey')}
                                  <Typography>{router?.query?.name}</Typography>
                                </Fragment>
                              ) : undefined
                            }
                          />
                        )}
                      </Box>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          mt: 5,
                        }}
                      >
                        <Pagination
                          count={
                            total > 0 ? Math.ceil(total / search.pageSize) : 0
                          }
                          showFirstButton
                          showLastButton
                          onChange={handleChangePage}
                          page={search.pageNumber + 1}
                        />
                      </Box>
                    </Fragment>
                  )}
                </Box>
              </Box>
            </Container>
          </Container>
        </Container>
      </Page>
    </HomeLayout>
  );
};

export default withRouter(SearchResult);
