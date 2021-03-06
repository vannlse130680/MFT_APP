import React, { Fragment, useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import useRouter from 'utils/useRouter';

// Example of user roles: ['GUEST', 'USER', 'ADMIN'];

const AuthGuard = props => {
  const { roles, children } = props;

  const session = useSelector(state => state.session);
  const router = useRouter();

  useEffect(() => {
    if (
      router.history.location.pathname === '/auth/login' ||
      router.history.location.pathname === '/auth/register'
    )
      return;

    if (!sessionStorage.getItem('USER')) {
      router.history.push('/auth/login');
      return;
    }
    if (roles) {
      var role = JSON.parse(sessionStorage.getItem('USER')).role;
      console.log(roles);
      if (!roles.includes(role)) {
        router.history.push('/errors/error-401');
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return <Fragment>{children}</Fragment>;
};

AuthGuard.propTypes = {
  children: PropTypes.node
};

// AuthGuard.defaultProps = {
//   roles: []
// };

export default AuthGuard;
