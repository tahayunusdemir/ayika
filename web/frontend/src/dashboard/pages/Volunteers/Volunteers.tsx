import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import DashboardPageLayout from '../../components/DashboardPageLayout';
import AppTheme from '../../../shared-theme/AppTheme';
import { dataGridCustomizations } from '../../theme/customizations';
import VolunteerList from './components/VolunteerList';
import NotificationsProvider from './hooks/useNotifications/NotificationsProvider';
import DialogsProvider from './hooks/useDialogs/DialogsProvider';


const Volunteers = () => {
  return (
    <AppTheme themeComponents={dataGridCustomizations}>
      <NotificationsProvider>
        <DialogsProvider>
          <DashboardPageLayout
            title="Gönüllüler"
            description="Afet yardım koordinasyonunda görev alan gönüllülerin kayıt, yönetim ve koordinasyon sistemi. Gönüllülerin yeteneklerine göre görevlendirilmesi ve etkin katılımının sağlanması."
            icon={PeopleRoundedIcon}
          >
            <VolunteerList />
          </DashboardPageLayout>
        </DialogsProvider>
      </NotificationsProvider>
    </AppTheme>
  );
};

export default Volunteers;
