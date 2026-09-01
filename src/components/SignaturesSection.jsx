import React from 'react';
import { PenTool, UserCheck } from 'lucide-react';

export default function SignaturesSection({ signatures, setSignatures }) {
  const handleChange = (field, subfield, value) => {
    setSignatures(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        [subfield]: value
      }
    }));
  };

  return (
    <div className="glass-card p-6 mb-8 rounded-2xl bg-white/95 border border-slate-200 shadow-xl backdrop-blur-md">
      <div className="flex items-center gap-2 mb-4 text-purple-900 font-extrabold text-xs uppercase tracking-wider">
        <PenTool className="w-4 h-4 text-purple-700" />
        Validação e Assinaturas Técnicas (TKE)
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Elaborado por */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-3 border-b border-slate-200 pb-2">
            <UserCheck className="w-4 h-4 text-purple-700" />
            1. Elaborado por (Técnico de Campo)
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-[11px] text-slate-600 mb-1 font-bold">Nome Completo</label>
              <input
                type="text"
                placeholder="Nome do Técnico TKE"
                value={signatures.elaborado.nome}
                onChange={(e) => handleChange('elaborado', 'nome', e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-600 font-medium"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-600 mb-1 font-bold">Data</label>
              <input
                type="date"
                value={signatures.elaborado.data}
                onChange={(e) => handleChange('elaborado', 'data', e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-purple-600 font-medium"
              />
            </div>
          </div>
        </div>

        {/* Revisado por */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-3 border-b border-slate-200 pb-2">
            <UserCheck className="w-4 h-4 text-purple-700" />
            2. Revisado por (Supervisão TKE)
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-[11px] text-slate-600 mb-1 font-bold">Nome Completo</label>
              <input
                type="text"
                placeholder="Nome do Supervisor TKE"
                value={signatures.revisado.nome}
                onChange={(e) => handleChange('revisado', 'nome', e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-600 font-medium"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-600 mb-1 font-bold">Data</label>
              <input
                type="date"
                value={signatures.revisado.data}
                onChange={(e) => handleChange('revisado', 'data', e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-purple-600 font-medium"
              />
            </div>
          </div>
        </div>

        {/* Aprovado por */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-3 border-b border-slate-200 pb-2">
            <UserCheck className="w-4 h-4 text-purple-700" />
            3. Aprovado por (Gerência/Cliente)
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-[11px] text-slate-600 mb-1 font-bold">Nome Completo</label>
              <input
                type="text"
                placeholder="Nome do Aprovador"
                value={signatures.aprovado.nome}
                onChange={(e) => handleChange('aprovado', 'nome', e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-600 font-medium"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-600 mb-1 font-bold">Data</label>
              <input
                type="date"
                value={signatures.aprovado.data}
                onChange={(e) => handleChange('aprovado', 'data', e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-purple-600 font-medium"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
