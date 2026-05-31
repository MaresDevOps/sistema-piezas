import React, { useState } from 'react';
import { Hammer, ShoppingBag, Database, AlertTriangle, Info, Receipt, X } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

export default function PCBuilder() {
  const { products } = useProducts();
  const { setCart, setIsCartOpen } = useCart();
  
  const [builderSpecs, setBuilderSpecs] = useState({
    CPU: null,
    Motherboard: null,
    RAM: null,
    GPU: null,
    Storage: null,
    PSU: null,
    Case: null
  });
  
  const [showQuoteModal, setShowQuoteModal] = useState(false);

  const selectBuilderPart = (category, product) => {
    setBuilderSpecs(prev => ({
      ...prev,
      [category]: product
    }));
  };

  const clearBuilder = () => {
    setBuilderSpecs({
      CPU: null,
      Motherboard: null,
      RAM: null,
      GPU: null,
      Storage: null,
      PSU: null,
      Case: null
    });
  };

  const addBuilderToCart = () => {
    const selectedParts = Object.values(builderSpecs).filter(p => p !== null);
    if (selectedParts.length === 0) {
      toast.error("Selecciona al menos un componente en el PC Builder.");
      return;
    }
    
    setCart(prevCart => {
      let updatedCart = [...prevCart];
      selectedParts.forEach(product => {
        const existingItem = updatedCart.find(item => item.id === product.id);
        if (existingItem) {
          updatedCart = updatedCart.map(item => 
            item.id === product.id 
              ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) }
              : item
          );
        } else {
          updatedCart.push({ ...product, quantity: 1 });
        }
      });
      return updatedCart;
    });
    
    toast.success("¡Componentes del PC Builder agregados al carrito!");
    setIsCartOpen(true);
  };

  const activeSelectedParts = Object.values(builderSpecs).filter(p => p !== null);

  const builderWatts = Object.entries(builderSpecs)
    .filter(([cat]) => cat !== 'PSU')
    .reduce((sum, [cat, val]) => sum + (val ? (val.watts || 0) : 0), 0);

  const psuWatts = builderSpecs.PSU ? (builderSpecs.PSU.watts || 0) : 0;
  const isPowerInsufficient = psuWatts > 0 && builderWatts > psuWatts;
  
  const builderTotal = Object.values(builderSpecs)
    .reduce((sum, val) => sum + (val ? (val.price || 0) : 0), 0);

  const handleDownloadQuotePDF = () => {
    // Native print is much better for Tailwind v4 (oklch)
    window.print();
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center space-x-2.5">
            <Hammer className="h-8 w-8 text-cyan-400" />
            <span>INTEGRADOR PC BUILDER</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Combina hardware de diferentes gamas, comprueba la carga de watts del sistema y exporta una cotización formal.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={clearBuilder}
            className="px-4 py-2.5 rounded-xl text-xs font-bold border border-white/10 hover:border-red-500/40 hover:bg-red-500/10 text-slate-400 hover:text-white transition-all"
          >
            Limpiar Rig
          </button>
          <button
            onClick={addBuilderToCart}
            className="px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-white rounded-xl text-xs font-bold transition-all shadow-neon-cyan flex items-center space-x-1.5"
          >
            <ShoppingBag className="h-4.5 w-4.5" />
            <span>Llevar Rig al Carrito</span>
          </button>
        </div>
      </div>

      {/* Builder Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Dropdowns builder fields */}
        <div className="lg:col-span-2 space-y-6">
          {[
            { key: 'CPU', label: 'Procesador (CPU)', desc: 'Unidad de procesamiento central para lógica y cálculo' },
            { key: 'Motherboard', label: 'Placa Base (Motherboard)', desc: 'Canales de comunicación y chipset principal' },
            { key: 'RAM', label: 'Memoria RAM', desc: 'Acceso aleatorio de datos volátiles para el sistema' },
            { key: 'GPU', label: 'Tarjeta de Video (GPU)', desc: 'Unidad de procesamiento de cálculo paralelo y vídeo' },
            { key: 'Storage', label: 'Almacenamiento (M.2 NVMe)', desc: 'Dispositivo SSD para lectura y escritura' },
            { key: 'PSU', label: 'Fuente de Alimentación (PSU)', desc: 'Transformador y distribuidor de corriente' },
            { key: 'Case', label: 'Gabinete (Case)', desc: 'Chasis de soporte físico y montaje general' }
          ].map(item => {
            const currentSelection = builderSpecs[item.key];
            const options = products.filter(p => p.category === item.key);

            return (
              <div 
                key={item.key}
                className={`p-5 rounded-2xl border transition-all duration-300 ${
                  currentSelection ? 'border-cyan-500/35 bg-[#151C2C]/50' : 'border-white/5 bg-[#151C2C]/10'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[9px] font-extrabold uppercase tracking-widest text-cyan-400">{item.key}</span>
                    <h3 className="font-extrabold text-white text-base">{item.label}</h3>
                    <p className="text-slate-500 text-xs leading-tight">{item.desc}</p>
                  </div>

                  {/* Select picker */}
                  <div className="w-full sm:w-80">
                    <select
                      value={currentSelection ? currentSelection.id : ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === '') {
                          selectBuilderPart(item.key, null);
                        } else {
                          const match = products.find(p => p.id === parseInt(val));
                          selectBuilderPart(item.key, match);
                        }
                      }}
                      className="w-full px-3 py-2.5 bg-[#0B0F19] text-white border border-white/5 rounded-xl text-xs focus:border-cyan-500/40 focus:outline-none cursor-pointer"
                    >
                      <option value="">-- Escoger {item.label} --</option>
                      {options.map(opt => (
                        <option key={opt.id} value={opt.id}>
                          {opt.name} - ${opt.price.toFixed(2)} ({opt.isPowerSupply ? `+${opt.watts}W` : `${opt.watts}W`})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Selection metadata banner */}
                {currentSelection && (
                  <div className="mt-4 pt-3.5 border-t border-white/5 flex items-start space-x-3.5 text-xs bg-slate-900/40 p-3 rounded-xl">
                    <img src={currentSelection.image} alt={currentSelection.name} className="w-12 h-12 object-cover rounded-lg border border-white/5 shrink-0 bg-slate-950" />
                    <div className="flex-grow min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <span className="font-bold text-slate-100 truncate">{currentSelection.name}</span>
                        <span className="font-black text-cyan-400 shrink-0">${currentSelection.price.toFixed(2)}</span>
                      </div>
                      <p className="text-slate-500 text-[10px] truncate">{currentSelection.specs}</p>
                      <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1.5">
                        <span>Consumo/Flujo: {currentSelection.isPowerSupply ? `Suministra ${currentSelection.watts}W` : `${currentSelection.watts}W`}</span>
                        <button onClick={() => selectBuilderPart(item.key, null)} className="text-red-400 hover:text-red-300 font-extrabold">Remover</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Summary panel right col */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-white/5 bg-[#151C2C]/50 p-6 glass-panel sticky top-28 space-y-6">
            <div className="flex items-center space-x-2 pb-4 border-b border-white/5">
              <Database className="h-5 w-5 text-cyan-400" />
              <h3 className="font-extrabold text-white text-base">Consola de Compatibilidad</h3>
            </div>

            {/* Components checklist */}
            <div className="space-y-2.5 text-xs">
              {Object.entries(builderSpecs).map(([cat, val]) => (
                <div key={cat} className="flex justify-between items-center py-0.5">
                  <span className="text-slate-500 font-semibold">{cat}:</span>
                  {val ? (
                    <span className="text-slate-100 font-bold truncate max-w-[170px]" title={val.name}>{val.name}</span>
                  ) : (
                    <span className="text-slate-700 italic">Pendiente</span>
                  )}
                </div>
              ))}
            </div>

            {/* Wattage analyzer */}
            <div className="pt-4 border-t border-white/5 space-y-3.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-400">Consumo Estimado:</span>
                <span className={isPowerInsufficient ? 'text-red-400' : 'text-emerald-400'}>{builderWatts} W</span>
              </div>

              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-400">Capacidad de Fuente:</span>
                <span className="text-white">{psuWatts > 0 ? `${psuWatts} W` : 'Por elegir'}</span>
              </div>

              {/* Progress slider bar */}
              {psuWatts > 0 && (
                <div className="space-y-1">
                  <div className="w-full bg-[#0B0F19] rounded-full h-2 overflow-hidden border border-white/5">
                    <div 
                      className={`h-full transition-all duration-300 rounded-full ${
                        isPowerInsufficient 
                          ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' 
                          : (builderWatts / psuWatts) > 0.8 
                            ? 'bg-amber-500' 
                            : 'bg-cyan-500 shadow-neon-cyan'
                      }`}
                      style={{ width: `${Math.min((builderWatts / psuWatts) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-[9px] text-slate-500 font-extrabold uppercase">
                    <span>Uso: {((builderWatts / psuWatts) * 100).toFixed(0)}%</span>
                    <span>Max sugerido: 80%</span>
                  </div>
                </div>
              )}

              {/* Watts warning box */}
              {isPowerInsufficient && (
                <div className="flex items-start space-x-2 text-xs text-red-400 bg-red-950/20 border border-red-500/20 p-3.5 rounded-xl animate-pulse">
                  <AlertTriangle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                  <span>
                    <strong>Cuidado:</strong> El consumo total supera los Watts de tu Fuente de Poder. Tu PC podría apagarse bajo carga. Elige una fuente de poder mayor.
                  </span>
                </div>
              )}

              {psuWatts > 0 && !isPowerInsufficient && (builderWatts / psuWatts) > 0.8 && (
                <div className="flex items-start space-x-2 text-xs text-amber-400 bg-amber-950/20 border border-amber-500/20 p-3.5 rounded-xl">
                  <Info className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                  <span>
                    <strong>Carga Alta:</strong> Recomendamos una fuente de mayor capacidad para mantener el ventilador en rangos óptimos de eficiencia.
                  </span>
                </div>
              )}
            </div>

            {/* Summary cost */}
            <div className="pt-4 border-t border-white/5 space-y-4">
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-slate-400 font-extrabold uppercase tracking-wide">Total Rig:</span>
                <span className="text-2xl font-black text-white glow-cyan">${builderTotal.toFixed(2)}</span>
              </div>

              <button
                onClick={() => setShowQuoteModal(true)}
                className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white rounded-xl font-bold transition-all shadow-neon-cyan flex items-center justify-center space-x-2"
              >
                <Receipt className="h-4.5 w-4.5" />
                <span>Generar Ficha de Cotización</span>
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* Quote Modal */}
      {showQuoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setShowQuoteModal(false)} className="absolute inset-0 bg-[#0B0F19]/85 backdrop-blur-md"></div>
          
          <div className="relative w-full max-w-xl rounded-2xl border border-white/10 bg-[#151C2C] p-6 shadow-2xl z-10 max-h-[90vh] overflow-y-auto animate-zoomIn">
            <button onClick={() => setShowQuoteModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X className="h-5 w-5" /></button>

            {/* Quote details */}
            <div id="quote-print-area" className="space-y-6 pt-2 bg-[#151C2C] p-4">
              <div className="text-center pb-4 border-b border-dashed border-white/10 space-y-1">
                <div className="inline-flex bg-cyan-500/10 p-2.5 rounded-lg mb-1.5">
                  <Receipt className="h-6 w-6 text-cyan-400" />
                </div>
                <h3 className="font-mono text-base font-black text-white tracking-widest">COTIZACIÓN FORMAL DE HARDWARE</h3>
                <p className="text-[9px] text-slate-500 font-mono">
                  COTIZACIÓN NRO-#{Math.floor(100000 + Math.random() * 900000)} | FECHA: {new Date().toLocaleDateString()}
                </p>
              </div>

              {/* Items listing */}
              <div className="space-y-4">
                <span className="text-[9px] font-extrabold text-cyan-400 uppercase tracking-widest block">Componentes Configurados</span>
                
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {Object.entries(builderSpecs).map(([cat, val]) => {
                    if (!val) return null;
                    return (
                      <div key={cat} className="flex justify-between items-center py-2 px-3.5 bg-[#0B0F19] rounded-xl text-xs border border-white/2">
                        <div>
                          <span className="text-[9px] font-extrabold text-cyan-400 uppercase block tracking-wide">{cat}</span>
                          <span className="text-white font-bold">{val.name}</span>
                        </div>
                        <span className="font-black text-slate-300 ml-4">${val.price.toFixed(2)}</span>
                      </div>
                    );
                  })}

                  {activeSelectedParts.length === 0 && (
                    <div className="text-center py-8 text-xs italic text-slate-600">
                      No has seleccionado ningún componente todavía.
                    </div>
                  )}
                </div>
              </div>

              {/* Specs parameters */}
              <div className="bg-[#0B0F19] p-4 rounded-xl border border-white/5 space-y-3.5 font-mono text-xs text-slate-400">
                <div className="flex justify-between">
                  <span>Piezas Totales:</span>
                  <span className="text-white font-bold">{activeSelectedParts.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Carga de Energía:</span>
                  <span className="text-white font-bold">{builderWatts} W</span>
                </div>
                <div className="flex justify-between border-t border-dashed border-white/10 pt-3.5 text-sm">
                  <span className="text-white font-bold">TOTAL COTIZADO:</span>
                  <span className="text-cyan-400 font-black">${builderTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 flex gap-3">
                <button
                  onClick={() => setShowQuoteModal(false)}
                  className="flex-grow py-3 bg-[#1e293b] hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl font-bold transition-all text-xs"
                >
                  Cerrar
                </button>
                <button
                  onClick={handleDownloadQuotePDF}
                  className="flex-grow py-3 bg-cyan-500 hover:bg-cyan-400 text-white rounded-xl font-bold transition-all shadow-neon-cyan text-xs flex justify-center items-center gap-2"
                >
                  <Receipt className="h-4 w-4" />
                  Descargar Cotización (PDF)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
