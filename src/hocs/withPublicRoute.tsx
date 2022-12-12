import PublicRoute from 'components/PublicRoute';
import type { NextComponentType } from 'next';

const withPublicRoute = <P extends {}>(Component: NextComponentType) =>
  function EnhancedComponent(props: P) {
    return (
      <PublicRoute>
        <Component {...props} />
      </PublicRoute>
    );
  };

export default withPublicRoute;
