import UserProfileLayout from 'layouts/UserProfile';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Form from 'components/Form/Form';
import FormGroup from 'components/Form/FormGroup';
import Grid from '@mui/material/Grid';
import FormLabel from 'components/Form/FormLabel';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import ControllerDatePicker from 'components/Form/ControllerDatePicker';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { styled } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import transaction from 'services/transaction';
import type {
  SearchTransactionParams,
  TransactionItem,
} from 'types/transaction';
import LinearProgress from '@mui/material/LinearProgress';
import DateFns from 'utils/DateFns';
import Pagination from '@mui/material/Pagination';
import type { ChangeEvent } from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import { useTranslation } from 'react-i18next';
import useNotification from 'hooks/useNotification';
import getMessageError from 'utils/controlMessage';
import useAuth from 'hooks/useAuth';

interface FormValue {
  from: Date | null;
  to: Date | null;
}

const validationSchema = yup.object().shape({
  from: yup.date().nullable().typeError('schema.validDate').default(null),
  to: yup.date().nullable().typeError('schema.validDate').default(null),
});

const TransactionPage = () => {
  const { control, handleSubmit, setError } = useForm<FormValue>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
    defaultValues: validationSchema.getDefault(),
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [transactionList, setTransactionList] = useState<TransactionItem[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [search, setSearch] = useState<SearchTransactionParams>({
    from: '',
    to: '',
    pageNumber: 1,
    pageSize: 10,
  });
  const { t } = useTranslation();
  const setNotification = useNotification();
  const { user, refetch } = useAuth();

  useEffect(() => {
    transaction
      .searchTransaction(search)
      .then((res) => {
        if (res.httpStatusCode === '200' && res.data) {
          setTransactionList(res.data);
          setTotal(res?.additionalInfo?.totalRecord ?? 0);
        } else {
          setTransactionList([]);
          setTotal(0);
        }
      })
      .catch((err) => {
        const message = getMessageError(err) || 'message.systemError';
        setNotification({
          error: t(message),
        });
        setTransactionList([]);
        setTotal(0);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [search, setNotification, t]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleChangePage = (event: ChangeEvent<unknown>, value: number) => {
    setSearch({
      ...search,
      pageNumber: value,
    });
  };

  const handleChangeDate = (data: FormValue) => {
    const { from, to } = data;
    if (from && to && from > to) {
      setError('from', {
        type: 'custome',
        message: t('schema.fromDateHigherThanToDate'),
      });
      return;
    }
    setSearch({
      ...search,
      from: from ? new Date(from.setHours(0, 0, 0, 0)).toISOString() : null,
      to: to ? new Date(to.setHours(23, 59, 59, 999)).toISOString() : null,
      pageNumber: 1,
    });
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
            flexDirection: { xs: 'column', sm: 'row' },
          }}
        >
          <Typography variant="h6">{t('title.transactionAmount')}</Typography>
          <Typography variant="h6" sx={{ color: 'vShip.text.lightBlue' }}>
            {user ? new Intl.NumberFormat('en').format(user.cashAmount) : 0} VND
          </Typography>
        </Box>
        <Box>
          <Typography variant="h6">{t('title.transactionInfo')}</Typography>
          <Box sx={{ px: 4 }}>
            <Typography variant="body1">
              {t('label.transactionInfo.stk')}
            </Typography>
            <Typography variant="body1">
              {t('label.transactionInfo.name')}
            </Typography>
            <Typography variant="body1">
              {t('label.transactionInfo.bank')}
            </Typography>
            <Typography variant="body1">
              {t('label.transactionInfo.note')}
            </Typography>
          </Box>
        </Box>
        <Divider sx={{ my: 1 }} />
        <Box>
          <Typography variant="h6">{t('title.transactionHistory')}</Typography>
        </Box>
        <Box sx={{ my: 1 }}>
          <Form
            noValidate
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              flexDirection: { xs: 'column', md: 'row' },
            }}
            onSubmit={handleSubmit(handleChangeDate)}
            autoComplete="off"
          >
            <FormGroup>
              <Grid container spacing={1}>
                <Grid item xs={12} sm={12} md={3}>
                  <FormLabel
                    title={t('label.fromDate')}
                    name={'from'}
                    gutterBottom
                    sx={{ mt: 1, display: 'block' }}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={9}>
                  <ControllerDatePicker
                    control={control}
                    name={'from'}
                    TextFieldProps={{ placeholder: 'dd/mm/yyyy' }}
                  />
                </Grid>
              </Grid>
            </FormGroup>
            <FormGroup sx={{ mt: 0 }}>
              <Grid container spacing={1}>
                <Grid item xs={12} sm={12} md={3}>
                  <FormLabel
                    title={t('label.toDate')}
                    name={'to'}
                    gutterBottom
                    sx={{ mt: 1, display: 'block' }}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={9}>
                  <ControllerDatePicker
                    control={control}
                    name={'to'}
                    TextFieldProps={{ placeholder: 'dd/mm/yyyy' }}
                  />
                </Grid>
              </Grid>
            </FormGroup>
            <Box sx={{ mt: { xs: 1, md: 0 } }}>
              <LoadingButton
                color="inherit"
                type="submit"
                loading={loading}
                size={'large'}
              >
                {t('button.search')}
              </LoadingButton>
            </Box>
          </Form>
        </Box>
        <Box sx={{ mt: 3 }}>
          <TableContainer>
            <Table
              size="small"
              sx={{ minHeight: 387, minWidth: 700, width: 1 }}
            >
              <TableHead>
                <StyledTableRow>
                  <TableCell align="center">
                    {t('label.transactionTable.stt')}
                  </TableCell>
                  <TableCell align="center">
                    {t('label.transactionTable.date')}
                  </TableCell>
                  <TableCell align="center">
                    {t('label.transactionTable.transactionNote')}
                  </TableCell>
                  <TableCell align="center">
                    {t('label.transactionTable.transactionAmount')}
                  </TableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <StyledTableRow>
                    <TableCell align="center" colSpan={4}>
                      <LinearProgress />
                    </TableCell>
                  </StyledTableRow>
                ) : transactionList.length > 0 ? (
                  transactionList.map((transaction, index) => (
                    <StyledTableRow key={transaction.id} sx={{ minHeight: 32 }}>
                      <TableCell align="center">
                        {(search.pageNumber - 1) * search.pageSize + index + 1}
                      </TableCell>
                      <TableCell align="center">
                        {DateFns.format(
                          new Date(transaction.createdAt),
                          'dd/MM/yyyy'
                        )}
                      </TableCell>
                      <TableCell align="center">{transaction.note}</TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          color:
                            transaction.type === 0
                              ? 'secondary.main'
                              : 'error.main',
                        }}
                      >
                        {`${
                          transaction.type === 0 ? '+' : '-'
                        } ${new Intl.NumberFormat('en').format(
                          transaction.amount
                        )}`}
                      </TableCell>
                    </StyledTableRow>
                  ))
                ) : (
                  <StyledTableRow>
                    <TableCell align="center" colSpan={4}>
                      {t('title.noData')}
                    </TableCell>
                  </StyledTableRow>
                )}
                {transactionList.length > 0 &&
                  Array.from({
                    length: search.pageSize - transactionList.length,
                  }).map((_, i) => (
                    <StyledTableRow key={i} sx={{ height: 34 }}>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                    </StyledTableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            mt: 5,
            flexDirection: { xs: 'column', md: 'row' },
          }}
        >
          <Box
            sx={{
              mr: { xs: 0, md: 2 },
              mt: { xs: 2, md: 0 },
            }}
          >
            <Typography variant="body2">
              {total > 0
                ? `${(search.pageNumber - 1) * search.pageSize + 1} - ${
                    total > (search.pageNumber - 1) * search.pageSize + 10
                      ? (search.pageNumber - 1) * search.pageSize + 10
                      : total
                  } ${t('title.outOfTotal')} ${total}`
                : `0 - 0 ${t('title.outOfTotal')} 0`}
            </Typography>
          </Box>
          <Pagination
            count={total > 0 ? Math.ceil(total / search.pageSize) : 0}
            showFirstButton
            showLastButton
            onChange={handleChangePage}
            page={search.pageNumber}
          />
        </Box>
      </Container>
    </UserProfileLayout>
  );
};

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(even)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&::last-child td, &::last-child th': {
    border: 0,
  },
}));

export default TransactionPage;
