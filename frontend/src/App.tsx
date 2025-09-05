import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MarketingPage from './marketing-page/MarketingPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MarketingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
