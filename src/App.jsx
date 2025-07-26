import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './component/header.jsx';
import './App.css';
import Dashboard from './component/homepage.jsx';
import ProductsPage from './component/product.jsx';
import OrdersPage from './component/order.jsx';
import ReportPage from './component/report.jsx';
<<<<<<< HEAD
import CustomersPage from './component/customer.jsx';
import LoginPage from './component/login.jsx';
import PrivateRoute from './component/protected_Routes.jsx';

function AppContent() {
  const location = useLocation();
  const hideSidebarRoutes = ['/'];

  const shouldHideSidebar = hideSidebarRoutes.includes(location.pathname);

  return (
    <div className='app-container'>
      {!shouldHideSidebar && (
        <div className="sidebar">
          <Header />
        </div>
      )}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/products"
            element={
              <PrivateRoute>
                <ProductsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/customers"
            element={
              <PrivateRoute>
                <CustomersPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <PrivateRoute>
                <OrdersPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <PrivateRoute>
                <ReportPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

=======
import Login from './component/login.jsx';
>>>>>>> 01ba024090ac85c7eb2a6b903c79cda9ac9d0515

function App() {
  return (
    <Router>
<<<<<<< HEAD
      <AppContent />
=======
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
>>>>>>> 01ba024090ac85c7eb2a6b903c79cda9ac9d0515
    </Router>
  );
}

export default App;
