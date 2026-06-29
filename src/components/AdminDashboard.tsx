import React, { useState } from 'react';
import { Campaign, Donation, PlatformConfig, User } from '../types';
import { ShieldCheck, BarChart3, Settings, ShieldAlert, Users, Send, CheckCircle, AlertTriangle, Sparkles, Download, Ban, RotateCcw, Landmark, Percent } from 'lucide-react';

interface AdminDashboardProps {
  campaigns: Campaign[];
  donations: Donation[];
  config: PlatformConfig;
  users: User[];
  onUpdateCampaigns: (updatedCampaigns: Campaign[]) => void;
  onUpdateDonations: (updatedDonations: (Donation[]) | ((prev: Donation[]) => Donation[])) => void;
  onUpdateConfig: (updatedConfig: PlatformConfig) => void;
  onUpdateUsers: (updatedUsers: User[]) => void;
}

export default function AdminDashboard({
  campaigns,
  donations,
  config,
  users,
  onUpdateCampaigns,
  onUpdateDonations,
  onUpdateConfig,
  onUpdateUsers
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'stats' | 'approval' | 'fees' | 'users' | 'broadcast'>('stats');

  // Input states
  const [gatewayFee, setGatewayFee] = useState(config.gatewayFeePercent);
  const [platformFee, setPlatformFee] = useState(config.platformFeePercent);
  
  // Broadcast state
  const [broadcastTarget, setBroadcastTarget] = useState<'Todos' | 'Doadores' | 'Organizadores'>('Todos');
  const [broadcastSubject, setBroadcastSubject] = useState('');
  const [broadcastBody, setBroadcastBody] = useState('');

  // Local notifications feedback
  const [feedback, setFeedback] = useState('');

  // Filter campaigns pending approval (status === 'Pendente')
  const pendingCampaigns = campaigns.filter(c => c.status === 'Pendente');

  const handleApproveCampaign = (campaignId: string, approve: boolean) => {
    const updated = campaigns.map(c => {
      if (c.id === campaignId) {
        return { ...c, status: approve ? 'Ativa' as const : 'Suspensa' as const };
      }
      return c;
    });
    onUpdateCampaigns(updated);
    showFeedback(`Campanha ${approve ? 'APROVADA e publicada publicamente' : 'REJEITADA'} com sucesso.`);
  };

  const handleSaveFees = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateConfig({
      ...config,
      gatewayFeePercent: gatewayFee,
      platformFeePercent: platformFee
    });
    showFeedback('Taxas operacionais da plataforma atualizadas!');
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastSubject || !broadcastBody) {
      alert('Preencha o assunto e conteúdo do comunicado.');
      return;
    }
    showFeedback(`Comunicado de massa enviado com sucesso para: ${broadcastTarget}!`);
    setBroadcastSubject('');
    setBroadcastBody('');
  };

  const handleUserAction = (userId: string, action: 'ban' | 'block-withdrawal') => {
    const actionLabel = action === 'ban' ? 'banir' : 'bloquear saques de';
    const conf = window.confirm(`Deseja realmente ${actionLabel} este usuário?`);
    if (!conf) return;

    if (action === 'ban') {
      const updated = users.filter(u => u.id !== userId);
      onUpdateUsers(updated);
      showFeedback('Usuário banido do ecossistema Reconstrói.');
    } else {
      showFeedback('Saques bloqueados preventivamente para investigação.');
    }
  };

  const handleReverseDonation = (donationId: string) => {
    const conf = window.confirm('Deseja realmente ESTORNAR este repasse financeiro? O valor retornará ao doador.');
    if (!conf) return;

    // We can update the status of the donation to 'Estornada'
    onUpdateDonations(prev => prev.map(d => {
      if (d.id === donationId) {
        return { ...d, status: 'Estornada' };
      }
      return d;
    }));

    showFeedback('Doação estornada com sucesso. Comprovante de estorno enviado ao banco.');
  };

  const showFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(''), 4000);
  };

  // Generate mock chart coordinates for Transaction Volume Relatório
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
  const dataPoints = [35000, 58000, 92000, 145000, 210000, config.totalDonatedGlobal];

  return (
    <div className="space-y-8">
      
      {/* Welcome header */}
      <div className="glass-panel border-b border-slate-200/50 p-6 sm:p-8 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-orange-500">
            <ShieldCheck size={18} className="fill-orange-500 text-white animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider">Painel Administrativo Geral (Root)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Console de Comando Geral
          </h1>
          <p className="text-sm text-slate-600">
            Acesso irrestrito ao banco de dados, aprovação de campanhas e inteligência financeira.
          </p>
        </div>
      </div>

      {feedback && (
        <div className="p-4 rounded-xl bg-slate-900 text-slate-100 border border-slate-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle size={16} className="text-emerald-400" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap border-b border-slate-200 gap-1">
        <button
          onClick={() => setActiveTab('stats')}
          className={`py-3 px-5 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'stats' ? 'border-orange-500 text-orange-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Relatório Financeiro
        </button>
        <button
          onClick={() => setActiveTab('approval')}
          className={`py-3 px-5 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'approval' ? 'border-orange-500 text-orange-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Aprovar Campanhas ({pendingCampaigns.length})
        </button>
        <button
          onClick={() => setActiveTab('fees')}
          className={`py-3 px-5 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'fees' ? 'border-orange-500 text-orange-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Gestão de Taxas
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`py-3 px-5 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'users' ? 'border-orange-500 text-orange-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Gestão de Usuários / Fraude
        </button>
        <button
          onClick={() => setActiveTab('broadcast')}
          className={`py-3 px-5 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'broadcast' ? 'border-orange-500 text-orange-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Comunicados em Massa
        </button>
      </div>

      {/* TAB CONTENT: STATS & CHARTS */}
      {activeTab === 'stats' && (
        <div className="space-y-6">
          
          {/* Big metrics bento row */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Volume Transacionado</span>
              <span className="text-2xl font-black text-slate-900 font-mono">
                R$ {config.totalDonatedGlobal.toLocaleString('pt-BR')}
              </span>
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Doações Confirmadas</span>
              <span className="text-2xl font-black text-slate-900 font-mono">
                {donations.filter(d => d.status === 'Confirmada').length} Transações
              </span>
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Campanhas Ativas</span>
              <span className="text-2xl font-black text-slate-900 font-mono">
                {campaigns.filter(c => c.status === 'Ativa').length} Projetos
              </span>
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Usuários Cadastrados</span>
              <span className="text-2xl font-black text-slate-900 font-mono">
                {users.length} Contas
              </span>
            </div>
          </div>

          {/* Transaction Volume Relatório (White / Gray Visual Chart) */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 text-base">Evolução do Volume Transacional Acumulado</h3>
                <p className="text-xs text-slate-500">Dados consolidados do semestre fiscal em moeda corrente (R$)</p>
              </div>

              <button
                onClick={() => alert('Relatório fiscal exportado em formato CSV/Excel fictício para download.')}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
              >
                <Download size={14} />
                <span>Exportar Relatório</span>
              </button>
            </div>

            {/* SVG Visual Bar Chart */}
            <div className="space-y-4">
              <div className="h-64 w-full bg-slate-50 rounded-2xl p-6 border border-slate-100 flex items-end justify-between gap-4">
                {dataPoints.map((val, idx) => {
                  const maxVal = Math.max(...dataPoints);
                  const pctHeight = (val / maxVal) * 80 + 10; // min 10% max 90%
                  return (
                    <div key={months[idx]} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                      
                      {/* Tooltip value */}
                      <span className="text-[10px] font-mono font-bold text-slate-800">
                        R$ {Math.round(val / 1000)}k
                      </span>

                      {/* Bar */}
                      <div 
                        className="w-full sm:w-16 rounded-t-lg bg-orange-500/90 hover:bg-orange-600 transition-all cursor-pointer relative group"
                        style={{ height: `${pctHeight}%` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-orange-600/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-t-lg" />
                      </div>

                      {/* Month label */}
                      <span className="text-xs font-bold text-slate-500">
                        {months[idx]}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="bg-slate-50/50 p-4 rounded-xl text-xs text-slate-500 flex items-center gap-2 border border-slate-100">
                <Sparkles size={16} className="text-orange-500" />
                <span>A taxa média de conversão da plataforma é de <strong>94.6%</strong> de cliques em botões de doação para conclusão financeira.</span>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TAB CONTENT: CAMPAIGN APPROVALS */}
      {activeTab === 'approval' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">Fila de Novas Campanhas Registradas</h3>
            
            {pendingCampaigns.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                Nenhuma nova campanha aguardando publicação inicial.
              </div>
            ) : (
              <div className="space-y-4">
                {pendingCampaigns.map((camp) => (
                  <div key={camp.id} className="p-5 rounded-xl border border-slate-100 bg-slate-50 flex flex-col md:flex-row gap-6">
                    <img 
                      src={camp.imageUrl} 
                      alt={camp.title} 
                      className="w-full md:w-48 h-32 object-cover rounded-lg bg-slate-200"
                    />

                    <div className="flex-1 space-y-2 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-orange-100 text-orange-800 text-[10px] font-bold rounded">
                          {camp.category}
                        </span>
                        <span className="text-slate-400 font-mono">Meta: R$ {camp.targetAmount.toLocaleString('pt-BR')}</span>
                      </div>

                      <h4 className="font-bold text-slate-900 text-sm">{camp.title}</h4>
                      <p className="text-slate-500 line-clamp-2">{camp.description}</p>
                      
                      <div className="text-[11px] text-slate-400 flex items-center gap-3">
                        <span>Local: <strong>{camp.location}</strong></span>
                        <span>Organizador: <strong>{camp.organizerName}</strong></span>
                      </div>
                    </div>

                    <div className="flex md:flex-col justify-center gap-2 min-w-[150px]">
                      <button
                        onClick={() => handleApproveCampaign(camp.id, true)}
                        className="py-2.5 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer transition-colors"
                      >
                        Aprovar Publicação
                      </button>
                      <button
                        onClick={() => handleApproveCampaign(camp.id, false)}
                        className="py-2.5 px-3 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold text-xs cursor-pointer transition-colors"
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

      {/* TAB CONTENT: FEES CONFIG */}
      {activeTab === 'fees' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs max-w-lg space-y-6">
            <h3 className="font-bold text-slate-900 text-sm">Configuração de Taxas Operacionais</h3>
            
            <form onSubmit={handleSaveFees} className="space-y-4 text-xs">
              <div className="space-y-2">
                <div className="flex justify-between font-bold text-slate-700">
                  <span>Taxa Operacional do Gateway (%)</span>
                  <span className="font-mono text-orange-600">{gatewayFee}%</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="5"
                  step="0.1"
                  value={gatewayFee}
                  onChange={(e) => setGatewayFee(parseFloat(e.target.value))}
                  className="w-full accent-orange-500"
                />
                <span className="text-[10px] text-slate-400 block leading-tight">
                  Custo cobrado pela processadora de cartão de crédito e PIX do consórcio bancário nacional.
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between font-bold text-slate-700">
                  <span>Taxa Administrativa da Plataforma (%)</span>
                  <span className="font-mono text-orange-600">{platformFee}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.5"
                  value={platformFee}
                  onChange={(e) => setPlatformFee(parseFloat(e.target.value))}
                  className="w-full accent-orange-500"
                />
                <span className="text-[10px] text-slate-400 block leading-tight">
                  Taxa retida para cobrir servidores Cloud Run e banco de dados. Atualmente zerada como compromisso social.
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold cursor-pointer transition-all"
              >
                Salvar Configurações
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB CONTENT: USERS MANAGEMENT & FRAUD CONTROLS */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          
          {/* User actions logs */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">Painel de Segurança e Rastreamento</h3>
            
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 font-bold border-b border-slate-100">
                    <th className="p-3">Usuário</th>
                    <th className="p-3">E-mail</th>
                    <th className="p-3">Função / Papel</th>
                    <th className="p-3">Status Segurança</th>
                    <th className="p-3 text-right">Ação Preventiva</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  {users.map((usr) => (
                    <tr key={usr.id} className="hover:bg-slate-50/50">
                      <td className="p-3 font-semibold text-slate-800">{usr.name}</td>
                      <td className="p-3 font-mono">{usr.email}</td>
                      <td className="p-3 font-bold text-slate-600">{usr.role}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold text-[10px]">
                          Ativo & Seguro
                        </span>
                      </td>
                      <td className="p-3 text-right space-x-1">
                        <button
                          onClick={() => handleUserAction(usr.id, 'block-withdrawal')}
                          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded text-[10px] transition-colors"
                          title="Bloquear saques temporariamente"
                        >
                          Bloquear Saque
                        </button>
                        <button
                          onClick={() => handleUserAction(usr.id, 'ban')}
                          className="px-2 py-1 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded text-[10px] transition-colors"
                        >
                          Banir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ESTORNO DE DOAÇÕES (Reversals list) */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">Fila de Transações Ativas para Estorno Preventivo</h3>
            
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 font-bold border-b border-slate-100">
                    <th className="p-3">ID Transação</th>
                    <th className="p-3">Doador</th>
                    <th className="p-3">Campanha</th>
                    <th className="p-3">Valor</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Controle</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  {donations.map((d) => (
                    <tr key={d.id} className="hover:bg-slate-50/50">
                      <td className="p-3 font-mono text-slate-400">{d.id}</td>
                      <td className="p-3">
                        <span className="font-semibold text-slate-800 block">{d.donorName}</span>
                        <span className="text-[10px] text-slate-400 block font-mono">{d.donorEmail}</span>
                      </td>
                      <td className="p-3 truncate max-w-[200px]">{d.campaignTitle}</td>
                      <td className="p-3 font-mono font-bold text-slate-950">R$ {d.amount.toFixed(2)}</td>
                      <td className="p-3">
                        {d.status === 'Confirmada' ? (
                          <span className="text-emerald-600 font-bold">Liquidada</span>
                        ) : (
                          <span className="text-slate-400 font-medium">{d.status}</span>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        {d.status === 'Confirmada' && (
                          <button
                            onClick={() => handleReverseDonation(d.id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-orange-50 hover:bg-orange-100 text-orange-600 font-bold text-[10px]"
                          >
                            <RotateCcw size={11} />
                            <span>Estornar</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB CONTENT: BROADCAST PUBLIC COMMUNICADOS */}
      {activeTab === 'broadcast' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs max-w-lg space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">Disparar Informativo Geral em Massa</h3>
            
            <form onSubmit={handleSendBroadcast} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 block">Público de Destino</label>
                <select
                  value={broadcastTarget}
                  onChange={(e: any) => setBroadcastTarget(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-white"
                >
                  <option value="Todos">Todos os Usuários Cadastrados</option>
                  <option value="Doadores">Apenas Doadores de Campanhas</option>
                  <option value="Organizadores">Apenas Organizadores locais / ONGs</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 block">Assunto do E-mail / Notificação</label>
                <input
                  type="text"
                  placeholder="Ex: Atualização obrigatória sobre Prestação de Contas no Inverno"
                  value={broadcastSubject}
                  onChange={(e) => setBroadcastSubject(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 font-semibold"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 block">Corpo da Mensagem</label>
                <textarea
                  rows={5}
                  placeholder="Digite aqui o texto oficial..."
                  value={broadcastBody}
                  onChange={(e) => setBroadcastBody(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 leading-relaxed"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
              >
                <Send size={14} />
                <span>Enviar Comunicado</span>
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
