import React from 'react';
import { FileCheck2, MapPin, UserCheck, Building } from 'lucide-react';

export default function RiaConclusaoSection({
  headerData,
  setHeaderData
}) {
  const handleChange = (field, value) => {
    setHeaderData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="glass-card p-6 mb-8 rounded-2xl bg-white/95 border border-slate-200 shadow-xl backdrop-blur-md relative overflow-hidden">
      {/* Decorative top bar */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-700 via-rose-600 to-orange-500" />

      <h3 className="text-base sm:text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
        <FileCheck2 className="w-5 h-5 text-purple-700" />
        Conclusão da Inspeção e Termo de Encerramento (TKE)
      </h3>

      {/* Conclusão Textarea */}
      <div className="mb-6">
        <label className="block text-xs font-bold text-slate-700 mb-1.5">
          Conclusão Técnica / Parecer da Inspeção Anual:
        </label>
        <textarea
          rows={3}
          placeholder="Descreva a conclusão técnica sobre a segurança, condições de operação e recomendações gerais para o equipamento..."
          value={headerData.conclusao || ''}
          onChange={(e) => handleChange('conclusao', e.target.value)}
          className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition-all font-medium resize-y"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4 border-t border-slate-200">
        {/* Local, Data e Emissor */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-purple-700" />
            Localidade e Data de Emissão (Cidade, DD/MM/AAAA)
          </label>
          <input
            type="text"
            placeholder="Ex: PASSO FUNDO, 19/09/2026"
            value={headerData.cidade || ''}
            onChange={(e) => handleChange('cidade', e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 font-bold uppercase mb-3"
          />

          <div className="mt-2 text-xs text-slate-600">
            <p className="font-semibold">Cordialmente,</p>
            <p className="font-black text-purple-950 text-sm tracking-tight mt-0.5">
              {headerData.empresa || 'TK ELEVADORES BRASIL LTDA'}
            </p>
          </div>
        </div>

        {/* Termo de Ciência do Cliente */}
        <div className="bg-purple-50/50 p-4 rounded-xl border border-purple-200">
          <label className="block text-xs font-bold text-purple-950 mb-1 flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-purple-700" />
            Ciente do Cliente / Responsável Predial
          </label>
          <p className="text-[11px] text-slate-600 italic mb-2">
            "Recebi o relatório 'RELATÓRIO DE INSPEÇÃO ANUAL - ESCADAS E ESTEIRAS'"
          </p>

          <input
            type="text"
            placeholder="Nome do Cliente / Responsável (ex: Shoping Bella Citta)"
            value={headerData.clienteNome || ''}
            onChange={(e) => handleChange('clienteNome', e.target.value)}
            className="w-full bg-white border border-purple-300 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 font-bold"
          />
        </div>
      </div>
    </div>
  );
}
