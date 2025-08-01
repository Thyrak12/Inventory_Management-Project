import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import Header from './page/header.jsx';
import './App.css';
import Dashboard from './page/homepage.jsx';
import ProductsPage from './page/product.jsx';
import OrdersPage from './page/order.jsx';
import ReportPage from './page/report.jsx';
import LoginPage from './auth/login.jsx';
import PrivateRoute from './component/protected_Routes.jsx';
import AdminRoute from './auth/admin_Routes.jsx';
import StockPage from './page/stock.jsx';
import UserManage from './page/user_manage.jsx';

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
            path="/stock"
            element={
              <PrivateRoute>
                <StockPage />
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
            path="/users"
            element={
              <AdminRoute>
                <UserManage />
              </AdminRoute>
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


function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
