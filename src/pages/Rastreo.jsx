import React, { useState, useEffect } from 'react';
import { Truck, Search, AlertTriangle, Wrench } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { doc, updateDoc, onSnapshot, collection, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Rastreo() {
  const { currentUser } = useAuth();
  const location = useLocation();
  const initialTrackingId = location.state?.trackingId || '';
  
  const [searchTrackingInput, setSearchTrackingInput] = useState(initialTrackingId);
  const [trackingResult, setTrackingResult] = useState(null);
  const [trackingError, setTrackingError] = useState('');
  const [orders, setOrders] = useState([]);

  // Auto-search if we came from MisCompras with a trackingId
  useEffect(() => {
    if (initialTrackingId) {
      handleSearchTracking(initialTrackingId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialTrackingId]);

  // Fetch user orders for quick tracking shortcuts
  useEffect(() => {
    if (!currentUser) {
      setOrders([]);
      return;
    }
    const q = query(collection(db, 'orders'), where('buyerUid', '==', currentUser.uid));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const ordersList = [];
      querySnapshot.forEach((docSnap) => {
        ordersList.push(docSnap.data());
      });
      ordersList.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      setOrders(ordersList);
    }, (err) => {
      console.error("Error subscribing to user orders:", err);
    });
    return () => unsubscribe();
  }, [currentUser]);

  const handleSearchTracking = (code = null) => {
    const targetCode = (code || searchTrackingInput).trim().toUpperCase();
    if (!targetCode) {
      setTrackingError("Introduce un número de guía para buscar.");
      setTrackingResult(null);
      return;
    }

    setTrackingError('');
    
    const docRef = doc(db, 'orders', targetCode);
    
    if (window.activeTrackingListener) {
      window.activeTrackingListener();
    }

    window.activeTrackingListener = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setTrackingResult(docSnap.data());
        setTrackingError('');
      } else {
        setTrackingError('Guía no registrada. Verifique el código de seguimiento.');
        setTrackingResult(null);
      }
    }, (err) => {
      console.error("Firestore tracking listener error:", err);
      setTrackingError('Error al conectar con la base de datos.');
      setTrackingResult(null);
    });
  };

  const handleSimulateStatusChange = async (newStatus) => {
    if (!trackingResult) return;
    if (currentUser?.role !== 'admin' && currentUser?.role !== 'encargado') {
      toast.error("Acceso Denegado: Solo el personal autorizado puede cambiar el estatus.");
      return;
    }

    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    const locations = {
      1: 'Taller de Ensamblaje Central',
      2: 'Taller de Calibración & Benchmarking',
      3: 'Centro de Clasificación Express DHL',
      4: 'Domicilio del Cliente'
    };

    const statusDescriptions = {
      1: 'Pago aprobado. Su orden está lista para el taller de ensamblaje.',
      2: 'Hardware ensamblado y configurado. Pruebas de estrés superadas.',
      3: 'Paquete en tránsito vía aérea express a tu ciudad.',
      4: 'Entregado y recibido a conformidad del usuario.'
    };

    const updatedHistory = trackingResult.history.map(h => {
      if (h.step <= newStatus) {
        return {
          ...h,
          time: h.time === '--' ? formattedDate : h.time,
          location: h.location === '--' ? locations[h.step] : h.location,
          desc: statusDescriptions[h.step],
          completed: true
        };
      } else {
        return {
          ...h,
          time: '--',
          location: '--',
          completed: false
        };
      }
    });

    try {
      const docRef = doc(db, 'orders', trackingResult.id);
      await updateDoc(docRef, {
        status: newStatus,
        history: updatedHistory
      });
      toast.success("Estatus de orden actualizado.");
    } catch (err) {
      console.error("Firestore status update error:", err);
      toast.error("Error al actualizar la orden en el servidor.");
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
      {/* Title */}
      <div className="text-center space-y-3.5 pb-4">
        <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
          <Truck className="h-4 w-4 mr-1.5" /> Monitoreo y Logística de Distribución
        </span>
        <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">LOGÍSTICA DE HARDWARE</h1>
        <p className="text-slate-400 text-xs md:text-sm max-w-lg mx-auto">
          Introduce el código de guía asignado a tu pedido (`NEX-XXXXXX`) para ver su progreso actual.
        </p>
      </div>

      {/* Input card */}
      <div className="rounded-2xl border border-white/5 bg-[#151C2C]/50 p-6 glass-panel space-y-6">
        <div className="flex flex-col sm:flex-row items-stretch gap-3">
          <div className="relative flex-grow">
            <Truck className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              value={searchTrackingInput}
              onChange={(e) => setSearchTrackingInput(e.target.value)}
              placeholder="Código de guía NEX-XXXXXX"
              className="w-full pl-11 pr-4 py-3 bg-[#0B0F19] text-white border border-white/5 rounded-xl text-xs uppercase focus:border-cyan-500/40 focus:outline-none transition-all"
              onKeyDown={(e) => e.key === 'Enter' && handleSearchTracking()}
            />
          </div>
          <button
            onClick={() => handleSearchTracking()}
            className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-white rounded-xl text-xs font-bold transition-all shadow-neon-cyan flex items-center justify-center space-x-2"
          >
            <Search className="h-4 w-4" />
            <span>Buscar</span>
          </button>
        </div>

        {trackingError && (
          <div className="text-red-400 text-xs bg-red-950/20 border border-red-500/20 p-3 rounded-lg flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4" />
            <span>{trackingError}</span>
          </div>
        )}

        {/* Operating history links */}
        {orders.length > 0 && (
          <div className="pt-4 border-t border-white/5 space-y-3">
            <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest block">Tus Órdenes en Tránsito:</span>
            <div className="flex flex-wrap gap-2.5">
              {orders.map(o => (
                <button
                  key={o.id}
                  onClick={() => {
                    setSearchTrackingInput(o.id);
                    handleSearchTracking(o.id);
                  }}
                  className="px-3.5 py-2 text-xs bg-[#1F293D]/30 border border-white/5 hover:border-purple-500/30 text-slate-400 hover:text-white rounded-xl transition-all font-mono"
                >
                  <span className="text-cyan-400 font-bold mr-1.5">{o.id}</span>
                  <span className="text-[10px] text-slate-500 font-sans">({o.createdAt.split(' ')[0]})</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Timeline Results Panel */}
      {trackingResult && (
        <div className="space-y-6">
          
          {/* Admin Backoffice Console */}
          {(currentUser?.role === 'admin' || currentUser?.role === 'encargado') && (
            <div className="border border-cyan-500/20 bg-cyan-500/5 p-5 rounded-2xl space-y-4">
              <div className="flex items-center space-x-2">
                <Wrench className="h-4.5 w-4.5 text-cyan-400" />
                <span className="text-xs text-white font-extrabold uppercase tracking-wider">
                  PANEL ADMINISTRATIVO DE DESPACHO (CONTROL OPERATIVO INTERNO)
                </span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Actualiza la bitácora interna de tránsito en Firestore. Todos los clientes suscritos verán los cambios en tiempo real.
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  { step: 1, label: '1. Recibido' },
                  { step: 2, label: '2. Ensamblado' },
                  { step: 3, label: '3. En Ruta' },
                  { step: 4, label: '4. Entregado' }
                ].map(btn => (
                  <button
                    key={btn.step}
                    onClick={() => handleSimulateStatusChange(btn.step)}
                    className={`px-3 py-2 text-[10px] font-bold rounded-lg border transition-all ${
                      trackingResult.status === btn.step
                        ? 'bg-cyan-500 text-[#0B0F19] border-transparent font-extrabold shadow-neon-cyan'
                        : 'border-white/5 hover:border-cyan-500/30 text-slate-400 hover:text-white bg-slate-955'
                    }`}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tracking Detail Card */}
          <div className="rounded-2xl border border-white/5 bg-[#151C2C]/50 p-6 md:p-8 space-y-8 glass-panel animate-fadeIn">
            
            {/* Card Header info */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-white/5 pb-5 gap-4">
              <div className="space-y-1">
                <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-500">ID de Seguimiento</span>
                <h3 className="font-mono text-lg font-black text-white tracking-wider flex items-center">
                  {trackingResult.id}
                  <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded text-[9px] font-extrabold uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    {trackingResult.history.find(h => h.step === trackingResult.status)?.title || 'Procesando'}
                  </span>
                </h3>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Destinatario</span>
                <span className="font-bold text-slate-100 block">{trackingResult.buyerName}</span>
                <span className="text-[10px] text-slate-500 block truncate">{trackingResult.address}</span>
              </div>
            </div>

            {/* Components items purchased list */}
            <div className="p-4 rounded-xl bg-slate-900/40 border border-white/2 space-y-3.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Contenido del Pedido</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
                {trackingResult.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center py-1.5 px-3 bg-[#0B0F19] rounded border border-white/5">
                    <span className="truncate pr-3">{item.name} <strong className="text-cyan-400 font-black pl-1">x{item.quantity}</strong></span>
                    <span className="font-mono text-slate-500 shrink-0">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Vertical Timeline */}
            <div className="relative pl-6 space-y-8 py-2">
              <div className="absolute left-[11px] top-4 bottom-4 w-0.5 bg-slate-800"></div>
              
              {trackingResult.history.map((step, idx) => (
                <div key={idx} className="relative z-10 flex gap-5">
                  <div className={`mt-1 h-5 w-5 rounded-full flex items-center justify-center shrink-0 border-4 border-[#151C2C] ${
                    step.completed ? 'bg-cyan-500 shadow-neon-cyan' : 'bg-slate-700'
                  }`}>
                    {step.completed && <div className="h-1.5 w-1.5 bg-white rounded-full"></div>}
                  </div>
                  
                  <div className={`flex-grow space-y-1 ${step.completed ? 'opacity-100' : 'opacity-40'}`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                      <h4 className="text-sm font-bold text-white">{step.title}</h4>
                      <span className="text-[10px] text-slate-400 font-mono sm:text-right mt-1 sm:mt-0">{step.time}</span>
                    </div>
                    <p className="text-xs text-slate-400">{step.desc}</p>
                    {step.location !== '--' && (
                      <p className="text-[10px] text-cyan-400 uppercase tracking-widest font-bold mt-1">Ubicación: {step.location}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
