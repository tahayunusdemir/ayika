import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CssBaseline from '@mui/material/CssBaseline';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import AppTheme from '../shared-theme/AppTheme';
import AppAppBar from '../shared-theme/components/AppAppBar';
import { turkishCities } from '../dashboard/pages/Shipments/data/cities';
import { useAuth } from '../contexts/AuthContext';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: {
    maxWidth: '500px',
  },
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const SignUpContainer = styled(Stack)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage:
      'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
      backgroundImage:
        'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}));

// Volunteer types - Backend ile uyumlu
const VOLUNTEER_TYPES = [
  { value: 'toplama', label: 'Toplama Gönüllüsü', description: 'Bulunduğu şehirde yardımları toplamak' },
  { value: 'tasima', label: 'Taşıma Gönüllüsü', description: 'Afet bölgesine yardımı ulaştırmak' },
  { value: 'dagitim', label: 'Dağıtım Gönüllüsü', description: 'Afet bölgesinde yardımları dağıtmak' },
  { value: 'karma', label: 'Karma Gönüllü', description: 'Tüm görevlerde yer almak' }
];


export default function SignUp(props: { disableCustomTheme?: boolean }) {
  const { signUp, isLoading } = useAuth();
  const [submitError, setSubmitError] = React.useState('');
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [redirectCountdown, setRedirectCountdown] = React.useState(5);
  
  // Form field errors
  const [adError, setAdError] = React.useState(false);
  const [adErrorMessage, setAdErrorMessage] = React.useState('');
  const [soyadError, setSoyadError] = React.useState(false);
  const [soyadErrorMessage, setSoyadErrorMessage] = React.useState('');
  const [sehirError, setSehirError] = React.useState(false);
  const [sehirErrorMessage, setSehirErrorMessage] = React.useState('');
  const [telefonError, setTelefonError] = React.useState(false);
  const [telefonErrorMessage, setTelefonErrorMessage] = React.useState('');
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const [passwordConfirmError, setPasswordConfirmError] = React.useState(false);
  const [passwordConfirmErrorMessage, setPasswordConfirmErrorMessage] = React.useState('');
  const [volunteerTypesError, setVolunteerTypesError] = React.useState(false);
  const [volunteerTypesErrorMessage, setVolunteerTypesErrorMessage] = React.useState('');
  
  // Form values
  const [sehir, setSehir] = React.useState('');
  const [volunteerType, setVolunteerType] = React.useState('');
  const [kvkkAccepted, setKvkkAccepted] = React.useState(false);
  const [volunteerRulesAccepted, setVolunteerRulesAccepted] = React.useState(false);
  
  // Dialog states
  const [kvkkDialogOpen, setKvkkDialogOpen] = React.useState(false);
  const [rulesDialogOpen, setRulesDialogOpen] = React.useState(false);


  const validateInputs = () => {
    const ad = document.getElementById('ad') as HTMLInputElement;
    const soyad = document.getElementById('soyad') as HTMLInputElement;
    const telefon = document.getElementById('telefon') as HTMLInputElement;
    const email = document.getElementById('email') as HTMLInputElement;
    const password = document.getElementById('password') as HTMLInputElement;
    const passwordConfirm = document.getElementById('password-confirm') as HTMLInputElement;

    let isValid = true;

    // Ad validation
    if (!ad.value || ad.value.trim().length < 2) {
      setAdError(true);
      setAdErrorMessage('Ad en az 2 karakter olmalıdır.');
      isValid = false;
    } else {
      setAdError(false);
      setAdErrorMessage('');
    }

    // Soyad validation
    if (!soyad.value || soyad.value.trim().length < 2) {
      setSoyadError(true);
      setSoyadErrorMessage('Soyad en az 2 karakter olmalıdır.');
      isValid = false;
    } else {
      setSoyadError(false);
      setSoyadErrorMessage('');
    }


    // Şehir validation
    if (!sehir) {
      setSehirError(true);
      setSehirErrorMessage('Şehir seçimi zorunludur.');
      isValid = false;
    } else {
      setSehirError(false);
      setSehirErrorMessage('');
    }

    // Telefon validation
    if (!telefon.value || !/^5\d{9}$/.test(telefon.value)) {
      setTelefonError(true);
      setTelefonErrorMessage('Telefon numarası 5XXXXXXXXX formatında olmalıdır.');
      isValid = false;
    } else {
      setTelefonError(false);
      setTelefonErrorMessage('');
    }

    // Email validation
    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage('Lütfen geçerli bir e-posta adresi giriniz.');
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }

    // Password validation
    if (!password.value) {
      setPasswordError(true);
      setPasswordErrorMessage('Şifre zorunludur.');
      isValid = false;
    } else if (password.value.length < 8 || 
               !/[a-z]/.test(password.value) || 
               !/[A-Z]/.test(password.value) || 
               !/\d/.test(password.value) || 
               !/[@$!%*?&]/.test(password.value)) {
      setPasswordError(true);
      setPasswordErrorMessage('Şifre gereksinimlerini karşılamıyor: En az 8 karakter • Büyük/küçük harf • Rakam • Özel işaret (@$!%*?&)');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    // Password confirmation validation
    if (!passwordConfirm.value) {
      setPasswordConfirmError(true);
      setPasswordConfirmErrorMessage('Şifre tekrarı zorunludur.');
      isValid = false;
    } else if (password.value !== passwordConfirm.value) {
      setPasswordConfirmError(true);
      setPasswordConfirmErrorMessage('Şifreler eşleşmiyor.');
      isValid = false;
    } else {
      setPasswordConfirmError(false);
      setPasswordConfirmErrorMessage('');
    }

    // Volunteer type validation
    if (!volunteerType) {
      setVolunteerTypesError(true);
      setVolunteerTypesErrorMessage('Gönüllü tipi seçimi zorunludur.');
      isValid = false;
    } else {
      setVolunteerTypesError(false);
      setVolunteerTypesErrorMessage('');
    }

    // KVKK validation
    if (!kvkkAccepted) {
      setSubmitError('KVKK onayı zorunludur.');
      isValid = false;
    }

    // Volunteer rules validation
    if (!volunteerRulesAccepted) {
      setSubmitError('Gönüllülük esasları onayı zorunludur.');
      isValid = false;
    }

    if (isValid) {
      setSubmitError('');
    }

    return isValid;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (!validateInputs()) {
      return;
    }

    setSubmitError('');

    const data = new FormData(event.currentTarget);
    const signUpData = {
      ad: data.get('ad') as string,
      soyad: data.get('soyad') as string,
      sehir: sehir, // Already in backend format from dropdown
      telefon: data.get('telefon') as string,
      email: data.get('email') as string,
      password: data.get('password') as string,
      password_confirm: data.get('password-confirm') as string,
      gonullu_tipi: volunteerType,
    };

    try {
      const response = await signUp(signUpData);
      
      if (response.success) {
        // Set success state
        setIsSuccess(true);
        setSubmitError('');
        
        // Start countdown and redirect
        let countdown = 5;
        setRedirectCountdown(countdown);
        
        const countdownInterval = setInterval(() => {
          countdown -= 1;
          setRedirectCountdown(countdown);
          
          if (countdown <= 0) {
            clearInterval(countdownInterval);
            window.location.href = '/sign-in';
          }
        }, 1000);
      } else {
        // Handle errors
        setSubmitError(response.message || 'Kayıt sırasında bir hata oluştu.');
        
        // Handle field-specific errors
        if (response.errors) {
          if (response.errors.ad) {
            setAdError(true);
            setAdErrorMessage(response.errors.ad[0]);
          }
          if (response.errors.soyad) {
            setSoyadError(true);
            setSoyadErrorMessage(response.errors.soyad[0]);
          }
          if (response.errors.email) {
            setEmailError(true);
            setEmailErrorMessage(response.errors.email[0]);
          }
          if (response.errors.telefon) {
            setTelefonError(true);
            setTelefonErrorMessage(response.errors.telefon[0]);
          }
          if (response.errors.password) {
            setPasswordError(true);
            setPasswordErrorMessage(response.errors.password[0]);
          }
          if (response.errors.password_confirm) {
            setPasswordConfirmError(true);
            setPasswordConfirmErrorMessage(response.errors.password_confirm[0]);
          }
          if (response.errors.sehir) {
            setSehirError(true);
            setSehirErrorMessage(response.errors.sehir[0]);
          }
          if (response.errors.gonullu_tipi) {
            setVolunteerTypesError(true);
            setVolunteerTypesErrorMessage(response.errors.gonullu_tipi[0]);
          }
        }
      }
      
    } catch (error) {
      console.error('Sign up error:', error);
      setSubmitError('Kayıt sırasında bağlantı hatası oluştu. Lütfen tekrar deneyiniz.');
    }
  };

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <AppAppBar />
      <SignUpContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
          >
            Gönüllü Kayıt
          </Typography>
          {submitError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {submitError}
            </Alert>
          )}
          {isSuccess && (
            <Alert severity="success" sx={{ mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                Tebrikler! Gönüllü kaydınız başarıyla tamamlandı!
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Hesabınız oluşturuldu<br/>
                E-posta adresiniz sisteme kaydedildi<br/>
                Artık giriş yapabilirsiniz
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'success.dark', mb: 2 }}>
                Giriş sayfasına yönlendiriliyorsunuz... ({redirectCountdown} saniye)
              </Typography>
              <Button
                variant="contained"
                color="success"
                onClick={() => window.location.href = '/sign-in'}
                sx={{ mt: 1 }}
              >
                Hemen Giriş Yap
              </Button>
            </Alert>
          )}
          {!isSuccess && (
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                gap: 2,
              }}
            >
            <Grid container spacing={2}>
              {/* Ad Soyad - Yan yana */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <FormLabel htmlFor="ad">Ad *</FormLabel>
                  <TextField
                    error={adError}
                    helperText={adErrorMessage}
                    id="ad"
                    name="ad"
                    placeholder="Ahmet"
                    required
                    fullWidth
                    variant="outlined"
                    color={adError ? 'error' : 'primary'}
                    disabled={isLoading}
                  />
                </FormControl>
              </Grid>
              
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <FormLabel htmlFor="soyad">Soyad *</FormLabel>
                  <TextField
                    error={soyadError}
                    helperText={soyadErrorMessage}
                    id="soyad"
                    name="soyad"
                    placeholder="Yılmaz"
                    required
                    fullWidth
                    variant="outlined"
                    color={soyadError ? 'error' : 'primary'}
                    disabled={isLoading}
                  />
                </FormControl>
              </Grid>

              {/* Telefon - E-posta */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <FormLabel htmlFor="telefon">Telefon Numarası *</FormLabel>
                  <TextField
                    error={telefonError}
                    helperText={telefonErrorMessage}
                    id="telefon"
                    name="telefon"
                    placeholder="5551234567"
                    required
                    fullWidth
                    variant="outlined"
                    color={telefonError ? 'error' : 'primary'}
                    disabled={isLoading}
                    inputProps={{ maxLength: 10 }}
                    InputProps={{
                      startAdornment: (
                        <Typography variant="body1" sx={{ mr: 1, color: 'text.secondary' }}>
                          +90
                        </Typography>
                      ),
                    }}
                  />
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <FormLabel htmlFor="email">E-posta Adresi *</FormLabel>
                  <TextField
                    error={emailError}
                    helperText={emailErrorMessage}
                    id="email"
                    type="email"
                    name="email"
                    placeholder="ornek@email.com"
                    autoComplete="email"
                    required
                    fullWidth
                    variant="outlined"
                    color={emailError ? 'error' : 'primary'}
                    disabled={isLoading}
                  />
                </FormControl>
              </Grid>

              {/* Şifre - Şifre Tekrarı */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <FormLabel htmlFor="password">Şifre *</FormLabel>
                  <TextField
                    error={passwordError}
                    helperText={passwordErrorMessage}
                    id="password"
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    autoComplete="new-password"
                    required
                    fullWidth
                    variant="outlined"
                    color={passwordError ? 'error' : 'primary'}
                    disabled={isLoading}
                  />
                  {!passwordError && (
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, ml: 2 }}>
                      En az 8 karakter • Büyük/küçük harf • Rakam • Özel işaret (@$!%*?&)
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <FormLabel htmlFor="password-confirm">Şifre Tekrarı *</FormLabel>
                  <TextField
                    error={passwordConfirmError}
                    helperText={passwordConfirmErrorMessage}
                    id="password-confirm"
                    type="password"
                    name="password-confirm"
                    placeholder="••••••••"
                    autoComplete="new-password"
                    required
                    fullWidth
                    variant="outlined"
                    color={passwordConfirmError ? 'error' : 'primary'}
                    disabled={isLoading}
                  />
                </FormControl>
              </Grid>

              {/* Şehir - Gönüllü Tipi */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth error={sehirError}>
                  <FormLabel>Şehir *</FormLabel>
                  <Select
                    value={sehir}
                    onChange={(e) => setSehir(e.target.value)}
                    displayEmpty
                    disabled={isLoading}
                  >
                    <MenuItem value="">
                      <em>Şehir seçiniz</em>
                    </MenuItem>
                    {turkishCities.map((city) => {
                      const backendValue = city.name
                        .toLowerCase()
                        .replace(/ç/g, 'c')
                        .replace(/ğ/g, 'g')
                        .replace(/ı/g, 'i')
                        .replace(/ö/g, 'o')
                        .replace(/ş/g, 's')
                        .replace(/ü/g, 'u')
                        .replace(/â/g, 'a')
                        .replace(/î/g, 'i')
                        .replace(/û/g, 'u')
                        .replace(/\s+/g, '');
                      return (
                        <MenuItem key={city.id} value={backendValue}>
                          {city.name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                  {sehirError && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                      {sehirErrorMessage}
                    </Typography>
                  )}
                </FormControl>
              </Grid>


              {/* Gönüllü Tipi Dropdown */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth error={volunteerTypesError}>
                  <FormLabel>Gönüllü Tipi *</FormLabel>
                  <Select
                    value={volunteerType}
                    onChange={(e) => setVolunteerType(e.target.value)}
                    displayEmpty
                    disabled={isLoading}
                  >
                    <MenuItem value="">
                      <em>Gönüllü tipi seçiniz</em>
                    </MenuItem>
                    {VOLUNTEER_TYPES.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        <Box>
                          <Typography variant="body1">{type.label}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {type.description}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                  {volunteerTypesError && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                      {volunteerTypesErrorMessage}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
            </Grid>

            {/* Onay Kutuları */}
            
            <FormControlLabel
              control={
                <Checkbox
                  checked={kvkkAccepted && volunteerRulesAccepted}
                  onChange={(e) => {
                    setKvkkAccepted(e.target.checked);
                    setVolunteerRulesAccepted(e.target.checked);
                  }}
                  color="primary"
                  disabled={isLoading}
                />
              }
              label={
                <Typography variant="body2">
                  <Link 
                    component="button" 
                    variant="body2"
                    onClick={(e) => { e.preventDefault(); setKvkkDialogOpen(true); }}
                    sx={{ cursor: 'pointer' }}
                  >
                    KVKK
                  </Link>
                  'ni ve{' '}
                  <Link 
                    component="button" 
                    variant="body2"
                    onClick={(e) => { e.preventDefault(); setRulesDialogOpen(true); }}
                    sx={{ cursor: 'pointer' }}
                  >
                    Gönüllülük Esasları
                  </Link>
                  'nı okudum ve kabul ediyorum. *
                </Typography>
              }
              sx={{ mt: 2 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={20} /> : null}
              sx={{ mt: 2 }}
            >
              {isLoading ? 'Kayıt yapılıyor...' : 'Gönüllü Kaydı Yap'}
            </Button>
          </Box>
          )}
          {!isSuccess && (
            <Typography sx={{ textAlign: 'center', mt: 2 }}>
              Zaten hesabınız var mı?{' '}
              <Link
                href="/sign-in"
                variant="body2"
                sx={{ alignSelf: 'center' }}
              >
                Giriş Yap
              </Link>
            </Typography>
          )}
        </Card>
        
        {/* KVKK Dialog */}
        <Dialog
          open={kvkkDialogOpen}
          onClose={() => setKvkkDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            KVKK Onay Metni
            <IconButton
              aria-label="close"
              onClick={() => setKvkkDialogOpen(false)}
              sx={{ position: 'absolute', right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers sx={{ maxHeight: '70vh', overflow: 'auto' }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              KVKK KAPSAMINDA AYDINLATMA METNİ
            </Typography>
            <Typography paragraph>
              İşbu metin, 6698 sayılı Kişisel Verilerin Korunması Kanunu'nun ("KVKK") 10. maddesi ve Aydınlatma Yükümlülüğünün Yerine Getirilmesinde Uyulacak Usul ve Esaslar Hakkında Tebliğ uyarınca, veri sorumlusu sıfatıyla hareket eden Ayika Platfomu tarafından kişisel verilerinizin işlenmesine ilişkin olarak aydınlatma yükümlülüğünün yerine getirilmesi amacı ile hazırlanmıştır.
            </Typography>
            
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', mt: 2 }}>
              Hangi Kişisel Verilerinizi İşliyoruz?
            </Typography>
            <Typography paragraph>
              Ayika Platformu gönüllülerinin paylaşmasını talep etmiş olduğumuz veriler: Adı, Soyadı veya Unvanı, T.C. kimlik numarası, İmza, Adres bilgisi, E-posta adresi, Telefon numarası, Adli Sicil Kaydı, Sağlık Raporu bilgilerinin alınması gerekmektedir.
            </Typography>

            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', mt: 2 }}>
              Kişisel Verileriniz Neden İşlenir?
            </Typography>
            <Typography paragraph>
              Kişisel verileriniz, Ayika Platformu'nda yer alan amaçlar ve çalışma konuları doğrultusunda sağlanacak hizmetlerin yasal çerçevede tam ve zamanında sunulabilmesi, platformun gönüllüsü olmanız ve buna bağlı süreçlerin yürütülmesi amacıyla KVKK'nın 5. ve 6. maddelerinde belirtilen kişisel veri işleme şartları ve amaçları dâhilinde işlenecektir.
            </Typography>

            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', mt: 2 }}>
              İşlenen Veriler Kimlere Hangi Amaçla Aktarılabilir?
            </Typography>
            <Typography paragraph>
              İşlenen kişisel verileriniz, Ayika Platformu gönüllüsü olmanız ve buna bağlı süreçlerin yürütülmesi için Ayika, bağışçılarımız ve destekçilerimizin de dahil olduğu tedarikçiler, iş birliği yapılan kurumlar, kanunen yetkili kamu kurumları ve özel kişilere ve kişisel verilerinizin yeterli ve gerekli şekilde korunması ve dijital altyapıların işletilmesi için dijital araçlar, bilgi teknolojileri, sunucu ve sunucu hizmetleri güvenliği ile web sitesi alanında hizmet aldığımız şirketlere, belirtilen kişisel veri işleme şartları ve amaçları çerçevesinde KVKK'nın 8. ve 9. maddesi kapsamında aktarılabilecektir.
            </Typography>

            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', mt: 2 }}>
              Kişisel Veri Toplamanın Yöntemi ile Hukuki Sebebi Nedir?
            </Typography>
            <Typography paragraph>
              Kişisel verileriniz, her türlü sözlü, yazılı ya da elektronik ortamda, gönüllülük formu veya diğer bir yolla yukarıda yer verilen amaçlar doğrultusunda toplanmaktadır. Bu hukuki sebeple toplanan kişisel verileriniz kanunlarda açıkça öngörülmesi, bir sözleşmenin kurulması veya ifasıyla doğrudan doğruya ilgili olması kaydıyla, sözleşmenin taraflarına ait kişisel verilerin işlenmesinin gerekli olması, Ayika Platformu ve Ayika'nın hukuki yükümlülüğünü yerine getirebilmesi için zorunlu olması durumları da dahil KVKK'nın 5. ve 6. maddelerinde belirtilen kişisel veri işleme şartları ve amaçları kapsamında bu metnin ilk iki kısmında belirtilen amaçlarla da işlenebilmekte ve aktarılabilmektedir.
            </Typography>

            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', mt: 2 }}>
              Kişisel Veri Sahibinin Hakları Nelerdir?
            </Typography>
            <Typography paragraph>
              KVKK'nın "İstisnalar" başlıklı 28. maddesinde öngörülen haller saklı kalmak kaydıyla, KVVK'nın 11. maddesi çerçevesinde kişisel veri sahipleri Ayika Platformu'na başvurarak; Kişisel verilerinin işlenip işlenmediğini öğrenme, Kişisel verileri işlenmişse buna ilişkin bilgi talep etme, Kişisel verilerinin işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme, Yurt içinde veya yurt dışında kişisel verilerinin aktarıldığı üçüncü kişileri bilme, Kişisel verilerinin eksik veya yanlış işlenmiş olması hâlinde bunların düzeltilmesini isteme ve bu kapsamda yapılan işlemin kişisel verilerin aktarıldığı üçüncü kişilere bildirilmesini isteme, KVKK'ya ve ilgili diğer kanun hükümlerine uygun olarak işlenmiş olmasına rağmen, işlenmesini gerektiren sebeplerin ortadan kalkması hâlinde kişisel verilerinin silinmesini veya yok edilmesini isteme ve bu kapsamda yapılan işlemin kişisel verilerin aktarıldığı üçüncü kişilere bildirilmesini isteme, İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle kişinin kendisi aleyhine bir sonucun ortaya çıkmasına itiraz etme, Kişisel verilerin kanuna aykırı olarak işlenmesi sebebiyle zarara uğraması hâlinde zararın giderilmesini talep etme haklarına sahiptir.
            </Typography>

            <Typography paragraph>
              Yukarıda belirtilen haklarınızı kullanmak için talebinizi, yazılı veya Kişisel Verileri Koruma Kurulu'nun belirlediği diğer yöntemlerle Ayika Platformu'na iletebilirsiniz. Yapacağınız başvuru kapsamında kimliğinizi tespit edici gerekli bilgiler ile Kanun'un 11. maddesinde belirtilen haklardan kullanmayı talep ettiğiniz hakkınıza yönelik açıklamalarınızı içeren talebinizi "Levent Mahallesi, İstanbul" adresine bizzat elden iletebilir, noter kanalıyla veya "ayikadestek@gmail.com" e-posta adresi üzerinden gönderebilirsiniz. Başvurunuzda yer alan talepleriniz, talebin niteliğine göre en kısa sürede ve en geç otuz gün içinde Ayika Platformu tarafından ücretsiz olarak sonuçlandırılacaktır. Ancak işlemin, Ayika Platformu için ayrıca bir maliyet gerektirmesi halinde, Kişisel Verileri Koruma Kurulu tarafından belirlenen tarifedeki ücret alınacaktır.
            </Typography>

            <Typography paragraph sx={{ fontStyle: 'italic', mt: 3 }}>
              6698 sayılı Kişisel Verilerin Korunması Kanunu'nun "Veri Sorumlusunun Aydınlatma Yükümlülüğü" başlıklı 10. maddesi gereğince, kişisel verilerimin kim tarafından, hangi amaçla işleneceği, işlenen kişisel verilerin kimlere ve hangi amaçla aktarılabileceği, kişisel veri toplamanın yöntemi ve hukuki sebebi ve Kanun'un 11. maddesinde yer alan haklarım konusunda hazırlanan işbu "Bilgilendirme Metnini" okudum, anladım ve veri sorumlusu sıfatına sahip Ayika Platformu tarafından bu konuda detaylı olarak bilgilendirildim.
            </Typography>

            <Typography paragraph sx={{ fontWeight: 'bold' }}>
              Kişisel verilerimin işlenmesine dair metni okudum, onaylıyorum.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setKvkkDialogOpen(false)} variant="contained">
              Anladım
            </Button>
          </DialogActions>
        </Dialog>

        {/* Gönüllülük Esasları Dialog */}
        <Dialog
          open={rulesDialogOpen}
          onClose={() => setRulesDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            Gönüllülük Esasları
            <IconButton
              aria-label="close"
              onClick={() => setRulesDialogOpen(false)}
              sx={{ position: 'absolute', right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers sx={{ maxHeight: '70vh', overflow: 'auto' }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              GÖNÜLLÜLÜK ESASLARI
            </Typography>
            <Typography paragraph>
              Ayika Derneği Gönüllülerinin; Ayika Derneği'nin ("dernek" olarak anılacaktır) kuruluş ilkelerine, vizyonuna ve misyonuna uygun şekilde hareket ederek, gönüllük çalışmalarını gerçekleştirmek en temel amaçtır. Ayika olarak, tüm canlılar arasında dayanışma, saygı ve yardımlaşma ilkesini benimsiyoruz ve herkesi bu düşünceyle karşılıyoruz.
            </Typography>
            
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', mt: 2 }}>
              GÖNÜLLÜLÜK TAAHHÜTNAMESİ
            </Typography>
            <Typography paragraph>
              Yukarıda anılan amaçlar doğrultusunda Ayika gönüllüsü olarak;
            </Typography>
            
            <Typography component="ul" sx={{ pl: 2, mb: 2 }}>
              <li>Derneğe uyumlu olarak vizyon ve misyonuna aykırı etmeyeceğimi,</li>
              <li>Tüm canlıların ihtiyaçlarını herhangi bir ayrım gözetmeksizin karşılayarak, onlara yardımcı olmayı,</li>
              <li>Kişilerin dinine, diline, ırkına, yönelimlerine veya siyasi görüşlerine bakılmaksızın yardım etmeyi, onları anlamayı ve onlarla empati kurmayı,</li>
              <li>Kişileri ötekileştiren, ayrımcılığa yol açabilecek herhangi bir tartışmaya girmemeyi,</li>
              <li>Ayika gönüllüsü olduğumu belirttiğim hiçbir fiziksel veya sosyal platformda (Facebook, Twitter vb.) siyasi içerikli, din, dil, ırk konusunda ayrıştırıcı veya ötekileştirici paylaşımlar yapmamayı,</li>
              <li>Şehir içinde faaliyetlere katıldığımda Ayika gönüllüleri de dahil olmak üzere farklı sivil toplum kuruluşlarındaki gönüllülerle din, dil, yönelim, siyaset konularında herhangi bir ayrıştırıcı tartışmaya girmeyeceğimi ve fiziksel ya da sözlü şiddete başvurmayacağımı,</li>
              <li>Ayika üyeleri, görevlileri ve diğer gönüllülerle uyum içinde çalışıp, ekip çalışmalarına destek vereceğimi,</li>
              <li>Dernek tanıtım toplantılarına ve gönüllü eğitimlerine katılım sağlayacağımı,</li>
              <li>Gönüllü çalışmalarında süreklilik gösterip, zaman planlamasına uyacağımı,</li>
              <li>Gönüllü çalışmalarında Ayika Derneği tarafından belirlenen ilke ve kurallara uyacağımı,</li>
              <li>Ayika adını kullanarak kişisel çıkar sağlamayacağımı, hediye ve adıma bağış kabul etmeyeceğimi,</li>
              <li>Ayika toplantılarına, organizasyonlara ve gönüllü seminerlerine katılacağımı, katılamayacağım durumlarda önceden bilgi vereceğimi,</li>
              <li>Gönüllü Bilgi Forumu'nda verdiğim bilgilerin doğru, eksiksiz ve gerçeğe uygun olduğunu,</li>
              <li>Türkiye Cumhuriyeti devleti aleyhinde faaliyette bulunmadığımı ve yüz kızartıcı bir suçtan ceza almadığımı,</li>
              <li>Kendime, gönüllülere ve ihtiyaç sahiplerine zarar verebilecek, bilinmesi, önlem alınması, izlenmesi gereken herhangi bir sağlık sorunum olmadığını ve olduğu takdirde derneğe bildirimde bulunacağımı,</li>
              <li>Ayika faaliyetlerinde etkin iletişim kurulabilmesi için kayıtlarda yer alan herhangi bir kişisel verimde değişiklik olması halinde en kısa sürede ilgili birime bildirimde bulunacağımı,</li>
              <li>Ayika Derneği bünyesindeki faaliyetler ile ilgili bilgilerin ve çeşitli duyuruların e-posta ile veya kısa mesaj (SMS) olarak tarafına ulaştırılmasını kabul ettiğimi,</li>
              <li>Ayika Derneği gönüllülük faaliyetleri ve bunlara hazırlık esnasında, dernek ilke ve amaçlarına uygun olmak ve bu doğrultuda kullanılmak koşuluyla, çekilmiş olan fotoğraflarının kullanılması ve saklanmasına rıza gösterdiğimi,</li>
              <li>Ayika Derneği bünyesindeki faaliyetler ile ilgili bilgilerin ve çeşitli duyuruların telefon, çağrı merkezleri, faks, akıllı ses kaydedici sistemler, elektronik posta, kısa mesaj gibi vasıtalar kullanılarak elektronik ortamda tarafına ulaştırılmasını önceden kabul ettiğimi ve bu konuda gerekli izni verdiğimi,</li>
              <li>Dernek çalışanlarına, gönüllülerine ve ihtiyaç sahiplerine ilişkin kişisel veri, bilgi ya da görsellerin gizliliğine azami düzeyde riayet edeceğimi bu kişisel veri, bilgi ve görselleri (fotoğraf, video, ses vb.) üçüncü kişilerle, hizmet sağlayıcıları ile yetkili kurum ve kuruluşlarla ve sosyal medya vb. mecralarda paylaşmayacağımı, açık rıza alınmamış ve tarafıma açıkça yetki verilmemiş hiçbir kişisel veri, bilgi ya da görseli işlemeyeceğimi ve kullanmayacağımı,</li>
              <li>Gönüllülüğün ifası için zorunlu kişisel verilerimin Ayika Derneği tarafından işlenmesine izin verdiğimi ve rızam bulunduğunu,</li>
              <li>Ayika Derneği nezdindeki her türlü Kişisel Veriye ilişkin olarak, gönüllülük ilişkisi süresince ve gönüllülük ilişkisinin son bulmasını takiben de süresiz olarak Kişisel Verilerin Korunması Kanunu ve Kişisel Verilere ilişkin diğer mevzuata uygun davrandığımı ve davranacağımı,</li>
              <li>Kişisel verilere bağlı ihlalleri nedeniyle derneğin şahsıma rücu etme hakkının bulunduğunu ve iş bu Taahhütnameye aykırılıktan dolayı derneğin uğrayacağı her türlü zarardan sorumlu olacağımı,</li>
              <li>Ayika etkinlikleri kapsamında tarafımca kayda alınan ya da tarafıma ait fotoğraf, video, ses ve benzeri görsel ya da işitsel materyalin Ayika kurumsal iletişim organlarında (dergi, web sitesi, sosyal medya, vd.) ya da çeşitli iletişim-tanıtım materyalleri ile faaliyetlerinde Ayika Derneği tarafından süresiz olarak kullanımına izin verdiğimi ve bu konuda herhangi bir bedel talep etmediğimi,</li>
              <li>Gönüllülük görevlerinin uygulanmasında karşılaşılan her türlü sorun ve sıkıntıda, öncelikle sorumlu dernek çalışanlarıyla iletişime geçerek çözüm bulmak amacıyla ortak hareket edeceğimi,</li>
              <li>Dernek, dernek çalışanları, üyeleri, gönüllüleri, bağışçıları, sponsorları ve ihtiyaç sahipleri ile bursiyerleri hakkında elde edilen bilgileri hiçbir koşulda amaç dışında kullanmamayı, kopyalamamayı ve saklamamayı, üçüncü kişiler ve kamu ile paylaşmamayı,</li>
              <li>Gönüllü çalışmam sırasında eylemlerim nedeniyle maddi ya da manevi, doğrudan ya da dolaylı herhangi bir zarara uğrarsam veya dernek, dernek çalışanları, üyeleri, gönüllüler ya da 3. kişiler nezdinde herhangi bir maddi ya da manevi zarara sebep olursam, her türlü zarardan şahsi olarak sorumlu olduğumu,</li>
              <li>Eylemlerim nedeniyle bir ihlal gerçekleşmesi akabinde dernek adına idari, adli para cezası vb. kesilmesi durumunda derneğin tarafıma rücu hakkı olduğunu ve bu masrafları şahsen karşılayacağımı,</li>
              <li>Herhangi bir şekilde gönüllülüğün sona ermesi durumunda verilmiş ise kimlik kartı ve hizmette kullanılmak üzere verilen tüm malzemeleri iade etmeyi,</li>
            </Typography>

            <Typography paragraph sx={{ fontWeight: 'bold', mt: 3 }}>
              Yukarıda kabul beyan ve taahhüt etmiş olduğum hususlara aykırı hareket etmem halinde Ayika Derneği gönüllülüğümün sonlanacağını kabul beyan ve taahhüt ederim.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setRulesDialogOpen(false)} variant="contained">
              Anladım
            </Button>
          </DialogActions>
        </Dialog>
      </SignUpContainer>
    </AppTheme>
  );
}
