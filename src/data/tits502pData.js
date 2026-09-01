export const MONTHS = [
  { id: 1, name: "Janeiro", short: "Jan" },
  { id: 2, name: "Fevereiro", short: "Fev" },
  { id: 3, name: "Março", short: "Mar" },
  { id: 4, name: "Abril", short: "Abr" },
  { id: 5, name: "Maio", short: "Mai" },
  { id: 6, name: "Junho", short: "Jun" },
  { id: 7, name: "Julho", short: "Jul" },
  { id: 8, name: "Agosto", short: "Ago" },
  { id: 9, name: "Setembro", short: "Set" },
  { id: 10, name: "Outubro", short: "Out" },
  { id: 11, name: "Novembro", short: "Nov" },
  { id: 12, name: "Dezembro", short: "Dez" },
];

export const STAGES = [
  {
    id: 1,
    title: "Etapa 1 - Inspeção Prévia",
    subtitle: "(Equipamento em movimento - VERIFICAÇÃO)",
    badge: "Mensal",
  },
  {
    id: 2,
    title: "Etapa 2 - Patamar Superior",
    subtitle: "(Desenergizado & Energizado)",
    badge: "Mensal / Complementar",
  },
  {
    id: 3,
    title: "Etapa 3 - Patamar Inferior",
    subtitle: "(Desenergizado & Energizado)",
    badge: "Mensal / Complementar",
  },
  {
    id: 4,
    title: "Etapa 4 - Patamar Intermediário",
    subtitle: "(Apenas atividades complementares)",
    badge: "Complementar",
  },
];

export const ACTIVITIES = [
  // --- ETAPA 1: Inspeção Prévia (Todas mensais) ---
  {
    id: "5.5.1",
    stageId: 1,
    subgroup: "Movimento",
    code: "5.5.1",
    description: "Verificar a existência e o estado dos defletores e dos guarda-corpos.",
    isMonthly: true,
    months: [1,2,3,4,5,6,7,8,9,10,11,12]
  },
  {
    id: "5.5.2",
    stageId: 1,
    subgroup: "Movimento",
    code: "5.5.2",
    description: "Verificar o estado das etiquetas de advertência conforme ITITS-502P.",
    isMonthly: true,
    months: [1,2,3,4,5,6,7,8,9,10,11,12]
  },
  {
    id: "5.5.3",
    stageId: 1,
    subgroup: "Movimento",
    code: "5.5.3",
    description: "Verificar a iluminação dos degraus, placas pentes, rodapés e balaustradas.",
    isMonthly: true,
    months: [1,2,3,4,5,6,7,8,9,10,11,12]
  },
  {
    id: "5.5.4",
    stageId: 1,
    subgroup: "Movimento",
    code: "5.5.4",
    description: "Inspecionar o estado dos acabamentos e o correto funcionamento dos semáforos (quando existir).",
    isMonthly: true,
    months: [1,2,3,4,5,6,7,8,9,10,11,12]
  },
  {
    id: "5.5.5",
    stageId: 1,
    subgroup: "Movimento",
    code: "5.5.5",
    description: "Examinar o estado das escovas, acabamentos dos rodapés e fixação dos rodapés.",
    isMonthly: true,
    months: [1,2,3,4,5,6,7,8,9,10,11,12]
  },
  {
    id: "5.5.6",
    stageId: 1,
    subgroup: "Movimento",
    code: "5.5.6",
    description: "Validar ausência de ruídos no funcionamento, golpes e vibrações anormais.",
    isMonthly: true,
    months: [1,2,3,4,5,6,7,8,9,10,11,12]
  },
  {
    id: "5.5.7",
    stageId: 1,
    subgroup: "Movimento",
    code: "5.5.7",
    description: "Inspecionar o aquecimento dos corrimãos e sincronismos.",
    isMonthly: true,
    months: [1,2,3,4,5,6,7,8,9,10,11,12]
  },
  {
    id: "5.5.8",
    stageId: 1,
    subgroup: "Movimento",
    code: "5.5.8",
    description: "Verificar o funcionamento do botão de \"STOP\" do usuário em ambos os patamares e chave de direção.",
    isMonthly: true,
    months: [1,2,3,4,5,6,7,8,9,10,11,12]
  },
  {
    id: "5.5.9",
    stageId: 1,
    subgroup: "Movimento",
    code: "5.5.9",
    description: "Comprovar o estado das entradas dos corrimãos e atuação dos microinterruptores.",
    isMonthly: true,
    months: [1,2,3,4,5,6,7,8,9,10,11,12]
  },
  {
    id: "5.5.10",
    stageId: 1,
    subgroup: "Movimento",
    code: "5.5.10",
    description: "Verificar o estado do sistema de detecção de pessoas (fotoelétrico, radar, etc.).",
    isMonthly: true,
    months: [1,2,3,4,5,6,7,8,9,10,11,12]
  },

  // --- ETAPA 2: Patamar Superior (Desenergizado + Energizado) ---
  {
    id: "5.6.1",
    stageId: 2,
    subgroup: "Desenergizado",
    code: "5.6.1",
    description: "Comprovar o estado da placa piso superior.",
    isMonthly: true,
    months: [1,2,3,4,5,6,7,8,9,10,11,12]
  },
  {
    id: "5.6.2",
    stageId: 2,
    subgroup: "Desenergizado",
    code: "5.6.2",
    description: "Realizar a abertura do poço e comprovar o estado do quadro de comando.",
    isMonthly: true,
    months: [1,2,3,4,5,6,7,8,9,10,11,12]
  },
  {
    id: "5.6.3",
    stageId: 2,
    subgroup: "Desenergizado",
    code: "5.6.3",
    description: "Realizar a limpeza do patamar superior.",
    isMonthly: true,
    months: [1,2,3,4,5,6,7,8,9,10,11,12]
  },
  {
    id: "5.6.4",
    stageId: 2,
    subgroup: "Desenergizado",
    code: "5.6.4",
    description: "Validar as condições e folgas da corrente principal.",
    isMonthly: true,
    months: [1,2,3,4,5,6,7,8,9,10,11,12]
  },
  {
    id: "5.6.5",
    stageId: 2,
    subgroup: "Desenergizado",
    code: "5.6.5",
    description: "Verificar as condições e nível de óleo do redutor.",
    isMonthly: true,
    months: [1,2,3,4,5,6,7,8,9,10,11,12]
  },
  {
    id: "5.6.6",
    stageId: 2,
    subgroup: "Desenergizado",
    code: "5.6.6",
    description: "Comprovar o estado geral do lubrificador automático e dosadores (se existir).",
    isMonthly: true,
    months: [1,2,3,4,5,6,7,8,9,10,11,12]
  },
  {
    id: "5.6.7",
    stageId: 2,
    subgroup: "Desenergizado",
    code: "5.6.7",
    description: "Examinar a fixação dos pentes, altura e alinhamento - superior.",
    isMonthly: true,
    months: [1,2,3,4,5,6,7,8,9,10,11,12]
  },
  {
    id: "5.6.8",
    stageId: 2,
    subgroup: "Energizado",
    code: "5.6.8",
    description: "Verificar vibração, temperatura, batidas, ruídos anormais e acoplamento na(s) máquina(s) de tração.",
    isMonthly: true,
    months: [1,2,3,4,5,6,7,8,9,10,11,12]
  },
  {
    id: "5.6.9-mensal",
    stageId: 2,
    subgroup: "Energizado",
    code: "5.6.9",
    description: "Testar o funcionamento do freio de serviço e freio auxiliar (quando existir).",
    isMonthly: true,
    months: [1,2,3,4,5,6,7,8,9,10,11,12]
  },
  {
    id: "5.6.10",
    stageId: 2,
    subgroup: "Energizado",
    code: "5.6.10",
    description: "Sensor da corrente principal, da velocidade, do freio e do degrau.",
    isMonthly: true,
    months: [1,2,3,4,5,6,7,8,9,10,11,12]
  },
  {
    id: "5.6.11",
    stageId: 2,
    subgroup: "Energizado",
    code: "5.6.11",
    description: "Testar os micros da placa pente - superior.",
    isMonthly: true,
    months: [1,2,3,4,5,6,7,8,9,10,11,12]
  },
  {
    id: "5.6.16-mensal",
    stageId: 2,
    subgroup: "Energizado",
    code: "5.6.16",
    description: "Verificar o estado dos corrimãos.",
    isMonthly: true,
    months: [1,2,3,4,5,6,7,8,9,10,11,12]
  },
  // Complementares do Patamar Superior:
  {
    id: "5.6.9-desgaste",
    stageId: 2,
    subgroup: "Complementar (Energizado)",
    code: "5.6.9",
    description: "Verificar o desgaste da lona e ajuste do freio de serviço.",
    isMonthly: false,
    months: [3, 6, 9, 12]
  },
  {
    id: "5.6.9-deslize",
    stageId: 2,
    subgroup: "Complementar (Energizado)",
    code: "5.6.9",
    description: "Verificação mecânica e deslize do freio auxiliar (quando existir).",
    isMonthly: false,
    months: [1, 9]
  },
  {
    id: "5.6.12",
    stageId: 2,
    subgroup: "Complementar (Energizado)",
    code: "5.6.12",
    description: "Comprovar o funcionamento do disjuntor diferencial residual (DR) e os relés de segurança do quadro de comando.",
    isMonthly: false,
    months: [1]
  },
  {
    id: "5.6.13",
    stageId: 2,
    subgroup: "Complementar (Energizado)",
    code: "5.6.13",
    description: "Verificar as conexões dos bornes e as conexões elétricas do motor da tração, limpeza dos ventiladores/dissipadores do quadro de comando e inversor (quando existir).",
    isMonthly: false,
    months: [1, 3]
  },
  {
    id: "5.6.14",
    stageId: 2,
    subgroup: "Complementar (Energizado)",
    code: "5.6.14",
    description: "Verificar o nivelamento, o estado das rodas dentadas e lubrificação dos mancais do eixo primário.",
    isMonthly: false,
    months: [1]
  },

  // --- ETAPA 3: Patamar Inferior (Desenergizado + Energizado) ---
  {
    id: "5.7.1",
    stageId: 3,
    subgroup: "Desenergizado",
    code: "5.7.1",
    description: "Comprovar o estado da placa piso inferior.",
    isMonthly: true,
    months: [1,2,3,4,5,6,7,8,9,10,11,12]
  },
  {
    id: "5.7.2",
    stageId: 3,
    subgroup: "Desenergizado",
    code: "5.7.2",
    description: "Realizar a abertura do poço.",
    isMonthly: true,
    months: [1,2,3,4,5,6,7,8,9,10,11,12]
  },
  {
    id: "5.7.3",
    stageId: 3,
    subgroup: "Desenergizado",
    code: "5.7.3",
    description: "Realizar a limpeza do patamar inferior.",
    isMonthly: true,
    months: [1,2,3,4,5,6,7,8,9,10,11,12]
  },
  {
    id: "5.7.4",
    stageId: 3,
    subgroup: "Desenergizado",
    code: "5.7.4",
    description: "Examinar a fixação dos pentes, altura e alinhamento - inferior.",
    isMonthly: true,
    months: [1,2,3,4,5,6,7,8,9,10,11,12]
  },
  {
    id: "5.7.5",
    stageId: 3,
    subgroup: "Desenergizado",
    code: "5.7.5",
    description: "Testar os micros da placa pente - inferior.",
    isMonthly: true,
    months: [1,2,3,4,5,6,7,8,9,10,11,12]
  },
  {
    id: "5.7.7",
    stageId: 3,
    subgroup: "Energizado",
    code: "5.7.7",
    description: "Lubrificar as correntes dos degraus.",
    isMonthly: true,
    months: [1,2,3,4,5,6,7,8,9,10,11,12]
  },
  // Complementares do Patamar Inferior:
  {
    id: "5.7.6",
    stageId: 3,
    subgroup: "Complementar",
    code: "5.7.6",
    description: "Verificar o funcionamento dos microinterruptores de segurança da estação tensora (carro tensor).",
    isMonthly: false,
    months: [1, 7]
  },
  {
    id: "5.7.8",
    stageId: 3,
    subgroup: "Complementar",
    code: "5.7.8",
    description: "Comprovar as conexões dos bornes.",
    isMonthly: false,
    months: [1, 3]
  },
  {
    id: "5.7.9",
    stageId: 3,
    subgroup: "Complementar",
    code: "5.7.9",
    description: "Retirar e verificar o estado dos degraus.",
    isMonthly: false,
    months: [1, 4, 7, 10]
  },

  // --- ETAPA 4: Patamar Intermediário (Apenas Atividades Complementares) ---
  {
    id: "5.8.1",
    stageId: 4,
    subgroup: "Complementar",
    code: "5.8.1",
    description: "Verificar o desgaste, lubrificação e folga entre o degrau e o iniciador de degraus/paletes.",
    isMonthly: false,
    months: [1, 4, 7, 10]
  },
  {
    id: "5.8.2",
    stageId: 4,
    subgroup: "Complementar",
    code: "5.8.2",
    description: "Verificar o \"varão\" e testar o acionamento do microinterruptor.",
    isMonthly: false,
    months: [1, 4, 7, 10]
  },
  {
    id: "5.8.3",
    stageId: 4,
    subgroup: "Complementar",
    code: "5.8.3",
    description: "Comprovar as condições gerais e folgas da corrente secundária.",
    isMonthly: false,
    months: [1, 4, 7, 10]
  },
  {
    id: "5.8.4",
    stageId: 4,
    subgroup: "Complementar",
    code: "5.8.4",
    description: "Avaliar as condições do sistema de tração dos corrimãos.",
    isMonthly: false,
    months: [1, 7]
  },
  {
    id: "5.8.5",
    stageId: 4,
    subgroup: "Complementar",
    code: "5.8.5",
    description: "Verificar o estado das guias, roletes, folgas e sensores dos corrimãos.",
    isMonthly: false,
    months: [1, 7]
  },
  {
    id: "5.8.6",
    stageId: 4,
    subgroup: "Complementar",
    code: "5.8.6",
    description: "Confirmar a folga entre degrau/palete e rodapé e micros do rodapé.",
    isMonthly: false,
    months: [1, 2, 5, 8, 11]
  },
  {
    id: "5.8.7",
    stageId: 4,
    subgroup: "Complementar",
    code: "5.8.7",
    description: "Realizar a limpeza dos trilhos e verificar os parafusos de fixação.",
    isMonthly: false,
    months: [2, 5, 8, 11]
  },
  {
    id: "5.6.15",
    stageId: 4,
    subgroup: "Complementar",
    code: "5.6.15",
    description: "Verificar e limpeza das guias dos corrimãos.",
    isMonthly: false,
    months: [3, 6, 9, 12]
  }
];

export const SAFETY_ALERT_TEXT = `Desligar a escada/esteira rolante e notificar o condomínio e o supervisor sempre que ocorrer: (1) deficiência na alimentação elétrica do condomínio - falta de aterramento no quadro de força da casa de máquinas ou ligações elétricas clandestinas; (2) qualquer micro da série de segurança danificado e/ou ponteado; (3) água no poço.`;
