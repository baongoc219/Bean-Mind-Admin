// routes
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import MotionLazyContainer from './components/animate/MotionLazyContainer';
import { ChartStyle } from './components/chart';
import NotistackProvider from './components/NotistackProvider';
import { ProgressBarStyle } from './components/ProgressBar';
import ScrollToTop from './components/ScrollToTop';
// components
import ThemeSettings from './components/settings';
import Router from './routes';
// theme
import ThemeProvider from './theme';

// ----------------------------------------------------------------------

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MotionLazyContainer>
        <ThemeProvider>
          <ThemeSettings>
            <NotistackProvider>
              <ProgressBarStyle />
              <ChartStyle />
              <ScrollToTop />
              <Router />
            </NotistackProvider>
          </ThemeSettings>
        </ThemeProvider>
      </MotionLazyContainer>
      <ReactQueryDevtools initialIsOpen={false} position={'bottom-right'} />
    </QueryClientProvider>
  );
}
