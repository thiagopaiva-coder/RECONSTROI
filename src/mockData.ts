import { Campaign, Donation, SupportTicket, PlatformConfig, User } from './types';

export const mockUsers: User[] = [
  {
    id: 'usr-1',
    name: 'Thiago Silva',
    email: 'doador@reconstroi.com',
    role: 'Doador',
    verified: true,
  },
  {
    id: 'usr-2',
    name: 'Defesa Civil Vale do Taquari',
    email: 'organizador@reconstroi.com',
    role: 'Organizador',
    verified: true,
    bankAccount: {
      bank: 'Banco do Brasil',
      agency: '1234',
      account: '98765-4',
      pixKey: 'cnpj-vale@defesacivil.gov.br',
    },
  },
  {
    id: 'usr-3',
    name: 'Mariana Costa (Auditora)',
    email: 'suporte@reconstroi.com',
    role: 'Suporte',
    verified: true,
  },
  {
    id: 'usr-4',
    name: 'Carlos Santos (Root)',
    email: 'admin@reconstroi.com',
    role: 'Administrador',
    verified: true,
  }
];

export const mockCampaigns: Campaign[] = [
  {
    id: 'camp-1',
    title: 'Reconstrução Vale do Taquari - RS',
    location: 'Lajeado e Muçum - Rio Grande do Sul',
    category: 'Enchentes',
    description: 'Campanha de apoio emergencial para reconstrução das casas destruídas pelas cheias do Rio Taquari. O foco é a aquisição direta de materiais de construção, telhas, cimento, tijolos e assistência direta para 120 famílias desabrigadas que perderam tudo no último desastre climático.',
    organizerName: 'Liderança Comunitária Vale do Taquari',
    organizerId: 'usr-2',
    isVerified: true,
    targetAmount: 250000,
    collectedAmount: 182450,
    donorsCount: 1412,
    imageUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&q=80&w=1200',
    mural: [
      {
        id: 'update-1-1',
        date: '2026-06-25T14:30:00',
        title: 'Entrega do primeiro lote de telhas e caixas d\'água',
        content: 'Hoje conseguimos entregar o primeiro lote com 450 telhas de fibrocimento e 15 caixas d\'água de 500L para as famílias do bairro Navegantes em Muçum. Obrigado a todos os doadores! A transparência corre em nosso sangue.',
        type: 'delivery',
        mediaUrl: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&q=80&w=800'
      },
      {
        id: 'update-1-2',
        date: '2026-06-20T10:15:00',
        title: 'Prestação de contas: Compra de cimento e argamassa',
        content: 'Acabamos de realizar o upload de mais uma nota fiscal referente à compra de 100 sacos de cimento CP-II e 80 sacos de argamassa AC-III. O material já foi descarregado no galpão comunitário para distribuição imediata.',
        type: 'financial',
        mediaUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=800'
      },
      {
        id: 'update-1-3',
        date: '2026-06-15T09:00:00',
        title: 'Início dos trabalhos de levantamento estrutural',
        content: 'Engenheiros voluntários parceiros da nossa associação iniciaram os laudos de segurança estrutural nas residências afetadas para definir quais materiais serão entregues prioritariamente para cada família.',
        type: 'info'
      }
    ],
    prestacaoContas: [
      {
        id: 'rec-1-1',
        description: '450 Telhas de Fibrocimento Ecológicas de 4mm',
        amount: 14850.00,
        date: '2026-06-24',
        supplier: 'Telhas e Cia S.A.',
        cnpj: '12.345.678/0001-90',
        status: 'Verificado',
        fileUrl: '#nota-fiscal-10492',
        auditNotes: 'Documento fiscal perfeitamente batido com o comprovante de PIX bancário. Telhas entregues no galpão de triagem de Muçum.'
      },
      {
        id: 'rec-1-2',
        description: '100 sacos de Cimento Itambé CP-II + 80 sacos de Argamassa AC-III',
        amount: 5840.00,
        date: '2026-06-19',
        supplier: 'Materiais de Construção São Jorge Ltda',
        cnpj: '89.012.345/0002-11',
        status: 'Verificado',
        fileUrl: '#nota-fiscal-09384',
        auditNotes: 'NF-e emitida e validada no portal da SEFAZ-RS. Transação correta.'
      },
      {
        id: 'rec-1-3',
        description: '20 Kits de Ferramentas Manuais (Pá, Enxada, Carrinho de Mão)',
        amount: 4200.00,
        date: '2026-06-27',
        supplier: 'Varejo de Ferragens Sul-Rio-Grandense',
        cnpj: '55.443.221/0001-02',
        status: 'Pendente',
        fileUrl: '#nota-fiscal-45521'
      }
    ],
    saques: [
      {
        id: 'saq-1-1',
        amount: 20000.00,
        date: '2026-06-23',
        status: 'Aprovado',
        bankAccount: 'Banco do Brasil - Ag. 1234 - C/C 98765-4'
      },
      {
        id: 'saq-1-2',
        amount: 15000.00,
        date: '2026-06-28',
        status: 'Pendente',
        bankAccount: 'Banco do Brasil - Ag. 1234 - C/C 98765-4'
      }
    ],
    status: 'Ativa'
  },
  {
    id: 'camp-2',
    title: 'Deslizamentos Petrópolis - Apoio Habitacional',
    location: 'Petrópolis - Rio de Janeiro',
    category: 'Deslizamentos',
    description: 'Após as fortes chuvas de verão causarem severos deslizamentos na região da subida da serra, criamos este fundo para auxiliar no aluguel social de curto prazo e na compra de eletrodomésticos básicos (fogão e geladeira) para 40 famílias que foram realocadas para abrigos temporários.',
    organizerName: 'ONG Renascer Serra RJ',
    organizerId: 'usr-2',
    isVerified: true,
    targetAmount: 120000,
    collectedAmount: 98100,
    donorsCount: 820,
    imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=1200',
    mural: [
      {
        id: 'update-2-1',
        date: '2026-06-22T11:00:00',
        title: 'Primeiras 12 famílias mudam para habitação provisória',
        content: 'Graças ao repasse de R$ 35.000,00 efetuado na semana passada, conseguimos garantir o depósito caução de aluguel social para as primeiras doze famílias vulneráveis. Elas já saíram do pavilhão de esportes para lares dignos!',
        type: 'info',
        mediaUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800'
      },
      {
        id: 'update-2-2',
        date: '2026-06-18T16:45:00',
        title: 'Compra de 10 Fogões de 4 bocas e Botijões de Gás',
        content: 'Publicamos as notas fiscais das compras de eletrodomésticos básicos essenciais efetuadas ontem à tarde. Transparência acima de tudo.',
        type: 'financial',
        mediaUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800'
      }
    ],
    prestacaoContas: [
      {
        id: 'rec-2-1',
        description: 'Aluguel Social Emergencial (Depósitos de 12 Unidades)',
        amount: 18000.00,
        date: '2026-06-12',
        supplier: 'Contratos Locação Direta Habitacional',
        cnpj: '00.000.000/0000-00',
        status: 'Verificado',
        fileUrl: '#recibos-locacao',
        auditNotes: 'Recibos assinados individualmente pelos proprietários e beneficiários das habitações temporárias.'
      },
      {
        id: 'rec-2-2',
        description: '10 Fogões Atlas Fastcook 4 Bocas com Acendimento',
        amount: 7200.00,
        date: '2026-06-17',
        supplier: 'Magazine Express Filial Petrópolis',
        cnpj: '15.654.120/0034-88',
        status: 'Verificado',
        fileUrl: '#nota-fiscal-77291',
        auditNotes: 'Confirmado com o extrato da conta de destino. Tudo em conformidade.'
      }
    ],
    saques: [
      {
        id: 'saq-2-1',
        amount: 35000.00,
        date: '2026-06-10',
        status: 'Aprovado',
        bankAccount: 'Banco Itaú - Ag. 0910 - C/C 12093-9'
      }
    ],
    status: 'Ativa'
  },
  {
    id: 'camp-3',
    title: 'Brigada Voluntária e Defesa Animal - Pantanal',
    location: 'Corumbá - Mato Grosso do Sul',
    category: 'Incêndios',
    description: 'Campanha para aquisição de abafadores de fogo, bombas costais de água, Equipamentos de Proteção Individual (EPIs) adequados para combate a incêndio de mata, e suprimentos de primeiros socorros veterinários para resgate de animais silvestres feridos nas queimadas no Pantanal.',
    organizerName: 'Rede Resgate Animal & Brigadas Pantanal',
    organizerId: 'usr-2',
    isVerified: true,
    targetAmount: 85000,
    collectedAmount: 43200,
    donorsCount: 395,
    imageUrl: 'https://images.unsplash.com/photo-1602164940765-a430db88583e?auto=format&fit=crop&q=80&w=1200',
    mural: [
      {
        id: 'update-3-1',
        date: '2026-06-26T08:00:00',
        title: 'EPIs e Equipamentos táticos entregues à Brigada',
        content: 'Nossas equipes receberam 15 conjuntos novos de botas de couro com solado reforçado, perneiras de proteção e óculos contra fumaça. Esse material protege vidas na linha de frente!',
        type: 'delivery',
        mediaUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=800'
      }
    ],
    prestacaoContas: [
      {
        id: 'rec-3-1',
        description: '15 Pares de Botas de Segurança Motosserrista/Fogo',
        amount: 5400.00,
        date: '2026-06-24',
        supplier: 'Equipamentos e Epis MS Ltda',
        cnpj: '44.887.123/0001-44',
        status: 'Verificado',
        fileUrl: '#nota-fiscal-12002'
      }
    ],
    saques: [],
    status: 'Ativa'
  },
  {
    id: 'camp-4',
    title: 'Frio Extremo - Aquecedores e Cobertores Serra Catarinense',
    location: 'São Joaquim e Urupema - Santa Catarina',
    category: 'Frio Extremo',
    description: 'Com temperaturas batendo records históricos negativos de até -6°C na serra catarinense, as famílias vulneráveis que moram em habitações de madeira sofrem graves riscos de hipotermia. Esta campanha compra e distribui imediatamente cobertores de lã, fogões a lenha de ferro e mantimentos calóricos.',
    organizerName: 'Projeto Social Aquecer Serra',
    organizerId: 'usr-5',
    isVerified: false,
    targetAmount: 45000,
    collectedAmount: 12500,
    donorsCount: 110,
    imageUrl: 'https://images.unsplash.com/photo-1542044896530-05d85be9b11a?auto=format&fit=crop&q=80&w=1200',
    mural: [],
    prestacaoContas: [],
    saques: [],
    status: 'Pendente' // Apenas admin pode aprovar
  }
];

export const mockDonations: Donation[] = [
  {
    id: 'don-1',
    campaignId: 'camp-1',
    campaignTitle: 'Reconstrução Vale do Taquari - RS',
    donorName: 'Thiago Silva',
    donorEmail: 'doador@reconstroi.com',
    amount: 250.00,
    paymentMethod: 'PIX',
    date: '2026-06-28T16:45:00',
    status: 'Confirmada'
  },
  {
    id: 'don-2',
    campaignId: 'camp-1',
    campaignTitle: 'Reconstrução Vale do Taquari - RS',
    donorName: 'Aline de Souza Mendes',
    donorEmail: 'aline@mendes.com.br',
    amount: 1500.00,
    paymentMethod: 'Cartão de Crédito',
    date: '2026-06-27T10:12:00',
    status: 'Confirmada'
  },
  {
    id: 'don-3',
    campaignId: 'camp-2',
    campaignTitle: 'Deslizamentos Petrópolis - Apoio Habitacional',
    donorName: 'Thiago Silva',
    donorEmail: 'doador@reconstroi.com',
    amount: 120.00,
    paymentMethod: 'PIX',
    date: '2026-06-26T22:30:00',
    status: 'Confirmada'
  },
  {
    id: 'don-4',
    campaignId: 'camp-2',
    campaignTitle: 'Deslizamentos Petrópolis - Apoio Habitacional',
    donorName: 'Carlos Eduardo Ramos',
    donorEmail: 'cadu.ramos@gmail.com',
    amount: 50.00,
    paymentMethod: 'Boleto',
    date: '2026-06-25T14:15:00',
    status: 'Confirmada'
  },
  {
    id: 'don-5',
    campaignId: 'camp-3',
    campaignTitle: 'Brigada Voluntária e Defesa Animal - Pantanal',
    donorName: 'Renato Nogueira',
    donorEmail: 'renato@nogueira.adv.br',
    amount: 500.00,
    paymentMethod: 'Cartão de Crédito',
    date: '2026-06-28T18:00:00',
    status: 'Confirmada'
  }
];

export const mockTickets: SupportTicket[] = [
  {
    id: 'tkt-1',
    donorEmail: 'doador@reconstroi.com',
    donorName: 'Thiago Silva',
    subject: 'Como verificar se minha NF-e foi homologada?',
    message: 'Olá, fiz uma doação de R$ 250 para a campanha do Vale do Taquari. Gostaria de saber onde vejo o comprovante da compra da telha que foi vinculada à minha contribuição. Excelente a ideia de auditar tudo.',
    campaignTitle: 'Reconstrução Vale do Taquari - RS',
    status: 'Aberto',
    date: '2026-06-28'
  },
  {
    id: 'tkt-2',
    donorEmail: 'julia.moraes@uol.com.br',
    donorName: 'Júlia Moraes',
    subject: 'Dúvida de Saque no Petrópolis',
    message: 'Percebi que houve um saque de R$ 35.000,00 na campanha de Petrópolis. Vocês poderiam confirmar os documentos de locação social de forma pública? Gostaria de entender se o aluguel foi quitado diretamente aos proprietários.',
    campaignTitle: 'Deslizamentos Petrópolis - Apoio Habitacional',
    status: 'Em andamento',
    date: '2026-06-26'
  },
  {
    id: 'tkt-3',
    donorEmail: 'fernando.silveira@outlook.com',
    donorName: 'Fernando Silveira',
    subject: 'Erro na emissão do Boleto Bancário',
    message: 'Tentei emitir o boleto de doação de R$ 100,00 e o código de barras veio em branco. Já resolvi pagando via PIX, mas achei bom avisar para corrigirem.',
    status: 'Resolvido',
    date: '2026-06-24'
  }
];

export const mockPlatformConfig: PlatformConfig = {
  gatewayFeePercent: 1.2,
  platformFeePercent: 2.5,
  totalDonatedGlobal: 336250,
  totalPeopleHelped: 1420
};
