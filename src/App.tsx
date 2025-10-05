// import { Toaster } from '../components/ui/sonner';
import { Toaster } from 'sonner'; // If using the 'sonner' package from npm
// import { TooltipProvider } from '../components/ui/tooltip';
// If you are using a UI library like 'radix-ui', update the import as follows:
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import WeatherQuery from './pages/WeatherQuery';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/weather" element={<WeatherQuery />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
