import '../styles/globals.css';
import { ToastProvider } from '../components/ui/use-toast';

function MyApp({ Component, pageProps }) {
  return (
    <ToastProvider>
      <Component {...pageProps} />
    </ToastProvider>
  );
}

export default MyApp;