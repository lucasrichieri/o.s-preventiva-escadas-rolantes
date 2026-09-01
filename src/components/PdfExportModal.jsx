import React, { useRef, useState } from 'react';
import { MONTHS, STAGES } from '../data/tits502pData';
import { Download, Printer, X, FileCheck, Mail, Send, CheckCircle2, Loader2 } from 'lucide-react';

export default function PdfExportModal({
  isOpen,
  onClose,
  headerData,
  activeActivities,
  itemStates,
  alertConfirmed,
  signatures
}) {
  const printRef = useRef(null);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [emailInput, setEmailInput] = useState('lucasrichieri@gmail.com');
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [sendError, setSendError] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  if (!isOpen) return null;

  const mesObj = MONTHS.find(m => m.id === headerData.mesRef) || MONTHS[0];

  // Group activities by stage
  const activitiesByStage = STAGES.map(stage => {
    const stageActs = activeActivities.filter(a => a.stageId === stage.id);
    return { stage, activities: stageActs };
  });

  // Calculate overall stats
  let totalConforme = 0;
  let totalNaoConforme = 0;
  let totalNaoAplica = 0;

  activeActivities.forEach(act => {
    const status = itemStates[act.id]?.status || 'Conforme';
    if (status === 'Conforme') totalConforme++;
    else if (status === 'Não conforme') totalNaoConforme++;
    else if (status === 'Não se aplica') totalNaoAplica++;
  });

  // Download direto do arquivo PDF (.pdf)
  const handleDirectDownload = async () => {
    if (!printRef.current) return;
    setIsDownloadingPdf(true);
    try {
      const { downloadReportPdf } = await import('../utils/pdfGenerator');
      const clienteSafe = (headerData.cliente || 'Equipamento').replace(/[^a-zA-Z0-9]/g, '_');
      await downloadReportPdf(printRef.current, `Relatorio_TKE_${clienteSafe}.pdf`);
    } catch (err) {
      console.error('Erro no download do PDF:', err);
      window.print();
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  // PDF download via browser native print dialog (vetorial, fiel ao layout)
  const handleDownloadPdf = () => {
    window.print();
  };

  // Enviar relatório por e-mail (dados completos da O.S. formatados em HTML)
  const handleSendEmailSubmit = async (e) => {
    e.preventDefault();
    if (!emailInput) return;

    setIsSending(true);
    setSendSuccess(false);
    setSendError(false);

    try {
      const { sendReportEmail } = await import('../utils/emailService');
      const result = await sendReportEmail({
        toEmail: emailInput,
        headerData,
        activeActivities,
        itemStates,
        pdfElement: printRef.current,
      });
      if (result.success) {
        setSendSuccess(true);
        setShowEmailDialog(false);
      } else {
        setSendError(true);
      }
    } catch (err) {
      console.error('Erro ao enviar e-mail:', err);
      setSendError(true);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="modal-overlay fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="modal-container bg-slate-900 border border-purple-900/60 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Top Bar */}
        <div className="modal-top-bar p-4 bg-slate-950 border-b border-slate-800 flex justify-between items-center shrink-0 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-orange-400" />
            <h3 className="text-sm sm:text-base font-extrabold text-white">
              Relatório Oficial TKE (TITS-502P)
            </h3>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Botão Enviar E-mail */}
            <button
              onClick={() => { setShowEmailDialog(v => !v); setSendError(false); }}
              type="button"
              className="bg-purple-900/80 hover:bg-purple-800 text-purple-200 border border-purple-600/50 flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg shadow transition-colors cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5 text-purple-300" /> Enviar por E-mail (com Anexo)
            </button>

            {/* Botão Principal: Baixar Arquivo PDF (.pdf) */}
            <button
              onClick={handleDirectDownload}
              disabled={isDownloadingPdf}
              type="button"
              className="tke-btn-gradient flex items-center gap-2 px-4 py-2 text-white text-xs sm:text-sm font-black rounded-lg shadow-lg transition-transform transform hover:scale-105 cursor-pointer disabled:opacity-60"
            >
              {isDownloadingPdf ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-amber-200" />
                  Gerando PDF...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-amber-200" />
                  Baixar Arquivo PDF (.pdf)
                </>
              )}
            </button>

            {/* Botão Secundário: Imprimir / Salvar Navegador */}
            <button
              onClick={handleDownloadPdf}
              type="button"
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg shadow transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-slate-300" /> Imprimir
            </button>

            <button
              onClick={onClose}
              type="button"
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Email Send Dialog Overlay */}
        {showEmailDialog && (
          <div className="email-dialog-overlay bg-purple-950/90 border-b border-purple-800 p-4 px-6 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Mail className="w-6 h-6 text-amber-300 shrink-0" />
              <div>
                <h4 className="font-extrabold text-sm text-white">Enviar Relatório com PDF Anexo por E-mail</h4>
                <p className="text-xs text-purple-200">O arquivo PDF gerado e o resumo da O.S. serão enviados em anexo.</p>
              </div>
            </div>

            <form onSubmit={handleSendEmailSubmit} className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="Endereço de e-mail"
                required
                className="bg-slate-900 border border-purple-500/60 text-white text-xs rounded-lg px-3 py-2 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <button
                type="submit"
                disabled={isSending}
                className="tke-btn-gradient px-4 py-2 text-xs font-extrabold text-white rounded-lg flex items-center gap-1.5 shadow-md shrink-0 cursor-pointer disabled:opacity-50"
              >
                {isSending ? (
                  <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Gerando PDF e Enviando...</>
                ) : (
                  <><Send className="w-3.5 h-3.5" /> Enviar com Anexo</>
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowEmailDialog(false)}
                className="text-xs text-purple-300 hover:text-white px-2 py-1"
              >
                Cancelar
              </button>
            </form>
          </div>
        )}

        {/* Success Banner */}
        {sendSuccess && (
          <div className="success-banner bg-emerald-900/90 text-emerald-100 p-3 px-6 text-xs font-bold flex items-center justify-between border-b border-emerald-700">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>✅ Relatório e <strong>arquivo PDF anexo</strong> enviados com sucesso para <strong>{emailInput}</strong>!</span>
            </div>
            <button onClick={() => setSendSuccess(false)} className="text-emerald-300 hover:text-white text-xs">Fechar</button>
          </div>
        )}

        {/* Error Banner */}
        {sendError && (
          <div className="bg-red-900/90 text-red-100 p-3 px-6 text-xs font-bold flex items-center justify-between border-b border-red-700">
            <span>⚠️ Falha no envio automático. Verifique sua conexão ou tente novamente.</span>
            <button onClick={() => setSendError(false)} className="text-red-300 hover:text-white text-xs">Fechar</button>
          </div>
        )}

        {/* Printable / Preview Content Area */}
        <div className="modal-content-area p-4 sm:p-6 overflow-y-auto bg-slate-950 flex-1">
          
          <div
            ref={printRef}
            id="pdf-document"
            className="bg-white text-slate-900 p-6 sm:p-8 rounded-lg shadow-lg font-sans max-w-[210mm] mx-auto text-xs relative overflow-hidden"
            style={{ backgroundColor: '#ffffff' }}
          >
            {/* Top TKE Brand Gradient Strip */}
            <div
              className="absolute top-0 left-0 right-0 h-2"
              style={{ background: 'linear-gradient(to right, #7e22ce, #e11d48, #f97316)', height: '8px' }}
            />

            {/* Header Document Banner with TKE Brand Logo */}
            <div className="border-b-2 border-slate-900 pb-4 mb-4 flex justify-between items-start pt-2">
              <div>
                {/* Official styled TKE logo mark */}
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="font-black text-2xl tracking-tighter text-purple-900 font-mono">
                    TK<span className="text-orange-500">E</span>
                  </span>
                  <span className="text-[10px] font-extrabold text-purple-900 tracking-wider uppercase border-l-2 border-slate-300 pl-2">
                    TK Elevator Corporation
                  </span>
                </div>
                <h1 className="text-lg font-extrabold text-slate-900">
                  RELATÓRIO FOTOGRÁFICO DE MANUTENÇÃO PREVENTIVA
                </h1>
                <p className="text-[11px] text-slate-600 font-semibold">
                  Metodologia e Atividades TKE - Código TITS-502P (Ind. 1)
                </p>
              </div>

              <div className="text-right border-l-2 border-orange-500 pl-4">
                <span className="text-[11px] font-black bg-purple-950 text-purple-100 px-2.5 py-1 rounded shadow-sm" style={{ backgroundColor: '#0c0a20', color: '#e9d5ff' }}>
                  TITS-502P (TKE)
                </span>
                <p className="text-[10px] text-slate-600 font-medium mt-1.5">Data: {headerData.data ? new Date(headerData.data).toLocaleDateString('pt-BR') : '-'}</p>
                <p className="text-[10px] text-slate-600 font-medium">Mês Ref: <strong className="text-purple-900">{mesObj.name}</strong></p>
              </div>
            </div>

            {/* Client and Facility Info Grid */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 bg-slate-50 p-3.5 rounded-lg border border-purple-200 mb-4" style={{ backgroundColor: '#f8fafc', borderColor: '#e9d5ff' }}>
              <div>
                <span className="text-[10px] text-purple-900 font-bold uppercase block">Cliente / Condomínio</span>
                <span className="text-xs font-bold text-slate-900">{headerData.cliente || '-'}</span>
              </div>
              <div>
                <span className="text-[10px] text-purple-900 font-bold uppercase block">Local / Endereço</span>
                <span className="text-xs font-semibold text-slate-800">{headerData.endereco || '-'}</span>
              </div>
              <div>
                <span className="text-[10px] text-purple-900 font-bold uppercase block">Equipamento (Tag / Série)</span>
                <span className="text-xs font-mono font-bold text-slate-900">{headerData.equipamento || '-'}</span>
              </div>
              <div>
                <span className="text-[10px] text-purple-900 font-bold uppercase block">Técnico(s) Responsável(is)</span>
                <span className="text-xs font-semibold text-slate-800">{headerData.tecnicos || '-'}</span>
              </div>
              <div>
                <span className="text-[10px] text-purple-900 font-bold uppercase block">Escopo da Manutenção</span>
                <span className="text-xs font-bold text-slate-800">Preventiva Periódica Unificada ({mesObj.name})</span>
              </div>
              <div>
                <span className="text-[10px] text-purple-900 font-bold uppercase block">Status de Segurança</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded inline-block ${alertConfirmed ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-800 border border-amber-300'}`}
                  style={alertConfirmed ? { backgroundColor: '#d1fae5', color: '#065f46', borderColor: '#6ee7b7' } : { backgroundColor: '#fef3c7', color: '#92400e', borderColor: '#fbbf24' }}
                >
                  {alertConfirmed ? 'Aviso de Segurança Validado' : 'Aviso Pendente'}
                </span>
              </div>
            </div>

            {/* Safety Warning Banner */}
            <div className="p-3 bg-amber-50 border-l-4 border-amber-500 rounded-r-md mb-4 text-[10px] text-amber-900" style={{ backgroundColor: '#fffbeb', borderLeftColor: '#f59e0b' }}>
              <strong className="block text-[10px] uppercase font-extrabold text-amber-950 mb-0.5">
                ⚠️ ALERTA OBRIGATÓRIO DE SEGURANÇA (TITS-502P):
              </strong>
              Desligar a escada/esteira rolante e notificar o condomínio e supervisor se ocorrer: (1) deficiência na alimentação elétrica (falta de aterramento ou ligações clandestinas); (2) micro da série de segurança danificado/ponteado; (3) água no poço.
            </div>

            {/* Executive Summary Bar */}
            <div className="grid grid-cols-3 gap-3 mb-5 text-center">
              <div className="bg-emerald-50 border border-emerald-200 p-2 rounded-md" style={{ backgroundColor: '#ecfdf5', borderColor: '#a7f3d0' }}>
                <span className="text-[10px] text-emerald-800 uppercase font-bold block" style={{ color: '#065f46' }}>Conformes</span>
                <span className="text-base font-extrabold text-emerald-700" style={{ color: '#047857' }}>{totalConforme}</span>
              </div>
              <div className={`p-2 rounded-md border ${totalNaoConforme > 0 ? 'bg-red-100 border-red-300 text-red-900 font-bold' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                <span className="text-[10px] uppercase font-bold block">Não Conformes</span>
                <span className="text-base font-extrabold text-red-600" style={{ color: '#dc2626' }}>{totalNaoConforme}</span>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-2 rounded-md">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Não se Aplica</span>
                <span className="text-base font-extrabold text-slate-700">{totalNaoAplica}</span>
              </div>
            </div>

            {/* Stages & Activities Grid */}
            <div className="space-y-4">
              {activitiesByStage.map(({ stage, activities }) => {
                if (activities.length === 0) return null;

                return (
                  <div key={stage.id} className="border border-slate-300 rounded-lg overflow-hidden">
                    {/* Stage Header with TKE gradient */}
                    <div
                      className="bg-gradient-to-r from-purple-950 to-slate-900 text-white px-3.5 py-1.5 font-bold text-xs flex justify-between items-center"
                      style={{ background: 'linear-gradient(to right, #0c0a20, #0f172a)', color: '#ffffff' }}
                    >
                      <span>{stage.title} - {stage.subtitle}</span>
                      <span className="text-[10px] font-semibold text-orange-300" style={{ color: '#fdba74' }}>{activities.length} itens</span>
                    </div>

                    {/* Stage Items */}
                    <div className="divide-y divide-slate-200 bg-white">
                      {activities.map(act => {
                        const itemState = itemStates[act.id] || { status: 'Conforme', comment: '', photos: [] };
                        const status = itemState.status || 'Conforme';
                        const photos = itemState.photos || [];

                        return (
                          <div key={act.id} className="p-3 text-[11px] leading-tight break-inside-avoid" style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                            <div className="flex justify-between items-start gap-2">
                              <div className="flex items-start gap-2">
                                <span className="font-mono font-bold bg-purple-100 text-purple-900 px-1.5 py-0.5 rounded border border-purple-300 text-[10px] shrink-0" style={{ backgroundColor: '#f3e8ff', color: '#581c87', borderColor: '#d8b4fe' }}>
                                  {act.code}
                                </span>
                                {act.isMonthly ? (
                                  <span className="text-[8px] bg-blue-50 text-blue-800 px-1 py-0.5 rounded border border-blue-200 font-bold uppercase shrink-0" style={{ backgroundColor: '#eff6ff', color: '#1e40af', borderColor: '#bfdbfe' }}>
                                    Mensal
                                  </span>
                                ) : (
                                  <span className="text-[8px] bg-amber-50 text-amber-900 px-1 py-0.5 rounded border border-amber-300 font-bold uppercase shrink-0" style={{ backgroundColor: '#fffbeb', color: '#78350f', borderColor: '#fcd34d' }}>
                                    Periódica
                                  </span>
                                )}
                                <div>
                                  <p className="font-semibold text-slate-900">{act.description}</p>
                                  {itemState.comment && (
                                    <p className="text-[10px] text-slate-600 italic mt-0.5">
                                      Obs: {itemState.comment}
                                    </p>
                                  )}
                                </div>
                              </div>

                              <span
                                className={`px-2 py-0.5 rounded font-bold text-[10px] shrink-0 ${
                                  status === 'Conforme'
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                    : status === 'Não conforme'
                                    ? 'bg-red-100 text-red-800 border border-red-400 font-extrabold'
                                    : 'bg-slate-100 text-slate-600 border border-slate-300'
                                }`}
                                style={
                                  status === 'Conforme'
                                    ? { backgroundColor: '#d1fae5', color: '#065f46', borderColor: '#6ee7b7' }
                                    : status === 'Não conforme'
                                    ? { backgroundColor: '#fee2e2', color: '#991b1b', borderColor: '#f87171' }
                                    : { backgroundColor: '#f1f5f9', color: '#475569', borderColor: '#cbd5e1' }
                                }
                              >
                                {status}
                              </span>
                            </div>

                            {/* Attached Photos inside item */}
                            {photos.length > 0 && (
                              <div className="mt-2 pt-2 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 gap-2 break-inside-avoid">
                                {photos.map((photoUrl, pIdx) => {
                                  const condomínioStr = headerData.cliente ? headerData.cliente.trim() : "Condomínio";
                                  const dataStr = headerData.data ? new Date(headerData.data).toLocaleDateString('pt-BR') : "Data";
                                  const photoNumStr = photos.length > 1 ? ` (Foto ${pIdx + 1})` : '';
                                  const legendText = `Item ${act.code} - ${condomínioStr} - ${dataStr}${photoNumStr}`;

                                  return (
                                    <div key={pIdx} className="border border-slate-300 rounded overflow-hidden bg-slate-50 shadow-xs">
                                      <img src={photoUrl} alt="Foto" className="w-full h-24 object-cover" />
                                      <div className="p-1 text-[8px] font-mono text-slate-700 bg-slate-100 border-t border-slate-200 truncate">
                                        {legendText}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Signatures Section */}
            <div className="mt-6 pt-4 border-t-2 border-purple-900 break-inside-avoid" style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
              <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-purple-950 mb-4 text-center">
                VALIDAÇÃO E ASSINATURAS DE RESPONSABILIDADE TÉCNICA — TKE
              </h4>

              <div className="grid grid-cols-3 gap-4 text-[10px]">
                {/* Elaborado */}
                <div className="border border-slate-300 p-2.5 rounded text-center">
                  <div className="h-10 border-b border-slate-300 border-dashed mb-1.5 flex items-end justify-center pb-0.5 text-[9px] text-slate-400 italic">
                    Assinatura do Técnico
                  </div>
                  <p className="font-bold text-slate-900">{signatures.elaborado.nome || 'Elaborado por'}</p>
                  <p className="text-slate-500">Técnico de Campo TKE</p>
                  <p className="text-slate-400 text-[9px] mt-0.5">
                    Data: {signatures.elaborado.data ? new Date(signatures.elaborado.data).toLocaleDateString('pt-BR') : '-'}
                  </p>
                </div>

                {/* Revisado */}
                <div className="border border-slate-300 p-2.5 rounded text-center">
                  <div className="h-10 border-b border-slate-300 border-dashed mb-1.5 flex items-end justify-center pb-0.5 text-[9px] text-slate-400 italic">
                    Assinatura do Supervisor
                  </div>
                  <p className="font-bold text-slate-900">{signatures.revisado.nome || 'Revisado por'}</p>
                  <p className="text-slate-500">Supervisão Técnica TKE</p>
                  <p className="text-slate-400 text-[9px] mt-0.5">
                    Data: {signatures.revisado.data ? new Date(signatures.revisado.data).toLocaleDateString('pt-BR') : '-'}
                  </p>
                </div>

                {/* Aprovado */}
                <div className="border border-slate-300 p-2.5 rounded text-center">
                  <div className="h-10 border-b border-slate-300 border-dashed mb-1.5 flex items-end justify-center pb-0.5 text-[9px] text-slate-400 italic">
                    Assinatura do Cliente
                  </div>
                  <p className="font-bold text-slate-900">{signatures.aprovado.nome || 'Aprovado por'}</p>
                  <p className="text-slate-500">Cliente / Gerência</p>
                  <p className="text-slate-400 text-[9px] mt-0.5">
                    Data: {signatures.aprovado.data ? new Date(signatures.aprovado.data).toLocaleDateString('pt-BR') : '-'}
                  </p>
                </div>
              </div>
            </div>

            {/* Document Footer */}
            <div className="mt-6 pt-2 border-t border-slate-200 flex justify-between text-[9px] text-slate-400">
              <span>TK Elevator - TITS-502P Relatório Fotográfico de Manutenção Preventiva</span>
              <span>Página 1 de 1</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
