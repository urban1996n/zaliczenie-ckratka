import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Entries } from './pages/Entries';
import { Categories } from './pages/Categories';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/entries" element={<Entries />} />
          <Route path="/categories" element={<Categories />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
