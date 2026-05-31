import React, { useState, useEffect } from 'react';
import { FileCheck, Receipt, Search, AlertTriangle, Printer } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import toast from 'react-hot-toast';

export default function Facturacion() {
  const location = useLocation();
  const initialOrderId = location.state?.orderId || '';

  const [invoiceSearchCode, setInvoiceSearchCode] = useState(initialOrderId);
  const [invoiceSearchError, setInvoiceSearchError] = useState('');
  const [selectedOrderToBill, setSelectedOrderToBill] = useState(null);
  const [billingForm, setBillingForm] = useState({ rfc: '', razonSocial: '', cp: '', regimen: '601', usoCfdi: 'G03' });
  const [generatedInvoice, setGeneratedInvoice] = useState(null);

  useEffect(() => {
    if (initialOrderId) {
      handleSearchOrderToBill(initialOrderId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialOrderId]);

  const [qrPattern] = useState(() => 
    Array.from({ length: 144 }).map((_, idx) => {
      const row = Math.floor(idx / 12);
      const col = idx % 12;
      if (row < 4 && col < 4) return (row === 0 || row === 3 || col === 0 || col === 3);
      if (row < 4 && col >= 8) return (row === 0 || row === 3 || col === 8 || col === 11);
      if (row >= 8 && col < 4) return (row === 8 || row === 11 || col === 0 || col === 3);
      return Math.sin(idx * 4.3) > 0;
    })
  );

  const handleSearchOrderToBill = async (code = null) => {
    setInvoiceSearchError('');
    setGeneratedInvoice(null);
    const targetCode = (code || invoiceSearchCode).trim().toUpperCase();
    
    if (!targetCode) {
      setInvoiceSearchError('Por favor introduce un código de pedido.');
      setSelectedOrderToBill(null);
      return;
    }

    try {
      const docSnap = await getDoc(doc(db, 'orders', targetCode));
      if (docSnap.exists()) {
        setSelectedOrderToBill(docSnap.data());
      } else {
        setInvoiceSearchError('El código de pedido no coincide con ningún registro.');
        setSelectedOrderToBill(null);
      }
    } catch (err) {
      console.error("Firestore invoice order lookup error:", err);
      setInvoiceSearchError('Error de red al consultar el pedido.');
      setSelectedOrderToBill(null);
    }
  };

  const handleGenerateCFDI = async (e) => {
    e.preventDefault();
    if (!selectedOrderToBill) return;

    // Check if it already has CFDI
    if (selectedOrderToBill.cfdi) {
      toast.error('Este pedido ya fue facturado anteriormente.');
      setGeneratedInvoice({ ...selectedOrderToBill.cfdi, order: selectedOrderToBill });
      return;
    }

    const randomUUID = () => {
      const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1).toUpperCase();
      return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
    };

    const uuid = randomUUID();
    const now = new Date();
    const formattedCertTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}T${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    const mockSello = "N3XU5Se11oD1g1ta1Em1s0rBase64==" + Math.floor(Math.random() * 1000000);
    const mockSelloSAT = "SATSe11oD1g1ta1Cert1f1cad0Base64==" + Math.floor(Math.random() * 1000000);
    const mockCadena = `||1.1|${uuid}|${formattedCertTime}|${mockSello}|00001000000504465028||`;

    const invoiceData = {
      uuid,
      certTime: formattedCertTime,
      selloEmisor: mockSello,
      selloSAT: mockSelloSAT,
      cadenaOriginal: mockCadena,
      rfcEmisor: "NEX260529HA1",
      razonSocialEmisor: "Nexus Hardware S.A. de C.V.",
      regimenEmisor: "601 - General de Ley Personas Morales",
      rfcReceptor: billingForm.rfc.toUpperCase(),
      razonSocialReceptor: billingForm.razonSocial.toUpperCase(),
      cpReceptor: billingForm.cp,
      regimenReceptor: billingForm.regimen,
      usoCfdi: billingForm.usoCfdi,
      order: selectedOrderToBill
    };

    try {
      await updateDoc(doc(db, 'orders', selectedOrderToBill.id), {
        cfdi: {
          uuid: invoiceData.uuid,
          certTime: invoiceData.certTime,
          selloEmisor: invoiceData.selloEmisor,
          selloSAT: invoiceData.selloSAT,
          cadenaOriginal: invoiceData.cadenaOriginal,
          rfcEmisor: invoiceData.rfcEmisor,
          razonSocialEmisor: invoiceData.razonSocialEmisor,
          regimenEmisor: invoiceData.regimenEmisor,
          rfcReceptor: invoiceData.rfcReceptor,
          razonSocialReceptor: invoiceData.razonSocialReceptor,
          cpReceptor: invoiceData.cpReceptor,
          regimenReceptor: invoiceData.regimenReceptor,
          usoCfdi: invoiceData.usoCfdi
        }
      });
      setGeneratedInvoice(invoiceData);
      toast.success('CFDI generado y registrado con éxito.');
    } catch (error) {
      console.error("Error saving CFDI:", error);
      toast.error('Error al guardar el CFDI en la base de datos.');
    }
  };

  const handleDownloadPDF = () => {
    // Relying on native browser print dialog for Save as PDF
    // Modern CSS (oklch) is fully supported by the browser natively.
    window.print();
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
      <div className="text-center space-y-3.5 pb-4">
        <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
          <FileCheck className="h-4 w-4 mr-1.5" /> Portal de Autofacturación CFDI 4.0
        </span>
        <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">FACTURACIÓN ELECTRÓNICA</h1>
        <p className="text-slate-400 text-xs md:text-sm max-w-lg mx-auto">
          Obtén tu CFDI de compra y descarga la representación impresa oficial en formato PDF.
        </p>
      </div>

      {generatedInvoice ? (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 bg-[#151C2C]/30 p-4 border border-white/5 rounded-2xl">
            <span className="text-xs text-slate-400">Su comprobante CFDI ha sido generado y timbrado con éxito.</span>
            <div className="flex gap-2">
              <button 
                onClick={() => {
                  setGeneratedInvoice(null);
                  setSelectedOrderToBill(null);
                  setInvoiceSearchCode('');
                }}
                className="px-4 py-2 text-xs font-bold bg-[#1e293b] text-slate-300 hover:text-white rounded-xl border border-white/5 transition-all"
              >
                Facturar otro pedido
              </button>
              <button 
                onClick={handleDownloadPDF}
                className="px-4 py-2 text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-white rounded-xl shadow-neon-cyan transition-all flex items-center space-x-1.5"
              >
                <Printer className="h-4 w-4" />
                <span>Descargar Factura (PDF)</span>
              </button>
            </div>
          </div>

          {/* Printable Invoice Page Layout */}
          <div id="sat-invoice" className="bg-white text-slate-900 p-6 md:p-10 rounded-2xl shadow-2xl border border-slate-300 space-y-6 text-[10px] font-sans">
            <div className="flex justify-between items-start border-b border-slate-300 pb-5 gap-4">
              <div className="space-y-1">
                <h2 className="text-lg font-black tracking-tight text-slate-900">FACTURA ELECTRÓNICA CFDI</h2>
                <p className="font-bold text-slate-600">VERSIÓN 4.0</p>
              </div>
              <div className="text-right font-mono space-y-0.5">
                <p className="text-slate-500 font-sans font-semibold">FOLIO FISCAL (UUID)</p>
                <p className="font-bold text-slate-900 text-xs">{generatedInvoice.uuid}</p>
                <p className="text-slate-500 font-sans font-semibold">NÚMERO DE CERTIFICADO SAT</p>
                <p className="font-bold text-slate-900">00001000000504465028</p>
                <p className="text-slate-500 font-sans font-semibold font-bold">FECHA Y HORA DE CERTIFICACIÓN</p>
                <p className="font-bold text-slate-900">{generatedInvoice.certTime}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-slate-200 pb-5">
              <div className="space-y-1 bg-slate-50 p-3.5 rounded-lg border border-slate-100">
                <h4 className="font-extrabold text-slate-900 border-b border-slate-200 pb-1 mb-1.5 uppercase">EMISOR</h4>
                <p><strong className="text-slate-500">Razón Social:</strong> <span className="font-bold">{generatedInvoice.razonSocialEmisor}</span></p>
                <p><strong className="text-slate-500">RFC:</strong> <span className="font-mono font-bold">{generatedInvoice.rfcEmisor}</span></p>
                <p><strong className="text-slate-500">Régimen Fiscal:</strong> <span>{generatedInvoice.regimenEmisor}</span></p>
              </div>
              <div className="space-y-1 bg-slate-50 p-3.5 rounded-lg border border-slate-100">
                <h4 className="font-extrabold text-slate-900 border-b border-slate-200 pb-1 mb-1.5 uppercase">RECEPTOR</h4>
                <p><strong className="text-slate-500">Razón Social:</strong> <span className="font-bold">{generatedInvoice.razonSocialReceptor}</span></p>
                <p><strong className="text-slate-500">RFC:</strong> <span className="font-mono font-bold">{generatedInvoice.rfcReceptor}</span></p>
                <p><strong className="text-slate-500">Domicilio Fiscal (CP):</strong> <span>{generatedInvoice.cpReceptor}</span></p>
                <p><strong className="text-slate-500">Régimen Receptor:</strong> <span>{generatedInvoice.regimenReceptor}</span></p>
                <p><strong className="text-slate-500">Uso de CFDI:</strong> <span className="uppercase">{generatedInvoice.usoCfdi}</span></p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-extrabold text-slate-900 border-b border-slate-200 pb-1 uppercase">Conceptos del Pedido</h4>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-300 text-slate-500 font-bold">
                    <th className="py-2">Clave</th>
                    <th className="py-2">Cant.</th>
                    <th className="py-2">Descripción</th>
                    <th className="py-2 text-right">P. Unitario</th>
                    <th className="py-2 text-right">Importe</th>
                  </tr>
                </thead>
                <tbody>
                  {generatedInvoice.order.items.map((item, idx) => (
                    <tr key={idx} className="border-b border-slate-100 text-slate-800">
                      <td className="py-2 font-mono">43201500</td>
                      <td className="py-2">{item.quantity}</td>
                      <td className="py-2">{item.name} ({item.category})</td>
                      <td className="py-2 text-right">${item.price.toFixed(2)}</td>
                      <td className="py-2 text-right">${(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end pt-4">
              <div className="w-64 space-y-2 border-t border-slate-300 pt-3 text-right">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span className="font-mono font-bold text-slate-900">${generatedInvoice.order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>IVA Trasladado (16.00%):</span>
                  <span className="font-mono font-bold text-slate-900">${generatedInvoice.order.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t border-slate-300 pt-2 text-sm font-extrabold text-slate-900">
                  <span>TOTAL FACTURA:</span>
                  <span className="font-mono">${generatedInvoice.order.total.toFixed(2)} MXN</span>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-300 pt-5 flex flex-col md:flex-row items-center md:items-start gap-6 font-mono text-[8px] text-slate-500 leading-normal">
              <div className="w-24 h-24 bg-white border border-slate-300 p-1 shrink-0 grid grid-cols-12 gap-0.5 select-none">
                {qrPattern.map((cellBlack, idx) => (
                  <div key={idx} className={`w-1.5 h-1.5 ${cellBlack ? 'bg-black' : 'bg-white'}`}></div>
                ))}
              </div>

              <div className="flex-grow space-y-3.5 max-w-full overflow-hidden">
                <div className="space-y-0.5">
                  <strong className="text-slate-800 font-bold block">CADENA ORIGINAL DE CERTIFICACIÓN DIGITAL DEL SAT</strong>
                  <p className="break-all bg-slate-50 p-2 border border-slate-100 rounded text-slate-600 font-mono select-all">
                    {generatedInvoice.cadenaOriginal}
                  </p>
                </div>
                <div className="space-y-0.5">
                  <strong className="text-slate-800 font-bold block">SELLO DIGITAL DEL EMISOR</strong>
                  <p className="break-all bg-slate-50 p-2 border border-slate-100 rounded text-slate-600 font-mono select-all">
                    {generatedInvoice.selloEmisor}
                  </p>
                </div>
                <div className="space-y-0.5">
                  <strong className="text-slate-800 font-bold block">SELLO DIGITAL DEL SAT</strong>
                  <p className="break-all bg-slate-50 p-2 border border-slate-100 rounded text-slate-600 font-mono select-all">
                    {generatedInvoice.selloSAT}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-white/5 bg-[#151C2C]/50 p-6 glass-panel space-y-6">
          <div className="space-y-3">
            <label className="text-xs text-slate-300 font-extrabold uppercase tracking-wide">Paso 1: Localizar Pedido</label>
            <div className="flex flex-col sm:flex-row items-stretch gap-3">
              <div className="relative flex-grow">
                <Receipt className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  value={invoiceSearchCode}
                  onChange={(e) => setInvoiceSearchCode(e.target.value)}
                  placeholder="Ingrese código de pedido (NEX-XXXXXX)"
                  className="w-full pl-11 pr-4 py-3 bg-[#0B0F19] text-white border border-white/5 rounded-xl text-xs uppercase focus:border-cyan-500/40 focus:outline-none"
                />
              </div>
              <button
                onClick={() => handleSearchOrderToBill()}
                className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-white rounded-xl text-xs font-bold transition-all shadow-neon-cyan flex items-center justify-center space-x-2"
              >
                <Search className="h-4 w-4" />
                <span>Buscar Pedido</span>
              </button>
            </div>
            {invoiceSearchError && (
              <span className="text-red-400 text-xs flex items-center space-x-1.5 pt-1.5">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>{invoiceSearchError}</span>
              </span>
            )}
          </div>

          {selectedOrderToBill && (
            <div className="pt-6 border-t border-white/5 space-y-5 animate-fadeIn">
              <div className="p-4 bg-slate-900 border border-white/2 rounded-xl text-xs text-slate-300 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <div>
                  <span className="text-[9px] text-slate-500 font-extrabold block uppercase tracking-wider">Orden Encontrada</span>
                  <span className="font-mono text-white font-bold">{selectedOrderToBill.id}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-500 font-extrabold block uppercase tracking-wider">Importe Total (IVA Inc.)</span>
                  <span className="font-mono text-cyan-400 font-bold">${selectedOrderToBill.total.toFixed(2)} MXN</span>
                </div>
              </div>

              <form onSubmit={handleGenerateCFDI} className="space-y-4 text-xs">
                <span className="text-xs text-slate-300 font-extrabold uppercase tracking-wide block">Paso 2: Registrar Datos de Facturación</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">RFC (Receptor)</label>
                    <input 
                      required 
                      type="text" 
                      maxLength={13}
                      placeholder="RFC (12 o 13 caracteres)"
                      value={billingForm.rfc}
                      onChange={(e) => setBillingForm({ ...billingForm, rfc: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#0B0F19] text-white border border-white/5 rounded-xl uppercase focus:border-cyan-500/40 focus:outline-none" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Razón Social (Receptor)</label>
                    <input 
                      required 
                      type="text" 
                      placeholder="Nombre completo o razón social registrada en SAT"
                      value={billingForm.razonSocial}
                      onChange={(e) => setBillingForm({ ...billingForm, razonSocial: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#0B0F19] text-white border border-white/5 rounded-xl focus:border-cyan-500/40 focus:outline-none" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Código Postal Fiscal</label>
                    <input 
                      required 
                      type="text" 
                      maxLength={5}
                      placeholder="Código Postal receptor"
                      value={billingForm.cp}
                      onChange={(e) => setBillingForm({ ...billingForm, cp: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#0B0F19] text-white border border-white/5 rounded-xl focus:border-cyan-500/40 focus:outline-none" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Régimen Fiscal (SAT)</label>
                    <select 
                      value={billingForm.regimen}
                      onChange={(e) => setBillingForm({ ...billingForm, regimen: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#0B0F19] text-white border border-white/5 rounded-xl focus:border-cyan-500/40 focus:outline-none cursor-pointer"
                    >
                      <option value="601">601 - General de Ley Personas Morales</option>
                      <option value="603">603 - Personas Morales con Fines no Lucrativos</option>
                      <option value="605">605 - Sueldos y Salarios</option>
                      <option value="612">612 - Personas Físicas con Actividades Empresariales</option>
                      <option value="626">626 - Régimen Simplificado de Confianza (RESICO)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Uso de CFDI</label>
                  <select 
                    value={billingForm.usoCfdi}
                    onChange={(e) => setBillingForm({ ...billingForm, usoCfdi: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#0B0F19] text-white border border-white/5 rounded-xl focus:border-cyan-500/40 focus:outline-none cursor-pointer"
                  >
                    <option value="G01">G01 - Adquisición de mercancías</option>
                    <option value="G03">G03 - Gastos en general</option>
                    <option value="I01">I01 - Construcciones</option>
                    <option value="I02">I02 - Mobiliario y equipo de oficina por inversiones</option>
                    <option value="I04">I04 - Equipo de cómputo y accesorios</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white rounded-xl font-bold transition-all shadow-neon-cyan flex items-center justify-center space-x-1.5"
                >
                  <FileCheck className="h-4.5 w-4.5" />
                  <span>Generar y Timbrar CFDI 4.0</span>
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
