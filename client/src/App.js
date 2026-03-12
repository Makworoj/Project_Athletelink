import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Athletes from './pages/Athletes';
import AthleteDetail from './pages/AthleteDetail';
import Scouts from './pages/Scouts';
import Opportunities from './pages/Opportunities';
import ScoutDetail from './pages/ScoutDetail';
import OpportunityDetail from './pages/OpportunityDetail';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-900 text-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/athletes" element={<Athletes />} />
          <Route path="/athletes/:id" element={<AthleteDetail />} />
          <Route path="/scouts" element={<Scouts />} />
          <Route path="/opportunities" element={<Opportunities />} />
          <Route path="/scouts/:id" element={<ScoutDetail />} />
          <Route path="/opportunities/:id" element={<OpportunityDetail />} />
          {/* more routes coming */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;