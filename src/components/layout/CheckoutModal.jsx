import React, { useState } from 'react';
import { CreditCard, MapPin, X, CheckCircle2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import toast from 'react-hot-toast';

export default function CheckoutModal() {
  const { cart, setCart, getCartSubtotal, showCheckoutModal, setShowCheckoutModal, setIsCartOpen } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [newOrderSuccess, setNewOrderSuccess] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card');

  if (!showCheckoutModal && !newOrderSuccess) return null;

  const handleCheckoutSuccess = async (e, checkoutForm) => {
    e.preventDefault();
    if (!currentUser) return;
    
    // Generate tracking code: NEX-XXXXXX
    const randomHex = Math.floor(16777215 + Math.random() * 8388607).toString(16).toUpperCase();
    const trackingCode = `NEX-${randomHex}`;

    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    const subtotal = getCartSubtotal();
    const tax = subtotal * 0.16;
    const total = subtotal + tax;

    const newOrder = {
      id: trackingCode,
      buyerUid: currentUser.uid,
      buyerName: currentUser.name,
      email: currentUser.email,
      address: checkoutForm.address,
      items: cart.map(item => ({ id: item.id, name: item.name, price: item.price, quantity: item.quantity, category: item.category })),
      subtotal: parseFloat(subtotal.toFixed(2)),
      tax: parseFloat(tax.toFixed(2)),
      total: parseFloat(total.toFixed(2)),
      createdAt: formattedDate,
      status: 1,
      paymentMethod: paymentMethod,
      oxxoReference: paymentMethod === 'oxxo' ? `4152 7728 9912 ${Math.floor(1000 + Math.random() * 9000)}` : null,
      history: [
        { step: 1, title: 'Pedido Recibido', desc: 'Pago aprobado. Su orden está lista para el taller de ensamblaje.', time: formattedDate, location: 'Taller de Ensamblaje Central', completed: true },
        { step: 2, title: 'En Ensamblaje / Empaque', desc: 'Aún sin iniciar.', time: '--', location: '--', completed: false },
        { step: 3, title: 'En Tránsito', desc: 'Pendiente de recolección de transportista.', time: '--', location: '--', completed: false },
        { step: 4, title: 'Entregado', desc: 'Pendiente de envío.', time: '--', location: '--', completed: false }
      ]
    };

    try {
      // Write to Firestore orders collection
      await setDoc(doc(db, 'orders', trackingCode), newOrder);
      
      setCart([]);
      setShowCheckoutModal(false);
      setIsCartOpen(false);
      setNewOrderSuccess(newOrder);
    } catch (error) {
      console.error("Order error:", error);
      toast.error("Error al procesar la orden en la base de datos.");
      setIsProcessing(false);
    }
  };

  return (
    <>
      {showCheckoutModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div onClick={() => setShowCheckoutModal(false)} className="absolute inset-0 bg-[#0B0F19]/80 backdrop-blur-md"></div>
          
          <div className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-[#151C2C] p-6 md:p-8 shadow-2xl z-10 max-h-[90vh] overflow-y-auto animate-zoomIn">
            <button onClick={() => setShowCheckoutModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X className="h-5 w-5" /></button>

            <div className="flex items-center space-x-2 pb-3 border-b border-white/5 mb-6">
              <CreditCard className="h-5 w-5 text-cyan-400" />
              <h3 className="font-extrabold text-white text-lg">Pasarela de Pago Segura</h3>
            </div>

            <form 
              onSubmit={(e) => {
                const addressVal = e.target.elements.address.value;
                handleCheckoutSuccess(e, { address: addressVal });
              }} 
              className="space-y-4 text-xs"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-slate-400 font-semibold">Cliente</label>
                  <input readOnly type="text" value={currentUser?.name || ''} className="w-full px-3 py-2 bg-slate-900/60 border border-white/5 rounded-lg text-slate-400 cursor-not-allowed outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-slate-400 font-semibold">Email de Confirmación</label>
                  <input readOnly type="email" value={currentUser?.email || ''} className="w-full px-3 py-2 bg-slate-900/60 border border-white/5 rounded-lg text-slate-400 cursor-not-allowed outline-none" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-400 font-semibold">Dirección de Despacho</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input required name="address" type="text" placeholder="Calle Gamer #777, Zona de Ensambles, Monterrey" className="w-full pl-9 pr-3 py-2 bg-[#0B0F19] border border-white/5 rounded-lg text-white focus:border-cyan-500/40 focus:outline-none" />
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-1.5">
                <label className="text-slate-400 font-semibold block">Método de Pago</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 border rounded-xl flex items-center justify-center space-x-2 transition-colors ${paymentMethod === 'card' ? 'bg-cyan-500/10 border-cyan-400 text-cyan-400' : 'bg-[#0B0F19] border-white/5 text-slate-400 hover:border-white/20'}`}
                  >
                    <CreditCard className="h-4 w-4" />
                    <span className="font-bold text-xs">Tarjeta C/D</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('oxxo')}
                    className={`p-3 border rounded-xl flex items-center justify-center space-x-2 transition-colors ${paymentMethod === 'oxxo' ? 'bg-purple-500/10 border-purple-400 text-purple-400' : 'bg-[#0B0F19] border-white/5 text-slate-400 hover:border-white/20'}`}
                  >
                    <span className="font-bold text-xs uppercase">Efectivo (OXXO)</span>
                  </button>
                </div>
              </div>

              {/* Payment specifications */}
              {paymentMethod === 'card' ? (
                <div className="p-4 rounded-xl bg-slate-900/40 border border-white/2 space-y-3.5 animate-fadeIn">
                  <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Información Bancaria de Pago</span>
                  
                  <div className="space-y-1.5">
                    <label className="text-slate-400 font-semibold">Tarjeta de Crédito / Débito</label>
                    <input required type="text" placeholder="4152 7728 9912 3456" className="w-full px-3 py-2 bg-[#0B0F19] border border-white/5 rounded-lg text-white focus:border-cyan-500/40 focus:outline-none" />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-slate-400 font-semibold">Expiración</label>
                      <input required type="text" placeholder="12/30" className="w-full px-3 py-2 bg-[#0B0F19] border border-white/5 rounded-lg text-white focus:border-cyan-500/40 focus:outline-none" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-slate-400 font-semibold">CVC / CVV</label>
                      <input required type="password" placeholder="***" className="w-full px-3 py-2 bg-[#0B0F19] border border-white/5 rounded-lg text-white focus:border-cyan-500/40 focus:outline-none" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-center space-y-2 animate-fadeIn">
                  <span className="text-purple-400 font-bold block">Pago en Efectivo (OXXO / Transferencia)</span>
                  <p className="text-slate-300 text-[11px]">
                    Al completar la transacción, se generará tu recibo de pago con la referencia. 
                    Tendrás 24 horas para depositar en cualquier OXXO o banco.
                  </p>
                </div>
              )}

              <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block font-semibold">Total a Debitar:</span>
                  <span className="font-black text-white text-lg glow-cyan">${(getCartSubtotal() * 1.16).toFixed(2)}</span>
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white rounded-xl font-bold transition-all shadow-neon-cyan"
                >
                  Completar Transacción
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {newOrderSuccess && newOrderSuccess.paymentMethod === 'oxxo' && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 print:bg-white print:p-0">
          <div onClick={() => setNewOrderSuccess(null)} className="absolute inset-0 bg-[#0B0F19]/80 backdrop-blur-md print:hidden"></div>
          
          <div className="relative w-full max-w-md rounded-2xl border border-purple-500/25 bg-[#151C2C] p-6 shadow-2xl z-10 text-center space-y-5 animate-zoomIn print:bg-white print:border-none print:shadow-none print:text-black print:max-w-none print:w-[80mm] print:mx-auto">
            <h2 className="text-2xl font-black text-white print:text-black">OXXO PAY</h2>
            
            <div className="space-y-1">
              <p className="text-slate-400 text-xs print:text-gray-600">Monto a pagar</p>
              <h3 className="text-3xl font-black text-purple-400 print:text-black">${newOrderSuccess.total.toFixed(2)}</h3>
              <p className="text-[10px] text-slate-500 print:text-gray-500">Comisión OXXO: $15.00 MXN</p>
            </div>

            <div className="p-4 bg-white rounded-xl space-y-2 border-2 border-dashed border-gray-300">
              <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest block">Referencia de Pago</span>
              <div className="h-16 w-full bg-black/5 flex items-center justify-center font-mono text-xl tracking-widest">
                <span className="text-black font-bold">{newOrderSuccess.oxxoReference}</span>
              </div>
              <div className="w-full h-8 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/e9/UPC-A-036000291452.svg')] bg-contain bg-center bg-no-repeat opacity-50 mix-blend-multiply"></div>
            </div>

            <div className="space-y-1 pb-4">
              <p className="text-slate-400 text-xs">Instrucciones:</p>
              <p className="text-[10px] text-slate-500">1. Acude a tu OXXO más cercano.<br/>2. Indica al cajero que realizarás un pago de OXXO PAY.<br/>3. Dicta la referencia o muestra el código de barras.</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => window.print()}
                className="flex-grow py-3 border border-purple-500/30 text-purple-400 hover:bg-purple-500/10 rounded-xl font-bold transition-all text-xs"
              >
                Imprimir Referencia
              </button>
              <button
                onClick={() => {
                  setNewOrderSuccess(null);
                  navigate('/rastreo', { state: { trackingId: newOrderSuccess.id } });
                }}
                className="flex-grow py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold transition-all text-xs shadow-neon-purple"
              >
                Continuar
              </button>
            </div>
          </div>

          {/* Printable A4 OXXO Reference Sheet */}
          <div id="oxxo-print-area" className="hidden font-sans text-black bg-white">
            <div style={{ padding: '30px 40px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
              
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #000', paddingBottom: '15px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ width: '50px', height: '50px', backgroundColor: '#000', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '900', fontSize: '28px', marginRight: '15px' }}>N</div>
                  <div>
                    <h1 style={{ margin: 0, fontSize: '20px', fontWeight: '900', letterSpacing: '1px' }}>NEXUS HARDWARE S.A. DE C.V.</h1>
                    <p style={{ margin: '3px 0 0 0', fontSize: '11px', color: '#555' }}>Plataforma de Hardware y Componentes</p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '900', color: '#e51a2e' }}>OXXO PAY</h2>
                  <p style={{ margin: '2px 0 0 0', fontSize: '10px', fontWeight: 'bold' }}>FICHA DE DEPÓSITO BANCARIO</p>
                </div>
              </div>

              {/* Info grid */}
              <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                <div style={{ flex: '1', border: '1px solid #ccc', borderRadius: '8px', overflow: 'hidden' }}>
                  <div style={{ backgroundColor: '#f3f4f6', padding: '8px 12px', borderBottom: '1px solid #ccc', fontSize: '11px', fontWeight: 'bold', color: '#374151', textTransform: 'uppercase' }}>
                    Datos del Cliente
                  </div>
                  <div style={{ padding: '12px', fontSize: '12px', lineHeight: '1.6' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#6b7280' }}>Nombre:</span>
                      <strong style={{ textTransform: 'uppercase' }}>{newOrderSuccess.buyerName}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#6b7280' }}>Folio / Pedido:</span>
                      <strong>{newOrderSuccess.id}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#6b7280' }}>Fecha de emisión:</span>
                      <strong>{newOrderSuccess.createdAt?.slice(0, 10)}</strong>
                    </div>
                  </div>
                </div>

                <div style={{ flex: '1', border: '1px solid #ccc', borderRadius: '8px', overflow: 'hidden' }}>
                  <div style={{ backgroundColor: '#f3f4f6', padding: '8px 12px', borderBottom: '1px solid #ccc', fontSize: '11px', fontWeight: 'bold', color: '#374151', textTransform: 'uppercase' }}>
                    Datos de Cobro
                  </div>
                  <div style={{ padding: '12px', fontSize: '12px', lineHeight: '1.6' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#6b7280' }}>Concepto:</span>
                      <strong>COMPRA HARDWARE</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#6b7280' }}>Moneda:</span>
                      <strong>MXN (Pesos Mexicanos)</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#6b7280' }}>Válido hasta:</span>
                      <strong style={{ color: '#e51a2e' }}>{new Date(Date.now() + 86400000).toLocaleDateString()} 23:59 hrs</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Box */}
              <div style={{ border: '2px solid #000', borderRadius: '12px', padding: '25px', textAlign: 'center', marginBottom: '25px', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#fff', padding: '0 10px', fontSize: '12px', fontWeight: 'bold', color: '#6b7280' }}>
                  MONTO TOTAL A PAGAR
                </div>
                <h1 style={{ margin: '0 0 15px 0', fontSize: '42px', fontWeight: '900', letterSpacing: '-1px' }}>
                  ${(newOrderSuccess.total).toFixed(2)} <span style={{ fontSize: '16px', color: '#6b7280' }}>MXN</span>
                </h1>
                
                <p style={{ margin: '0 0 5px 0', fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '1px' }}>Referencia (Dictar al cajero)</p>
                <div style={{ fontSize: '24px', fontWeight: '900', letterSpacing: '4px', margin: '0 0 20px 0', fontFamily: 'monospace', padding: '10px', backgroundColor: '#f9fafb', border: '1px dashed #d1d5db', display: 'inline-block', borderRadius: '8px' }}>
                  {newOrderSuccess.oxxoReference}
                </div>
                
                <div style={{ width: '100%', maxWidth: '300px', height: '60px', margin: '0 auto', backgroundImage: 'url("https://upload.wikimedia.org/wikipedia/commons/e/e9/UPC-A-036000291452.svg")', backgroundSize: '100% 100%', backgroundRepeat: 'no-repeat' }}></div>
              </div>

              {/* Instructions */}
              <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', marginBottom: '30px' }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: 'bold' }}>Instrucciones para realizar el pago en OXXO</h3>
                <ol style={{ margin: 0, paddingLeft: '20px', fontSize: '12px', color: '#334155', lineHeight: '1.6' }}>
                  <li>Acude a cualquier tienda <strong>OXXO</strong> del país.</li>
                  <li>Indica al cajero que realizarás un pago de servicio a través de <strong>OXXO PAY</strong>.</li>
                  <li>Dicta al cajero los números de la Referencia que aparecen arriba, o muéstrale el código de barras para que lo escanee.</li>
                  <li>Realiza el pago correspondiente en efectivo.</li>
                  <li>Conserva el ticket impreso que te entregará el cajero como comprobante de pago.</li>
                </ol>
                <p style={{ margin: '15px 0 0 0', fontSize: '11px', color: '#e51a2e', fontWeight: 'bold' }}>
                  * OXXO cobrará una comisión adicional de $15.00 MXN al momento de realizar el pago en caja.
                </p>
              </div>

              {/* Footer / Legal */}
              <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '15px', fontSize: '9px', color: '#9ca3af', textAlign: 'justify', lineHeight: '1.5' }}>
                <p style={{ margin: '0 0 10px 0' }}>
                  IMPORTANTE: Este formato es de carácter estrictamente informativo y no es válido como recibo de pago ni comprobante fiscal. La transacción será confirmada en nuestro sistema de manera automática una vez que la tienda OXXO reporte los fondos depositados. Nexus Hardware no se hace responsable por pagos depositados a números de referencia incorrectos por error de dictado al cajero.
                </p>
                <div style={{ textAlign: 'center', fontWeight: 'bold', fontFamily: 'monospace', letterSpacing: '1px', color: '#d1d5db' }}>
                  ||1.0|{newOrderSuccess.id}|OXXOPAY|{newOrderSuccess.oxxoReference}|{newOrderSuccess.createdAt}||
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {newOrderSuccess && newOrderSuccess.paymentMethod !== 'oxxo' && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div onClick={() => setNewOrderSuccess(null)} className="absolute inset-0 bg-[#0B0F19]/80 backdrop-blur-md"></div>
          
          <div className="relative w-full max-w-md rounded-2xl border border-emerald-500/25 bg-[#151C2C] p-6 shadow-2xl z-10 text-center space-y-5 animate-zoomIn">
            <div className="inline-flex bg-emerald-500/10 p-3 rounded-full border border-emerald-500/20">
              <CheckCircle2 className="h-8 w-8 text-emerald-400" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-black text-white">¡PAGO PROCESADO EXITOSAMENTE!</h3>
              <p className="text-slate-400 text-xs">
                Se ha generado tu orden de compra en el sistema técnico de ensamblaje. Tu número de guía ha sido asignado.
              </p>
            </div>

            <div className="p-4 bg-slate-900 border border-white/5 rounded-xl space-y-1 font-mono">
              <span className="text-[9px] text-slate-500 font-sans uppercase tracking-widest block font-bold">Código de Rastreo</span>
              <span className="text-lg font-black text-cyan-400 tracking-widest">{newOrderSuccess.id}</span>
              <span className="text-[9px] text-slate-400 block font-sans mt-1.5">{newOrderSuccess.createdAt}</span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setNewOrderSuccess(null)}
                className="flex-grow py-3 bg-[#1e293b] hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl font-bold transition-all text-xs"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  setNewOrderSuccess(null);
                  navigate('/rastreo', { state: { trackingId: newOrderSuccess.id } });
                }}
                className="flex-grow py-3 bg-cyan-500 hover:bg-cyan-400 text-white rounded-xl font-bold transition-all text-xs shadow-neon-cyan"
              >
                Ir a Rastrear Orden
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
