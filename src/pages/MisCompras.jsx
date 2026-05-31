import React, { useState, useEffect } from 'react';
import { History, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';

export default function MisCompras() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

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

  const userOrders = orders.filter(o => o.buyerName === currentUser?.name);

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
      <div className="border-b border-white/5 pb-4">
        <h1 className="text-3xl font-black text-white tracking-tight flex items-center space-x-2">
          <History className="h-7 w-7 text-cyan-400" />
          <span>MIS COMPRAS</span>
        </h1>
        <p className="text-slate-400 text-xs mt-1">
          Historial completo de facturación, comprobantes y logística vinculada a tu cuenta.
        </p>
      </div>

      {userOrders.length > 0 ? (
        <div className="space-y-4">
          {userOrders.map(order => (
            <div key={order.id} className="p-5 rounded-2xl border border-white/5 bg-[#151C2C]/40 glass-panel space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-white/5 pb-3 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">Código de Pedido</span>
                  <span className="font-mono font-bold text-white text-sm">{order.id}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">Fecha / Hora de Compra</span>
                  <span className="text-slate-300 font-mono font-semibold">{order.createdAt}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate('/rastreo', { state: { trackingId: order.id } })}
                    className="px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/20 hover:border-cyan-500/40 text-cyan-400 hover:text-white rounded-lg text-[10px] font-bold uppercase transition-all"
                  >
                    Rastrear Envío
                  </button>
                  <button
                    onClick={() => navigate('/facturacion', { state: { orderId: order.id } })}
                    className="px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 hover:border-purple-500/40 text-purple-400 hover:text-white rounded-lg text-[10px] font-bold uppercase transition-all"
                  >
                    Facturar Compra
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">Componentes Adquiridos:</span>
                <div className="space-y-1.5">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs text-slate-400">
                      <span>{item.name} <strong className="text-cyan-400/80">x{item.quantity}</strong></span>
                      <span className="font-mono text-[10px]">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-white/5 flex justify-between items-baseline text-xs">
                <span className="text-slate-500 font-bold uppercase">Total Pagado:</span>
                <span className="font-black text-white text-sm">${order.total.toFixed(2)} (IVA Inc.)</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border border-dashed border-white/5 rounded-2xl glass-panel">
          <ShoppingBag className="h-10 w-10 text-slate-700 mx-auto mb-3" />
          <p className="text-slate-500 text-xs">No has realizado ninguna compra con esta cuenta.</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 text-xs text-cyan-400 hover:underline font-bold"
          >
            Explorar Componentes
          </button>
        </div>
      )}
    </div>
  );
}
