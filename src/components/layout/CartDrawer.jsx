import React from 'react';
import { ShoppingBag, X, Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';

export default function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, updateCartQuantity, removeFromCart, getCartSubtotal, setShowCheckoutModal } = useCart();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleProceedToCheckout = () => {
    setShowCheckoutModal(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      <div onClick={() => setIsCartOpen(false)} className="absolute inset-0 bg-[#0B0F19]/60 backdrop-blur-sm"></div>

      <div className="relative w-full max-w-md h-full bg-[#151C2C] border-l border-white/5 shadow-2xl flex flex-col justify-between z-10 animate-slideLeft">
        
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <ShoppingBag className="h-5 w-5 text-cyan-400" />
            <h3 className="font-extrabold text-white text-lg">Carrito de Compras</h3>
          </div>
          <button onClick={() => setIsCartOpen(false)} className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-all">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* List items */}
        <div className="flex-grow overflow-y-auto p-6 space-y-4">
          {cart.length > 0 ? (
            cart.map(item => (
              <div key={item.id} className="flex items-center space-x-3.5 p-3 rounded-xl bg-slate-900/40 border border-white/5 hover:border-white/10 transition-all duration-300">
                <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-lg border border-white/5 shrink-0 bg-slate-950" />
                <div className="flex-grow min-w-0">
                  <h4 className="font-bold text-white text-xs truncate">{item.name}</h4>
                  <span className="text-[10px] text-slate-500">{item.category}</span>
                  
                  <div className="flex justify-between items-center mt-1.5">
                    <span className="font-black text-cyan-400 text-xs">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                    
                    {/* Stepper */}
                    <div className="flex items-center space-x-1.5 bg-slate-950/80 rounded-md p-1 border border-white/5">
                      <button onClick={() => updateCartQuantity(item.id, -1)} className="p-0.5 text-slate-400 hover:text-white rounded"><Minus className="h-3 w-3" /></button>
                      <span className="text-white text-xs font-bold px-1 text-center min-w-[14px]">{item.quantity}</span>
                      <button onClick={() => updateCartQuantity(item.id, 1)} className="p-0.5 text-slate-400 hover:text-white rounded"><Plus className="h-3 w-3" /></button>
                    </div>
                  </div>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-300 p-1 hover:bg-red-500/10 rounded-lg transition-colors shrink-0">
                  <Trash2 className="h-4.5 w-4.5" />
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-20">
              <ShoppingBag className="h-14 w-14 text-slate-700 mx-auto mb-4" />
              <p className="text-slate-500 text-xs">El carrito está vacío.</p>
              <button onClick={() => { setIsCartOpen(false); navigate('/'); }} className="mt-4 text-xs text-cyan-400 font-bold hover:underline">Explorar Catálogo</button>
            </div>
          )}
        </div>

        {/* Bottom summary and check actions */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-white/5 bg-slate-900/60 space-y-4">
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span className="text-white font-semibold">${getCartSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>IVA (16%)</span>
                <span className="text-white font-semibold">${(getCartSubtotal() * 0.16).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Envío Express</span>
                <span className="text-emerald-400 font-bold uppercase">Gratuito</span>
              </div>
              <div className="flex justify-between items-baseline pt-2.5 border-t border-white/5 text-sm">
                <span className="font-extrabold text-white">Total</span>
                <span className="text-xl font-extrabold text-white glow-cyan">
                  ${(getCartSubtotal() * 1.16).toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={handleProceedToCheckout}
              className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white rounded-xl font-bold transition-all shadow-neon-cyan flex items-center justify-center space-x-2"
            >
              <span>Proceder al Pago</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
