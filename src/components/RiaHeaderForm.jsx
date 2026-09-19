import React from 'react';
import { Building2, MapPin, Wrench, Calendar, FileText, Sparkles, Hash, Layers, ShieldCheck, Factory, Cpu, DoorClosed, Gauge } from 'lucide-react';

export default function RiaHeaderForm({
  headerData,
  setHeaderData,
  onFillDemo,
  onSwitchToMonthly
}) {
  const handleChange = (field, value) => {
    setHeaderData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="glass-card p-6 mb-8 rounded-2xl bg-white/95 border border-slate-200 shadow-xl backdrop-blur-md relative overflow-hidden">
      {/* Decorative top accent line with TKE logo colors */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-700 via-rose-600 to-orange-500" />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase">
            <span className="tke-gradient-text font-black flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-purple-700" />
              TK ELEVATOR — RELATÓRIO OFICIAL DE INSPEÇÃO ANUAL (RIA)
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1 tracking-tight">
            RELATÓRIO DE INSPEÇÃO ANUAL - ESCADAS E ESTEIRAS
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5 font-medium">
            Inspeção Técnica Periódica Anual de Segurança e Conservação Mecânica/Elétrica
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onFillDemo}
            type="button"
            className="tke-btn-gradient flex items-center gap-2 px-4 py-2.5 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Sparkles className="w-4 h-4 text-amber-200" />
            Preencher Demo RIA (Shopping Bella Citta)
          </button>
        </div>
      </div>

      {/* Grid of Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {/* Edifício */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-purple-700" />
            Edifício / Shopping
          </label>
          <input
            type="text"
            placeholder="Ex: SHOPING BELLA CITTA"
            value={headerData.edificio || ''}
            onChange={(e) => handleChange('edificio', e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition-all font-bold uppercase"
          />
        </div>

        {/* Endereço */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-purple-700" />
            Endereço Completo
          </label>
          <input
            type="text"
            placeholder="Ex: RUA CORONEL CHICUTA 355 CENTRO 99010050 PASSO FUNDO RS"
            value={headerData.endereco || ''}
            onChange={(e) => handleChange('endereco', e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition-all font-medium uppercase"
          />
        </div>

        {/* Equipamento */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <Wrench className="w-3.5 h-3.5 text-purple-700" />
            Equipamento (Tag / Número)
          </label>
          <input
            type="text"
            placeholder="Ex: 138644"
            value={headerData.equipamento || ''}
            onChange={(e) => handleChange('equipamento', e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition-all font-mono font-bold"
          />
        </div>

        {/* Fabricante */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <Factory className="w-3.5 h-3.5 text-purple-700" />
            Fabricante
          </label>
          <input
            type="text"
            placeholder="Ex: Schindler, TK Elevator, Otis"
            value={headerData.fabricante || ''}
            onChange={(e) => handleChange('fabricante', e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition-all font-medium"
          />
        </div>

        {/* Paradas / Entradas */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-purple-700" />
            Paradas / Entradas
          </label>
          <input
            type="text"
            placeholder="Ex: 0 ou 2"
            value={headerData.paradasEntradas || ''}
            onChange={(e) => handleChange('paradasEntradas', e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition-all font-medium"
          />
        </div>

        {/* Máquina */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-purple-700" />
            Máquina
          </label>
          <input
            type="text"
            placeholder="Ex: Máquina não cadastrada."
            value={headerData.maquina || ''}
            onChange={(e) => handleChange('maquina', e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition-all font-medium"
          />
        </div>

        {/* Quadro de comando */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-700" />
            Quadro de Comando
          </label>
          <input
            type="text"
            placeholder="Ex: Microprocessado / Indefinido"
            value={headerData.quadroComando || ''}
            onChange={(e) => handleChange('quadroComando', e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition-all font-medium"
          />
        </div>

        {/* Portas pavimento */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <DoorClosed className="w-3.5 h-3.5 text-purple-700" />
            Portas Pavimento
          </label>
          <input
            type="text"
            placeholder="Ex: Indefinida"
            value={headerData.portasPavimento || ''}
            onChange={(e) => handleChange('portasPavimento', e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition-all font-medium"
          />
        </div>

        {/* Capacidade */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <Gauge className="w-3.5 h-3.5 text-purple-700" />
            Capacidade
          </label>
          <input
            type="text"
            placeholder="Ex: 0 ou 6000 pess/h"
            value={headerData.capacidade || ''}
            onChange={(e) => handleChange('capacidade', e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition-all font-medium"
          />
        </div>

        {/* DATA INSPEÇÃO */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-purple-700" />
            Data da Inspeção Anual
          </label>
          <input
            type="date"
            value={headerData.data || ''}
            onChange={(e) => handleChange('data', e.target.value)}
            className="w-full bg-purple-50 border border-purple-300 rounded-xl px-3.5 py-2.5 text-sm text-purple-950 font-bold focus:bg-white focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition-all"
          />
        </div>

        {/* Código */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <Hash className="w-3.5 h-3.5 text-purple-700" />
            Código do Relatório
          </label>
          <input
            type="text"
            placeholder="Ex: 988039"
            value={headerData.codigo || ''}
            onChange={(e) => handleChange('codigo', e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition-all font-mono font-bold"
          />
        </div>
      </div>
    </div>
  );
}
