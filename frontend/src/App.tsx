import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MarketingPage from './marketing-page/MarketingPage';
import Blog from './blog/Blog';
import SignIn from './sign-in/SignIn';
import Dashboard from './dashboard/Dashboard';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MarketingPage />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
