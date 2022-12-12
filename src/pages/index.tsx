import Page from 'components/Page';
import AllProducts from 'components/Product/AllProducts';
import FeaturedProducts from 'components/Product/FeaturedProducts';
import SimilarProducts from 'components/Product/SimilarProducts';
import WatchedProducts from 'components/Product/WatchedProducts';
import BannerSlide from 'components/Slides/Banner';
import useAuth from 'hooks/useAuth';
import HomeLayout from 'layouts/Home';
import type { GetServerSideProps, NextPage } from 'next';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import banner from 'services/banner';
import { getRelatedProducts, getWatchedProducts } from 'services/new_products';
import product from 'services/product';
import type { BannerType } from 'types/banner';
import type { Product, SearchProduct } from 'types/product';

interface Props {
  outstandingProduct: Product[];
  activeBanners: BannerType[];
  allProduct: SearchProduct[];
}

const Home: NextPage<Props> = (props: Props) => {
  const { outstandingProduct, activeBanners, allProduct } = props;
  const { isAuthenticated } = useAuth();
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [watchedProducts, setWatchedProducts] = useState<Product[]>([]);
  const [watchedProductIds, setWatchedProductIds] = useState<string[]>([]);
  const [watchedProductId, setWatchedProductId] = useState<string | null>(null);

  const { t } = useTranslation();

  useEffect(() => {
    if (!isAuthenticated) return;
    getWatchedProducts()
      .then((response) => {
        const { data } = response;
        const products = data?.products || [];
        const [firstProductId, ...productIds] = products.map(
          (product) => product.id
        );

        setWatchedProducts(products);
        setWatchedProductId(firstProductId || null);
        setWatchedProductIds(productIds);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [isAuthenticated]);

  useEffect(() => {
    if (!watchedProductId) return;

    getRelatedProducts(watchedProductId)
      .then((response) => {
        const { data } = response;
        setSimilarProducts(data || []);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [watchedProductId]);

  return (
    <HomeLayout>
      <Page title={t('title.home')}>
        <BannerSlide banners={activeBanners} />
        {watchedProducts.length > 0 && (
          <WatchedProducts products={watchedProducts} />
        )}
        {similarProducts.length > 0 && (
          <SimilarProducts
            products={similarProducts}
            watchedProductIds={watchedProductIds}
          />
        )}
        <FeaturedProducts products={outstandingProduct} />
        <AllProducts products={allProduct} />
      </Page>
    </HomeLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const { data: activeBanners } = await banner.getActiveBanner();
  const { data: outstandingProduct } = await product
    .getOutstandingProduct({
      pageNumber: 1,
      pageSize: 100,
    })
    .catch(() => {
      return { data: [] };
    });

  const { data: allProduct } = await product
    .getProductRecommend({
      pageNumber: 1,
      pageSize: 60,
    })
    .catch(() => {
      return { data: [] };
    });

  return {
    props: {
      outstandingProduct,
      activeBanners,
      allProduct,
    },
  };
};

export default Home;
