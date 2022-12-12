import PrivateRoute from 'components/PrivateRoute';
import type { NextComponentType } from 'next';

const withPrivateRoute = <P extends {}>(Component: NextComponentType) =>
  function EnhancedComponent(props: P) {
    return (
      <PrivateRoute>
        <Component {...props} />
      </PrivateRoute>
    );
  };

export default withPrivateRoute;
