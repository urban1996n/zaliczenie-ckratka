import { Outlet } from 'react-router-dom';
import { HealthStatus } from './components/HealthStatus/HealthStatus';
import { Layout } from './components/Layout';
import './App.css';

function App() {
  return (
    <Layout>
      <h1>Budget Planner</h1>
      <HealthStatus />
      <Outlet />
    </Layout>
  );
}

export default App;
