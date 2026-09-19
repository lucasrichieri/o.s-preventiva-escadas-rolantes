import React, { useState, useMemo } from 'react';
import HeaderForm from './components/HeaderForm';
import RiaHeaderForm from './components/RiaHeaderForm';
import AlertBlock from './components/AlertBlock';
import StageSection from './components/StageSection';
import RiaSection from './components/RiaSection';
import SummaryStats from './components/SummaryStats';
import RiaSummaryStats from './components/RiaSummaryStats';
import SignaturesSection from './components/SignaturesSection';
import RiaConclusaoSection from './components/RiaConclusaoSection';
import PdfExportModal from './components/PdfExportModal';
import PwaInstallPrompt from './components/PwaInstallPrompt';

import { ACTIVITIES, STAGES, MONTHS } from './data/tits502pData';
import { RIA_SECTIONS, INITIAL_RIA_HEADER, DEMO_RIA_DATA } from './data/riaData';
import { Download, CheckCircle2, ClipboardList, FileText } from 'lucide-react';

export default function App() {
  const currentDateStr = new Date().toISOString().split('T')[0];

  // Modo do Relatório: 'TITS-502P' (Preventiva Mensal) ou 'RIA' (Inspeção Anual)
  const [reportType, setReportType] = useState('TITS-502P');

  // Dados do Cabeçalho - TITS-502P
  const [headerData, setHeaderData] = useState({
    cliente: '',
    endereco: '',
    equipamento: '',
    data: currentDateStr,
    tecnicos: '',
    tipoVisita: 'Mensal',
    mesRef: 1 // Janeiro por padrão
  });

  // Dados do Cabeçalho - RIA
  const [riaHeaderData, setRiaHeaderData] = useState({
    ...INITIAL_RIA_HEADER,
    data: currentDateStr
  });

  // Estados dos Itens
  const [itemStates, setItemStates] = useState({});
  const [riaItemStates, setRiaItemStates] = useState({});
  const [alertConfirmed, setAlertConfirmed] = useState(false);

  // Assinaturas TITS-502P
  const [signatures, setSignatures] = useState({
    elaborado: { nome: '', data: currentDateStr },
    revisado: { nome: '', data: currentDateStr },
    aprovado: { nome: '', data: currentDateStr }
  });

  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  // Filtro dinâmico de atividades TITS-502P baseado no mês de referência (1 - 12)
  const activeActivities = useMemo(() => {
    const selectedMonth = headerData.mesRef;
    return ACTIVITIES.filter(act => {
      if (act.isMonthly) return true;
      if (act.months && Array.isArray(act.months)) {
        return act.months.includes(selectedMonth);
      }
      return false;
    });
  }, [headerData.mesRef]);

  const handleItemChange = (activityId, newState) => {
    setItemStates(prev => ({
      ...prev,
      [activityId]: newState
    }));
  };

  const handleRiaItemChange = (itemId, newState) => {
    setRiaItemStates(prev => ({
      ...prev,
      [itemId]: newState
    }));
  };

  // Helper para gerar imagem canvas demonstrativa com texto
  const createDemoPlaceholderImage = (title, bgColor1 = '#4c1d95', bgColor2 = '#ea580c') => {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');

    // Background TKE gradient
    const grad = ctx.createLinearGradient(0, 0, 400, 300);
    grad.addColorStop(0, bgColor1);
    grad.addColorStop(1, bgColor2);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 400, 300);

    // Decorative lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 4;
    ctx.strokeRect(20, 20, 360, 260);

    // TKE Logo text watermark
    ctx.fillStyle = '#ffffff';
    ctx.font = 'black 24px monospace';
    ctx.textAlign = 'right';
    ctx.fillText('TKE', 360, 50);

    // Text label
    ctx.font = 'bold 18px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('INSPEÇÃO DE CAMPO TKE', 200, 130);
    ctx.font = '14px sans-serif';
    ctx.fillText(title, 200, 160);
    ctx.font = '11px sans-serif';
    ctx.fillStyle = '#fef08a';
    ctx.fillText(reportType === 'RIA' ? 'Relatório RIA' : 'Norma TITS-502P', 200, 190);

    return canvas.toDataURL('image/jpeg', 0.85);
  };

  // Preencher dados demonstrativos para teste rápido em 1 clique
  const handleFillDemo = () => {
    if (reportType === 'RIA') {
      handleFillDemoRia();
      return;
    }

    setHeaderData({
      cliente: 'Condomínio Edifício Plaza Shopping Center',
      endereco: 'Av. das Nações Unidas, 12551 - São Paulo/SP',
      equipamento: 'Escada Rolante ER-02 (S/N: TK-998412)',
      data: currentDateStr,
      tecnicos: 'Carlos Eduardo Silva & Marcos Roberto (TKE)',
      tipoVisita: 'Mensal',
      mesRef: 1 // Janeiro
    });

    setAlertConfirmed(true);

    const demoPhoto1 = createDemoPlaceholderImage('Guarda-corpos e Defletores', '#581c87', '#c2410c');
    const demoPhoto2 = createDemoPlaceholderImage('Quadro de Comando e Inversor', '#1e1b4b', '#4338ca');
    const demoPhoto3 = createDemoPlaceholderImage('Lubrificação e Carro Tensor', '#14532d', '#15803d');

    const demoStates = {};
    activeActivities.forEach((act, idx) => {
      if (idx === 0) {
        demoStates[act.id] = {
          status: 'Conforme',
          comment: 'Defletores e guarda-corpos em bom estado e fixados conforme padrão TKE.',
          photos: [demoPhoto1]
        };
      } else if (idx === 3) {
        demoStates[act.id] = {
          status: 'Conforme',
          comment: 'Quadro elétrico limpo, barramentos e conexões verificadas.',
          photos: [demoPhoto2]
        };
      } else if (idx === 7) {
        demoStates[act.id] = {
          status: 'Conforme',
          comment: 'Lubrificação efetuada com óleo recomendado pelo fabricante.',
          photos: [demoPhoto3]
        };
      } else if (idx === 14) {
        demoStates[act.id] = {
          status: 'Não conforme',
          comment: 'Desgaste leve identificado na lona; sugerida substituição preventiva no próximo ciclo.',
          photos: []
        };
      } else if (idx === 18) {
        demoStates[act.id] = {
          status: 'Não se aplica',
          comment: 'Equipamento não possui sistema de inversor regenerativo.',
          photos: []
        };
      } else {
        demoStates[act.id] = {
          status: 'Conforme',
          comment: '',
          photos: []
        };
      }
    });

    setItemStates(demoStates);

    setSignatures({
      elaborado: { nome: 'Carlos Eduardo Silva', data: currentDateStr },
      revisado: { nome: 'Marcos Roberto Santos', data: currentDateStr },
      aprovado: { nome: 'Eng. Fernando Costa (Gestor Predial)', data: currentDateStr }
    });
  };

  // Preencher dados demonstrativos específicos do RIA (exatamente como no PDF fornecido)
  const handleFillDemoRia = () => {
    setRiaHeaderData({
      ...DEMO_RIA_DATA.header
    });

    const demoPhoto1 = createDemoPlaceholderImage('Nível de Óleo Redutor', '#581c87', '#ea580c');
    const demoPhoto2 = createDemoPlaceholderImage('Folga Corrente Principal', '#1e1b4b', '#f97316');

    const populatedStates = { ...DEMO_RIA_DATA.items };
    if (populatedStates['ria-ps-11']) {
      populatedStates['ria-ps-11'].photos = [demoPhoto1];
      populatedStates['ria-ps-11'].descricao = 'Nível de óleo abaixo do visor indicador.';
      populatedStates['ria-ps-11'].providencias = 'Orçamento para reposição e troca de retentor.';
    }
    if (populatedStates['ria-ps-14']) {
      populatedStates['ria-ps-14'].photos = [demoPhoto2];
      populatedStates['ria-ps-14'].descricao = 'Constatada folga na corrente superior a 10mm.';
      populatedStates['ria-ps-14'].providencias = 'Orçamento para tensionamento/substituição.';
    }

    setRiaItemStates(populatedStates);
  };

  return (
    <div className="min-h-screen bg-slate-200 text-slate-900 font-sans pb-16 selection:bg-orange-500 selection:text-white">
      
      {/* Top Navigation Bar */}
      <header className="no-print sticky top-0 z-40 bg-white border-b border-slate-300 px-4 sm:px-8 py-3 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-3">
          {/* TKE Logo Icon */}
          <div className="px-3 py-1.5 rounded-xl bg-gradient-to-tr from-purple-800 via-rose-600 to-orange-500 flex items-center justify-center shadow-md">
            <span className="font-mono font-black text-xl text-white tracking-tighter">
              TK<span className="text-amber-200">E</span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900">
                {reportType === 'RIA' ? 'Relatório de Inspeção Anual (RIA)' : 'Relatório Fotográfico TITS-502P'}
              </h1>
              <span className={`font-mono font-bold text-[10px] px-2 py-0.5 rounded border ${
                reportType === 'RIA'
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : 'bg-orange-100 text-orange-900 border-orange-300'
              }`}>
                Padrão TKE
              </span>
            </div>
            <p className="text-xs text-slate-600 font-medium">
              {reportType === 'RIA'
                ? 'Inspeção Anual de Segurança - Escadas e Esteiras Rolantes'
                : 'Manutenção Preventiva Periódica de Escadas e Esteiras Rolantes'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Switcher Rápido de Relatório */}
          <div className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => setReportType('TITS-502P')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                reportType === 'TITS-502P'
                  ? 'bg-purple-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              TITS-502P
            </button>
            <button
              type="button"
              onClick={() => setReportType('RIA')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                reportType === 'RIA'
                  ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              <ClipboardList className="w-3.5 h-3.5" />
              RIA Anual
            </button>
          </div>

          <button
            onClick={() => setIsPdfModalOpen(true)}
            className="tke-btn-gradient flex items-center gap-2 px-4 sm:px-5 py-2.5 text-white font-black text-xs sm:text-sm rounded-xl shadow-md cursor-pointer transform hover:-translate-y-0.5"
          >
            <Download className="w-4 h-4 text-amber-200" />
            <span className="hidden sm:inline">Exportar / Enviar PDF</span>
            <span className="sm:hidden">Relatório PDF</span>
          </button>
        </div>
      </header>

      {/* Main Body Container */}
      <main className="no-print max-w-6xl mx-auto px-4 sm:px-6 pt-8">
        
        {/* ========================================================
            FLUXO RIA (RELATÓRIO DE INSPEÇÃO ANUAL)
            ======================================================== */}
        {reportType === 'RIA' ? (
          <div>
            {/* Top Switcher Banner */}
            <div className="mb-4 flex items-center justify-between bg-amber-500/10 border border-amber-300/80 p-3 rounded-2xl">
              <div className="flex items-center gap-2">
                <span className="bg-amber-600 text-white font-black text-[10px] px-2.5 py-1 rounded-lg uppercase tracking-wider">
                  MODO ATIVO: RIA
                </span>
                <span className="text-xs font-extrabold text-amber-950">
                  Relatório de Inspeção Anual com Itens do PDF Oficial da TKE
                </span>
              </div>
              <button
                type="button"
                onClick={() => setReportType('TITS-502P')}
                className="text-xs font-bold text-purple-900 hover:text-purple-700 bg-white px-3 py-1.5 rounded-xl border border-purple-200 shadow-xs cursor-pointer"
              >
                ← Voltar para Manutenção Mensal (TITS-502P)
              </button>
            </div>

            {/* RIA Header Form */}
            <RiaHeaderForm
              headerData={riaHeaderData}
              setHeaderData={setRiaHeaderData}
              onFillDemo={handleFillDemoRia}
              onSwitchToMonthly={() => setReportType('TITS-502P')}
            />

            {/* RIA Summary Statistics */}
            <RiaSummaryStats
              itemStates={riaItemStates}
            />

            {/* RIA Sections (Poço Inferior; Corrimão/Balaustrada; Poço Superior) */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-orange-600" />
                  Itens Inspecionados - Relatório de Inspeção Anual (RIA)
                </h3>
                <span className="text-xs text-slate-600 font-bold">
                  * Preencha os resultados (C, NC, ATR, N/A) e códigos de correção (ORÇ, ITP, CC, DIR)
                </span>
              </div>

              {RIA_SECTIONS.map((sec) => (
                <RiaSection
                  key={sec.id}
                  section={sec}
                  itemStates={riaItemStates}
                  onItemChange={handleRiaItemChange}
                  edificioName={riaHeaderData.edificio}
                  dataInspeção={riaHeaderData.data}
                />
              ))}
            </div>

            {/* Conclusão e Encerramento RIA */}
            <RiaConclusaoSection
              headerData={riaHeaderData}
              setHeaderData={setRiaHeaderData}
            />
          </div>
        ) : (
          /* ========================================================
             FLUXO TITS-502P (MANUTENÇÃO PREVENTIVA MENSAL)
             ======================================================== */
          <div>
            {/* Header Form */}
            <HeaderForm
              headerData={headerData}
              setHeaderData={setHeaderData}
              onFillDemo={handleFillDemo}
              reportType={reportType}
              onReportTypeChange={setReportType}
            />

            {/* Safety Alert Block */}
            <AlertBlock
              alertConfirmed={alertConfirmed}
              setAlertConfirmed={setAlertConfirmed}
            />

            {/* Summary Statistics Bar */}
            <SummaryStats
              activeActivities={activeActivities}
              itemStates={itemStates}
            />

            {/* Stages list */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-purple-700" />
                  Atividades de Campo TKE ({activeActivities.length} itens para {MONTHS.find(m => m.id === headerData.mesRef)?.name})
                </h3>
                <span className="text-xs text-slate-600 font-bold">
                  * Atividades complementares filtradas pelo mês de referência
                </span>
              </div>

              {STAGES.map(stage => {
                const stageActs = activeActivities.filter(a => a.stageId === stage.id);
                return (
                  <StageSection
                    key={stage.id}
                    stage={stage}
                    activities={stageActs}
                    itemStates={itemStates}
                    onItemChange={handleItemChange}
                    clienteName={headerData.cliente}
                    dataManutencao={headerData.data}
                  />
                );
              })}
            </div>

            {/* Signatures Section */}
            <SignaturesSection
              signatures={signatures}
              setSignatures={setSignatures}
            />
          </div>
        )}

        {/* Bottom PDF Export Floating Trigger */}
        <div className="flex items-center justify-center pt-4 pb-12">
          <button
            onClick={() => setIsPdfModalOpen(true)}
            className="tke-btn-gradient flex items-center gap-3 px-8 sm:px-10 py-4 text-white font-black text-sm sm:text-base rounded-2xl shadow-xl transition-all cursor-pointer transform hover:-translate-y-1 active:translate-y-0"
          >
            <Download className="w-5 h-5 text-amber-200" />
            <span>Visualizar, Baixar e Enviar Relatório (PDF)</span>
          </button>
        </div>

      </main>

      {/* PDF Preview Modal */}
      <PdfExportModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        reportType={reportType}
        headerData={headerData}
        activeActivities={activeActivities}
        itemStates={itemStates}
        alertConfirmed={alertConfirmed}
        signatures={signatures}
        riaHeaderData={riaHeaderData}
        riaItemStates={riaItemStates}
      />

      {/* PWA Mobile Installation Prompt & Offline Banner */}
      <PwaInstallPrompt />
    </div>
  );
}
