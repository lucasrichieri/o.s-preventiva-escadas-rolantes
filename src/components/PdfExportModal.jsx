import React, { useRef, useState } from 'react';
import html2pdf from 'html2pdf.js';
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
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  if (!isOpen) return null;

  const mesObj = MONTHS.find(m => m.id === headerData.mesRef) || MONTHS[0];

  // Group activities by stage
  const activitiesByStage = STAGES.map(stage => {
    const stageActs = activeActivities.filter(a => a.stageId === stage.id);
    return {
      stage,
      activities: stageActs
    };
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

  const handleDownloadPdf = async () => {
    const element = printRef.current;
    if (!element) return;

    setIsDownloadingPdf(true);
    const clientSanitized = (headerData.cliente || 'Equipamento').replace(/[^a-zA-Z0-9\-_]/g, '_');
    const filename = `Relatorio_TKE_TITS502P_${clientSanitized}_${headerData.data || 'Data'}.pdf`;

    try {
      const getHtml2Pdf = () => (typeof html2pdf === 'function' ? html2pdf : html2pdf.default);
      const pdfFunc = getHtml2Pdf();

      const opt = {
        margin: [5, 5, 5, 5],
        filename: filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2, 
          useCORS: true, 
          allowTaint: true,
          logging: false,
          backgroundColor: '#ffffff'
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      // Generate blob for direct browser trigger
      const pdfBlob = await pdfFunc().set(opt).from(element).output('blob');
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (err) {
      console.warn('Falha no Blob URL, tentando save() direto:', err);
      try {
        const getHtml2Pdf = () => (typeof html2pdf === 'function' ? html2pdf : html2pdf.default);
        const pdfFunc = getHtml2Pdf();
        const opt = {
          margin: [5, 5, 5, 5],
          filename: filename,
          image: { type: 'jpeg', quality: 0.95 },
          html2canvas: { scale: 1.5, useCORS: true, allowTaint: true },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        pdfFunc().set(opt).from(element).save();
      } catch (fallbackErr) {
        console.error('Invocando impressão nativa:', fallbackErr);
        window.print();
      }
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const handleSendEmailSubmit = async (e) => {
    e.preventDefault();
    if (!emailInput) return;

    setIsSending(true);
    setSendSuccess(false);

    // 1. Gera e baixa o PDF no dispositivo do usuário
    await handleDownloadPdf();

    // 2. Dispara o e-mail via Gmail Web ou EmailJS API
    try {
      const { sendReportEmail } = await import('../utils/emailService');
      await sendReportEmail({
        toEmail: emailInput,
        headerData,
        activeActivities,
        itemStates
      });
    } catch (err) {
      console.error('Erro ao enviar e-mail:', err);
    } finally {
      setIsSending(false);
      setSendSuccess(true);
    }
  };

  const handleNativePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-purple-900/60 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Top Bar */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex justify-between items-center shrink-0 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-orange-400" />
            <h3 className="text-sm sm:text-base font-extrabold text-white">
              Relatório Oficial TKE (TITS-502P)
            </h3>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setShowEmailDialog(true)}
              type="button"
              className="bg-purple-900/80 hover:bg-purple-800 text-purple-200 border border-purple-600/50 flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg shadow transition-colors cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5 text-purple-300" /> Enviar por E-mail
            </button>
            <button
              onClick={handleNativePrint}
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" /> Impressão
            </button>
            <button
              onClick={handleDownloadPdf}
              disabled={isDownloadingPdf}
              type="button"
              className="tke-btn-gradient flex items-center gap-1.5 px-4 py-1.5 text-white text-xs font-bold rounded-lg shadow-md transition-colors cursor-pointer disabled:opacity-60"
            >
              {isDownloadingPdf ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Gerando PDF...
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" /> Baixar PDF
                </>
              )}
            </button>
            <button
              onClick={onClose}
              type="button"
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Email Send Dialog Overlay */}
        {showEmailDialog && (
          <div className="bg-purple-950/90 border-b border-purple-800 p-4 px-6 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fadeIn">
            <div className="flex items-center gap-3">
              <Mail className="w-6 h-6 text-amber-300 shrink-0" />
              <div>
                <h4 className="font-extrabold text-sm text-white">Enviar Relatório PDF por E-mail</h4>
                <p className="text-xs text-purple-200">O PDF será baixado no dispositivo e o e-mail será enviado para o destinatário abaixo.</p>
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
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Enviando...
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" /> Enviar PDF
                  </>
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

        {sendSuccess && (
          <div className="bg-emerald-900/90 text-emerald-100 p-3 px-6 text-xs font-bold flex items-center justify-between border-b border-emerald-700">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>✅ O PDF foi baixado no dispositivo e o e-mail para <strong>{emailInput}</strong> foi preparado e aberto no Gmail Web!</span>
            </div>
            <button onClick={() => setSendSuccess(false)} className="text-emerald-300 hover:text-white text-xs">
              Fechar
            </button>
          </div>
        )}

        {/* Printable / Preview Content Area */}
        <div className="p-4 sm:p-6 overflow-y-auto bg-slate-950 flex-1">
          
          <div
            ref={printRef}
            id="pdf-document"
            className="bg-white text-slate-900 p-6 sm:p-8 rounded-lg shadow-lg font-sans max-w-[210mm] mx-auto text-xs relative overflow-hidden"
          >
            {/* Top TKE Brand Gradient Strip */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-purple-700 via-rose-600 to-orange-500" />

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
                <span className="text-[11px] font-black bg-purple-950 text-purple-100 px-2.5 py-1 rounded shadow-sm">
                  TITS-502P (TKE)
                </span>
                <p className="text-[10px] text-slate-600 font-medium mt-1.5">Data: {headerData.data ? new Date(headerData.data).toLocaleDateString('pt-BR') : '-'}</p>
                <p className="text-[10px] text-slate-600 font-medium">Mês Ref: <strong className="text-purple-900">{mesObj.name}</strong></p>
              </div>
            </div>

            {/* Client and Facility Info Grid */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 bg-slate-50 p-3.5 rounded-lg border border-purple-200 mb-4">
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
                <span className="text-[10px] text-purple-900 font-bold uppercase block">Tipo de Visita</span>
                <span className="text-xs font-semibold text-slate-800">{headerData.tipoVisita}</span>
              </div>
              <div>
                <span className="text-[10px] text-purple-900 font-bold uppercase block">Status de Segurança</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded inline-block ${alertConfirmed ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-800 border border-amber-300'}`}>
                  {alertConfirmed ? 'Aviso de Segurança Validado' : 'Aviso Pendente'}
                </span>
              </div>
            </div>

            {/* Safety Warning Banner */}
            <div className="p-3 bg-amber-50 border-l-4 border-amber-500 rounded-r-md mb-4 text-[10px] text-amber-900">
              <strong className="block text-[10px] uppercase font-extrabold text-amber-950 mb-0.5">
                ⚠️ ALERTA OBRIGATÓRIO DE SEGURANÇA (TITS-502P):
              </strong>
              Desligar a escada/esteira rolante e notificar o condomínio e supervisor se ocorrer: (1) deficiência na alimentação elétrica (falta de aterramento ou ligações clandestinas); (2) micro da série de segurança danificado/ponteado; (3) água no poço.
            </div>

            {/* Executive Summary Bar */}
            <div className="grid grid-cols-3 gap-3 mb-5 text-center">
              <div className="bg-emerald-50 border border-emerald-200 p-2 rounded-md">
                <span className="text-[10px] text-emerald-800 uppercase font-bold block">Conformes</span>
                <span className="text-base font-extrabold text-emerald-700">{totalConforme}</span>
              </div>
              <div className={`p-2 rounded-md border ${totalNaoConforme > 0 ? 'bg-red-100 border-red-300 text-red-900 font-bold' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                <span className="text-[10px] uppercase font-bold block">Não Conformes</span>
                <span className="text-base font-extrabold text-red-600">{totalNaoConforme}</span>
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
                    <div className="bg-gradient-to-r from-purple-950 to-slate-900 text-white px-3.5 py-1.5 font-bold text-xs flex justify-between items-center">
                      <span>{stage.title} - {stage.subtitle}</span>
                      <span className="text-[10px] font-semibold text-orange-300">{activities.length} itens</span>
                    </div>

                    {/* Stage Items */}
                    <div className="divide-y divide-slate-200 bg-white">
                      {activities.map(act => {
                        const itemState = itemStates[act.id] || { status: 'Conforme', comment: '', photos: [] };
                        const status = itemState.status || 'Conforme';
                        const photos = itemState.photos || [];

                        return (
                          <div key={act.id} className="p-3 text-[11px] leading-tight">
                            <div className="flex justify-between items-start gap-2">
                              <div className="flex items-start gap-2">
                                <span className="font-mono font-bold bg-purple-100 text-purple-900 px-1.5 py-0.5 rounded border border-purple-300 text-[10px]">
                                  {act.code}
                                </span>
                                <div>
                                  <p className="font-semibold text-slate-900">{act.description}</p>
                                  {itemState.comment && (
                                    <p className="text-[10px] text-slate-600 italic mt-0.5">
                                      Obs: {itemState.comment}
                                    </p>
                                  )}
                                </div>
                              </div>

                              <span className={`px-2 py-0.5 rounded font-bold text-[10px] shrink-0 ${
                                status === 'Conforme'
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                  : status === 'Não conforme'
                                  ? 'bg-red-100 text-red-800 border border-red-400 font-extrabold'
                                  : 'bg-slate-100 text-slate-600 border border-slate-300'
                              }`}>
                                {status}
                              </span>
                            </div>

                            {/* Attached Photos inside item */}
                            {photos.length > 0 && (
                              <div className="mt-2 pt-2 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {photos.map((photoUrl, pIdx) => {
                                  const condomínioStr = headerData.cliente ? headerData.cliente.trim() : "Condomínio";
                                  const dataStr = headerData.data ? new Date(headerData.data).toLocaleDateString('pt-BR') : "Data";
                                  const photoNumStr = photos.length > 1 ? ` (Foto ${pIdx + 1})` : '';
                                  const legendText = `Item ${act.code} - ${condomínioStr} - ${dataStr}${photoNumStr}`;

                                  return (
                                    <div key={pIdx} className="border border-slate-300 rounded overflow-hidden bg-slate-50">
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
            <div className="mt-6 pt-4 border-t-2 border-purple-900">
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
