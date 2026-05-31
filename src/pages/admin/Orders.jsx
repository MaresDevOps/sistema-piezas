import React, { useEffect, useState } from 'react';
import { ListOrdered } from 'lucide-react';
import { collection, query, onSnapshot, orderBy, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function AdminOrders() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [allOrders, setAllOrders] = useState([]);

  useEffect(() => {
    if (currentUser?.role !== 'admin') {
      navigate('/admin/products');
      return;
    }
    
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = [];
      snapshot.forEach(docSnap => {
        list.push({ ...docSnap.data(), id: docSnap.id });
      });
      setAllOrders(list);
    });
    return () => unsubscribe();
  }, [currentUser, navigate]);

  const handleAdminUpdateOrderStatus = async (orderId, newStatus) => {
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;
    const locations = { 1: 'Taller de Ensamblaje Central', 2: 'Taller de Calibración & Benchmarking', 3: 'Centro de Clasificación Express DHL', 4: 'Domicilio del Cliente' };
    const descs = { 1: 'Pago aprobado. Su orden está lista para el taller de ensamblaje.', 2: 'Hardware ensamblado y configurado. Pruebas de estrés superadas.', 3: 'Paquete en tránsito vía aérea express a tu ciudad.', 4: 'Entregado y recibido a conformidad del usuario.' };
    
    const order = allOrders.find(o => o.id === orderId);
    if (!order) return;
    
    const updatedHistory = order.history.map(h => h.step <= newStatus
      ? { ...h, time: h.time === '--' ? formattedDate : h.time, location: h.location === '--' ? locations[h.step] : h.location, desc: descs[h.step], completed: true }
      : { ...h, time: '--', location: '--', completed: false }
    );
    try {
      await updateDoc(doc(db, 'orders', orderId), { status: newStatus, history: updatedHistory });
      toast.success('Orden actualizada correctamente.');
    } catch (err) {
      toast.error('Error al actualizar orden: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-black text-white flex items-center space-x-2"><ListOrdered className="h-5 w-5 text-purple-400" /><span>Todos los Pedidos ({allOrders.length})</span></h2>
      {allOrders.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-white/5 rounded-2xl text-slate-600 text-xs">Sin pedidos registrados.</div>
      ) : (
        <div className="space-y-4">
          {allOrders.map(order => (
            <div key={order.id} className="p-5 rounded-2xl border border-white/5 bg-[#151C2C]/40 glass-panel space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-black text-white text-sm">{order.id}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      order.status === 4 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : order.status === 3 ? 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                      : order.status === 2 ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                      : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                    }`}>
                      {['', 'Recibido', 'En Ensamblaje', 'En Tránsito', 'Entregado'][order.status]}
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs"><span className="text-slate-500">Cliente:</span> {order.buyerName} — <span className="text-slate-500">Email:</span> {order.email}</p>
                  <p className="text-slate-500 text-[10px] font-mono">{order.createdAt}</p>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <span className="font-black text-white">${order.total?.toFixed(2)}</span>
                  {/* Status changer */}
                  <div className="flex items-center space-x-1">
                    <span className="text-[10px] text-slate-500 font-bold">Cambiar estado:</span>
                    {[1, 2, 3, 4].map(s => (
                      <button
                        key={s}
                        onClick={() => handleAdminUpdateOrderStatus(order.id, s)}
                        disabled={order.status === s}
                        className={`w-6 h-6 rounded-md text-[10px] font-black transition-all border ${
                          order.status === s
                            ? 'bg-purple-500/30 text-purple-300 border-purple-500/40 cursor-default'
                            : 'bg-white/5 hover:bg-purple-500/20 text-slate-400 hover:text-purple-300 border-white/10 hover:border-purple-500/30'
                        }`}
                        title={['', 'Recibido', 'En Ensamblaje', 'En Tránsito', 'Entregado'][s]}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              {/* Items */}
              <div className="border-t border-white/5 pt-3 space-y-1">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-xs text-slate-400">
                    <span>{item.name} <strong className="text-cyan-400/80">x{item.quantity}</strong></span>
                    <span className="font-mono">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="flex justify-between text-xs pt-2 border-t border-white/5 font-black">
                  <span className="text-slate-500">Total c/IVA</span>
                  <span className="text-white">${order.total?.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
