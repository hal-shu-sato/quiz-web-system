import { type LinkProps, Link as MuiLink } from '@mui/material';
import NextLink from 'next/link';

export default function Link({
  children,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  component,
  href,
  ...props
}: LinkProps) {
  if (!href) return null;

  return (
    <MuiLink component={NextLink} {...props} href={href} passHref>
      {children}
    </MuiLink>
  );
}
