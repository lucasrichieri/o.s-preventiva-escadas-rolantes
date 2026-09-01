import React from 'react';
import { MONTHS, ACTIVITIES } from '../data/tits502pData';
import { Building2, MapPin, Wrench, Calendar, UserCheck, Sparkles, FileText, CheckCircle2 } from 'lucide-react';

export default function HeaderForm({ headerData, setHeaderData, onFillDemo }) {
  const handleChange = (field, value) => {
    setHeaderData(prev => ({ ...prev, [field]: value }));
  };

  const selectedMonth = headerData.mesRef || 1;
  const currentMonthObj = MONTHS.find(m => m.id === selectedMonth) || MONTHS[0];

  // Cálculo automático de itens unificados para o mês
  const monthlyCount = ACTIVITIES.filter(a => a.isMonthly).length;
  const periodicCount = ACTIVITIES.filter(a => !a.isMonthly && a.months && a.months.includes(selectedMonth)).length;
  const totalCount = monthlyCount + periodicCount;

  return (
    <div className="glass-card p-6 mb-8 rounded-2xl bg-white/95 border border-slate-200 shadow-xl backdrop-blur-md relative overflow-hidden">
      {/* Decorative top accent line with TKE logo colors */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-700 via-rose-600 to-orange-500" />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase">
            <span className="tke-gradient-text font-black flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-purple-700" />
              PADRÃO OFICIAL TKE — DOCUMENTO TITS-502P
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1 tracking-tight">
            Relatório Fotográfico de Manutenção Preventiva Unificada
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5 font-medium">
            Escadas e Esteiras Rolantes - TK Elevator
          </p>
        </div>

        <button
          onClick={onFillDemo}
          type="button"
          className="tke-btn-gradient flex items-center gap-2 px-4 py-2.5 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <Sparkles className="w-4 h-4 text-amber-200" />
          Preencher Dados de Teste (Demo)
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Cliente / Condomínio */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-purple-700" />
            Cliente / Condomínio
          </label>
          <input
            type="text"
            placeholder="Ex: Condomínio Edifício Plaza Center"
            value={headerData.cliente}
            onChange={(e) => handleChange('cliente', e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition-all font-medium"
          />
        </div>

        {/* Endereço / Local */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-purple-700" />
            Endereço / Local de Instalação
          </label>
          <input
            type="text"
            placeholder="Ex: Av. Paulista, 1000 - Bloco A"
            value={headerData.endereco}
            onChange={(e) => handleChange('endereco', e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition-all font-medium"
          />
        </div>

        {/* Identificação Equipamento */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <Wrench className="w-3.5 h-3.5 text-purple-700" />
            Nº de Série / Tag do Equipamento
          </label>
          <input
            type="text"
            placeholder="Ex: ESC-01 (S/N: TK-884920)"
            value={headerData.equipamento}
            onChange={(e) => handleChange('equipamento', e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition-all font-mono font-bold"
          />
        </div>

        {/* Data da Manutenção */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-purple-700" />
            Data da Manutenção
          </label>
          <input
            type="date"
            value={headerData.data}
            onChange={(e) => handleChange('data', e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition-all font-medium"
          />
        </div>

        {/* Técnico(s) Responsável(is) */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-purple-700" />
            Técnico(s) Responsável(is)
          </label>
          <input
            type="text"
            placeholder="Ex: Carlos Silva & Roberto Alves"
            value={headerData.tecnicos}
            onChange={(e) => handleChange('tecnicos', e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition-all font-medium"
          />
        </div>

        {/* Mês de Referência (Cruza com a matriz) */}
        <div>
          <label className="block text-xs font-extrabold text-orange-600 mb-1.5 flex items-center justify-between">
            <span>Mês de Referência (Matriz TKE)</span>
            <span className="text-[10px] bg-orange-100 text-orange-900 font-extrabold px-1.5 py-0.5 rounded">Unifica Cronograma</span>
          </label>
          <select
            value={headerData.mesRef}
            onChange={(e) => handleChange('mesRef', parseInt(e.target.value))}
            className="w-full bg-purple-50 border border-orange-500/80 rounded-xl px-3.5 py-2.5 text-sm text-purple-950 font-black focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all cursor-pointer"
          >
            {MONTHS.map(m => (
              <option key={m.id} value={m.id} className="bg-white text-slate-900 font-bold">
                {m.id.toString().padStart(2, '0')} - {m.name}
              </option>
            ))}
          </select>
        </div>

        {/* Escopo Unificado da Visita */}
        <div className="md:col-span-2 lg:col-span-3 pt-3 border-t border-slate-200">
          <div className="bg-gradient-to-r from-purple-900/10 via-orange-500/10 to-purple-900/10 border border-purple-300/80 p-3.5 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="bg-purple-950 text-amber-300 font-mono font-black text-[10px] px-2.5 py-1 rounded-md tracking-wider">
                ESCOPO UNIFICADO
              </span>
              <div>
                <h4 className="text-xs sm:text-sm font-black text-slate-900">
                  Manutenção Preventiva Periódica — {currentMonthObj.name}
                </h4>
                <p className="text-[11px] text-slate-600 font-medium">
                  Contempla atividades de rotina mensal + atividades complementares programadas para este mês.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold flex-wrap">
              <span className="bg-blue-100 text-blue-900 px-2.5 py-1 rounded-lg border border-blue-300">
                {monthlyCount} Mensais
              </span>
              <span className="bg-amber-100 text-amber-900 px-2.5 py-1 rounded-lg border border-amber-300">
                {periodicCount} Periódicas ({currentMonthObj.short})
              </span>
              <span className="bg-purple-950 text-white px-2.5 py-1 rounded-lg shadow-sm">
                Total: {totalCount} Itens
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
