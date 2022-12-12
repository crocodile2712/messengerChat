import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import TypographyWrap from 'components/TypographyWrap';
import useAuth from 'hooks/useAuth';
import useShoppingCart from 'hooks/useShoppingCart';
import { useEffect } from 'react';
import Currency from 'utils/Currency';
import LocalStorage from 'utils/LocalStorage';

const BuyItemsTable = () => {
  const { buyItems, setBuyItems } = useShoppingCart();

  useEffect(() => {
    const bItems = LocalStorage.get('buy-items');

    if (buyItems.length === 0) {
      setBuyItems(bItems || []);
    }
    // eslint-disable-next-line
  }, []);

  const { priceRate } = useShoppingCart();
  const { user } = useAuth();

  return (
    <Accordion elevation={0}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 0 }}>
        <Typography variant="h6">
          Sản phẩm đã chọn ({buyItems?.length} sản phẩm)
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ p: { xs: 0 } }}>
        <TableContainer component={Paper} elevation={9} sx={{ maxHeight: 500 }}>
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: 'black',
                  color: 'common.white',
                }}
              >
                <TableCell align="center" sx={{ color: 'common.white' }}>
                  STT
                </TableCell>
                <TableCell align="center" sx={{ color: 'common.white' }}>
                  Tên sản phẩm
                </TableCell>
                <TableCell align="center" sx={{ color: 'common.white' }}>
                  Tiền sản phẩm
                </TableCell>
                <TableCell align="center" sx={{ color: 'common.white' }}>
                  Phí thanh toán
                </TableCell>
                <TableCell align="center" sx={{ color: 'common.white' }}>
                  Phí vShip
                </TableCell>
                <TableCell align="center" sx={{ color: 'common.white' }}>
                  Phí vận chuyển
                </TableCell>
                <TableCell align="center" sx={{ color: 'common.white' }}>
                  Tổng tiền
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {buyItems?.map((item, index) => (
                <TableRow key={index}>
                  <TableCell align="center">{index + 1}</TableCell>
                  <TableCell align="center" sx={{ minWidth: 200 }}>
                    {item?.name}
                  </TableCell>
                  <TableCell align="center" sx={{ minWidth: 180 }}>
                    <TypographyWrap variant="body2" align="right">
                      {Currency.templatePriceVI(item?.price * priceRate)} VND
                    </TypographyWrap>
                    <TypographyWrap variant="body2" align="right">
                      {Currency.templatePriceVI(item?.price)} JPY
                    </TypographyWrap>
                  </TableCell>
                  <TableCell align="center" sx={{ minWidth: 180 }}>
                    <TypographyWrap variant="body2" align="right">
                      {Currency.templatePriceVI(100 * priceRate)} VND
                    </TypographyWrap>
                    <TypographyWrap variant="body2" align="right">
                      {Currency.templatePriceVI(100)} JPY
                    </TypographyWrap>
                  </TableCell>
                  <TableCell align="center" sx={{ minWidth: 150 }}>
                    <TypographyWrap variant="body2" align="right">
                      {Currency.calculateVShipFeeVN(
                        item?.price,
                        user?.feeRatio || null,
                        priceRate
                      )}{' '}
                      VND
                    </TypographyWrap>
                    <TypographyWrap variant="body2" align="right">
                      {Currency.calculateVShipFeeJA(
                        item?.price,
                        user?.feeRatio || null,
                        priceRate
                      )}{' '}
                      JPY
                    </TypographyWrap>
                  </TableCell>
                  <TableCell align="center" sx={{ minWidth: 150 }}>
                    Người bán chịu
                  </TableCell>
                  <TableCell align="center" sx={{ minWidth: 150 }}>
                    <TypographyWrap variant="body2" align="right">
                      {Currency.calculateTotalPriceProductVI(
                        item?.price,
                        user?.feeRatio || null,
                        priceRate
                      )}{' '}
                      VND
                    </TypographyWrap>
                    <TypographyWrap variant="body2" align="right">
                      {Currency.calculateTotalPriceProductJA(
                        item?.price,
                        user?.feeRatio || null,
                        priceRate
                      )}{' '}
                      JPY
                    </TypographyWrap>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </AccordionDetails>
    </Accordion>
  );
};

export default BuyItemsTable;
