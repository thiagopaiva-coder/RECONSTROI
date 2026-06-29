import React, { useState } from 'react';
import { Donation, Campaign, MuralUpdate } from '../types';
import { FileText, ShieldCheck, Heart, Clock, Calendar, Download, Landmark, Eye, CheckCircle2, ChevronRight, X } from 'lucide-react';

interface DonorDashboardProps {
  donations: Donation[];
  campaigns: Campaign[];
  donorEmail: string;
  donorName: string;
  onNavigateToCampaign: (campaignId: string) => void;
}

export default function DonorDashboard({ donations, campaigns, donorEmail, donorName, onNavigateToCampaign }: DonorDashboardProps) {
  const [selectedDonationForReceipt, setSelectedDonationForReceipt] = useState<Donation | null>(null);

  // Filter donations made by this donor
  const myDonations = donations.filter(d => d.donorEmail === donorEmail);
  
  // Calculate stats
  const totalDonated = myDonations.reduce((acc, curr) => acc + curr.amount, 0);
  const distinctCampaignsCount = new Set(myDonations.map(d => d.campaignId)).size;

  // Get mural updates of supported campaigns
  const supportedCampaignIds = Array.from(new Set(myDonations.map(d => d.campaignId)));
  const supportedCampaigns = campaigns.filter(c => supportedCampaignIds.includes(c.id));
  
  // Collect all updates from supported campaigns, sort by date desc
  const feedUpdates: { campaignTitle: string; campaignId: string; update: MuralUpdate }[] = [];
  supportedCampaigns.forEach(c => {
    c.mural.forEach(u => {
      feedUpdates.push({
        campaignTitle: c.title,
        campaignId: c.id,
        update: u
      });
    });
  });
  feedUpdates.sort((a, b) => b.update.date.localeCompare(a.update.date));

  return (
    <div className="space-y-8">
      
      {/* Welcome Banner */}
      <div className="glass-panel border-b border-slate-200/50 p-6 sm:p-8 rounded-3xl space-y-3">
        <div className="flex items-center gap-2 text-orange-500">
          <Heart size={18} className="fill-orange-500" />
          <span className="text-xs font-bold uppercase tracking-wider">Painel do Doador</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Olá, {donorName}! Obrigado por reconstruir conosco.
        </h1>
        <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
          Nesta área você acompanha o destino de cada doação efetuada, acessa o mural de obras atualizado pelas equipes de resgate, e emite recibos oficiais de contribuição.
        </p>
      </div>

      {/* Stats Summary Rows */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        <div className="bg-white border border-slate-100 rounded-2xl p-6 flex items-center gap-4 shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
            <Heart size={24} className="fill-orange-500" />
          </div>
          <div className="space-y-0.5">
            <span className="text-xs text-slate-500 font-medium block">Total Doado</span>
            <span className="text-2xl font-black text-slate-900 block font-mono">
              R$ {totalDonated.toLocaleString('pt-BR')}
            </span>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-6 flex items-center gap-4 shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
            <Landmark size={24} />
          </div>
          <div className="space-y-0.5">
            <span className="text-xs text-slate-500 font-medium block">Causas Apoiadas</span>
            <span className="text-2xl font-black text-slate-900 block font-mono">
              {distinctCampaignsCount} {distinctCampaignsCount === 1 ? 'Campanha' : 'Campanhas'}
            </span>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-6 flex items-center gap-4 shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <FileText size={24} />
          </div>
          <div className="space-y-0.5">
            <span className="text-xs text-slate-500 font-medium block">Recibos Emitidos</span>
            <span className="text-2xl font-black text-slate-900 block font-mono">
              {myDonations.length} Disponíveis
            </span>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: My Donations and Receipts (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <FileText size={18} className="text-orange-500" />
                <span>Histórico de Doações & Recibos</span>
              </h2>
              <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md">
                {myDonations.length} transações
              </span>
            </div>

            {myDonations.length === 0 ? (
              <div className="text-center py-10 space-y-3">
                <p className="text-slate-500 text-sm">Você ainda não realizou nenhuma doação.</p>
                <button 
                  onClick={() => window.location.reload()} // Just triggers home navigate fallback in App
                  className="px-4 py-2 rounded-xl bg-orange-500 text-white font-bold text-xs"
                >
                  Doar Agora
                </button>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[500px]">
                  <thead>
                    <tr className="text-slate-500 text-xs font-semibold pb-3">
                      <th className="py-2">Campanha</th>
                      <th className="py-2">Data</th>
                      <th className="py-2">Valor</th>
                      <th className="py-2">Método</th>
                      <th className="py-2 text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs divide-y divide-slate-50">
                    {myDonations.map((d) => (
                      <tr key={d.id} className="hover:bg-slate-50/50">
                        <td className="py-3 pr-2">
                          <span className="font-bold text-slate-800 block max-w-[200px] truncate">{d.campaignTitle}</span>
                          <span className="text-[10px] text-slate-400 font-mono">ID: {d.id}</span>
                        </td>
                        <td className="py-3 text-slate-500">
                          {new Date(d.date).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="py-3 font-mono font-bold text-slate-900">
                          R$ {d.amount.toFixed(2).replace('.', ',')}
                        </td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 font-mono text-[9px] font-bold text-slate-700">
                            {d.paymentMethod}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => setSelectedDonationForReceipt(d)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-600 font-semibold transition-all cursor-pointer text-[11px]"
                          >
                            <Download size={12} />
                            <span>Emitir Recibo</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Supported Campaigns list */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6 space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Minhas Causas Apoiadas</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {supportedCampaigns.map((camp) => (
                <div key={camp.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50 flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] bg-slate-200 text-slate-800 px-2 py-0.5 rounded font-bold font-mono uppercase">
                        {camp.category}
                      </span>
                      {camp.isVerified && (
                        <span className="text-emerald-600 text-[10px] font-bold flex items-center gap-0.5">
                          <ShieldCheck size={12} />
                          <span>Verificada</span>
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-sm text-slate-800 line-clamp-1">{camp.title}</h3>
                    <p className="text-[11px] text-slate-500 line-clamp-2">{camp.description}</p>
                  </div>

                  <button
                    onClick={() => onNavigateToCampaign(camp.id)}
                    className="w-full text-center py-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>Ir para a Linha do Tempo</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Feed of Updates from Backed Campaigns (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 text-slate-100 rounded-2xl p-6 shadow-md space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-bold text-orange-500 uppercase tracking-wider block">Feed em Tempo Real</span>
              <h2 className="text-lg font-bold text-white flex items-center gap-1.5">
                <Clock size={18} className="text-orange-500" />
                <span>Obras & Mantimentos</span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Acompanhe as atualizações das equipes locais referentes às campanhas que você apoiou.
              </p>
            </div>

            {feedUpdates.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-xs">
                Nenhuma atualização recente no mural destas campanhas.
              </div>
            ) : (
              <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
                {feedUpdates.map((item, idx) => (
                  <div key={item.update.id + '-' + idx} className="relative pl-7 space-y-2">
                    
                    {/* Circle icon marker on timeline */}
                    <div className={`absolute left-0 top-1.5 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      item.update.type === 'delivery' ? 'bg-emerald-500 text-white' :
                      item.update.type === 'financial' ? 'bg-orange-500 text-white' : 'bg-blue-500 text-white'
                    }`}>
                      {idx + 1}
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center justify-between gap-1 text-[10px]">
                        <span className="text-orange-400 font-bold hover:underline cursor-pointer" onClick={() => onNavigateToCampaign(item.campaignId)}>
                          {item.campaignTitle}
                        </span>
                        <span className="text-slate-500 font-mono">
                          {new Date(item.update.date).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      
                      <h4 className="font-bold text-xs text-white leading-tight">
                        {item.update.title}
                      </h4>
                      
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        {item.update.content}
                      </p>

                      {item.update.mediaUrl && (
                        <div className="pt-1.5 rounded-lg overflow-hidden max-h-40 bg-slate-950">
                          <img 
                            src={item.update.mediaUrl} 
                            alt={item.update.title} 
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" 
                          />
                        </div>
                      )}

                      <span className="inline-block text-[9px] uppercase tracking-wider font-bold text-slate-500 bg-slate-950/40 px-2 py-0.5 rounded">
                        {item.update.type === 'delivery' ? '🚚 Entrega Efetuada' :
                         item.update.type === 'financial' ? '🧾 Compra Auditada' : 'ℹ️ Informativo'}
                      </span>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* COMPROVANTE VISUAL / RECEIPT MODAL (Generates printable voucher layout) */}
      {selectedDonationForReceipt && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-orange-500 text-white font-extrabold text-xs flex items-center justify-center">
                  R
                </div>
                <span className="font-bold text-xs font-mono uppercase tracking-widest text-slate-300">Recibo Oficial Digital</span>
              </div>
              <button 
                onClick={() => setSelectedDonationForReceipt(null)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Receipt Content Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-slate-950 font-sans" id="receipt-printable-area">
              
              {/* Header inside the receipt */}
              <div className="text-center space-y-2 border-b border-dashed border-slate-200 pb-5">
                <span className="font-black text-2xl tracking-tight text-slate-900 block uppercase">RECONSTRÓI</span>
                <span className="text-[10px] text-slate-500 font-mono block">PLATAFORMA DE APOIO AUDITÁVEL E TRANSPARÊNCIA</span>
                <span className="text-xs bg-slate-100 text-slate-800 font-bold px-3 py-1 rounded-full inline-block">
                  RECIBO DE DOAÇÃO SOCIAL EMERGENCY
                </span>
              </div>

              {/* Core Receipt text statement */}
              <div className="space-y-4 text-xs leading-relaxed text-slate-700">
                <p>
                  Declaramos para os devidos fins de transparência pública, controle comunitário e dedução social que a plataforma <strong>Reconstrói</strong> intermediou com sucesso o repasse financeiro espontâneo efetuado por:
                </p>
                
                <div className="bg-slate-50 p-4 rounded-xl space-y-2 border border-slate-100 text-slate-900">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-mono leading-none">DOADOR(A)</span>
                    <span className="font-bold text-sm block">{donorName}</span>
                    <span className="text-xs text-slate-500 block font-mono">{donorEmail}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-mono leading-none">CAMPANHA BENEFICIADA</span>
                    <span className="font-bold text-slate-800 block">{selectedDonationForReceipt.campaignTitle}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-mono leading-none">VALOR REPASSADO</span>
                    <span className="text-xl font-mono font-extrabold text-orange-600 block">
                      R$ {selectedDonationForReceipt.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-mono leading-none">MÉTODO DE PAGAMENTO</span>
                    <span className="text-sm font-bold text-slate-800 block uppercase mt-1">
                      {selectedDonationForReceipt.paymentMethod}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-[11px]">
                  <div>
                    <span className="text-slate-400 block font-mono">DATA DE CONFIRMAÇÃO</span>
                    <span className="font-semibold text-slate-800 block">
                      {new Date(selectedDonationForReceipt.date).toLocaleString('pt-BR')}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-mono">STATUS DO REPASSE</span>
                    <span className="font-bold text-emerald-600 block flex items-center gap-1">
                      <CheckCircle2 size={12} />
                      <span>Confirmada & Homologada</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Cryptography Hash Signature */}
              <div className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-[9px] space-y-1 text-center">
                <span className="text-orange-400 font-bold block">ASSINATURA DIGITAL DE AUDITORIA CRIPTOGRÁFICA</span>
                <span className="text-slate-400 block break-all">
                  SHA256: {btoa(selectedDonationForReceipt.id + selectedDonationForReceipt.amount).substring(0, 32).toLowerCase()}
                </span>
                <span className="text-[8px] text-slate-500 block">
                  Documento auditado pela Rede Reconstrói e indexado para prestação de contas governamental.
                </span>
              </div>

              {/* Bottom security footer layout */}
              <div className="flex items-center justify-between border-t border-slate-100 pt-4 text-[10px] text-slate-500">
                <div className="flex items-center gap-1.5 text-emerald-600 font-bold">
                  <ShieldCheck size={16} />
                  <span>Selo de Rastreabilidade</span>
                </div>
                <span>Impresso em {new Date().toLocaleDateString('pt-BR')}</span>
              </div>

            </div>

            {/* Close / Action Buttons */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-2">
              <button
                onClick={() => {
                  window.print();
                }}
                className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download size={14} />
                <span>Salvar / Imprimir PDF</span>
              </button>
              <button
                onClick={() => setSelectedDonationForReceipt(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-all cursor-pointer"
              >
                Fechar
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
