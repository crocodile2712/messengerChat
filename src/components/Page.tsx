import Head from 'next/head';
import { Fragment } from 'react';
import type { FCC } from 'types/react';

interface Props {
  title?: string;
}

const Page: FCC<Props> = (props) => {
  const { children, title = 'vShip' } = props;

  return (
    <Fragment>
      <Head>
        <title>{title}</title>
      </Head>
      {children}
    </Fragment>
  );
};

export default Page;
