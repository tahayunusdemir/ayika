import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ColorModeIconDropdown from '../ColorModeIconDropdown';
import Sitemark from './SitemarkIcon';
import { Link } from 'react-router-dom';

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexShrink: 0,
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: 'blur(24px)',
  border: '1px solid',
  borderColor: (theme.vars || theme).palette.divider,
  backgroundColor: theme.vars
    ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
    : alpha(theme.palette.background.default, 0.4),
  boxShadow: (theme.vars || theme).shadows[1],
  padding: '8px 12px',
}));

export default function AppAppBar() {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const scrollToSection = (sectionId: string) => {
    // If we're not on the home page, navigate to home page first
    if (window.location.pathname !== '/') {
      window.location.href = `/#${sectionId}`;
      return;
    }

    const element = document.getElementById(sectionId);
    if (element) {
      // Calculate target position with offset for fixed AppBar
      const targetPosition = element.offsetTop - 100;
      const startPosition = window.pageYOffset;
      const distance = targetPosition - startPosition;
      const duration = 800; // 800ms duration
      let start: number | null = null;

      // Easing function for smooth animation
      const easeInOutCubic = (t: number): number => {
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
      };

      // Animation function
      const animateScroll = (timestamp: number) => {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        const percentage = Math.min(progress / duration, 1);
        
        const easedPercentage = easeInOutCubic(percentage);
        const currentPosition = startPosition + (distance * easedPercentage);
        
        window.scrollTo(0, currentPosition);
        
        if (progress < duration) {
          requestAnimationFrame(animateScroll);
        }
      };

      requestAnimationFrame(animateScroll);
    }
    
    // Close mobile drawer if open
    if (open) {
      setOpen(false);
    }
  };

  return (
    <AppBar
      position="fixed"
      enableColorOnDark
      sx={{
        boxShadow: 0,
        bgcolor: 'transparent',
        backgroundImage: 'none',
        mt: 'calc(var(--template-frame-height, 0px) + 28px)',
      }}
    >
      <Container maxWidth="lg">
        <StyledToolbar variant="dense" disableGutters>
          <Box
            sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', px: 0, cursor: 'pointer' }}
          >
            <Sitemark to="/" />
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              <Button 
                variant="text" 
                color="info" 
                size="small"
                onClick={() => scrollToSection('features')}
              >
                Özellikler
              </Button>
              <Button 
                variant="text" 
                color="info" 
                size="small"
                onClick={() => scrollToSection('highlights')}
              >
                Öne Çıkanlar
              </Button>
              <Button 
                variant="text" 
                color="info" 
                size="small" 
                sx={{ minWidth: 0 }}
                onClick={() => scrollToSection('faq')}
              >
                S.S.S
              </Button>
              <Button 
                variant="text" 
                color="info" 
                size="small"
                onClick={() => window.open('https://forms.gle/SqSKAGdtF6CoU1Jd8', '_blank')}
              >
                Geri Bildirim
              </Button>
            </Box>
          </Box>
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              gap: 1,
              alignItems: 'center',
            }}
          >
            <Button
              component={Link}
              to="/sign-in"
              color="primary"
              variant="text"
              size="small"
            >
              Giriş yap
            </Button>
            <Button
              color="primary"
              variant="contained"
              size="small"
              onClick={() => window.open('https://forms.gle/VRahDyBZUA3cojZa6', '_blank')}
            >
              Gönüllü ol 💙
            </Button>
            <ColorModeIconDropdown />
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 1 }}>
            <ColorModeIconDropdown size="medium" />
            <IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="top"
              open={open}
              onClose={toggleDrawer(false)}
              PaperProps={{
                sx: {
                  top: 'var(--template-frame-height, 0px)',
                },
              }}
            >
              <Box sx={{ p: 2, backgroundColor: 'background.default' }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                  }}
                >
                  <IconButton onClick={toggleDrawer(false)}>
                    <CloseRoundedIcon />
                  </IconButton>
                </Box>

                <MenuItem onClick={() => scrollToSection('features')}>Özellikler</MenuItem>
                <MenuItem onClick={() => scrollToSection('highlights')}>Öne Çıkanlar</MenuItem>
                <MenuItem onClick={() => scrollToSection('faq')}>S.S.S</MenuItem>
                <MenuItem>
                  <Button
                    variant="text"
                    fullWidth
                    sx={{ textAlign: 'left', justifyContent: 'flex-start' }}
                    onClick={() => window.open('https://forms.gle/SqSKAGdtF6CoU1Jd8', '_blank')}
                  >
                    Geri Bildirim
                  </Button>
                </MenuItem>
                <Divider sx={{ my: 3 }} />
                <MenuItem>
                  <Button
                    color="primary"
                    variant="contained"
                    fullWidth
                    onClick={() => window.open('https://forms.gle/VRahDyBZUA3cojZa6', '_blank')}
                  >
                    Gönüllü ol 💙
                  </Button>
                </MenuItem>
                <MenuItem>
                  <Button
                    component={Link}
                    to="/sign-in"
                    color="primary"
                    variant="outlined"
                    fullWidth
                  >
                    Giriş yap
                  </Button>
                </MenuItem>
              </Box>
            </Drawer>
          </Box>
        </StyledToolbar>
      </Container>
    </AppBar>
  );
}
