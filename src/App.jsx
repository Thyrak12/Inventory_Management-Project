import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './component/header.jsx';
import './App.css';
import Dashboard from './component/homepage.jsx';
import ProductsPage from './component/product.jsx';
import OrdersPage from './component/order.jsx';
import ReportPage from './component/report.jsx';
import Login from './component/login.jsx';
import CustomersPage from './component/customer.jsx';

function App() {
  return (
    <Router>
      <div className='app-container'>
        <div className="sidebar">
          <Header />
        </div>
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/customers" element={<CustomersPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/reports" element={<ReportPage />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;