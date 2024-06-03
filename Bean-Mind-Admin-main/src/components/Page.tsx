import { Helmet } from 'react-helmet-async';
import { forwardRef, ReactNode } from 'react';
// @mui
import { Box, BoxProps, Container, Stack, Typography } from '@mui/material';

// ----------------------------------------------------------------------

interface Props extends BoxProps {
  children: ReactNode;
  meta?: ReactNode;
  title: string;
  content?: ReactNode;
  actions?: () => ReactNode[];
  isTable?: boolean;
}
const Page = forwardRef<HTMLDivElement, Props>(
  ({ children, title = '', content, actions, meta, isTable, ...other }, ref) => (
    <>
      <Helmet>
        <title>{`${title} | Mentor-Mentee`}</title>
        {meta}
      </Helmet>

      <Box ref={ref} {...other}>
        {/* <Container maxWidth="lg" sx={{ mx: 'auto' }}> */}
        <Box pb={4}>
          <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
            {isTable && <Typography variant="h3">{title}</Typography>}
            <Stack direction="row" spacing={2}>
              {actions && actions()}
            </Stack>
          </Stack>
          {content}
        </Box>
        {children}
        {/* </Container> */}
      </Box>
    </>
  )
);

export default Page;
