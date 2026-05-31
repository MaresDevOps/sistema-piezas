import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Providers
import { AuthProvider } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import { CartProvider } from './context/CartContext';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AuthModal from './components/layout/AuthModal';
import CartDrawer from './components/layout/CartDrawer';
import CheckoutModal from './components/layout/CheckoutModal';

// Pages
import Catalogo from './pages/Catalogo';
import ProductDetail from './pages/ProductDetail';
import Profile from './pages/Profile';
import PCBuilder from './pages/PCBuilder';
import Rastreo from './pages/Rastreo';
import Facturacion from './pages/Facturacion';
import MisCompras from './pages/MisCompras';

// Admin Pages
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import AdminOrders from './pages/admin/Orders';
import AdminUsers from './pages/admin/Users';

// Helper component to render layout wrapper
function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-300 font-sans selection:bg-cyan-500/30 flex flex-col">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12 relative z-10 w-full flex-grow">
        {children}
      </main>
      <Footer />
      
      {/* Global Modals & Drawers */}
      <AuthModal />
      <CartDrawer />
      <CheckoutModal />

      <Toaster 
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#151C2C',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            fontSize: '12px',
            fontWeight: 'bold'
          },
        }}
      />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <CartProvider>
          <BrowserRouter>
            <AppLayout>
              <Routes>
                <Route path="/" element={<Catalogo />} />
                <Route path="/producto/:id" element={<ProductDetail />} />
                <Route path="/perfil" element={<Profile />} />
                <Route path="/builder" element={<PCBuilder />} />
                <Route path="/rastreo" element={<Rastreo />} />
                <Route path="/facturacion" element={<Facturacion />} />
                <Route path="/mis-compras" element={<MisCompras />} />
                
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="orders" element={<AdminOrders />} />
                  <Route path="users" element={<AdminUsers />} />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AppLayout>
          </BrowserRouter>
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  );
}

export default App;
