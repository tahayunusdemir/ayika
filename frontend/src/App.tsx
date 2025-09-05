import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MarketingPage from './marketing-page/MarketingPage';
import Blog from './blog/Blog';
import CrudDashboard from './crud-dashboard/CrudDashboard';
import Dashboard from './dashboard/Dashboard';
import SignIn from './sign-in/SignIn';
import SignUp from './sign-up/SignUp';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MarketingPage />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/crud-dashboard/*" element={<CrudDashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
      </Routes>
    </Router>
  );
}

export default App;
