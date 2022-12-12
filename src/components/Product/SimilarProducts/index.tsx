import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { useLayoutEffect, useState } from 'react';
import { getRelatedProducts } from 'services/new_products';
import type { Product, SearchProduct } from 'types/product';
import ProductCard from './ProductCard';

interface Props {
  products: SearchProduct[];
  watchedProductIds: string[];
}

const SimilarProducts = (props: Props) => {
  const { products, watchedProductIds } = props;
  const [pageNumber, setPageNumber] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [similarProducts, setSimilarProducts] = useState<Product[]>(products);

  const handleLoadMoreProduct = async () => {
    try {
      setLoading(true);

      const nextProductId = watchedProductIds[pageNumber];
      const nextPageNumber = pageNumber + 1;

      if (!nextProductId) {
        return;
      }

      setPageNumber(nextPageNumber);

      const { data } = await getRelatedProducts(nextProductId);

      pageYOffset = window.pageYOffset;

      setSimilarProducts((state) => state.concat(data || []));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  let pageYOffset = window.pageYOffset;

  useLayoutEffect(() => {
    window.scroll({ top: pageYOffset });
  }, [products, pageYOffset]);

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', flexDirection: 'column', mt: 3 }}>
        <Typography variant="h6" sx={{ ml: 1.5, textTransform: 'uppercase' }}>
          Sản phẩm tương tự
        </Typography>
        <Divider variant="fullWidth" sx={{ mb: 2 }} />
        <Box
          sx={{
            display: 'grid',
            gap: 1.5,
            gridTemplateColumns: {
              xs: 'repeat(2, minmax(0, 1fr))',
              sm: 'repeat(3, minmax(0, 1fr))',
              md: 'repeat(auto-fill, minmax(min(100%, 170px), 1fr))',
            },
          }}
        >
          {similarProducts.map((product, i) => (
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

export default SimilarProducts;
