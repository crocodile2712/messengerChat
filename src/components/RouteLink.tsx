import MuiLink, { LinkProps as MuiLinkProps } from '@mui/material/Link';
import { styled } from '@mui/material/styles';
import NextLink, { LinkProps as NextLinkProps } from 'next/link';
import type { AnchorHTMLAttributes } from 'react';
import { forwardRef } from 'react';

// Add support for the sx prop for consistency with the other branches.
const Anchor = styled('a')({});

interface NextLinkComposedProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>,
    Omit<
      NextLinkProps,
      'href' | 'as' | 'onClick' | 'onMouseEnter' | 'onTouchStart'
    > {
  to: NextLinkProps['href'];
  linkAs?: NextLinkProps['as'];
}

const NextLinkComposed = forwardRef<HTMLAnchorElement, NextLinkComposedProps>(
  function NextLinkComposed(props, ref) {
    const { to, linkAs, replace, scroll, shallow, prefetch, locale, ...other } =
      props;

    return (
      <NextLink
        href={to}
        prefetch={prefetch}
        as={linkAs}
        replace={replace}
        scroll={scroll}
        shallow={shallow}
        passHref
        locale={locale}
      >
        <Anchor ref={ref} {...other} />
      </NextLink>
    );
  }
);

type LinkProps = {
  activeClassName?: string;
  as?: NextLinkProps['as'];
  href: NextLinkProps['href'];
  linkAs?: NextLinkProps['as']; // Useful when the as prop is shallow by styled().
} & Omit<NextLinkComposedProps, 'to' | 'linkAs' | 'href'> &
  Omit<MuiLinkProps, 'href'>;

// A styled version of the Next.js Link component:
// https://nextjs.org/docs/api-reference/next/link
const RouteLink = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  props,
  ref
) {
  const {
    as,
    href,
    linkAs: linkAsProp,
    locale,
    prefetch,
    replace,
    role, // Link don't have roles.
    scroll,
    shallow,
    ...other
  } = props;

  const linkAs = linkAsProp || as;
  const nextjsProps = {
    to: href,
    linkAs,
    replace,
    scroll,
    shallow,
    prefetch,
    locale,
  };

  return (
    <MuiLink
      component={NextLinkComposed}
      ref={ref}
      // underline="none"
      color="vShip.link.main"
      {...nextjsProps}
      {...other}
    />
  );
});

export { RouteLink as default, NextLinkComposed };
