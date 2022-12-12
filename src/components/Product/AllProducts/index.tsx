import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { useLayoutEffect, useState } from 'react';
import Product from 'services/product';
import type { SearchProduct } from 'types/product';
import ProductCard from './ProductCard';

interface Props {
  products: SearchProduct[];
}

const AllProducts = (props: Props) => {
  const { products: initialProducts } = props;
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [products, setProducts] = useState<SearchProduct[]>(initialProducts);

  let pageYOffset = window.pageYOffset;

  const handleLoadMoreProduct = async () => {
    try {
      setLoading(true);

      const nextPageNumber = pageNumber + 1;

      setPageNumber(nextPageNumber);

      const { data } = await Product.getProductRecommend({
        pageNumber: nextPageNumber,
        pageSize: 30,
      });

      pageYOffset = window.pageYOffset;

      setProducts((state) => state.concat(data || []));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useLayoutEffect(() => {
    window.scroll({ top: pageYOffset });
  }, [products, pageYOffset]);

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', flexDirection: 'column', mt: 3 }}>
        <Typography variant="h6" sx={{ ml: 1.5, textTransform: 'uppercase' }}>
          Gợi ý cho bạn
        </Typography>
        <Divider variant="fullWidth" sx={{ mb: 2 }} />
        <Box
          sx={{
            display: 'grid',
            gap: 1.5,
            gridTemplateColumns: {
              xs: 'repeat(2, minmax(0, 1fr))',
              sm: 'repeat(3, minmax(0, 1fr))',
              md: 'repeat(auto-fill, minmax(min(100%, 180px), 1fr))',
            },
          }}
        >
          {products.map((product, i) => (
            <ProductCard key={i} product={product} />
          ))}
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3.5, mb: 1 }}>
          <Button
            sx={{ width: { xs: void 0, md: 240 } }}
            onClick={handleLoadMoreProduct}
          >
            {loading ? 'Đang tải sản phẩm...' : 'Xem thêm sản phẩm'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default AllProducts;
