import React from 'react';
import { Cpu } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-8 mt-auto z-10 glass-panel">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
        <div className="flex items-center space-x-2 mb-4 md:mb-0">
          <Cpu className="h-4 w-4 text-cyan-500" />
          <span className="font-bold text-slate-400">NEXUS HARDWARE & LOGISTICS</span>
        </div>
        <p>© {new Date().getFullYear()} Nexus Hardware. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
