/**
 * Dados e Estrutura Oficial do Relatório de Inspeção Anual (RIA) - Escadas e Esteiras
 * Padrão TK Elevator (TKE)
 */

export const RIA_RESULTS = [
  { code: 'C', label: 'C - Conforme', badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  { code: 'NC', label: 'NC - Não Conforme', badgeClass: 'bg-red-100 text-red-800 border-red-400' },
  { code: 'ATR', label: 'ATR - Atualização Técnica Recomendada', badgeClass: 'bg-amber-100 text-amber-900 border-amber-300' },
  { code: 'N/A', label: 'N/A - Não Aplicável', badgeClass: 'bg-slate-100 text-slate-700 border-slate-300' }
];

export const RIA_CORRECTIONS = [
  { code: '--', label: '-- (Sem Correção)' },
  { code: 'ORÇ', label: 'ORÇ - Orçamento' },
  { code: 'ITP', label: 'ITP - Informativo para Troca de Peças' },
  { code: 'CC', label: 'CC - Comunicação ao Cliente' },
  { code: 'DIR', label: 'DIR - Item a ser ajustado/regulado/lubrificado' }
];

export const RIA_SECTIONS = [
  {
    id: 'poco-inferior',
    title: 'POÇO INFERIOR',
    items: [
      {
        id: 'ria-pi-1',
        name: 'CONTATO BAIXA-QUEBRA DE DEGRAU',
        defaultResult: 'C',
        defaultCorr: '--',
        descricao: '',
        providencias: ''
      },
      {
        id: 'ria-pi-2',
        name: 'PLACA DE DENTES INFERIOR',
        defaultResult: 'C',
        defaultCorr: '--',
        descricao: '',
        providencias: ''
      },
      {
        id: 'ria-pi-3',
        name: 'MICRO DE ABERTURA DA TAMPA DO POÇO',
        defaultResult: 'C',
        defaultCorr: '--',
        descricao: '',
        providencias: ''
      },
      {
        id: 'ria-pi-4',
        name: 'LIMPEZA DO POÇO',
        defaultResult: 'C',
        defaultCorr: '--',
        descricao: '',
        providencias: ''
      },
      {
        id: 'ria-pi-5',
        name: 'PROTEÇÃO DOS DEGRAUS',
        defaultResult: 'C',
        defaultCorr: '--',
        descricao: '',
        providencias: ''
      },
      {
        id: 'ria-pi-6',
        name: 'STOP POÇO INFERIOR',
        defaultResult: 'C',
        defaultCorr: '--',
        descricao: '',
        providencias: ''
      },
      {
        id: 'ria-pi-7',
        name: 'COMANDO MANUAL DE INSPEÇÃO',
        defaultResult: 'C',
        defaultCorr: '--',
        descricao: '',
        providencias: ''
      }
    ]
  },
  {
    id: 'corrimao-balaustrada',
    title: 'CORRIMÃO, BALAUSTRADA E RODAPÉ',
    items: [
      {
        id: 'ria-cbr-1',
        name: 'ESTADO GERAL DO CORRIMÃO',
        defaultResult: 'C',
        defaultCorr: '--',
        descricao: '',
        providencias: ''
      },
      {
        id: 'ria-cbr-2',
        name: 'MICROS DE ENTRADAS DO CORRIMÃO',
        defaultResult: 'C',
        defaultCorr: '--',
        descricao: '',
        providencias: ''
      },
      {
        id: 'ria-cbr-3',
        name: 'ESTADO GERAL DA BALAUSTRADA',
        defaultResult: 'C',
        defaultCorr: '--',
        descricao: '',
        providencias: ''
      },
      {
        id: 'ria-cbr-4',
        name: 'ILUMINAÇÃO E SINALIZAÇÃO LUMINOSA',
        defaultResult: 'C',
        defaultCorr: '--',
        descricao: '',
        providencias: ''
      },
      {
        id: 'ria-cbr-5',
        name: 'MICRO DE SEGURANÇA DO RODAPÉ',
        defaultResult: 'C',
        defaultCorr: '--',
        descricao: '',
        providencias: ''
      },
      {
        id: 'ria-cbr-6',
        name: 'BOTOEIRA LIGA-DESLIGA',
        defaultResult: 'C',
        defaultCorr: '--',
        descricao: '',
        providencias: ''
      },
      {
        id: 'ria-cbr-7',
        name: 'ETIQUETAS DE SINALIZAÇÃO',
        defaultResult: 'C',
        defaultCorr: '--',
        descricao: '',
        providencias: ''
      },
      {
        id: 'ria-cbr-8',
        name: 'ESTADO GERAL DEGRAUS-PALETES',
        defaultResult: 'C',
        defaultCorr: '--',
        descricao: '',
        providencias: ''
      },
      {
        id: 'ria-cbr-9',
        name: 'CUNHA (ÂNGULOS DA ESCADA)',
        defaultResult: 'C',
        defaultCorr: '--',
        descricao: '',
        providencias: ''
      }
    ]
  },
  {
    id: 'poco-superior',
    title: 'POÇO SUPERIOR',
    items: [
      {
        id: 'ria-ps-1',
        name: 'BARRICADAS PARA MANUTENÇÃO',
        defaultResult: 'C',
        defaultCorr: '--',
        descricao: '',
        providencias: ''
      },
      {
        id: 'ria-ps-2',
        name: 'FERRAMENTA DE ABERTURA DO POÇO',
        defaultResult: 'C',
        defaultCorr: '--',
        descricao: '',
        providencias: ''
      },
      {
        id: 'ria-ps-3',
        name: 'MICRO DE ABERTURA DA TAMPA DO POÇO',
        defaultResult: 'C',
        defaultCorr: '--',
        descricao: '',
        providencias: ''
      },
      {
        id: 'ria-ps-4',
        name: 'MICRO DE ABERTURA DA TAMPA DO POÇO (SECUNDÁRIO)',
        defaultResult: 'C',
        defaultCorr: '--',
        descricao: '',
        providencias: ''
      },
      {
        id: 'ria-ps-5',
        name: 'LIMPEZA DO POÇO',
        defaultResult: 'C',
        defaultCorr: '--',
        descricao: '',
        providencias: ''
      },
      {
        id: 'ria-ps-6',
        name: 'PROTEÇÃO DE DEGRAUS',
        defaultResult: 'C',
        defaultCorr: '--',
        descricao: '',
        providencias: ''
      },
      {
        id: 'ria-ps-7',
        name: 'FIAÇÃO ELÉTRICA',
        defaultResult: 'C',
        defaultCorr: '--',
        descricao: '',
        providencias: ''
      },
      {
        id: 'ria-ps-8',
        name: 'CHAVE SECCIONADORA',
        defaultResult: 'C',
        defaultCorr: '--',
        descricao: '',
        providencias: ''
      },
      {
        id: 'ria-ps-9',
        name: 'DISJUNTOR MONOFÁSICO',
        defaultResult: 'C',
        defaultCorr: '--',
        descricao: '',
        providencias: ''
      },
      {
        id: 'ria-ps-10',
        name: 'SINALIZAÇÃO DE SEGURANÇA NR10',
        defaultResult: 'C',
        defaultCorr: '--',
        descricao: '',
        providencias: ''
      },
      {
        id: 'ria-ps-11',
        name: 'NÍVEL DE ÓLEO DO REDUTOR',
        isParent: true,
        subItems: [
          { id: 'ria-ps-11-sub1', name: 'NÍVEL DO ÓLEO BAIXO', checked: false, corr: 'ORÇ', providencias: '' },
          { id: 'ria-ps-11-sub2', name: 'SEM ÓLEO', checked: false, corr: 'ORÇ', providencias: '' },
          { id: 'ria-ps-11-sub3', name: 'SEM ETIQUETA DE TROCA DE ÓLEO', checked: false, corr: 'DIR', providencias: '' }
        ],
        defaultResult: 'C',
        defaultCorr: '--',
        descricao: '',
        providencias: ''
      },
      {
        id: 'ria-ps-12',
        name: 'FUNCIONAMENTO DO MOTOR',
        defaultResult: 'C',
        defaultCorr: '--',
        descricao: '',
        providencias: ''
      },
      {
        id: 'ria-ps-13',
        name: 'DESLIZE-FUNCIONAMENTO DO FREIO',
        defaultResult: 'C',
        defaultCorr: '--',
        descricao: '',
        providencias: ''
      },
      {
        id: 'ria-ps-14',
        name: 'TENSÃO DA CORRENTE PRINCIPAL',
        isParent: true,
        subItems: [
          { id: 'ria-ps-14-sub1', name: 'CORRENTE DANIFICADA', checked: false, corr: 'ORÇ', providencias: '' },
          { id: 'ria-ps-14-sub2', name: 'FOLGA MAIOR QUE 10MM', checked: false, corr: 'ORÇ', providencias: '' },
          { id: 'ria-ps-14-sub3', name: 'SENSOR DESAJUSTADO', checked: false, corr: 'DIR', providencias: '' }
        ],
        defaultResult: 'C',
        defaultCorr: '--',
        descricao: '',
        providencias: ''
      },
      {
        id: 'ria-ps-15',
        name: 'PLACA DE DENTES SUPERIOR',
        defaultResult: 'C',
        defaultCorr: '--',
        descricao: '',
        providencias: ''
      }
    ]
  }
];

export const INITIAL_RIA_HEADER = {
  edificio: '',
  endereco: '',
  equipamento: '',
  paradasEntradas: '0',
  fabricante: 'Schindler',
  maquina: 'Máquina não cadastrada.',
  quadroComando: '',
  portasPavimento: 'Indefinida',
  capacidade: '0',
  data: new Date().toISOString().split('T')[0],
  codigo: '',
  cidade: 'Passo Fundo - RS',
  conclusao: '',
  clienteNome: '',
  empresa: 'TK ELEVADORES BRASIL LTDA'
};

export const DEMO_RIA_DATA = {
  header: {
    edificio: 'SHOPING BELLA CITTA',
    endereco: 'RUA CORONEL CHICUTA 355 CENTRO 99010050 PASSO FUNDO RS',
    equipamento: '138644',
    paradasEntradas: '0',
    fabricante: 'Schindler',
    maquina: 'Máquina não cadastrada.',
    quadroComando: 'Padrão Schindler',
    portasPavimento: 'Indefinida',
    capacidade: '0',
    data: '2026-09-15',
    codigo: '988039',
    cidade: 'PASSO FUNDO, 19/09/2026',
    conclusao: 'Equipamento inspecionado de acordo com as normas de segurança TKE. Identificada necessidade de regularização do nível de óleo do redutor e ajuste/substituição de corrente com folga superior a 10mm.',
    clienteNome: 'Shoping Bella Citta - Gestão Predial',
    empresa: 'TK ELEVADORES BRASIL LTDA'
  },
  items: {
    'ria-pi-1': { result: 'C', corr: '--', descricao: '', providencias: '', photos: [] },
    'ria-pi-2': { result: 'C', corr: '--', descricao: '', providencias: '', photos: [] },
    'ria-pi-3': { result: 'C', corr: '--', descricao: '', providencias: '', photos: [] },
    'ria-pi-4': { result: 'C', corr: '--', descricao: '', providencias: '', photos: [] },
    'ria-pi-5': { result: 'C', corr: '--', descricao: '', providencias: '', photos: [] },
    'ria-pi-6': { result: 'C', corr: '--', descricao: '', providencias: '', photos: [] },
    'ria-pi-7': { result: 'C', corr: '--', descricao: '', providencias: '', photos: [] },
    'ria-cbr-1': { result: 'C', corr: '--', descricao: '', providencias: '', photos: [] },
    'ria-cbr-2': { result: 'C', corr: '--', descricao: '', providencias: '', photos: [] },
    'ria-cbr-3': { result: 'C', corr: '--', descricao: '', providencias: '', photos: [] },
    'ria-cbr-4': { result: 'C', corr: '--', descricao: '', providencias: '', photos: [] },
    'ria-cbr-5': { result: 'C', corr: '--', descricao: '', providencias: '', photos: [] },
    'ria-cbr-6': { result: 'C', corr: '--', descricao: '', providencias: '', photos: [] },
    'ria-cbr-7': { result: 'C', corr: '--', descricao: '', providencias: '', photos: [] },
    'ria-cbr-8': { result: 'C', corr: '--', descricao: '', providencias: '', photos: [] },
    'ria-cbr-9': { result: 'C', corr: '--', descricao: '', providencias: '', photos: [] },
    'ria-ps-1': { result: 'C', corr: '--', descricao: '', providencias: '', photos: [] },
    'ria-ps-2': { result: 'C', corr: '--', descricao: '', providencias: '', photos: [] },
    'ria-ps-3': { result: 'C', corr: '--', descricao: '', providencias: '', photos: [] },
    'ria-ps-4': { result: 'C', corr: '--', descricao: '', providencias: '', photos: [] },
    'ria-ps-5': { result: 'C', corr: '--', descricao: '', providencias: '', photos: [] },
    'ria-ps-6': { result: 'C', corr: '--', descricao: '', providencias: '', photos: [] },
    'ria-ps-7': { result: 'C', corr: '--', descricao: '', providencias: '', photos: [] },
    'ria-ps-8': { result: 'C', corr: '--', descricao: '', providencias: '', photos: [] },
    'ria-ps-9': { result: 'C', corr: '--', descricao: '', providencias: '', photos: [] },
    'ria-ps-10': { result: 'C', corr: '--', descricao: '', providencias: '', photos: [] },
    'ria-ps-11': {
      result: '',
      corr: '',
      descricao: '',
      providencias: '',
      photos: [],
      subItemsState: {
        'ria-ps-11-sub1': { checked: true, corr: 'ORÇ', providencias: '' },
        'ria-ps-11-sub2': { checked: false, corr: '', providencias: '' },
        'ria-ps-11-sub3': { checked: false, corr: '', providencias: '' }
      }
    },
    'ria-ps-12': { result: 'C', corr: '--', descricao: '', providencias: '', photos: [] },
    'ria-ps-13': { result: 'C', corr: '--', descricao: '', providencias: '', photos: [] },
    'ria-ps-14': {
      result: '',
      corr: '',
      descricao: '',
      providencias: '',
      photos: [],
      subItemsState: {
        'ria-ps-14-sub1': { checked: false, corr: '', providencias: '' },
        'ria-ps-14-sub2': { checked: true, corr: 'ORÇ', providencias: '' },
        'ria-ps-14-sub3': { checked: false, corr: '', providencias: '' }
      }
    },
    'ria-ps-15': { result: 'C', corr: '--', descricao: '', providencias: '', photos: [] }
  }
};
