import React, { useState } from 'react';
import { Campaign, MuralUpdate, ReceiptDoc, SaqueRequest } from '../types';
import { Plus, Send, FileText, Upload, Landmark, BadgeCheck, AlertTriangle, HelpCircle, CheckCircle2, ChevronRight, BarChart3, Image as ImageIcon } from 'lucide-react';

interface OrganizerDashboardProps {
  campaigns: Campaign[];
  organizerName: string;
  organizerId: string;
  onUpdateCampaigns: (updatedCampaigns: Campaign[]) => void;
}

export default function OrganizerDashboard({ campaigns, organizerName, organizerId, onUpdateCampaigns }: OrganizerDashboardProps) {
  // Filter campaigns owned by this organizer
  const myCampaigns = campaigns.filter(c => c.organizerId === organizerId || c.organizerName.includes('Defesa Civil') || c.organizerName.includes('Liderança Comunitária') || c.id === 'camp-1');
  
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>(myCampaigns[0]?.id || 'camp-1');
  const activeCampaign = myCampaigns.find(c => c.id === selectedCampaignId) || myCampaigns[0];

  // Forms state
  // 1. Create/Edit campaign
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCampTitle, setNewCampTitle] = useState('');
  const [newCampLocation, setNewCampLocation] = useState('');
  const [newCampCategory, setNewCampCategory] = useState<'Enchentes' | 'Deslizamentos' | 'Incêndios' | 'Frio Extremo' | 'Outros'>('Enchentes');
  const [newCampDescription, setNewCampDescription] = useState('');
  const [newCampTarget, setNewCampTarget] = useState('');
  const [newCampImage, setNewCampImage] = useState('https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&q=80&w=1200');

  // 2. Mural Update
  const [muralTitle, setMuralTitle] = useState('');
  const [muralType, setMuralType] = useState<'info' | 'financial' | 'delivery'>('info');
  const [muralContent, setMuralContent] = useState('');
  const [muralMedia, setMuralMedia] = useState('');

  // 3. Request Saque
  const [saqueAmount, setSaqueAmount] = useState('');
  const [bankName, setBankName] = useState('Banco do Brasil');
  const [bankAgency, setBankAgency] = useState('1234');
  const [bankAccount, setBankAccount] = useState('98765-4');
  const [bankPix, setBankPix] = useState('cnpj-vale@defesacivil.gov.br');

  // 4. Upload Receipt
  const [receiptDesc, setReceiptDesc] = useState('');
  const [receiptAmount, setReceiptAmount] = useState('');
  const [receiptSupplier, setReceiptSupplier] = useState('');
  const [receiptCnpj, setReceiptCnpj] = useState('');
  const [receiptFile, setReceiptFile] = useState('');

  // Notifications feedback
  const [feedback, setFeedback] = useState('');

  const handleCreateCampaignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampTitle || !newCampLocation || !newCampTarget || !newCampDescription) {
      alert('Por favor, preencha todos os campos obrigatórios da nova campanha.');
      return;
    }

    const newCamp: Campaign = {
      id: 'camp-' + (campaigns.length + 1),
      title: newCampTitle,
      location: newCampLocation,
      category: newCampCategory,
      description: newCampDescription,
      organizerName: organizerName,
      organizerId: organizerId,
      isVerified: false,
      targetAmount: parseFloat(newCampTarget) || 50000,
      collectedAmount: 0,
      donorsCount: 0,
      imageUrl: newCampImage || 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&q=80&w=1200',
      mural: [],
      prestacaoContas: [],
      saques: [],
      status: 'Pendente' // Needs Admin root to approve
    };

    onUpdateCampaigns([...campaigns, newCamp]);
    setNewCampTitle('');
    setNewCampLocation('');
    setNewCampDescription('');
    setNewCampTarget('');
    setShowCreateForm(false);
    showFeedback('Campanha criada com sucesso! Aguarde aprovação do Administrador Geral.');
  };

  const handleMuralSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!muralTitle || !muralContent) {
      alert('Por favor, forneça um título e descrição para a atualização.');
      return;
    }

    const newUpdate: MuralUpdate = {
      id: 'upd-' + Date.now(),
      date: new Date().toISOString(),
      title: muralTitle,
      content: muralContent,
      type: muralType,
      mediaUrl: muralMedia || undefined
    };

    const updated = campaigns.map(c => {
      if (c.id === activeCampaign.id) {
        return {
          ...c,
          mural: [newUpdate, ...c.mural]
        };
      }
      return c;
    });

    onUpdateCampaigns(updated);
    setMuralTitle('');
    setMuralContent('');
    setMuralMedia('');
    showFeedback('Mural atualizado com sucesso!');
  };

  const handleSaqueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountVal = parseFloat(saqueAmount);
    if (!amountVal || amountVal <= 0) {
      alert('Informe um valor de saque válido.');
      return;
    }

    // Balance validation (collected amount - approved saques)
    const approvedSaquesTotal = activeCampaign.saques
      .filter(s => s.status === 'Aprovado')
      .reduce((acc, curr) => acc + curr.amount, 0);
    const availableBalance = activeCampaign.collectedAmount - approvedSaquesTotal;

    if (amountVal > availableBalance) {
      alert(`Saldo indisponível. Saldo livre para saque: R$ ${availableBalance.toLocaleString('pt-BR')}`);
      return;
    }

    const newRequest: SaqueRequest = {
      id: 'saq-' + Date.now(),
      amount: amountVal,
      date: new Date().toLocaleDateString('pt-BR'),
      status: 'Pendente',
      bankAccount: `${bankName} - Ag: ${bankAgency} - CC: ${bankAccount}`
    };

    const updated = campaigns.map(c => {
      if (c.id === activeCampaign.id) {
        return {
          ...c,
          saques: [newRequest, ...c.saques]
        };
      }
      return c;
    });

    onUpdateCampaigns(updated);
    setSaqueAmount('');
    showFeedback('Solicitação de saque efetuada! Aguardando auditoria homologar.');
  };

  const handleReceiptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountVal = parseFloat(receiptAmount);
    if (!receiptDesc || !amountVal || !receiptSupplier || !receiptCnpj) {
      alert('Todos os campos fiscais são obrigatórios.');
      return;
    }

    const newReceipt: ReceiptDoc = {
      id: 'rec-nf-' + Math.floor(Math.random() * 90000 + 10000),
      description: receiptDesc,
      amount: amountVal,
      date: new Date().toLocaleDateString('pt-BR'),
      supplier: receiptSupplier,
      cnpj: receiptCnpj,
      status: 'Pendente',
      fileUrl: receiptFile || '#comprovante-ficticio'
    };

    const updated = campaigns.map(c => {
      if (c.id === activeCampaign.id) {
        return {
          ...c,
          prestacaoContas: [newReceipt, ...c.prestacaoContas]
        };
      }
      return c;
    });

    onUpdateCampaigns(updated);
    setReceiptDesc('');
    setReceiptAmount('');
    setReceiptSupplier('');
    setReceiptCnpj('');
    setReceiptFile('');
    showFeedback('Nota fiscal carregada! Status alterado para "Em Auditoria".');
  };

  const showFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(''), 4000);
  };

  if (!activeCampaign) {
    return (
      <div className="py-12 text-center bg-white border rounded-2xl">
        <p className="text-slate-500">Nenhuma campanha cadastrada para gerenciar.</p>
        <button 
          onClick={() => setShowCreateForm(true)}
          className="mt-4 px-4 py-2 rounded-xl bg-orange-500 text-white font-bold"
        >
          Criar Nova Campanha
        </button>
      </div>
    );
  }

  // Quick stats derived
  const approvedSaques = activeCampaign.saques
    .filter(s => s.status === 'Aprovado')
    .reduce((acc, curr) => acc + curr.amount, 0);
  const pendingSaques = activeCampaign.saques
    .filter(s => s.status === 'Pendente')
    .reduce((acc, curr) => acc + curr.amount, 0);
  
  const totalArrecadado = activeCampaign.collectedAmount;
  const saldoLivreParaSaque = totalArrecadado - approvedSaques;

  return (
    <div className="space-y-8">
      
      {/* Header Panel */}
      <div className="glass-panel border-b border-slate-200/50 p-6 sm:p-8 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-orange-500">
            <BadgeCheck size={18} className="fill-orange-500 text-white" />
            <span className="text-xs font-bold uppercase tracking-wider">Módulo do Organizador</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Painel da Defesa Civil / Liderança
          </h1>
          <p className="text-sm text-slate-600">
            Responsável: <strong className="text-slate-800">{organizerName}</strong>
          </p>
        </div>

        <div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold tracking-wide transition-all uppercase flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Plus size={16} />
            <span>Criar Nova Campanha</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-2 animate-bounce">
          <CheckCircle2 size={16} />
          <span>{feedback}</span>
        </div>
      )}

      {/* CREATE NEW CAMPAIGN DIALOG */}
      {showCreateForm && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xl space-y-6">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="font-bold text-lg text-slate-900">Formulário de Nova Campanha Emergencial</h3>
            <button 
              onClick={() => setShowCreateForm(false)}
              className="text-slate-400 hover:text-slate-700 text-xs font-bold cursor-pointer"
            >
              [Cancelar]
            </button>
          </div>

          <form onSubmit={handleCreateCampaignSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 block">Título da Campanha</label>
              <input
                type="text"
                placeholder="Ex: Auxílio Enchentes bairro Centro"
                value={newCampTitle}
                onChange={(e) => setNewCampTitle(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-300"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 block">Localidade (Cidade/Estado)</label>
              <input
                type="text"
                placeholder="Ex: Rio Branco - Acre"
                value={newCampLocation}
                onChange={(e) => setNewCampLocation(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-300"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 block">Categoria de Emergência</label>
              <select
                value={newCampCategory}
                onChange={(e: any) => setNewCampCategory(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-300 bg-white"
              >
                <option value="Enchentes">Enchentes / Enxurradas</option>
                <option value="Deslizamentos">Deslizamentos de Terra</option>
                <option value="Incêndios">Incêndios Florestais</option>
                <option value="Frio Extremo">Frio Extremo</option>
                <option value="Outros">Outros</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 block">Meta Requerida (R$)</label>
              <input
                type="number"
                placeholder="Ex: 80000"
                value={newCampTarget}
                onChange={(e) => setNewCampTarget(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-300"
                required
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="font-semibold text-slate-700 block">Foto de Capa (URL)</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="URL da imagem (unsplash ou similar)"
                  value={newCampImage}
                  onChange={(e) => setNewCampImage(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 flex-1"
                />
                <button
                  type="button"
                  onClick={() => setNewCampImage('https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&q=80&w=1200')}
                  className="px-3 bg-slate-100 rounded-lg hover:bg-slate-200"
                  title="Placeholder padrão"
                >
                  <ImageIcon size={16} />
                </button>
              </div>
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="font-semibold text-slate-700 block">Descrição Detalhada e Alocação dos Recursos</label>
              <textarea
                rows={4}
                placeholder="Explique exatamente para onde o dinheiro será direcionado (ex: compra de 20 toneladas de tijolos, etc.)"
                value={newCampDescription}
                onChange={(e) => setNewCampDescription(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-300"
                required
              />
            </div>

            <div className="md:col-span-2 pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-xs"
              >
                Submeter para Aprovação do Administrador
              </button>
            </div>
          </form>
        </div>
      )}

      {/* CAMPAIGN SWITCHER DROPDOWN */}
      <div className="bg-slate-100 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs">
          <span className="font-bold text-slate-700 text-xs">Selecione qual campanha gerenciar:</span>
          <select
            value={selectedCampaignId}
            onChange={(e) => setSelectedCampaignId(e.target.value)}
            className="p-2.5 rounded-xl border border-slate-300 bg-white font-bold text-slate-800"
          >
            {myCampaigns.map(c => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>Selo Ativo:</span>
          {activeCampaign.isVerified ? (
            <span className="px-3 py-1 rounded bg-emerald-100 text-emerald-800 font-bold flex items-center gap-1">
              <BadgeCheck size={14} className="fill-emerald-800 text-white" />
              <span>ORGANIZADOR VERIFICADO</span>
            </span>
          ) : (
            <span className="px-3 py-1 rounded bg-amber-100 text-amber-800 font-bold">
              PENDENTE DE VERIFICAÇÃO DE DADOS
            </span>
          )}
        </div>
      </div>

      {/* CORE ORGANIZER GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: FINANCIAL SUMMARY & DOCS (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Detailed Financial Balance box */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs space-y-6">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-1.5">
              <BarChart3 size={18} className="text-orange-500" />
              <span>Controle Financeiro da Campanha</span>
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold leading-none">Arrecadado</span>
                <span className="text-lg font-bold text-slate-900 font-mono">R$ {totalArrecadado.toLocaleString('pt-BR')}</span>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold leading-none">Liberado (Saques)</span>
                <span className="text-lg font-bold text-emerald-600 font-mono">R$ {approvedSaques.toLocaleString('pt-BR')}</span>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold leading-none">Pendente</span>
                <span className="text-lg font-bold text-amber-600 font-mono font-bold">R$ {pendingSaques.toLocaleString('pt-BR')}</span>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold leading-none">Saldo para Saque</span>
                <span className="text-lg font-bold text-slate-900 font-mono">R$ {saldoLivreParaSaque.toLocaleString('pt-BR')}</span>
              </div>
            </div>
          </div>

          {/* UPLOAD NOTES / INVOICES AREA */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs space-y-6">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-1.5">
                <FileText size={18} className="text-orange-500" />
                <span>Prestar Contas: Enviar Nota Fiscal / Comprovante</span>
              </h2>
              <p className="text-xs text-slate-500">
                O envio de faturas é **obrigatório** para homologar as retiradas efetuadas. Preencha os dados e carregue a comprovação.
              </p>
            </div>

            <form onSubmit={handleReceiptSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 block">Item / Descrição Fiscal</label>
                <input
                  type="text"
                  placeholder="Ex: Compra de 50 sacos de cimento Votoran"
                  value={receiptDesc}
                  onChange={(e) => setReceiptDesc(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 block">Valor da Fatura (R$)</label>
                <input
                  type="number"
                  placeholder="Ex: 2450.00"
                  value={receiptAmount}
                  onChange={(e) => setReceiptAmount(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 font-mono"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 block">Nome do Fornecedor</label>
                <input
                  type="text"
                  placeholder="Ex: Construtora e Varejo São Paulo Ltda"
                  value={receiptSupplier}
                  onChange={(e) => setReceiptSupplier(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 block">CNPJ do Fornecedor</label>
                <input
                  type="text"
                  placeholder="Ex: 12.345.678/0001-90"
                  value={receiptCnpj}
                  onChange={(e) => setReceiptCnpj(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 font-mono"
                  required
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="font-semibold text-slate-700 block">Arquivo XML / PDF da Nota Fiscal (Simulado)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="URL ou Nome do Arquivo Fiscal"
                    value={receiptFile}
                    onChange={(e) => setReceiptFile(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 flex-1 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setReceiptFile('NF-E_N_10492_VALIDADO.pdf')}
                    className="px-3 bg-slate-100 rounded-lg text-[10px] hover:bg-slate-200"
                  >
                    Auto-gerar
                  </button>
                </div>
              </div>

              <div className="sm:col-span-2 pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Upload size={16} />
                  <span>Submeter Comprovação para Auditoria</span>
                </button>
              </div>
            </form>
          </div>

          {/* EXISTING INVOICES TABLE IN THIS DASHBOARD */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">Status das Comprovações Enviadas</h3>
            
            {activeCampaign.prestacaoContas.length === 0 ? (
              <p className="text-xs text-slate-400">Nenhuma nota fiscal anexada ainda.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50 font-bold border-b border-slate-100">
                      <th className="p-3">Item / Fatura</th>
                      <th className="p-3">Valor</th>
                      <th className="p-3">Fornecedor</th>
                      <th className="p-3 text-right">Auditoria</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-600">
                    {activeCampaign.prestacaoContas.map((rec) => (
                      <tr key={rec.id}>
                        <td className="p-3">
                          <span className="font-semibold text-slate-800 block">{rec.description}</span>
                          <span className="text-[10px] text-slate-400 font-mono">Enviado: {rec.date}</span>
                        </td>
                        <td className="p-3 font-mono font-bold text-slate-900">
                          R$ {rec.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="p-3">{rec.supplier}</td>
                        <td className="p-3 text-right">
                          {rec.status === 'Verificado' ? (
                            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[9px] font-bold">
                              Verificado
                            </span>
                          ) : rec.status === 'CorrecaoSolicitada' ? (
                            <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 text-[9px] font-bold">
                              Correção Requerida
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[9px] font-bold animate-pulse">
                              Em Análise
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>

        {/* Right Column: ACTIONS MURAL & REQUEST SAQUE (4 cols) */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* MURAL TIMELINE WRITER */}
          <div className="bg-slate-900 text-slate-100 rounded-2xl p-6 shadow-md space-y-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-orange-500 uppercase tracking-wider block">Novidades da Obra</span>
              <h3 className="font-bold text-white text-base">Publicar Atualização no Mural</h3>
              <p className="text-[11px] text-slate-400">
                Mantenha seus doadores informados com posts de progresso, fotos e entregas de suprimentos.
              </p>
            </div>

            <form onSubmit={handleMuralSubmit} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Título da Atualização</label>
                <input
                  type="text"
                  placeholder="Ex: Chegaram as telhas!"
                  value={muralTitle}
                  onChange={(e) => setMuralTitle(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Categoria</label>
                  <select
                    value={muralType}
                    onChange={(e: any) => setMuralType(e.target.value)}
                    className="w-full p-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                  >
                    <option value="info">Info / Geral</option>
                    <option value="financial">Prestação Contas</option>
                    <option value="delivery">Entrega Insumos</option>
                  </select>
                </div>
                
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Foto URL (Opcional)</label>
                  <input
                    type="text"
                    placeholder="https://image..."
                    value={muralMedia}
                    onChange={(e) => setMuralMedia(e.target.value)}
                    className="w-full p-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Conteúdo do Post</label>
                <textarea
                  rows={3}
                  placeholder="Escreva detalhes do progresso habitacional ou doações..."
                  value={muralContent}
                  onChange={(e) => setMuralContent(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
              >
                <Send size={14} />
                <span>Publicar no Mural</span>
              </button>
            </form>
          </div>

          {/* REQUEST SAQUE FORM */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">Solicitar Saque de Recursos</h3>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              O saque transfere os recursos da carteira Reconstrói direto para a conta bancária da organização cadastrada.
            </p>

            <form onSubmit={handleSaqueSubmit} className="space-y-3 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 block">Banco de Destino</label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 bg-slate-50 font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 block">Agência</label>
                  <input
                    type="text"
                    value={bankAgency}
                    onChange={(e) => setBankAgency(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200 bg-slate-50 font-bold"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 block">Conta Corrente</label>
                  <input
                    type="text"
                    value={bankAccount}
                    onChange={(e) => setBankAccount(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200 bg-slate-50 font-bold"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 block">Chave PIX de Transferência</label>
                <input
                  type="text"
                  value={bankPix}
                  onChange={(e) => setBankPix(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 bg-slate-50 font-bold"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 block">Valor a Retirar (R$)</label>
                <input
                  type="number"
                  placeholder="Ex: 5000"
                  value={saqueAmount}
                  onChange={(e) => setSaqueAmount(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 font-mono font-bold focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold flex items-center justify-center gap-1 cursor-pointer"
              >
                <Landmark size={14} />
                <span>Efetuar Pedido de Saque</span>
              </button>
            </form>

            {/* List of withdrawal history for organizer */}
            <div className="pt-3 border-t border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase block mb-2">Pedidos Recentes</span>
              
              {activeCampaign.saques.length === 0 ? (
                <span className="text-[10px] text-slate-400 block text-center">Nenhuma solicitação pendente</span>
              ) : (
                <div className="space-y-2">
                  {activeCampaign.saques.map((saque) => (
                    <div key={saque.id} className="p-2 bg-slate-50 rounded-lg text-[10px] flex justify-between items-center border border-slate-100">
                      <div>
                        <span className="font-bold text-slate-800">R$ {saque.amount.toLocaleString('pt-BR')}</span>
                        <span className="text-[9px] text-slate-400 block font-mono">Conta: {saque.bankAccount.substring(0, 20)}...</span>
                      </div>
                      <div>
                        {saque.status === 'Aprovado' ? (
                          <span className="text-emerald-600 font-bold">Aprovado</span>
                        ) : (
                          <span className="text-amber-600 font-semibold">Pendente</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
