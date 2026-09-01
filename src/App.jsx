import React, { useState, useMemo } from 'react';
import HeaderForm from './components/HeaderForm';
import AlertBlock from './components/AlertBlock';
import StageSection from './components/StageSection';
import SummaryStats from './components/SummaryStats';
import SignaturesSection from './components/SignaturesSection';
import PdfExportModal from './components/PdfExportModal';
import PwaInstallPrompt from './components/PwaInstallPrompt';

import { ACTIVITIES, STAGES, MONTHS } from './data/tits502pData';
import { Download, CheckCircle2 } from 'lucide-react';

export default function App() {
  const currentDateStr = new Date().toISOString().split('T')[0];

  const [headerData, setHeaderData] = useState({
    cliente: '',
    endereco: '',
    equipamento: '',
    data: currentDateStr,
    tecnicos: '',
    tipoVisita: 'Mensal',
    mesRef: 1 // Janeiro por padrão
  });

  const [itemStates, setItemStates] = useState({});
  const [alertConfirmed, setAlertConfirmed] = useState(false);

  const [signatures, setSignatures] = useState({
    elaborado: { nome: '', data: currentDateStr },
    revisado: { nome: '', data: currentDateStr },
    aprovado: { nome: '', data: currentDateStr }
  });

  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  // Filter activities dynamically based on reference month (Jan - Dec)
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
    ctx.fillText('Norma TITS-502P', 200, 190);

    return canvas.toDataURL('image/jpeg', 0.85);
  };

  // Preencher dados demonstrativos para teste rápido em 1 clique
  const handleFillDemo = () => {
    setHeaderData({
      cliente: 'Condomínio Edifício Plaza Shopping Center',
      endereco: 'Av. das Nações Unidas, 12551 - São Paulo/SP',
      equipamento: 'Escada Rolante ER-02 (S/N: TK-998412)',
      data: currentDateStr,
      tecnicos: 'Carlos Eduardo Silva & Marcos Roberto (TKE)',
      tipoVisita: 'Mensal',
      mesRef: 1 // Janeiro (carrega mais itens complementares)
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

  return (
    <div className="min-h-screen bg-slate-200 text-slate-900 font-sans pb-16 selection:bg-orange-500 selection:text-white">
      
      {/* Top Navigation Bar */}
      <header className="no-print sticky top-0 z-40 bg-white border-b border-slate-300 px-4 sm:px-8 py-3.5 flex justify-between items-center shadow-md">
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
                Relatório Fotográfico TITS-502P
              </h1>
              <span className="bg-orange-100 text-orange-900 font-mono font-bold text-[10px] px-2 py-0.5 rounded border border-orange-300">
                Padrão TKE
              </span>
            </div>
            <p className="text-xs text-slate-600 font-medium">Manutenção Preventiva de Escadas e Esteiras Rolantes</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setIsPdfModalOpen(true)}
            className="tke-btn-gradient flex items-center gap-2 px-5 py-2.5 text-white font-black text-xs sm:text-sm rounded-xl shadow-md cursor-pointer transform hover:-translate-y-0.5"
          >
            <Download className="w-4 h-4 text-amber-200" />
            Visualizar e Baixar PDF
          </button>
        </div>
      </header>

      {/* Main Body Container */}
      <main className="no-print max-w-6xl mx-auto px-4 sm:px-6 pt-8">
        
        {/* Header Form */}
        <HeaderForm
          headerData={headerData}
          setHeaderData={setHeaderData}
          onFillDemo={handleFillDemo}
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

        {/* Bottom PDF Export Floating Trigger */}
        <div className="flex items-center justify-center pt-4 pb-12">
          <button
            onClick={() => setIsPdfModalOpen(true)}
            className="tke-btn-gradient flex items-center gap-3 px-10 py-4 text-white font-black text-base rounded-2xl shadow-xl transition-all cursor-pointer transform hover:-translate-y-1 active:translate-y-0"
          >
            <Download className="w-5 h-5 text-amber-200" />
            Visualizar e Baixar Relatório (PDF)
          </button>
        </div>

      </main>

      {/* PDF Preview Modal */}
      <PdfExportModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        headerData={headerData}
        activeActivities={activeActivities}
        itemStates={itemStates}
        alertConfirmed={alertConfirmed}
        signatures={signatures}
      />

      {/* PWA Mobile Installation Prompt & Offline Banner */}
      <PwaInstallPrompt />
    </div>
  );
}
