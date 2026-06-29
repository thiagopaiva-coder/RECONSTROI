import React, { useState } from 'react';
import { Campaign, SupportTicket, ReceiptDoc } from '../types';
import { ShieldCheck, Ticket, Users, AlertTriangle, CheckCircle, FileText, XCircle, Search, Mail, ArrowRight, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface AuditorDashboardProps {
  campaigns: Campaign[];
  tickets: SupportTicket[];
  onUpdateCampaigns: (updatedCampaigns: Campaign[]) => void;
  onUpdateTickets: (updatedTickets: SupportTicket[]) => void;
}

interface MockRegistration {
  id: string;
  name: string;
  email: string;
  entityName: string;
  cnpj: string;
  documentType: 'CNPJ' | 'Estatuto Social' | 'Ata de Posse';
  status: 'Pendente' | 'Aprovado' | 'Rejeitado';
}

export default function AuditorDashboard({ campaigns, tickets, onUpdateCampaigns, onUpdateTickets }: AuditorDashboardProps) {
  const [activeTab, setActiveTab] = useState<'notas' | 'tickets' | 'cadastros'>('notas');
  
  // Local state for registrations to simulate approval flow
  const [registrations, setRegistrations] = useState<MockRegistration[]>([
    {
      id: 'reg-1',
      name: 'João Pedro da Silva',
      email: 'joao@abrigoamigo.org',
      entityName: 'Associação Abrigo Amigo',
      cnpj: '23.456.789/0001-11',
      documentType: 'CNPJ',
      status: 'Pendente'
    },
    {
      id: 'reg-2',
      name: 'Maria Helena Ramos',
      email: 'maria@sosenchentes.org.br',
      entityName: 'Movimento SOS Enchentes RS',
      cnpj: '87.654.321/0001-22',
      documentType: 'Estatuto Social',
      status: 'Pendente'
    }
  ]);

  const [ticketReply, setTicketReply] = useState<string>('');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string>('');

  // Collect all invoices across all campaigns
  const allInvoices: { campaignId: string; campaignTitle: string; invoice: ReceiptDoc }[] = [];
  campaigns.forEach(c => {
    c.prestacaoContas.forEach(rec => {
      allInvoices.push({
        campaignId: c.id,
        campaignTitle: c.title,
        invoice: rec
      });
    });
  });

  const pendingInvoices = allInvoices.filter(item => item.invoice.status === 'Pendente');

  const handleVerifyInvoice = (campaignId: string, invoiceId: string, isApproved: boolean) => {
    const updated = campaigns.map(c => {
      if (c.id === campaignId) {
        return {
          ...c,
          prestacaoContas: c.prestacaoContas.map(rec => {
            if (rec.id === invoiceId) {
              return {
                ...rec,
                status: isApproved ? 'Verificado' as const : 'CorrecaoSolicitada' as const,
                auditNotes: isApproved 
                  ? 'Auditado e homologado pelo agente de suporte e auditoria conforme extrato e portal SEFAZ.' 
                  : 'Divergência de valores ou CNPJ incorreto. Solicita-se upload de nova NF-e correta.'
              };
            }
            return rec;
          })
        };
      }
      return c;
    });

    onUpdateCampaigns(updated);
    showFeedback(`Nota fiscal ${isApproved ? 'aprovada e marcada como Verificada' : 'rejeitada e marcada para Correção'}!`);
  };

  const handleSuspendCampaign = (campaignId: string) => {
    const conf = window.confirm('Deseja realmente SINALIZAR ESTA CAMPANHA COMO SUSPEITA? Isso suspenderá a arrecadação imediatamente.');
    if (!conf) return;

    const updated = campaigns.map(c => {
      if (c.id === campaignId) {
        return { ...c, status: 'Suspensa' as const };
      }
      return c;
    });

    onUpdateCampaigns(updated);
    showFeedback('Campanha SUSPENSA para averiguação de fraude contábil.');
  };

  const handleTicketStatusChange = (ticketId: string, newStatus: 'Aberto' | 'Em andamento' | 'Resolvido') => {
    const updated = tickets.map(t => {
      if (t.id === ticketId) {
        return { ...t, status: newStatus };
      }
      return t;
    });

    onUpdateTickets(updated);
    setTicketReply('');
    setSelectedTicketId(null);
    showFeedback(`Ticket de suporte atualizado para o status: ${newStatus}`);
  };

  const handleRegisterApproval = (regId: string, isApproved: boolean) => {
    setRegistrations(prev => prev.map(reg => {
      if (reg.id === regId) {
        return { ...reg, status: isApproved ? 'Aprovado' : 'Rejeitado' };
      }
      return reg;
    }));
    showFeedback(`Cadastro de organizador ${isApproved ? 'APROVADO e selo de Verificação gerado' : 'REJEITADO'}.`);
  };

  const showFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(''), 4000);
  };

  return (
    <div className="space-y-8">
      
      {/* Banner */}
      <div className="glass-panel border-b border-slate-200/50 p-6 sm:p-8 rounded-3xl space-y-2">
        <div className="flex items-center gap-2 text-orange-500">
          <ShieldCheck size={18} className="fill-orange-500 text-white" />
          <span className="text-xs font-bold uppercase tracking-wider">Painel de Auditoria & Suporte</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Portal do Agente & Auditor
        </h1>
        <p className="text-sm text-slate-600 max-w-3xl">
          Sua responsabilidade principal é assegurar que 100% das notas fiscais enviadas batam com as saídas financeiras, além de auxiliar doadores com dúvidas e certificar ONGs idôneas.
        </p>
      </div>

      {feedback && (
        <div className="p-4 rounded-xl bg-slate-900 text-slate-100 border border-slate-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-100 rounded-2xl p-6 flex items-center gap-4 shadow-xs">
          <div className="w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
            <FileText size={20} />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block leading-none">NF-es em Análise</span>
            <span className="text-xl font-bold text-slate-950 font-mono">{pendingInvoices.length} Notas</span>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-6 flex items-center gap-4 shadow-xs">
          <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
            <Ticket size={20} />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block leading-none">Dúvidas de Doadores</span>
            <span className="text-xl font-bold text-slate-950 font-mono">
              {tickets.filter(t => t.status !== 'Resolvido').length} Abertos
            </span>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-6 flex items-center gap-4 shadow-xs">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <Users size={20} />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block leading-none">Cadastros Pendentes</span>
            <span className="text-xl font-bold text-slate-950 font-mono">
              {registrations.filter(r => r.status === 'Pendente').length} ONGs
            </span>
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('notas')}
          className={`py-3 px-6 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'notas'
              ? 'border-orange-500 text-orange-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Auditoria de Notas Fiscais ({pendingInvoices.length})
        </button>
        <button
          onClick={() => setActiveTab('tickets')}
          className={`py-3 px-6 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'tickets'
              ? 'border-orange-500 text-orange-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Tickets de Suporte ({tickets.filter(t => t.status !== 'Resolvido').length})
        </button>
        <button
          onClick={() => setActiveTab('cadastros')}
          className={`py-3 px-6 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'cadastros'
              ? 'border-orange-500 text-orange-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Validação de Cadastros ({registrations.filter(r => r.status === 'Pendente').length})
        </button>
      </div>

      {/* TAB CONTENT: NOTAS FISCAIS AUDIT */}
      {activeTab === 'notas' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">Fila de Notas Fiscais Aguardando Homologação</h3>
            
            {pendingInvoices.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-xs">
                Nenhuma nota fiscal pendente de auditoria contábil. Bom trabalho!
              </div>
            ) : (
              <div className="space-y-4">
                {pendingInvoices.map((item) => (
                  <div 
                    key={item.invoice.id} 
                    className="p-5 rounded-xl border border-slate-100 bg-slate-50 flex flex-col md:flex-row justify-between gap-4 text-xs"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-orange-100 text-orange-800 text-[9px] font-bold font-mono">
                          CAMPANHA: {item.campaignTitle}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">ID Nota: {item.invoice.id}</span>
                      </div>
                      
                      <h4 className="font-bold text-slate-900 text-sm">{item.invoice.description}</h4>
                      
                      <div className="grid grid-cols-2 gap-4 text-[11px] text-slate-500">
                        <span>Fornecedor: <strong>{item.invoice.supplier}</strong></span>
                        <span>CNPJ: <strong>{item.invoice.cnpj}</strong></span>
                        <span>Data upload: <strong>{item.invoice.date}</strong></span>
                        <span>Valor: <strong className="text-orange-600 text-xs">R$ {item.invoice.amount.toLocaleString('pt-BR')}</strong></span>
                      </div>
                    </div>

                    <div className="flex md:flex-col items-stretch justify-center gap-2 min-w-[200px]">
                      <button
                        onClick={() => handleVerifyInvoice(item.campaignId, item.invoice.id, true)}
                        className="py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-center cursor-pointer transition-colors"
                      >
                        Marcar como Verificada
                      </button>
                      <button
                        onClick={() => handleVerifyInvoice(item.campaignId, item.invoice.id, false)}
                        className="py-2 px-3 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold text-center cursor-pointer transition-colors"
                      >
                        Solicitar Correção
                      </button>
                      <button
                        onClick={() => handleSuspendCampaign(item.campaignId)}
                        className="py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-center cursor-pointer transition-colors flex items-center justify-center gap-1.5"
                      >
                        <ShieldAlert size={14} className="text-orange-500 animate-pulse" />
                        <span>Sinalizar Campanha</span>
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT: TICKETS SUPPORT */}
      {activeTab === 'tickets' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* List left (5 cols) */}
            <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-900 text-sm">Mensagens Recebidas</h3>
              
              <div className="space-y-2">
                {tickets.map((t) => (
                  <div 
                    key={t.id}
                    onClick={() => setSelectedTicketId(t.id)}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition-all text-left ${
                      selectedTicketId === t.id 
                        ? 'border-orange-500 bg-orange-50/50' 
                        : 'border-slate-100 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono mb-1">
                      <span>ID: {t.id}</span>
                      <span>{t.date}</span>
                    </div>

                    <h4 className="font-bold text-slate-800 line-clamp-1">{t.subject}</h4>
                    <p className="text-[11px] text-slate-500 line-clamp-2">{t.message}</p>
                    
                    <div className="flex justify-between items-center pt-2 mt-1 border-t border-slate-100/40 text-[10px]">
                      <span className="text-slate-400 truncate max-w-[120px]">{t.donorName}</span>
                      <span className={`px-2 py-0.5 rounded font-bold ${
                        t.status === 'Aberto' ? 'bg-red-100 text-red-800' :
                        t.status === 'Em andamento' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {t.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Response Area right (7 cols) */}
            <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
              {selectedTicketId ? (
                (() => {
                  const t = tickets.find(ticket => ticket.id === selectedTicketId)!;
                  return (
                    <div className="space-y-6 text-xs">
                      <div className="border-b border-slate-100 pb-3 space-y-1">
                        <span className="text-[10px] text-slate-400 block font-mono">DÚVIDA DE TRANSPARÊNCIA</span>
                        <h3 className="font-bold text-slate-900 text-base leading-tight">{t.subject}</h3>
                        <p className="text-slate-500">De: <strong>{t.donorName}</strong> ({t.donorEmail})</p>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5 leading-relaxed text-slate-700">
                        <span className="font-bold text-slate-400 text-[10px] block uppercase font-mono">Mensagem do Doador:</span>
                        <p className="italic">"{t.message}"</p>
                      </div>

                      <div className="space-y-3 pt-2">
                        <label className="font-semibold text-slate-700 block">Escrever Resposta Oficial (Auditoria)</label>
                        <textarea
                          rows={4}
                          placeholder="Digite aqui os esclarecimentos técnicos, dados da NF-e ou faturamento..."
                          value={ticketReply}
                          onChange={(e) => setTicketReply(e.target.value)}
                          className="w-full p-2.5 rounded-lg border border-slate-300"
                        />

                        <div className="flex justify-end gap-2 pt-2">
                          <button
                            onClick={() => handleTicketStatusChange(t.id, 'Em andamento')}
                            className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-bold cursor-pointer"
                          >
                            Marcar: Em Andamento
                          </button>
                          <button
                            onClick={() => handleTicketStatusChange(t.id, 'Resolvido')}
                            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold flex items-center gap-1.5 cursor-pointer"
                          >
                            <CheckCircle size={14} className="text-emerald-400" />
                            <span>Responder & Resolver Ticket</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })()
              ) : (
                <div className="h-full flex flex-col items-center justify-center py-20 text-center text-slate-400 space-y-2">
                  <Mail size={36} className="text-slate-300" />
                  <p>Selecione um ticket de dúvida na lista para interagir e responder.</p>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* TAB CONTENT: VALIDAÇÃO DE CADASTROS */}
      {activeTab === 'cadastros' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">Fila de Aprovação de Novas Lideranças & ONGs</h3>
            
            {registrations.filter(r => r.status === 'Pendente').length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-10">
                Nenhum cadastro pendente de verificação de CNPJ/identidade.
              </p>
            ) : (
              <div className="space-y-4 text-xs">
                {registrations.filter(r => r.status === 'Pendente').map((reg) => (
                  <div key={reg.id} className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row justify-between gap-4">
                    <div className="space-y-1.5">
                      <h4 className="font-bold text-slate-900 text-sm">{reg.entityName}</h4>
                      <div className="grid grid-cols-2 gap-4 text-[11px] text-slate-500">
                        <span>Representante: <strong>{reg.name}</strong></span>
                        <span>E-mail: <strong>{reg.email}</strong></span>
                        <span>CNPJ/CPF: <strong className="font-mono text-slate-800">{reg.cnpj}</strong></span>
                        <span>Documento fornecido: <strong className="text-orange-600">{reg.documentType}</strong></span>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-stretch justify-center gap-2 min-w-[150px]">
                      <button
                        onClick={() => handleRegisterApproval(reg.id, true)}
                        className="py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-center cursor-pointer"
                      >
                        Aprovar Cadastro
                      </button>
                      <button
                        onClick={() => handleRegisterApproval(reg.id, false)}
                        className="py-2 px-3 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold text-center cursor-pointer"
                      >
                        Rejeitar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
