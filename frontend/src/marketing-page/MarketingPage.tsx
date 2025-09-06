import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import AppTheme from '../shared-theme/AppTheme';
import AppAppBar from '../shared-theme/components/AppAppBar';
import Hero from './components/Hero';
import LogoCollection from './components/LogoCollection';
import Highlights from './components/Highlights';
import Features from './components/Features';
import FAQ from './components/FAQ';
import Footer from '../shared-theme/components/Footer';

export default function MarketingPage(props: { disableCustomTheme?: boolean }) {
  React.useEffect(() => {
    // Check for hash in URL and scroll to section
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          const targetPosition = element.offsetTop - 100;
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }, 500); // Small delay to ensure page is fully loaded
    }
  }, []);

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />

      <AppAppBar />
      <Hero />
      <div>
        <LogoCollection />
        <Features />
        <Divider />
        <Highlights />
        <Divider />
        <FAQ />
        <Divider />
        <Footer />
      </div>
    </AppTheme>
  );
}
