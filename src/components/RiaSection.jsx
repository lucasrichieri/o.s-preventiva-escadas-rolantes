import React, { useState, useRef } from 'react';
import { Camera, ImagePlus, Trash2, CheckCircle2, ChevronDown, ChevronUp, AlertCircle, MessageSquare } from 'lucide-react';
import { RIA_RESULTS, RIA_CORRECTIONS } from '../data/riaData';
import { compressImage } from '../utils/imageCompressor';
import CameraCaptureModal from './CameraCaptureModal';

export default function RiaSection({
  section,
  itemStates = {},
  onItemChange,
  edificioName,
  dataInspeção
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeCameraItem, setActiveCameraItem] = useState(null);
  const fileInputRefs = useRef({});

  const handleFieldChange = (itemId, field, value) => {
    const currentState = itemStates[itemId] || {
      result: 'C',
      corr: '--',
      descricao: '',
      providencias: '',
      photos: []
    };
    onItemChange(itemId, {
      ...currentState,
      [field]: value
    });
  };

  const handleSubItemToggle = (parentId, subId, isChecked, defaultCorr = 'ORÇ') => {
    const currentState = itemStates[parentId] || {
      result: '',
      corr: '',
      descricao: '',
      providencias: '',
      photos: [],
      subItemsState: {}
    };
    const currentSubs = currentState.subItemsState || {};
    const subCurrent = currentSubs[subId] || { checked: false, corr: defaultCorr, providencias: '' };

    const updatedSubs = {
      ...currentSubs,
      [subId]: {
        ...subCurrent,
        checked: isChecked,
        corr: isChecked ? (subCurrent.corr || defaultCorr) : ''
      }
    };

    onItemChange(parentId, {
      ...currentState,
      subItemsState: updatedSubs
    });
  };

  const handleSubItemCorrChange = (parentId, subId, newCorr) => {
    const currentState = itemStates[parentId] || { subItemsState: {} };
    const currentSubs = currentState.subItemsState || {};
    const subCurrent = currentSubs[subId] || { checked: true, corr: newCorr, providencias: '' };

    onItemChange(parentId, {
      ...currentState,
      subItemsState: {
        ...currentSubs,
        [subId]: { ...subCurrent, corr: newCorr }
      }
    });
  };

  const handlePhotoUpload = async (itemId, e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    try {
      const compressedPromises = files.map(file => compressImage(file, 800, 600, 0.75));
      const newPhotos = await Promise.all(compressedPromises);
      const currentState = itemStates[itemId] || { photos: [] };
      onItemChange(itemId, {
        ...currentState,
        photos: [...(currentState.photos || []), ...newPhotos]
      });
    } catch (err) {
      console.error('Erro ao comprimir imagem RIA:', err);
    } finally {
      e.target.value = '';
    }
  };

  const handleCameraCapture = (photoBase64) => {
    if (!photoBase64 || !activeCameraItem) return;
    const currentState = itemStates[activeCameraItem.id] || { photos: [] };
    onItemChange(activeCameraItem.id, {
      ...currentState,
      photos: [...(currentState.photos || []), photoBase64]
    });
  };

  const handleRemovePhoto = (itemId, photoIndex) => {
    const currentState = itemStates[itemId] || { photos: [] };
    const updated = (currentState.photos || []).filter((_, idx) => idx !== photoIndex);
    onItemChange(itemId, { ...currentState, photos: updated });
  };

  return (
    <div className="glass-card mb-6 rounded-2xl bg-white/95 border border-slate-200 shadow-lg overflow-hidden transition-all">
      {/* Modal de Câmera */}
      {activeCameraItem && (
        <CameraCaptureModal
          isOpen={true}
          onClose={() => setActiveCameraItem(null)}
          onCapture={handleCameraCapture}
          itemCode="RIA"
          itemDescription={activeCameraItem.name}
        />
      )}

      {/* Section Header Accordion */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full bg-gradient-to-r from-purple-950 via-slate-900 to-purple-950 text-white p-4 sm:p-5 flex justify-between items-center text-left cursor-pointer transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-orange-500/20 border border-orange-400/40 flex items-center justify-center text-orange-400 font-black text-sm">
            TKE
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black tracking-tight text-white uppercase">
              {section.title}
            </h3>
            <p className="text-xs text-slate-300 font-medium">
              {section.items.length} itens inspecionados conforme norma de inspeção anual
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline text-xs font-bold text-orange-300 bg-orange-950/60 border border-orange-500/40 px-2.5 py-1 rounded-lg">
            {section.items.length} itens
          </span>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-slate-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-400" />
          )}
        </div>
      </button>

      {/* Section Body */}
      {isExpanded && (
        <div className="divide-y divide-slate-200 bg-slate-50/50">
          {section.items.map((item) => {
            const state = itemStates[item.id] || {
              result: item.defaultResult || 'C',
              corr: item.defaultCorr || '--',
              descricao: '',
              providencias: '',
              photos: []
            };

            const result = state.result || item.defaultResult || 'C';
            const corr = state.corr || item.defaultCorr || '--';
            const photos = state.photos || [];

            // Se for item pai com sub-itens estruturados (ex: Nível de Óleo / Tensão da Corrente)
            if (item.isParent) {
              const subStates = state.subItemsState || {};
              const hasAnyChecked = Object.values(subStates).some(s => s.checked);

              return (
                <div
                  key={item.id}
                  className={`p-4 sm:p-5 transition-all ${
                    hasAnyChecked ? 'bg-orange-50/70 border-l-4 border-l-orange-500' : 'bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-3">
                    <span className="font-extrabold text-slate-900 text-sm tracking-tight">
                      {item.name}
                    </span>
                    <span className="text-[11px] font-bold text-purple-900 bg-purple-100 border border-purple-300 px-2.5 py-0.5 rounded">
                      Verificação Específica TKE
                    </span>
                  </div>

                  {/* Sub-itens list */}
                  <div className="space-y-2.5 pl-2 sm:pl-4 border-l-2 border-slate-200 my-3">
                    {item.subItems.map((sub) => {
                      const subState = subStates[sub.id] || { checked: false, corr: sub.corr, providencias: '' };
                      const isChecked = subState.checked;
                      const subCorr = subState.corr || sub.corr;

                      return (
                        <div
                          key={sub.id}
                          className={`p-3 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-3 transition-all ${
                            isChecked
                              ? 'bg-red-50/90 border-red-300 shadow-xs'
                              : 'bg-white border-slate-200'
                          }`}
                        >
                          <label className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => handleSubItemToggle(item.id, sub.id, e.target.checked, sub.corr)}
                              className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500 border-slate-300 cursor-pointer"
                            />
                            <span className={`text-xs sm:text-sm font-bold ${isChecked ? 'text-red-900' : 'text-slate-700'}`}>
                              {sub.name}
                            </span>
                          </label>

                          {isChecked && (
                            <div className="flex items-center gap-2 pl-7 md:pl-0 flex-wrap">
                              <span className="text-[11px] font-extrabold text-red-700">
                                Resultado: [ ✓ Apontado ]
                              </span>

                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] font-bold text-slate-600 uppercase">Corr:</span>
                                <select
                                  value={subCorr}
                                  onChange={(e) => handleSubItemCorrChange(item.id, sub.id, e.target.value)}
                                  className="text-xs font-bold bg-white border border-red-300 text-red-900 rounded-lg px-2 py-1 focus:ring-1 focus:ring-red-400 focus:outline-none cursor-pointer"
                                >
                                  {RIA_CORRECTIONS.map((c) => (
                                    <option key={c.code} value={c.code}>
                                      {c.code} {c.code !== '--' ? `(${c.label.split('-')[1]?.trim() || ''})` : ''}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Providências gerais do item pai se houver */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Descrição / Detalhe Adicional:
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Identificado vazamento no retentor..."
                        value={state.descricao || ''}
                        onChange={(e) => handleFieldChange(item.id, 'descricao', e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-200"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Análise / Providências:
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Emitido orçamento para substituição / regulagem..."
                        value={state.providencias || ''}
                        onChange={(e) => handleFieldChange(item.id, 'providencias', e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-200"
                      />
                    </div>
                  </div>

                  {/* Foto attachment section */}
                  {renderPhotoSection(item, photos)}
                </div>
              );
            }

            // Item padrão do RIA
            const isNonConforming = result === 'NC' || corr === 'ORÇ';

            return (
              <div
                key={item.id}
                className={`p-4 sm:p-5 transition-all ${
                  isNonConforming ? 'bg-red-50/70 border-l-4 border-l-red-500' : 'bg-white hover:bg-slate-50'
                }`}
              >
                {/* Top: Item Title & Selectors */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 mb-3">
                  <span className="font-extrabold text-slate-900 text-xs sm:text-sm tracking-tight leading-snug">
                    {item.name}
                  </span>

                  <div className="flex flex-wrap items-center gap-2 self-stretch lg:self-auto justify-start lg:justify-end">
                    {/* Resultado selector buttons */}
                    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                      {RIA_RESULTS.map((resOpt) => {
                        const isSelected = result === resOpt.code;
                        return (
                          <button
                            key={resOpt.code}
                            type="button"
                            onClick={() => handleFieldChange(item.id, 'result', resOpt.code)}
                            title={resOpt.label}
                            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                              isSelected
                                ? resOpt.code === 'C'
                                  ? 'bg-emerald-600 text-white shadow-sm'
                                  : resOpt.code === 'NC'
                                  ? 'bg-red-600 text-white shadow-sm'
                                  : resOpt.code === 'ATR'
                                  ? 'bg-amber-600 text-white shadow-sm'
                                  : 'bg-slate-700 text-white shadow-sm'
                                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                            }`}
                          >
                            {resOpt.code}
                          </button>
                        );
                      })}
                    </div>

                    {/* Correção selector */}
                    <div className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-xl border border-slate-200">
                      <span className="text-[10px] font-bold text-slate-600 uppercase">Corr:</span>
                      <select
                        value={corr}
                        onChange={(e) => handleFieldChange(item.id, 'corr', e.target.value)}
                        className="bg-transparent text-xs font-bold text-slate-900 focus:outline-none cursor-pointer"
                      >
                        {RIA_CORRECTIONS.map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.code} {c.code !== '--' ? `(${c.label.split('-')[1]?.trim() || ''})` : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Bottom: Inputs for Descrição and Análise / Providências */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Descrição:
                    </label>
                    <input
                      type="text"
                      placeholder="Detalhes ou condições encontradas..."
                      value={state.descricao || ''}
                      onChange={(e) => handleFieldChange(item.id, 'descricao', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-200 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Análise / Providências:
                    </label>
                    <input
                      type="text"
                      placeholder="Ações tomadas ou recomendadas..."
                      value={state.providencias || ''}
                      onChange={(e) => handleFieldChange(item.id, 'providencias', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-200 font-medium"
                    />
                  </div>
                </div>

                {/* Photo attachment section */}
                {renderPhotoSection(item, photos)}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  function renderPhotoSection(item, photos) {
    return (
      <div className="mt-3 pt-2.5 border-t border-slate-200">
        <div className="flex justify-between items-center gap-2">
          <span className="text-[11px] text-slate-700 font-bold flex items-center gap-1.5">
            <Camera className="w-3.5 h-3.5 text-orange-600" />
            Fotos ({photos.length})
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveCameraItem(item)}
              className="flex items-center gap-1 text-[11px] font-bold bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white px-2.5 py-1 rounded-lg transition-all cursor-pointer shadow-xs"
            >
              <Camera className="w-3 h-3" />
              Câmera
            </button>

            <button
              type="button"
              onClick={() => fileInputRefs.current[item.id]?.click()}
              className="flex items-center gap-1 text-[11px] font-bold bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-300 px-2.5 py-1 rounded-lg transition-all cursor-pointer"
            >
              <ImagePlus className="w-3 h-3 text-purple-700" />
              Galeria
            </button>

            <input
              type="file"
              ref={(el) => (fileInputRefs.current[item.id] = el)}
              onChange={(e) => handlePhotoUpload(item.id, e)}
              accept="image/*"
              multiple
              className="hidden"
            />
          </div>
        </div>

        {photos.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
            {photos.map((url, pIdx) => {
              const edificioStr = edificioName ? edificioName.trim() : 'Edifício';
              const legendText = `Item ${item.name} - ${edificioStr} (${pIdx + 1})`;

              return (
                <div key={pIdx} className="relative group bg-white border border-slate-300 rounded-lg overflow-hidden shadow-xs">
                  <img src={url} alt="Foto" className="w-full h-20 object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(item.id, pIdx)}
                    className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-md transition-all cursor-pointer"
                    title="Remover foto"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                  <div className="p-1 bg-slate-100 border-t border-slate-200 text-[8px] font-mono text-slate-700 truncate">
                    {legendText}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }
}
