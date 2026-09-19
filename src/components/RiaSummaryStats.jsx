import React from 'react';
import { CheckCircle2, AlertTriangle, AlertOctagon, HelpCircle, Wrench } from 'lucide-react';
import { RIA_SECTIONS } from '../data/riaData';

export default function RiaSummaryStats({ itemStates = {} }) {
  let countConforme = 0;
  let countNaoConforme = 0;
  let countATR = 0;
  let countNA = 0;
  let countOrcamento = 0;

  RIA_SECTIONS.forEach(sec => {
    sec.items.forEach(item => {
      const state = itemStates[item.id] || {};
      if (item.isParent) {
        if (state.subItemsState) {
          Object.values(state.subItemsState).forEach(sub => {
            if (sub.checked) {
              countNaoConforme++;
              if (sub.corr === 'ORÇ') countOrcamento++;
            }
          });
        }
      } else {
        const res = state.result || item.defaultResult;
        const corr = state.corr || item.defaultCorr;
        if (res === 'C') countConforme++;
        else if (res === 'NC') countNaoConforme++;
        else if (res === 'ATR') countATR++;
        else if (res === 'N/A') countNA++;

        if (corr === 'ORÇ') countOrcamento++;
      }
    });
  });

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-8">
      {/* Conformes */}
      <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-emerald-200 shadow-sm flex items-center justify-between">
        <div>
          <span className="text-[10px] sm:text-xs font-bold text-emerald-800 uppercase tracking-wider block">
            Conformes (C)
          </span>
          <span className="text-xl sm:text-2xl font-black text-emerald-600">
            {countConforme}
          </span>
        </div>
        <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
          <CheckCircle2 className="w-5 h-5" />
        </div>
      </div>

      {/* Não Conformes */}
      <div className={`p-4 rounded-2xl border backdrop-blur-md shadow-sm flex items-center justify-between transition-all ${
        countNaoConforme > 0
          ? 'bg-red-50/90 border-red-300 text-red-900 shadow-red-100'
          : 'bg-white/90 border-slate-200 text-slate-700'
      }`}>
        <div>
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider block">
            Não Conformes (NC)
          </span>
          <span className="text-xl sm:text-2xl font-black text-red-600">
            {countNaoConforme}
          </span>
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
          countNaoConforme > 0 ? 'bg-red-200 text-red-700' : 'bg-slate-100 text-slate-500'
        }`}>
          <AlertOctagon className="w-5 h-5" />
        </div>
      </div>

      {/* Atualização Técnica Recomendada */}
      <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-amber-200 shadow-sm flex items-center justify-between">
        <div>
          <span className="text-[10px] sm:text-xs font-bold text-amber-900 uppercase tracking-wider block">
            Recomendações (ATR)
          </span>
          <span className="text-xl sm:text-2xl font-black text-amber-600">
            {countATR}
          </span>
        </div>
        <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
          <AlertTriangle className="w-5 h-5" />
        </div>
      </div>

      {/* Orçamentos Pendentes */}
      <div className={`p-4 rounded-2xl border backdrop-blur-md shadow-sm flex items-center justify-between transition-all ${
        countOrcamento > 0
          ? 'bg-orange-50/90 border-orange-300 text-orange-900'
          : 'bg-white/90 border-slate-200 text-slate-700'
      }`}>
        <div>
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider block">
            Orçamentos (ORÇ)
          </span>
          <span className="text-xl sm:text-2xl font-black text-orange-600">
            {countOrcamento}
          </span>
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
          countOrcamento > 0 ? 'bg-orange-200 text-orange-800' : 'bg-slate-100 text-slate-500'
        }`}>
          <Wrench className="w-5 h-5" />
        </div>
      </div>

      {/* Não Aplicável */}
      <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between col-span-2 sm:col-span-1">
        <div>
          <span className="text-[10px] sm:text-xs font-bold text-slate-600 uppercase tracking-wider block">
            Não Aplicável (N/A)
          </span>
          <span className="text-xl sm:text-2xl font-black text-slate-700">
            {countNA}
          </span>
        </div>
        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
          <HelpCircle className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
