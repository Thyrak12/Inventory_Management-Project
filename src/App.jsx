import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './component/header.jsx';
import './App.css';
import Dashboard from './component/homepage.jsx';
import ProductsPage from './component/product.jsx';
import OrdersPage from './component/order.jsx';
import ReportPage from './component/report.jsx';
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


function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
