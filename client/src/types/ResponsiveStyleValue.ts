import type { Breakpoint } from '@mui/material';

// from '@mui/material/esm/Grid/Grid.d.ts'
type ResponsiveStyleValue<T> =
  | T
  | Array<T | null>
  | { [key in Breakpoint]?: T | null };

export default ResponsiveStyleValue;
