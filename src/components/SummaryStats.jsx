import React from 'react';
import { CheckCircle2, AlertTriangle, MinusCircle, Camera, PieChart } from 'lucide-react';

export default function SummaryStats({ activeActivities, itemStates }) {
  let conformeCount = 0;
  let naoConformeCount = 0;
  let naoAplicaCount = 0;
  let totalPhotos = 0;
  const naoConformesList = [];

  activeActivities.forEach(act => {
    const state = itemStates[act.id] || { status: 'Conforme', photos: [] };
    const status = state.status || 'Conforme';

    if (status === 'Conforme') conformeCount++;
    else if (status === 'Não conforme') {
      naoConformeCount++;
      naoConformesList.push({
        code: act.code,
        description: act.description,
        comment: state.comment || 'Sem comentário preenchido'
      });
    } else if (status === 'Não se aplica') naoAplicaCount++;

    if (state.photos) {
      totalPhotos += state.photos.length;
    }
  });

  return (
    <div className="glass-card p-6 mb-8 rounded-2xl bg-white/95 border border-slate-200 shadow-xl backdrop-blur-md">
      <div className="flex items-center gap-2 mb-4 text-purple-900 font-extrabold text-xs uppercase tracking-wider">
        <PieChart className="w-4 h-4 text-purple-700" />
        Resumo Executivo do Relatório TKE
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Conformes */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex flex-col items-center justify-center text-center shadow-xs">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 mb-1" />
          <span className="text-2xl font-black text-emerald-700">{conformeCount}</span>
          <span className="text-xs text-emerald-900 font-bold">Conformes</span>
        </div>

        {/* Não conformes */}
        <div className={`border rounded-xl p-4 flex flex-col items-center justify-center text-center transition-all ${
          naoConformeCount > 0
            ? 'bg-red-50 border-red-300 text-red-900 shadow-md'
            : 'bg-slate-50 border-slate-200 text-slate-500'
        }`}>
          <AlertTriangle className={`w-6 h-6 mb-1 ${naoConformeCount > 0 ? 'text-red-600 animate-bounce' : 'text-slate-400'}`} />
          <span className="text-2xl font-black text-red-600">{naoConformeCount}</span>
          <span className="text-xs font-bold">Não Conformes</span>
        </div>

        {/* Não se aplica */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-center shadow-xs">
          <MinusCircle className="w-6 h-6 text-slate-500 mb-1" />
          <span className="text-2xl font-black text-slate-700">{naoAplicaCount}</span>
          <span className="text-xs text-slate-600 font-bold">Não se Aplica</span>
        </div>

        {/* Total Fotos */}
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 flex flex-col items-center justify-center text-center shadow-xs">
          <Camera className="w-6 h-6 text-orange-600 mb-1" />
          <span className="text-2xl font-black text-purple-900">{totalPhotos}</span>
          <span className="text-xs text-purple-900 font-bold">Fotos Anexadas</span>
        </div>
      </div>

      {/* Detail list for Non-Conformities */}
      {naoConformeCount > 0 && (
        <div className="mt-5 p-4 bg-red-50 border border-red-200 rounded-xl">
          <h4 className="text-xs font-extrabold text-red-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            Detalhamento de Não-Conformidades ({naoConformeCount})
          </h4>
          <div className="space-y-2">
            {naoConformesList.map((nc, idx) => (
              <div key={idx} className="p-2.5 bg-white rounded-lg border border-red-200 text-xs shadow-xs">
                <div className="flex items-center gap-2">
                  <span className="bg-red-100 text-red-900 font-mono font-bold px-2 py-0.5 rounded border border-red-300">
                    {nc.code}
                  </span>
                  <span className="text-slate-900 font-bold">{nc.description}</span>
                </div>
                <p className="text-red-700 mt-1 italic pl-1 text-[11px] font-medium">
                  Obs: {nc.comment}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
