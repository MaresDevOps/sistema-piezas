import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Sparkles, Hammer, Filter, Search, X, ArrowUpDown, AlertTriangle, Check, Plus } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';

export default function Catalogo() {
  const { products, loadingProducts } = useProducts();
  const { addToCart, justAddedProduct } = useCart();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [sortBy, setSortBy] = useState('default');

  // Update searchQuery when URL changes (e.g. from Navbar)
  useEffect(() => {
    const q = searchParams.get('q');
    if (q !== null && q !== searchQuery) {
      setSearchQuery(q);
      // Optional: if category was filtered, maybe reset to "Todas" if they do a new global search
      setSelectedCategory('Todas');
    }
  }, [searchParams]);

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'Todas' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.specs.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'newest') return b.id - a.id;
    return 0;
  });

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    
    // Update URL to keep it shareable
    if (val.trim() === '') {
      searchParams.delete('q');
    } else {
      searchParams.set('q', val);
    }
    setSearchParams(searchParams);
  };
  
  const handleClearSearch = () => {
    setSearchQuery('');
    searchParams.delete('q');
    setSearchParams(searchParams);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Promotion Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-white/5 glass-panel p-8 md:p-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-[70px] pointer-events-none"></div>
        <div className="space-y-4 max-w-2xl z-10 relative">
          <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Sparkles className="h-3 w-3 mr-1.5" /> PRO HARDWARE STATION
          </span>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-none">
            FORJA TU <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 glow-cyan">SET-UP</span> DE ÚLTIMA GENERACIÓN
          </h1>
          <p className="text-slate-400 text-sm md:text-base">
            Accede a componentes entusiastas de alta fidelidad. Selecciona tu combinación perfecta y monitorea el estado del ensamblado desde tu cuenta.
          </p>
        </div>
        <div className="shrink-0 flex items-center justify-start md:justify-end z-10 relative">
          <button 
            onClick={() => navigate('/builder')}
            className="px-6 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white rounded-2xl font-bold transition-all shadow-neon-purple hover:shadow-neon-cyan flex items-center space-x-2"
          >
            <Hammer className="h-5 w-5" />
            <span>Configurar PC Builder</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-thin">
          <Filter className="h-4 w-4 text-slate-500 shrink-0" />
          {['Todas', 'CPU', 'GPU', 'Motherboard', 'RAM', 'Storage', 'PSU', 'Case'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all shrink-0 ${
                selectedCategory === cat
                  ? 'bg-cyan-500/15 border-cyan-500/35 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.15)]'
                  : 'border-white/5 bg-white/5 hover:border-white/20 text-slate-400 hover:text-white'
              }`}
            >
              {cat === 'Todas' ? 'Todas las Categorías' : cat}
            </button>
          ))}
        </div>

        {/* Search & Sorting inputs */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Buscar hardware..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-white/5 bg-[#151C2C] text-white text-xs focus:border-cyan-500/40 focus:outline-none transition-all"
            />
            {searchQuery && (
              <button onClick={handleClearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                <X className="h-4.5 w-4.5" />
              </button>
            )}
          </div>

          <div className="relative w-full sm:w-auto flex items-center space-x-2 bg-[#151C2C] border border-white/5 rounded-xl px-3 py-2">
            <ArrowUpDown className="h-4 w-4 text-slate-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-white text-xs focus:outline-none cursor-pointer pr-4"
            >
              <option value="default" className="bg-[#151C2C] text-slate-400">Por Defecto</option>
              <option value="price-asc" className="bg-[#151C2C] text-slate-400">Precio: Menor a Mayor</option>
              <option value="price-desc" className="bg-[#151C2C] text-slate-400">Precio: Mayor a Menor</option>
              <option value="newest" className="bg-[#151C2C] text-slate-400">Más Recientes</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products grid */}
      {loadingProducts ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-10 h-10 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
          <span className="ml-3.5 text-slate-400 text-sm font-semibold uppercase tracking-wider">Conectando con base de datos real...</span>
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => {
            const isJustAdded = justAddedProduct === product.id;
            return (
              <div 
                key={product.id}
                className="group relative rounded-2xl border border-white/5 bg-[#151C2C]/50 flex flex-col justify-between overflow-hidden glass-card"
              >
                {/* Image panel */}
                <Link to={`/producto/${product.id}`} className="block h-48 w-full overflow-hidden relative bg-slate-950 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#151C2C] to-transparent z-10"></div>
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80" />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-[#0B0F19]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex items-center justify-center">
                    <span className="text-white text-xs font-bold bg-cyan-500/80 px-3 py-1.5 rounded-full shadow-neon-cyan backdrop-blur-sm">Ver Detalles</span>
                  </div>

                  {/* Category Badge */}
                  <span className="absolute top-3 left-3 bg-[#0B0F19]/80 backdrop-blur-md text-cyan-400 border border-cyan-500/20 text-[9px] font-extrabold px-2.5 py-1 rounded-md tracking-wider z-20">
                    {product.category}
                  </span>

                  {/* Stock Badge */}
                  <div className="absolute bottom-2 left-3 z-20">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                      product.stock > 5 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      Stock: {product.stock} pz.
                    </span>
                  </div>
                </Link>

                {/* Content panel */}
                <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <Link to={`/producto/${product.id}`}>
                      <h3 className="font-extrabold text-white text-sm tracking-tight leading-snug hover:text-cyan-400 transition-colors cursor-pointer">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-slate-400 text-xs line-clamp-3 leading-relaxed">
                      {product.specs}
                    </p>
                    <div className="flex gap-2">
                      {product.watts > 0 && (
                        <span className="inline-block text-[9px] text-slate-400 font-bold bg-slate-800/40 px-2 py-0.5 rounded">
                          {product.isPowerSupply ? `Potencia: ${product.watts}W` : `Consumo: ${product.watts}W`}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Price & Cart button */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/5">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-500 uppercase font-semibold">Precio</span>
                      <span className="text-lg font-black text-white">
                        ${product.price.toFixed(2)}
                      </span>
                    </div>

                    <button
                      onClick={() => addToCart(product)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                        isJustAdded 
                          ? 'bg-emerald-500 text-white shadow-neon-emerald' 
                          : 'bg-[#1e293b] text-white hover:bg-gradient-to-r hover:from-cyan-500 hover:to-purple-600 hover:shadow-neon-cyan hover:scale-[1.02]'
                      }`}
                    >
                      {isJustAdded ? <Check className="h-4.5 w-4.5 animate-bounce" /> : <Plus className="h-4.5 w-4.5" />}
                      <span>{isJustAdded ? 'Añadido' : 'Comprar'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-24 border border-dashed border-white/5 rounded-2xl glass-panel">
          <AlertTriangle className="h-12 w-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white">Sin resultados</h3>
          <p className="text-slate-500 text-xs mt-1">Intente buscar otro componente o cambie el filtro de categoría.</p>
        </div>
      )}
    </div>
  );
}
