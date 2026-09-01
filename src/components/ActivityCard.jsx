import React, { useRef } from 'react';
import { compressImage } from '../utils/imageCompressor';
import { Camera, Trash2, Check, X, Minus, ImagePlus, MessageSquare } from 'lucide-react';

export default function ActivityCard({ activity, itemState, onItemChange, clienteName, dataManutencao }) {
  const fileInputRef = useRef(null);

  const status = itemState?.status || 'Conforme';
  const comment = itemState?.comment || '';
  const photos = itemState?.photos || [];

  const handleStatusChange = (newStatus) => {
    onItemChange(activity.id, { ...itemState, status: newStatus });
  };

  const handleCommentChange = (e) => {
    onItemChange(activity.id, { ...itemState, comment: e.target.value });
  };

  const handlePhotoUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    try {
      const compressedPromises = files.map(file => compressImage(file, 800, 600, 0.75));
      const newPhotoUrls = await Promise.all(compressedPromises);
      onItemChange(activity.id, {
        ...itemState,
        photos: [...photos, ...newPhotoUrls]
      });
    } catch (err) {
      console.error("Erro ao comprimir foto:", err);
    }
  };

  const handleRemovePhoto = (index) => {
    const updated = photos.filter((_, i) => i !== index);
    onItemChange(activity.id, { ...itemState, photos: updated });
  };

  // Automatic photo legend generator
  const getPhotoLegend = (photoIndex) => {
    const condomínioStr = clienteName ? clienteName.trim() : "[Condomínio]";
    const dataStr = dataManutencao ? new Date(dataManutencao).toLocaleDateString('pt-BR') : "[Data]";
    const photoNumStr = photos.length > 1 ? ` (Foto ${photoIndex + 1})` : '';
    return `Item ${activity.code} - ${condomínioStr} - ${dataStr}${photoNumStr}`;
  };

  return (
    <div className={`rounded-xl border transition-all ${
      status === 'Não conforme'
        ? 'border-red-400 bg-red-50/70 shadow-md'
        : status === 'Conforme'
        ? 'border-slate-200 bg-white hover:border-purple-300 shadow-sm'
        : 'border-slate-200 bg-slate-50/70'
    } p-4 sm:p-5 mb-4`}>
      
      <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-3">
        <div className="flex items-start gap-3">
          <span className="bg-purple-100 text-purple-900 border border-purple-300 font-mono font-black text-xs px-2.5 py-1 rounded-lg shrink-0 mt-0.5 shadow-xs">
            {activity.code}
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-orange-600 uppercase font-extrabold tracking-wider">
                {activity.subgroup}
              </span>
              {!activity.isMonthly && (
                <span className="text-[10px] bg-purple-100 text-purple-800 px-2 py-0.5 rounded border border-purple-300 font-bold">
                  Complementar TKE
                </span>
              )}
            </div>
            <p className="text-sm font-bold text-slate-900 leading-snug mt-0.5">
              {activity.description}
            </p>
          </div>
        </div>

        {/* Status Selector Buttons */}
        <div className="flex items-center gap-1.5 self-end sm:self-start bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0">
          <button
            type="button"
            onClick={() => handleStatusChange('Conforme')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              status === 'Conforme'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Check className="w-3.5 h-3.5" />
            Conforme
          </button>

          <button
            type="button"
            onClick={() => handleStatusChange('Não conforme')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              status === 'Não conforme'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <X className="w-3.5 h-3.5" />
            Não Conforme
          </button>

          <button
            type="button"
            onClick={() => handleStatusChange('Não se aplica')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              status === 'Não se aplica'
                ? 'bg-slate-700 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Minus className="w-3.5 h-3.5" />
            N/A
          </button>
        </div>
      </div>

      {/* Observation Comment */}
      <div className="mt-3">
        <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold mb-1">
          <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
          <span>Observação / Comentário</span>
          {status === 'Não conforme' && (
            <span className="text-[10px] text-red-600 font-bold">* Detalhar a não conformidade</span>
          )}
        </div>
        <textarea
          rows={2}
          placeholder="Insira detalhes técnicos, observações ou recomendações para este item..."
          value={comment}
          onChange={handleCommentChange}
          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition-all resize-y font-medium"
        />
      </div>

      {/* Photos Attachment & Gallery Section */}
      <div className="mt-3.5 pt-3 border-t border-slate-200">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-slate-800 font-bold flex items-center gap-1.5">
            <Camera className="w-3.5 h-3.5 text-orange-600" />
            Fotos Anexadas ({photos.length})
          </span>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 text-xs font-bold bg-purple-50 hover:bg-purple-100 text-purple-900 px-3 py-1.5 rounded-lg border border-purple-300 transition-all cursor-pointer shadow-xs"
          >
            <ImagePlus className="w-3.5 h-3.5 text-orange-600" />
            Anexar Foto
          </button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handlePhotoUpload}
            accept="image/*"
            multiple
            className="hidden"
          />
        </div>

        {/* Photos Grid */}
        {photos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-3">
            {photos.map((url, idx) => (
              <div key={idx} className="group relative bg-white rounded-xl overflow-hidden border border-slate-300 shadow-sm">
                <img
                  src={url}
                  alt={`Foto ${idx + 1}`}
                  className="w-full h-36 object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemovePhoto(idx)}
                  className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-lg shadow-md transition-all cursor-pointer"
                  title="Remover foto"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <div className="p-2 bg-slate-50 border-t border-slate-200 text-[10px] text-slate-800 font-mono font-medium leading-tight">
                  <span className="text-orange-600 font-bold">Legenda:</span> {getPhotoLegend(idx)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[11px] text-slate-400 italic mt-1 font-medium">
            Nenhuma foto anexada a este item ainda.
          </p>
        )}
      </div>
    </div>
  );
}
