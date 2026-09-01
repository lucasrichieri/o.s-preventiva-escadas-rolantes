import React from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { SAFETY_ALERT_TEXT } from '../data/tits502pData';

export default function AlertBlock({ alertConfirmed, setAlertConfirmed }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border-l-4 border-l-amber-500 border border-amber-200 bg-amber-50/90 p-5 mb-8 shadow-md">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-amber-100 text-amber-700 rounded-xl border border-amber-300 shrink-0 mt-0.5 shadow-sm">
          <AlertTriangle className="w-6 h-6 animate-pulse" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="bg-amber-200 text-amber-900 font-extrabold text-[10px] tracking-wider uppercase px-2.5 py-0.5 rounded-full border border-amber-300">
              AVISO OBRIGATÓRIO DE SEGURANÇA
            </span>
            <span className="text-xs text-amber-800 font-semibold">Norma TITS-502P (TKE)</span>
          </div>

          <p className="text-sm text-amber-950 font-semibold leading-relaxed mt-2">
            {SAFETY_ALERT_TEXT}
          </p>

          <div className="mt-4 pt-3 border-t border-amber-200 flex items-center justify-between">
            <label className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-amber-900 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={alertConfirmed}
                onChange={(e) => setAlertConfirmed(e.target.checked)}
                className="w-4.5 h-4.5 accent-amber-600 rounded cursor-pointer"
              />
              <span>Ciente e verificado no local de manutenção</span>
            </label>

            {alertConfirmed && (
              <span className="flex items-center gap-1.5 text-xs text-emerald-800 font-extrabold bg-emerald-100 px-3 py-1 rounded-lg border border-emerald-300 shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Validado pelo técnico
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
