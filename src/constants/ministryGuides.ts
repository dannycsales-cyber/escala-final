import { MinistryGuide } from '../types';

export const MINISTRY_GUIDES: MinistryGuide[] = [
  {
    ministry: 'ESTACIONAMENTO',
    description: 'Responsável pela recepção e segurança dos veículos dos membros e visitantes.',
    responsibilities: [
      'Organizar carros de forma eficiente',
      'Auxiliar na entrada e saída de veículos',
      'Evitar bloqueios em vias de acesso',
      'Zelar pela segurança no pátio'
    ],
    checklist: {
      before: ['Chegar 30min antes', 'Colocar cones de sinalização', 'Vestir colete refletor'],
      during: ['Monitorar movimentação externa', 'Recepcionar com sorriso'],
      after: ['Guardar cones e materiais', 'Verificar se há luzes acesas nos carros']
    }
  },
  {
    ministry: 'COZINHA',
    description: 'Responsável pela hospitalidade e comunhão através do servir.',
    responsibilities: [
      'Preparar e servir café/lanches',
      'Organizar a mesa de comunhão',
      'Manter a limpeza da área',
      'Garantir suprimentos básicos'
    ],
    checklist: {
      before: ['Organizar a mesa', 'Passar o café fresco'],
      during: ['Servir com alegria', 'Repor o que for necessário'],
      after: ['Limpar superfícies', 'Retirar o lixo', 'Lavar utensílios']
    }
  },
  {
    ministry: 'RECEPÇÃO',
    description: 'A primeira impressão da igreja. Focada no acolhimento e informação.',
    responsibilities: [
      'Organizar o fluxo na entrada',
      'Auxiliar e orientar visitantes',
      'Identificar necessidades especiais',
      'Entregar materiais informativos'
    ],
    checklist: {
      before: ['Chegar no horário', 'Verificar se há folhetos', 'Organizar balcão'],
      during: ['Cumprimentar a todos', 'Acompanhar visitantes até os assentos', 'Verificar limpeza dos banheiros'],
      after: ['Recolher materiais deixados', 'Manter ambiente organizado']
    }
  },
  {
    ministry: 'CAPITÃO',
    description: 'Liderar e coordenar as operações durante o culto.',
    responsibilities: [
      'Liderar a equipe de apoio',
      'Delegar funções específicas',
      'Organizar o momento das ofertas',
      'Auxiliar o altar e o pastor'
    ],
    checklist: {
      before: ['Reunião rápida com equipe', 'Orar com os voluntários', 'Testar máquinas de cartão'],
      during: ['Coordenar dinâmica de assentos', 'Estar atento ao altar'],
      after: ['Relatório de intercorrências', 'Feedback para liderança']
    }
  },
  {
    ministry: 'APOIO TEMPLO',
    description: 'Suporte direto à logística interna do santuário.',
    responsibilities: [
      'Auxiliar o capitão em todas as demandas',
      'Zelar pela reverência e ordem',
      'Manter limpeza rápida se necessário',
      'Cuidar dos materiais de apoio'
    ],
    checklist: {
      before: ['Organizar envelopes nos bancos', 'Verificar temperatura/ar'],
      during: ['Auxiliar na acomodação', 'Retirar lixos discretamente'],
      after: ['Recolher envelopes usados', 'Guardar materiais em seus devidos lugares']
    }
  },
  {
    ministry: 'KIDS',
    description: 'Ministério com as crianças. Foco em ensino e segurança.',
    responsibilities: [
      'Cuidar das crianças com amor',
      'Facilitar atividades e ensino',
      'Garantir segurança total no espaço',
      'Comunicar com os pais'
    ],
    checklist: {
      before: ['Preparar a sala e materiais', 'Verificar brinquedos'],
      during: ['Acompanhar ida ao banheiro/bebedouro', 'Desenvolver atividades', 'Manter vigilância constante'],
      after: ['Organizar sala após saída', 'Lavar mãos das crianças se necessário']
    }
  },
  {
    ministry: 'MÍDIA',
    description: 'Responsável pela imagem e comunicação visual do Reino.',
    responsibilities: [
      'Gerenciar redes sociais (Instagram)',
      'Capturar fotos e vídeos de qualidade',
      'Editar conteúdos rápidos',
      'Registrar momentos proféticos'
    ],
    checklist: {
      before: ['Limpar lentes e carregar baterias', 'Verificar iluminação'],
      during: ['Registrar momentos chave (louvor, palavra)', 'Fazer stories dinâmicos'],
      after: ['Backup do material colhido', 'Seleção de melhores fotos']
    }
  }
];
