import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import DashboardPageLayout from '../../components/DashboardPageLayout';
import AppTheme from '../../../shared-theme/AppTheme';
import { dataGridCustomizations } from '../../theme/customizations';
import VolunteerList from './components/VolunteerList';


const Volunteers = () => {
  return (
    <AppTheme themeComponents={dataGridCustomizations}>
      <DashboardPageLayout
        title="Gönüllüler"
        description="Afet yardım koordinasyonunda görev alan gönüllülerin kayıt, yönetim ve koordinasyon sistemi. Gönüllülerin yeteneklerine göre görevlendirilmesi ve etkin katılımının sağlanması."
        icon={PeopleRoundedIcon}
      >
        <VolunteerList />
      </DashboardPageLayout>
    </AppTheme>
  );
};

export default Volunteers;
