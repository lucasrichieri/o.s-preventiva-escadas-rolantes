import React, { useState } from 'react';
import ActivityCard from './ActivityCard';
import { ChevronDown, ChevronUp, CheckCircle, AlertOctagon, MinusCircle } from 'lucide-react';

export default function StageSection({ stage, activities, itemStates, onItemChange, clienteName, dataManutencao }) {
  const [isOpen, setIsOpen] = useState(true);

  // Count stats for this stage
  const stageStats = activities.reduce(
    (acc, act) => {
      const status = itemStates[act.id]?.status || 'Conforme';
      if (status === 'Conforme') acc.conforme++;
      else if (status === 'Não conforme') acc.naoConforme++;
      else if (status === 'Não se aplica') acc.naoAplica++;
      return acc;
    },
    { conforme: 0, naoConforme: 0, naoAplica: 0 }
  );

  return (
    <div className="glass-card rounded-2xl border border-slate-200 bg-white shadow-lg overflow-hidden mb-6">
      {/* Stage Header Bar */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 bg-gradient-to-r from-slate-50 via-white to-purple-50/60 border-b border-slate-200 hover:bg-slate-100/50 transition-colors cursor-pointer select-none"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-700 via-rose-600 to-orange-500 flex items-center justify-center text-white font-extrabold text-base shadow-md">
            {stage.id}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                {stage.title}
              </h3>
              <span className="text-[10px] bg-purple-100 text-purple-900 px-2.5 py-0.5 rounded-md border border-purple-300 font-bold">
                {stage.badge}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">{stage.subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Stage summary pills */}
          <div className="hidden sm:flex items-center gap-2 text-xs font-bold">
            <span className="flex items-center gap-1 bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-lg border border-emerald-200">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> {stageStats.conforme}
            </span>
            {stageStats.naoConforme > 0 && (
              <span className="flex items-center gap-1 bg-red-50 text-red-800 px-2.5 py-1 rounded-lg border border-red-300 font-extrabold animate-pulse">
                <AlertOctagon className="w-3.5 h-3.5 text-red-600" /> {stageStats.naoConforme}
              </span>
            )}
            {stageStats.naoAplica > 0 && (
              <span className="flex items-center gap-1 bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-300">
                <MinusCircle className="w-3.5 h-3.5 text-slate-500" /> {stageStats.naoAplica}
              </span>
            )}
          </div>

          <div className="text-slate-500 hover:text-slate-900">
            {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </div>
      </div>

      {/* Stage Body */}
      {isOpen && (
        <div className="p-4 sm:p-6 bg-slate-50/60">
          {activities.length > 0 ? (
            activities.map(act => (
              <ActivityCard
                key={act.id}
                activity={act}
                itemState={itemStates[act.id]}
                onItemChange={onItemChange}
                clienteName={clienteName}
                dataManutencao={dataManutencao}
              />
            ))
          ) : (
            <p className="text-center py-6 text-xs text-slate-400 italic font-medium">
              Nenhuma atividade aplicável para esta etapa no mês de referência selecionado.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
