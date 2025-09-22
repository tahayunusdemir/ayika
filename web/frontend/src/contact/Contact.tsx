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
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from '@mui/material/styles';
import AppTheme from '../shared-theme/AppTheme';
import AppAppBar from '../shared-theme/components/AppAppBar';
import { turkishCities } from '../dashboard/pages/Shipments/data/cities';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: {
    maxWidth: '600px',
  },
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const ContactContainer = styled(Stack)(({ theme }) => ({
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

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

// İletişim kategorileri
const CONTACT_CATEGORIES = [
  { value: 'genel', label: 'Genel Bilgi' },
  { value: 'gonulluluk', label: 'Gönüllülük' },
  { value: 'yardim', label: 'Yardım Talebi' },
  { value: 'bagis', label: 'Bağış' },
  { value: 'teknik', label: 'Teknik Destek' },
  { value: 'medya', label: 'Medya ve Basın' },
  { value: 'isbirligi', label: 'İş Birliği' },
  { value: 'sikayet', label: 'Şikayet ve Öneri' }
];

export default function Contact(props: { disableCustomTheme?: boolean }) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [submitError, setSubmitError] = React.useState('');
  const [isSuccess, setIsSuccess] = React.useState(false);
  
  // Form field errors
  const [categoryError, setCategoryError] = React.useState(false);
  const [categoryErrorMessage, setCategoryErrorMessage] = React.useState('');
  const [nameError, setNameError] = React.useState(false);
  const [nameErrorMessage, setNameErrorMessage] = React.useState('');
  const [surnameError, setSurnameError] = React.useState(false);
  const [surnameErrorMessage, setSurnameErrorMessage] = React.useState('');
  const [phoneError, setPhoneError] = React.useState(false);
  const [phoneErrorMessage, setPhoneErrorMessage] = React.useState('');
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [cityError, setCityError] = React.useState(false);
  const [cityErrorMessage, setCityErrorMessage] = React.useState('');
  const [subjectError, setSubjectError] = React.useState(false);
  const [subjectErrorMessage, setSubjectErrorMessage] = React.useState('');
  const [messageError, setMessageError] = React.useState(false);
  const [messageErrorMessage, setMessageErrorMessage] = React.useState('');
  
  // Form values
  const [category, setCategory] = React.useState('');
  const [city, setCity] = React.useState('');
  const [kvkkAccepted, setKvkkAccepted] = React.useState(false);
  const [uploadedFile, setUploadedFile] = React.useState<File | null>(null);
  
  // Dialog states
  const [kvkkDialogOpen, setKvkkDialogOpen] = React.useState(false);

  const validateInputs = () => {
    const name = document.getElementById('name') as HTMLInputElement;
    const surname = document.getElementById('surname') as HTMLInputElement;
    const phone = document.getElementById('phone') as HTMLInputElement;
    const email = document.getElementById('email') as HTMLInputElement;
    const subject = document.getElementById('subject') as HTMLInputElement;
    const message = document.getElementById('message') as HTMLTextAreaElement;

    let isValid = true;

    // Category validation
    if (!category) {
      setCategoryError(true);
      setCategoryErrorMessage('Kategori seçimi zorunludur.');
      isValid = false;
    } else {
      setCategoryError(false);
      setCategoryErrorMessage('');
    }

    // Name validation
    if (!name.value || name.value.trim().length < 2) {
      setNameError(true);
      setNameErrorMessage('İsim en az 2 karakter olmalıdır.');
      isValid = false;
    } else {
      setNameError(false);
      setNameErrorMessage('');
    }

    // Surname validation
    if (!surname.value || surname.value.trim().length < 2) {
      setSurnameError(true);
      setSurnameErrorMessage('Soyisim en az 2 karakter olmalıdır.');
      isValid = false;
    } else {
      setSurnameError(false);
      setSurnameErrorMessage('');
    }

    // Phone validation
    if (!phone.value || !/^5\d{9}$/.test(phone.value)) {
      setPhoneError(true);
      setPhoneErrorMessage('Telefon numarası 5XXXXXXXXX formatında olmalıdır.');
      isValid = false;
    } else {
      setPhoneError(false);
      setPhoneErrorMessage('');
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

    // City validation
    if (!city) {
      setCityError(true);
      setCityErrorMessage('Şehir seçimi zorunludur.');
      isValid = false;
    } else {
      setCityError(false);
      setCityErrorMessage('');
    }

    // Subject validation
    if (!subject.value || subject.value.trim().length < 3) {
      setSubjectError(true);
      setSubjectErrorMessage('Konu en az 3 karakter olmalıdır.');
      isValid = false;
    } else {
      setSubjectError(false);
      setSubjectErrorMessage('');
    }

    // Message validation
    if (!message.value || message.value.trim().length < 10) {
      setMessageError(true);
      setMessageErrorMessage('Mesaj en az 10 karakter olmalıdır.');
      isValid = false;
    } else {
      setMessageError(false);
      setMessageErrorMessage('');
    }

    // KVKK validation
    if (!kvkkAccepted) {
      setSubmitError('KVKK onayı zorunludur.');
      isValid = false;
    }

    if (isValid) {
      setSubmitError('');
    }

    return isValid;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (10MB = 10 * 1024 * 1024 bytes)
      if (file.size > 10 * 1024 * 1024) {
        setSubmitError('Dosya boyutu 10MB\'dan büyük olamaz.');
        return;
      }
      setUploadedFile(file);
      setSubmitError('');
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (!validateInputs()) {
      return;
    }

    setIsLoading(true);
    setSubmitError('');

    try {
      // Google Forms integration would go here
      // For now, simulate form submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsSuccess(true);
      setSubmitError('');
      
    } catch (error) {
      console.error('Contact form error:', error);
      setSubmitError('Mesaj gönderilirken bir hata oluştu. Lütfen tekrar deneyiniz.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <AppAppBar />
      <ContactContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
          >
            İletişim Formu
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Bizimle iletişime geçmek için aşağıdaki formu doldurunuz. En kısa sürede size dönüş yapacağız.
          </Typography>
          
          {submitError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {submitError}
            </Alert>
          )}
          
          {isSuccess && (
            <Alert severity="success" sx={{ mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                Mesajınız başarıyla gönderildi!
              </Typography>
              <Typography variant="body2">
                En kısa sürede size dönüş yapacağız. Teşekkür ederiz.
              </Typography>
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
                {/* İsim Soyisim */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth>
                    <FormLabel htmlFor="name">İsim *</FormLabel>
                    <TextField
                      error={nameError}
                      helperText={nameErrorMessage}
                      id="name"
                      name="name"
                      placeholder="Ahmet"
                      required
                      fullWidth
                      variant="outlined"
                      color={nameError ? 'error' : 'primary'}
                      disabled={isLoading}
                    />
                  </FormControl>
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth>
                    <FormLabel htmlFor="surname">Soyisim *</FormLabel>
                    <TextField
                      error={surnameError}
                      helperText={surnameErrorMessage}
                      id="surname"
                      name="surname"
                      placeholder="Yılmaz"
                      required
                      fullWidth
                      variant="outlined"
                      color={surnameError ? 'error' : 'primary'}
                      disabled={isLoading}
                    />
                  </FormControl>
                </Grid>

                {/* Telefon - E-posta */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth>
                    <FormLabel htmlFor="phone">Telefon Numarası *</FormLabel>
                    <TextField
                      error={phoneError}
                      helperText={phoneErrorMessage}
                      id="phone"
                      name="phone"
                      placeholder="5551234567"
                      required
                      fullWidth
                      variant="outlined"
                      color={phoneError ? 'error' : 'primary'}
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

                {/* Şehir - boş alan */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth error={cityError}>
                    <FormLabel>Şehir *</FormLabel>
                    <Select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      displayEmpty
                      disabled={isLoading}
                    >
                      <MenuItem value="">
                        <em>Şehir seçiniz</em>
                      </MenuItem>
                      {turkishCities.map((cityItem) => (
                        <MenuItem key={cityItem.id} value={cityItem.name}>
                          {cityItem.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {cityError && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                        {cityErrorMessage}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  {/* Boş alan - şehir ile hizalamak için */}
                </Grid>

                {/* Kategori - Konu */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth error={categoryError}>
                    <FormLabel>Kategori *</FormLabel>
                    <Select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      displayEmpty
                      disabled={isLoading}
                    >
                      <MenuItem value="">
                        <em>Kategori seçiniz</em>
                      </MenuItem>
                      {CONTACT_CATEGORIES.map((cat) => (
                        <MenuItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {categoryError && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                        {categoryErrorMessage}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth>
                    <FormLabel htmlFor="subject">Konu *</FormLabel>
                    <TextField
                      error={subjectError}
                      helperText={subjectErrorMessage}
                      id="subject"
                      name="subject"
                      placeholder="Mesajınızın konusu"
                      required
                      fullWidth
                      variant="outlined"
                      color={subjectError ? 'error' : 'primary'}
                      disabled={isLoading}
                    />
                  </FormControl>
                </Grid>

                {/* Mesaj */}
                <Grid size={{ xs: 12 }}>
                  <FormControl fullWidth>
                    <FormLabel htmlFor="message">Mesaj *</FormLabel>
                    <TextField
                      error={messageError}
                      helperText={messageErrorMessage}
                      id="message"
                      name="message"
                      placeholder="Mesajınızı buraya yazınız..."
                      required
                      fullWidth
                      multiline
                      rows={2}
                      variant="outlined"
                      color={messageError ? 'error' : 'primary'}
                      disabled={isLoading}
                    />
                  </FormControl>
                </Grid>

                {/* Dosya Yükleme */}
                <Grid size={{ xs: 12 }}>
                  <FormControl fullWidth>
                    <FormLabel>Dosya Yükleme (İsteğe bağlı)</FormLabel>
                    <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                      {!uploadedFile ? (
                        <Button
                          component="label"
                          variant="outlined"
                          size="small"
                          startIcon={<CloudUploadIcon />}
                          disabled={isLoading}
                        >
                          Dosya Seç
                          <VisuallyHiddenInput
                            type="file"
                            onChange={handleFileUpload}
                            accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.txt"
                          />
                        </Button>
                      ) : (
                        <>
                          <AttachFileIcon color="primary" fontSize="small" />
                          <Typography variant="body2" sx={{ flex: 1 }}>
                            {uploadedFile.name} ({(uploadedFile.size / 1024 / 1024).toFixed(1)}MB)
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={handleRemoveFile}
                            disabled={isLoading}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </>
                      )}
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                      Max 10MB • JPG, PNG, PDF, DOC, TXT
                    </Typography>
                  </FormControl>
                </Grid>
              </Grid>

              {/* KVKK Onayı */}
              <FormControlLabel
                control={
                  <Checkbox
                    checked={kvkkAccepted}
                    onChange={(e) => setKvkkAccepted(e.target.checked)}
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
                      Ayika Kişisel Verilerin Korunması Politikası
                    </Link>
                    'nı okudum, kabul ediyorum. *
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
                {isLoading ? 'Gönderiliyor...' : 'Mesajı Gönder'}
              </Button>
            </Box>
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
      </ContactContainer>
    </AppTheme>
  );
}