import useAuth from 'hooks/useAuth';
import { useRouter } from 'next/router';
import { Fragment, useEffect, useState } from 'react';
import type { FCC } from 'types/react';

const PrivateRoute: FCC = (props) => {
  const { children } = props;
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    if (!isAuthenticated) {
      router.push('/auth/login');
    } else {
      setIsAuthorized(true);
    }
  }, [router, isAuthenticated]);

  if (!isAuthorized) {
    return null;
  }

  return <Fragment>{children}</Fragment>;
};

export default PrivateRoute;
