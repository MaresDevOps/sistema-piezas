import React, { useEffect } from 'react';
import { ShieldCheck, BarChart3, Package, ListOrdered, Users } from 'lucide-react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useProducts } from '../../context/ProductContext';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';

export default function AdminLayout() {
  const { currentUser } = useAuth();
  const { products } = useProducts();
  const navigate = useNavigate();

  // Basic stats for the header
  const [totalOrders, setTotalOrders] = React.useState(0);
  const [totalSales, setTotalSales] = React.useState(0);

  useEffect(() => {
    if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'encargado')) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    const q = query(collection(db, 'orders'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let orders = 0;
      let sales = 0;
      snapshot.forEach(doc => {
        orders++;
        sales += (doc.data().total || 0);
      });
      setTotalOrders(orders);
      setTotalSales(sales);
    });
    return () => unsubscribe();
  }, []);

  if (!currentUser) return null;

  const links = [
    ...(currentUser.role === 'admin' ? [{ to: '/admin', end: true, label: 'Dashboard', icon: BarChart3 }] : []),
    { to: '/admin/products', label: 'Productos', icon: Package },
    ...(currentUser.role === 'admin' ? [
      { to: '/admin/orders', label: 'Pedidos', icon: ListOrdered },
      { to: '/admin/users', label: 'Usuarios', icon: Users }
    ] : [])
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Admin Header */}
      <div className="relative overflow-hidden rounded-3xl border border-purple-500/20 glass-panel p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/8 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="space-y-2">
          <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20">
            <ShieldCheck className="h-3 w-3 mr-1.5" /> PANEL DE ADMINISTRACIÓN
          </span>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white leading-none">
            CONTROL <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">NEXUS</span>
          </h1>
          <p className="text-slate-400 text-sm">Gestiona productos, inventario y órdenes en tiempo real.</p>
        </div>
        {/* Stats row */}
        <div className="flex gap-4 shrink-0 flex-wrap">
          <div className="bg-[#151C2C] border border-white/5 rounded-2xl px-5 py-4 text-center min-w-[90px]">
            <span className="text-2xl font-black text-white">{products.length}</span>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mt-0.5">Productos</p>
          </div>
          <div className="bg-[#151C2C] border border-white/5 rounded-2xl px-5 py-4 text-center min-w-[90px]">
            <span className="text-2xl font-black text-cyan-400">{totalOrders}</span>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mt-0.5">Pedidos</p>
          </div>
          <div className="bg-[#151C2C] border border-white/5 rounded-2xl px-5 py-4 text-center min-w-[90px]">
            <span className="text-2xl font-black text-emerald-400">${totalSales.toFixed(0)}</span>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mt-0.5">Ventas</p>
          </div>
        </div>
      </div>

      {/* Sub-Tab navigation */}
      <div className="flex items-center space-x-2 border-b border-white/5 pb-0.5">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => `flex items-center space-x-2 px-5 py-2.5 rounded-t-lg text-xs font-bold transition-all border-b-2 ${
              isActive
                ? 'text-purple-300 border-purple-400 bg-purple-500/10'
                : 'text-slate-400 border-transparent hover:text-white hover:border-white/20'
            }`}
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>

      <div className="pt-2">
        <Outlet />
      </div>
    </div>
  );
}
