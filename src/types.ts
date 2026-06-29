export type UserRole = 'Doador' | 'Organizador' | 'Suporte' | 'Administrador';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  verified: boolean;
  bankAccount?: {
    bank: string;
    agency: string;
    account: string;
    pixKey: string;
  };
}

export interface MuralUpdate {
  id: string;
  date: string;
  title: string;
  content: string;
  type: 'info' | 'financial' | 'delivery'; // Informação, Compra/Financeiro, Entrega de mantimentos
  mediaUrl?: string;
}

export interface ReceiptDoc {
  id: string;
  description: string;
  amount: number;
  date: string;
  supplier: string;
  cnpj: string;
  status: 'Pendente' | 'Verificado' | 'CorrecaoSolicitada';
  fileUrl: string;
  auditNotes?: string;
}

export interface SaqueRequest {
  id: string;
  amount: number;
  date: string;
  status: 'Pendente' | 'Aprovado' | 'Rejeitado';
  bankAccount: string;
}

export interface Campaign {
  id: string;
  title: string;
  location: string;
  category: 'Enchentes' | 'Deslizamentos' | 'Incêndios' | 'Frio Extremo' | 'Outros';
  description: string;
  organizerName: string;
  organizerId: string;
  isVerified: boolean;
  targetAmount: number;
  collectedAmount: number;
  donorsCount: number;
  imageUrl: string;
  mural: MuralUpdate[];
  prestacaoContas: ReceiptDoc[];
  saques: SaqueRequest[];
  status: 'Pendente' | 'Ativa' | 'Suspensa' | 'Concluida';
}

export interface Donation {
  id: string;
  campaignId: string;
  campaignTitle: string;
  donorName: string;
  donorEmail: string;
  amount: number;
  paymentMethod: 'PIX' | 'Cartão de Crédito' | 'Boleto';
  date: string;
  status: 'Confirmada' | 'Pendente' | 'Estornada';
}

export interface SupportTicket {
  id: string;
  donorEmail: string;
  donorName: string;
  subject: string;
  message: string;
  campaignTitle?: string;
  status: 'Aberto' | 'Em andamento' | 'Resolvido';
  date: string;
}

export interface PlatformConfig {
  gatewayFeePercent: number;
  platformFeePercent: number;
  totalDonatedGlobal: number;
  totalPeopleHelped: number;
}
