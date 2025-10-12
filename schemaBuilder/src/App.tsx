import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/auth/Login';
import SignUp from './pages/auth/SignUp';
import Dashboard from './pages/user/Dashboard';
import Designer from './pages/user/Designer';
import Projects from './pages/user/Projects';
import Export from './pages/user/Export';
import SchemaViewer from './pages/user/SchemaViewer';
import Profile from './pages/user/Profile';
import Settings from './pages/user/Settings';
import './App.css';

function App() {
  const isAuthenticated = true;

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Full-screen Designer route (outside Layout) */}
          <Route path="/designer" element={isAuthenticated ? <Designer /> : <Navigate to="/login" />} />
          
          {/* Full-screen Schema Viewer route (outside Layout) */}
          <Route path="/export/:schemaId" element={isAuthenticated ? <SchemaViewer /> : <Navigate to="/login" />} />

          <Route path="/" element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="projects" element={<Projects />} />
            <Route path="export" element={<Export />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
