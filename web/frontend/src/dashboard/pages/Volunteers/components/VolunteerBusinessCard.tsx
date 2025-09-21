import * as React from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PrintIcon from '@mui/icons-material/Print';
import DownloadIcon from '@mui/icons-material/Download';
import QrCodeIcon from '@mui/icons-material/QrCode';
import { getDisplayName, getCityDisplayName, type Volunteer, type VolunteerType } from '../data/volunteers';

// Helper function to get volunteer type label
const getVolunteerTypeLabel = (type: VolunteerType) => {
  switch (type) {
    case 'toplama':
      return 'Toplama Gönüllüsü';
    case 'tasima':
      return 'Taşıma Gönüllüsü';
    case 'dagitim':
      return 'Dağıtım Gönüllüsü';
    case 'karma':
      return 'Karma Gönüllü';
    default:
      return type;
  }
};

// Simple QR Code component using a service (fallback until we add qrcode library)
const QRCodeDisplay: React.FC<{ data: string; size?: number }> = ({ data, size = 120 }) => {
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(data)}`;
  
  return (
    <Box
      component="img"
      src={qrUrl}
      alt="QR Code"
      sx={{
        width: size,
        height: size,
        border: '2px solid #e0e0e0',
        borderRadius: 1,
      }}
    />
  );
};

interface VolunteerBusinessCardProps {
  open: boolean;
  volunteer: Volunteer;
  onClose: () => void;
}

const VolunteerBusinessCard: React.FC<VolunteerBusinessCardProps> = ({
  open,
  volunteer,
  onClose,
}) => {
  const cardRef = React.useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = React.useState(false);

  // Generate QR code data with volunteer information - Simplified
  const qrData = React.useMemo(() => {
    const volunteerInfo = {
      name: getDisplayName(volunteer),
      phone: volunteer.telefon,
      email: volunteer.user?.email
    };
    
    // Simple contact format - easier to scan
    return `BEGIN:VCARD
VERSION:3.0
FN:${volunteerInfo.name}
TEL:${volunteerInfo.phone || ''}
EMAIL:${volunteerInfo.email || ''}
END:VCARD`;
  }, [volunteer]);

  const handlePrint = () => {
    if (cardRef.current) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        const cardHtml = cardRef.current.innerHTML;
        printWindow.document.write(`
          <html>
            <head>
              <title>Gönüllü Kartı - ${getDisplayName(volunteer)}</title>
              <style>
                body {
                  margin: 0;
                  padding: 20px;
                  font-family: 'Roboto', Arial, sans-serif;
                  background: white;
                }
                .business-card {
                  width: 85.6mm;
                  height: 53.98mm;
                  margin: 0 auto;
                  page-break-after: always;
                }
                @media print {
                  body { margin: 0; padding: 0; }
                  .business-card { margin: 0; }
                }
              </style>
            </head>
            <body>
              <div class="business-card">
                ${cardHtml}
              </div>
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  const handleDownload = async () => {
    if (cardRef.current && !isDownloading) {
      setIsDownloading(true);
      try {
        // Kısa bir bekleme süresi - DOM'un tamamen render olması için
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // html2canvas'ı lazy import et
        const { default: html2canvas } = await import('html2canvas');
        
        // Canvas oluştur - basit ayarlarla
        const canvas = await html2canvas(cardRef.current, {
          backgroundColor: '#1976d2', // Solid mavi arka plan
          scale: 2,
          useCORS: true,
          allowTaint: false,
          logging: false,
          width: 380,
          height: 228,
          x: 0,
          y: 0,
          scrollX: 0,
          scrollY: 0
        });
        
        // PNG olarak indir
        const link = document.createElement('a');
        link.download = `ayika-kartvizit-${volunteer.gonulluluk_no}.png`;
        link.href = canvas.toDataURL('image/png', 1.0);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
      } catch (error) {
        console.error('Kart indirilemedi:', error);
        alert('Kart indirme işlemi başarısız oldu. Lütfen yazdırma seçeneğini kullanın.');
      } finally {
        setIsDownloading(false);
      }
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 3,
        }
      }}
    >
      <DialogTitle>
        <Stack direction="row" alignItems="center" spacing={1}>
          <QrCodeIcon color="primary" />
          <Typography variant="h6">Gönüllü Kartı</Typography>
        </Stack>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ py: 2 }}>
        <Stack spacing={2} alignItems="center">

          {/* Business Card Preview */}
          <Card
            ref={cardRef}
            elevation={12}
            data-testid="business-card"
            sx={{
              width: '380px',
              height: '228px',
              background: `linear-gradient(135deg, #1976d2 0%, #1565c0 100%)`,
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
              borderRadius: 3,
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            }}
          >
            <CardContent sx={{ height: '100%', p: 2.5, position: 'relative', zIndex: 1 }}>
              <Stack height="100%" spacing={1}>
                {/* Top Row - Brand + Volunteer ID */}
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Box>
                    <Typography 
                      variant="h4" 
                      fontWeight="700" 
                      sx={{ 
                        fontSize: '1.4rem',
                        textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                        letterSpacing: '0.3px',
                        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif'
                      }}
                    >
                      Ayika
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        opacity: 0.9,
                        fontSize: '0.68rem',
                        letterSpacing: '0.1px',
                        fontWeight: 400,
                        lineHeight: 1.2
                      }}
                    >
                      Acil Yardım ve İhtiyaç Koordinasyon Ağı
                    </Typography>
                  </Box>
                  
                  {/* Volunteer ID - Top Right */}
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      opacity: 0.9,
                      fontSize: '0.65rem',
                      fontWeight: 600,
                      bgcolor: 'rgba(255,255,255,0.15)',
                      px: 1,
                      py: 0.4,
                      borderRadius: 1.5,
                      letterSpacing: '0.3px'
                    }}
                  >
                    {volunteer.gonulluluk_no}
                  </Typography>
                </Stack>

                {/* Middle Row - Main Content */}
                <Stack direction="row" sx={{ flex: 1 }} spacing={2} alignItems="center">
                  {/* Left - Volunteer Info */}
                  <Stack spacing={0.8} sx={{ flex: 1 }}>
                    <Typography 
                      variant="h4" 
                      fontWeight="700"
                      sx={{ 
                        fontSize: '1.4rem',
                        lineHeight: 1.1,
                        textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                      }}
                    >
                      {getDisplayName(volunteer)}
                    </Typography>
                    
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        opacity: 0.95,
                        fontSize: '0.9rem',
                        fontWeight: 600
                      }}
                    >
                      {getVolunteerTypeLabel(volunteer.gonullu_tipi)}
                    </Typography>
                  </Stack>

                  {/* Right - QR Code */}
                  <Box
                    sx={{
                      p: 0.5,
                      bgcolor: 'white',
                      borderRadius: 2,
                      boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <QRCodeDisplay data={qrData} size={85} />
                  </Box>
                </Stack>

                {/* Bottom Row - Contact Info */}
                <Stack direction="row" justifyContent="space-between" alignItems="flex-end">
                  {/* Left - City */}
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      opacity: 0.8,
                      fontSize: '0.7rem',
                      fontWeight: 500,
                      color: 'rgba(255,255,255,0.8)'
                    }}
                  >
                    {getCityDisplayName(volunteer.sehir)}
                  </Typography>
                  
                  {/* Right - Phone */}
                  {volunteer.telefon && (
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        opacity: 0.8,
                        fontSize: '0.7rem',
                        fontWeight: 500,
                        color: 'rgba(255,255,255,0.8)'
                      }}
                    >
                      {volunteer.telefon.slice(0, 3)} {volunteer.telefon.slice(3, 6)} {volunteer.telefon.slice(6, 8)} {volunteer.telefon.slice(8, 10)}
                    </Typography>
                  )}
                </Stack>
              </Stack>
            </CardContent>
          </Card>

        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Stack direction="row" spacing={2} sx={{ width: '100%', justifyContent: 'center' }}>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleDownload}
            disabled={isDownloading}
            size="medium"
          >
            {isDownloading ? 'İndiriliyor...' : 'PNG İndir'}
          </Button>
          <Button
            variant="contained"
            startIcon={<PrintIcon />}
            onClick={handlePrint}
            size="medium"
          >
            Yazdır
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

export default VolunteerBusinessCard;
