import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import MuiLink from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function FAQ() {
  const [expanded, setExpanded] = React.useState<string[]>([]);

  const handleChange =
    (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(
        isExpanded
          ? [...expanded, panel]
          : expanded.filter((item) => item !== panel),
      );
    };

  return (
    <Container
      id="faq"
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: { xs: 3, sm: 6 },
      }}
    >
      <Typography
        component="h2"
        variant="h4"
        sx={{
          color: 'text.primary',
          width: { sm: '100%', md: '60%' },
          textAlign: { sm: 'left', md: 'center' },
        }}
      >
        Sıkça Sorulan Sorular
      </Typography>
      <Box sx={{ width: '100%' }}>
        <Accordion
          expanded={expanded.includes('panel1')}
          onChange={handleChange('panel1')}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1d-content"
            id="panel1d-header"
          >
            <Typography component="span" variant="subtitle2">
              Ayika platformu nasıl çalışır ve afet durumunda nasıl kullanılır?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography
              variant="body2"
              gutterBottom
            >
              Ayika, afet anlarında yardım koordinasyonunu kolaylaştıran bir platformdur. Kullanıcılar mobil uygulama veya web sitesi üzerinden yardım talebinde bulunabilir, gönüllü olarak kayıt olabilir ve yardım malzemelerinin dağıtımını takip edebilir. GPS teknolojisi ile gerçek zamanlı konum takibi sağlanır.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded.includes('panel2')}
          onChange={handleChange('panel2')}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2d-content"
            id="panel2d-header"
          >
            <Typography component="span" variant="subtitle2">
              Gönüllü olarak nasıl kayıt olabilirim ve hangi görevleri yapabilirim?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography
              variant="body2"
              gutterBottom
            >
              Platform üzerinden kolayca gönüllü kaydı yapabilirsiniz. Yeteneklerinize ve konumunuza göre yardım toplama, dağıtım, lojistik destek, saha koordinasyonu gibi çeşitli görevlerde yer alabilirsiniz. Güvenlik doğrulaması sonrası görevlendirme yapılır.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded.includes('panel3')}
          onChange={handleChange('panel3')}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel3d-content"
            id="panel3d-header"
          >
            <Typography component="span" variant="subtitle2">
              Verilerim güvende mi? Hangi güvenlik önlemleri alınıyor?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography
              variant="body2"
              gutterBottom
            >
              Evet, verileriniz tamamen güvende. Güvenli şifreleme yöntemleri ile korunan iletişim sağlanır. Çok katmanlı güvenlik sistemi kullanılır ve tüm kişisel veriler en yüksek güvenlik standartlarında korunur.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded.includes('panel4')}
          onChange={handleChange('panel4')}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel4d-content"
            id="panel4d-header"
          >
            <Typography component="span" variant="subtitle2">
              Platform hangi afet türlerinde kullanılabilir?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography
              variant="body2"
              gutterBottom
            >
              Ayika platformu deprem, sel, yangın, heyelan gibi tüm doğal afetlerde kullanılabilir. Ayrıca büyük kazalar, salgın hastalıklar ve diğer acil durumlarda da yardım koordinasyonu için etkili bir şekilde kullanılabilir.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded.includes('panel5')}
          onChange={handleChange('panel5')}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel5d-content"
            id="panel5d-header"
          >
            <Typography component="span" variant="subtitle2">
              Proje hakkında daha fazla bilgi almak için kimle iletişime geçebilirim?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography
              variant="body2"
              gutterBottom
            >
              Ayika projesi hakkında detaylı bilgi almak için proje ekibiyle iletişime geçebilirsiniz. 
              <MuiLink href="mailto:ayikadestek@gmail.com"> ayikadestek@gmail.com</MuiLink> adresinden 
              veya ekip üyelerimizin LinkedIn profillerinden ulaşabilirsiniz.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Container>
  );
}
