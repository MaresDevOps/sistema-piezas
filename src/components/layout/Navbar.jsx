import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Cpu, 
  Compass, 
  Hammer, 
  Truck, 
  FileCheck, 
  History, 
  ShieldCheck, 
  ShoppingBag,
  ChevronDown,
  LogOut,
  User,
  Search
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export default function Navbar() {
  const { currentUser, setShowAuthModal, setAuthMode, handleLogout } = useAuth();
  const { cart, setIsCartOpen } = useCart();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  
  const location = useLocation();
  const navigate = useNavigate();
  
  const handleGlobalSearch = (e) => {
    e.preventDefault();
    if (globalSearch.trim()) {
      navigate(`/?q=${encodeURIComponent(globalSearch.trim())}`);
      setGlobalSearch('');
    }
  };
  const currentPath = location.pathname;

  const NavItem = ({ to, icon: Icon, label, isActive, mobileOnly = false, desktopOnly = false }) => {
    const activeClass = isActive 
      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' 
      : 'hover:bg-white/5 hover:text-white border border-transparent';
    
    return (
      <Link 
        to={to}
        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-2 ${activeClass} ${mobileOnly ? 'md:hidden flex-col items-center space-y-1 w-full text-center px-0 py-0' : ''} ${desktopOnly ? 'hidden md:flex' : ''}`}
      >
        <Icon className={mobileOnly ? "h-4 w-4" : "h-4 w-4"} />
        <span>{label}</span>
      </Link>
    );
  };

  const navLinks = [
    { to: '/', label: 'Catálogo', icon: Compass },
    { to: '/builder', label: 'PC Builder', icon: Hammer },
    { to: '/rastreo', label: 'Rastreo', icon: Truck },
    { to: '/facturacion', label: 'Facturación', icon: FileCheck },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/5 px-4 md:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center space-x-3 cursor-pointer">
          <div className="bg-gradient-to-tr from-cyan-500 to-purple-600 p-2.5 rounded-xl shadow-neon-cyan flex items-center justify-center">
            <Cpu className="h-6 w-6 text-white" />
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-wider text-white">NEXUS</span>
            <span className="text-xs font-semibold block text-cyan-400 tracking-widest mt-[-2px]">HARDWARE & LOGISTICS</span>
          </div>
        </Link>

        {/* Nav Links (Desktop) */}
        <nav className="hidden md:flex items-center space-x-1.5">
          {navLinks.map(link => (
            <NavItem 
              key={link.to} 
              to={link.to} 
              icon={link.icon} 
              label={link.label} 
              isActive={currentPath === link.to} 
            />
          ))}

          {currentUser && (
            <NavItem 
              to="/mis-compras" 
              icon={History} 
              label="Mis Compras" 
              isActive={currentPath === '/mis-compras'} 
            />
          )}

          {(currentUser?.role === 'admin' || currentUser?.role === 'encargado') && (
            <Link 
              to="/admin"
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-2 ${
                currentPath.startsWith('/admin')
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' 
                  : 'hover:bg-purple-500/10 hover:text-purple-300 border border-transparent text-purple-400'
              }`}
            >
              <ShieldCheck className="h-4 w-4" />
              <span>Admin</span>
            </Link>
          )}
        </nav>

        {/* User Section & Cart */}
        <div className="flex items-center space-x-3.5 flex-grow md:flex-grow-0 justify-end md:justify-start">
          
          {/* Global Search Bar */}
          <form onSubmit={handleGlobalSearch} className="hidden md:flex relative w-48 lg:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input 
              type="text" 
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              placeholder="Buscar componentes..." 
              className="w-full pl-9 pr-3 py-1.5 bg-[#0B0F19] border border-white/5 hover:border-white/10 focus:border-cyan-500/30 rounded-xl text-xs text-white focus:outline-none transition-all placeholder:text-slate-500"
            />
          </form>

          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative p-2.5 rounded-xl border border-white/5 hover:border-cyan-500/30 hover:bg-cyan-500/5 text-white transition-all group"
          >
            <ShoppingBag className="h-4.5 w-4.5" />
            {cart.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-cyan-500 to-purple-600 text-white text-[9px] font-black h-5 w-5 rounded-full flex items-center justify-center border border-[#0B0F19] shadow-neon-cyan">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </button>

          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center space-x-2.5 px-3.5 py-1.5 rounded-xl border border-white/5 bg-[#151C2C]/60 hover:border-cyan-500/20 transition-all text-xs font-bold text-white cursor-pointer"
              >
                <div className={`w-6 h-6 rounded-full bg-gradient-to-tr ${currentUser.avatarColor} flex items-center justify-center text-[10px] text-white font-extrabold uppercase shrink-0`}>
                  {currentUser.name[0]}
                </div>
                <span className="hidden sm:inline-block max-w-[100px] truncate">{currentUser.name}</span>
                <ChevronDown className="h-3 w-3 text-slate-400 shrink-0" />
              </button>

              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-white/5 bg-[#151C2C] p-2.5 shadow-2xl z-50 text-xs text-slate-300 animate-zoomIn">
                  <div className="p-2 border-b border-white/5 mb-2">
                    <span className="text-[10px] text-cyan-400 font-extrabold uppercase tracking-wider block">{currentUser.rank}</span>
                    <span className="font-extrabold text-white text-sm block truncate">{currentUser.name}</span>
                    <span className="text-slate-500 block text-[10px] truncate">{currentUser.email}</span>
                  </div>
                  <button
                    onClick={() => {
                      navigate('/perfil');
                      setShowProfileDropdown(false);
                    }}
                    className="w-full text-left p-2 rounded-lg hover:bg-white/5 flex items-center space-x-2 text-slate-200 transition-colors"
                  >
                    <User className="h-4 w-4 text-cyan-500" />
                    <span>Mi Perfil</span>
                  </button>
                  <button
                    onClick={() => {
                      navigate('/mis-compras');
                      setShowProfileDropdown(false);
                    }}
                    className="w-full text-left p-2 rounded-lg hover:bg-white/5 flex items-center space-x-2 text-slate-200 transition-colors"
                  >
                    <History className="h-4 w-4 text-cyan-500" />
                    <span>Mis Compras</span>
                  </button>
                  {(currentUser?.role === 'admin' || currentUser?.role === 'encargado') && (
                    <button
                      onClick={() => {
                        navigate('/admin');
                        setShowProfileDropdown(false);
                      }}
                      className="w-full text-left p-2 rounded-lg hover:bg-purple-500/10 flex items-center space-x-2 text-purple-300 transition-colors"
                    >
                      <ShieldCheck className="h-4 w-4" />
                      <span>Panel de Admin</span>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      setShowProfileDropdown(false);
                    }}
                    className="w-full text-left p-2 rounded-lg hover:bg-red-500/10 flex items-center space-x-2 text-red-400 transition-colors mt-1"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => {
                setShowAuthModal(true);
                setAuthMode('login');
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white shadow-neon-cyan hover:scale-[1.03] transition-all flex items-center space-x-1.5"
            >
              <User className="h-3.5 w-3.5" />
              <span>Ingresar</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Nav Bar */}
      <div className="md:hidden flex items-center justify-around mt-3.5 pt-3.5 border-t border-white/5 text-[10px] uppercase font-bold tracking-wider text-slate-400">
        <Link to="/" className={`flex flex-col items-center space-y-1 w-full text-center ${currentPath === '/' ? 'text-cyan-400' : ''}`}><Compass className="h-4 w-4" /><span>Catálogo</span></Link>
        <Link to="/builder" className={`flex flex-col items-center space-y-1 w-full text-center ${currentPath === '/builder' ? 'text-cyan-400' : ''}`}><Hammer className="h-4 w-4" /><span>PC Builder</span></Link>
        <Link to="/rastreo" className={`flex flex-col items-center space-y-1 w-full text-center ${currentPath === '/rastreo' ? 'text-cyan-400' : ''}`}><Truck className="h-4 w-4" /><span>Rastreo</span></Link>
        <Link to="/facturacion" className={`flex flex-col items-center space-y-1 w-full text-center ${currentPath === '/facturacion' ? 'text-cyan-400' : ''}`}><FileCheck className="h-4 w-4" /><span>Factura</span></Link>
        {currentUser && (
          <Link to="/mis-compras" className={`flex flex-col items-center space-y-1 w-full text-center ${currentPath === '/mis-compras' ? 'text-cyan-400' : ''}`}><History className="h-4 w-4" /><span>Compras</span></Link>
        )}
      </div>
    </header>
  );
}
