import React, { useState } from 'react';
import { Campaign, ReceiptDoc } from '../types';
import { ShieldCheck, Heart, MapPin, Calendar, Users, AlertTriangle, FileText, CheckCircle2, FileSpreadsheet, Eye, ArrowLeft } from 'lucide-react';

interface CampaignDetailsProps {
  campaign: Campaign;
  onGoBack: () => void;
  onDonate: (campaignId: string) => void;
}

export default function CampaignDetails({ campaign, onGoBack, onDonate }: CampaignDetailsProps) {
  const [activeTab, setActiveTab] = useState<'mural' | 'contas'>('mural');
  const [selectedInvoice, setSelectedInvoice] = useState<ReceiptDoc | null>(null);

  const progressPct = Math.round((campaign.collectedAmount / campaign.targetAmount) * 100);

  return (
    <div className="space-y-8 pb-16">
      
      {/* Back button */}
      <div>
        <button
          onClick={onGoBack}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-xl transition-all cursor-pointer shadow-xs hover:shadow-sm"
        >
          <ArrowLeft size={14} />
          <span>Voltar para as Campanhas</span>
        </button>
      </div>

      {/* Main Grid: Capa & Key stats card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Cover & Details Description (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-xs">
            
            {/* Capa */}
            <div className="relative h-64 sm:h-80 bg-slate-100">
              <img 
                src={campaign.imageUrl} 
                alt={campaign.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                <span className="px-3 py-1.5 rounded-lg bg-slate-900/90 text-white text-xs font-bold uppercase tracking-wider">
                  {campaign.category}
                </span>
                {campaign.isVerified && (
                  <span className="px-3 py-1.5 rounded-lg bg-emerald-500 text-white text-xs font-bold tracking-wider flex items-center gap-1 shadow-md">
                    <ShieldCheck size={14} />
                    <span>CAMPANHA AUDITADA E VERIFICADA</span>
                  </span>
                )}
              </div>
            </div>

            {/* Campaign info */}
            <div className="p-6 sm:p-8 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-orange-500 uppercase tracking-wider block">Campanha de Apoio</span>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {campaign.title}
                  </h1>
                </div>
                
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 text-slate-700 text-xs font-medium border border-slate-200">
                  <MapPin size={14} className="text-orange-500" />
                  <span>{campaign.location}</span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h3 className="font-bold text-slate-900 text-base">Sobre a Emergência</h3>
                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                  {campaign.description}
                </p>
              </div>

              {/* Organizer Badge */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-900 text-white font-extrabold text-sm flex items-center justify-center">
                    {campaign.organizerName.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block font-mono">ORGANIZADOR RESPONSÁVEL</span>
                    <span className="text-xs font-bold text-slate-800 block flex items-center gap-1">
                      {campaign.organizerName}
                      {campaign.isVerified && <ShieldCheck size={14} className="text-emerald-500" />}
                    </span>
                  </div>
                </div>

                <div className="text-right text-[11px] text-slate-400">
                  <span>Prestação de contas auditada voluntariamente.</span>
                </div>
              </div>

            </div>
          </div>

          {/* DUAL TAB SWITCH */}
          <div className="space-y-4">
            
            <div className="flex border-b border-slate-200">
              <button
                onClick={() => setActiveTab('mural')}
                className={`py-3 px-6 text-sm font-bold border-b-2 transition-all cursor-pointer ${
                  activeTab === 'mural'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Mural da Linha de Tempo ({campaign.mural.length})
              </button>
              <button
                onClick={() => setActiveTab('contas')}
                className={`py-3 px-6 text-sm font-bold border-b-2 transition-all cursor-pointer ${
                  activeTab === 'contas'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Documentos de Prestação de Contas ({campaign.prestacaoContas.length})
              </button>
            </div>

            {/* TAB CONTENT: MURAL */}
            {activeTab === 'mural' && (
              <div className="space-y-6">
                {campaign.mural.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-2xl border border-slate-100 text-slate-500 text-sm">
                    Nenhuma atualização registrada até o momento neste mural.
                  </div>
                ) : (
                  <div className="space-y-6 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                    {campaign.mural.map((update) => (
                      <div key={update.id} className="relative pl-12 bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-3">
                        
                        {/* Circle Badge Icon on line */}
                        <div className="absolute left-2.5 top-6 w-5 h-5 rounded-full border-4 border-white bg-orange-500 ring-2 ring-orange-200 flex items-center justify-center">
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                          <span className="font-bold text-orange-600 font-mono uppercase tracking-wider">
                            {update.type === 'delivery' ? '🚚 Entrega de Insumos' :
                             update.type === 'financial' ? '🧾 Compra Realizada' : 'ℹ️ Informativo Geral'}
                          </span>
                          <span className="text-slate-400 font-mono">
                            {new Date(update.date).toLocaleDateString('pt-BR')} às {new Date(update.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        <h3 className="text-lg font-bold text-slate-900 leading-tight">
                          {update.title}
                        </h3>

                        <p className="text-sm text-slate-600 leading-relaxed">
                          {update.content}
                        </p>

                        {update.mediaUrl && (
                          <div className="rounded-xl overflow-hidden max-h-[350px] bg-slate-50 border border-slate-100 mt-2">
                            <img 
                              src={update.mediaUrl} 
                              alt={update.title} 
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover" 
                            />
                          </div>
                        )}

                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: PRESTAÇÃO DE CONTAS */}
            {activeTab === 'contas' && (
              <div className="space-y-6">
                
                {/* Transparency alert box */}
                <div className="bg-slate-900 text-slate-100 p-5 rounded-2xl border border-slate-800 space-y-2">
                  <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
                    <ShieldCheck className="text-orange-500" size={16} />
                    <span>Compromisso de Rastreabilidade Total</span>
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Todas as notas fiscais, cupons eletrônicos ou faturas anexadas abaixo passam pela auditoria voluntária da nossa plataforma. O status do documento reflete a homologação contábil para evitar fraudes ou desvio de finalidade.
                  </p>
                </div>

                {campaign.prestacaoContas.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-2xl border border-slate-100 text-slate-500 text-sm">
                    Nenhum documento de prestação de contas carregado ainda. Aguardando o início dos saques e compras pelo organizador.
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-xs">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse min-w-[600px] text-xs">
                        <thead>
                          <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                            <th className="p-4">Item Comprado / Descrição</th>
                            <th className="p-4">Valor</th>
                            <th className="p-4">Fornecedor / CNPJ</th>
                            <th className="p-4">Status Auditoria</th>
                            <th className="p-4 text-center">Fatura</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700">
                          {campaign.prestacaoContas.map((doc) => (
                            <tr key={doc.id} className="hover:bg-slate-50/50">
                              <td className="p-4 space-y-0.5">
                                <span className="font-bold text-slate-800 block">{doc.description}</span>
                                <span className="text-[10px] text-slate-400 font-mono">ID Nota: {doc.id} • Emissão: {doc.date}</span>
                              </td>
                              <td className="p-4 font-mono font-bold text-slate-900">
                                R$ {doc.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                              </td>
                              <td className="p-4 space-y-0.5">
                                <span className="font-semibold block">{doc.supplier}</span>
                                <span className="text-[10px] text-slate-400 font-mono">{doc.cnpj}</span>
                              </td>
                              <td className="p-4">
                                {doc.status === 'Verificado' ? (
                                  <span className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-100 font-bold inline-flex items-center gap-1 text-[10px]">
                                    <CheckCircle2 size={12} />
                                    <span>CONTA VERIFICADA</span>
                                  </span>
                                ) : doc.status === 'CorrecaoSolicitada' ? (
                                  <span className="px-2.5 py-1 rounded bg-red-50 text-red-700 border border-red-100 font-bold inline-flex items-center gap-1 text-[10px]">
                                    <AlertTriangle size={12} />
                                    <span>CORREÇÃO SOLICITADA</span>
                                  </span>
                                ) : (
                                  <span className="px-2.5 py-1 rounded bg-amber-50 text-amber-700 border border-amber-100 font-bold inline-flex items-center gap-1 text-[10px]">
                                    <Calendar size={12} />
                                    <span>EM AUDITORIA</span>
                                  </span>
                                )}
                              </td>
                              <td className="p-4 text-center">
                                <button
                                  onClick={() => setSelectedInvoice(doc)}
                                  className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors inline-flex items-center justify-center cursor-pointer"
                                  title="Visualizar Nota Fiscal"
                                >
                                  <Eye size={14} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>

        {/* Right Column: Donation card & metadata widgets (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Target Progress Card */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-md space-y-6">
            
            <div className="space-y-1">
              <span className="text-xs font-bold text-orange-500 uppercase tracking-wider block">Progresso Habitacional</span>
              <h3 className="font-bold text-slate-900 text-lg leading-tight">Metas de Arrecadação</h3>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 font-semibold">Valor Arrecadado</span>
                <span className="font-bold text-slate-900">R$ {campaign.collectedAmount.toLocaleString('pt-BR')}</span>
              </div>
              
              {/* Progresso */}
              <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-orange-500 rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min(100, progressPct)}%` }}
                />
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium">Meta Final</span>
                <span className="font-bold text-slate-800 font-mono">R$ {campaign.targetAmount.toLocaleString('pt-BR')}</span>
              </div>
            </div>

            {/* Quick counters */}
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                <Users size={18} className="mx-auto text-slate-500 mb-1" />
                <span className="block text-sm font-bold text-slate-900 font-mono">{campaign.donorsCount}</span>
                <span className="text-[10px] text-slate-400 font-medium uppercase">Doadores</span>
              </div>
              
              <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                <ShieldCheck size={18} className="mx-auto text-slate-500 mb-1" />
                <span className="block text-sm font-bold text-slate-900 font-mono">{progressPct}%</span>
                <span className="text-[10px] text-slate-400 font-medium uppercase">Atingido</span>
              </div>
            </div>

            {/* Main Donate Button (Laranja) */}
            <button
              onClick={() => onDonate(campaign.id)}
              className="w-full py-4 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm uppercase tracking-wide shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Heart size={16} className="fill-white animate-pulse" />
              <span>Apoiar / Doar Agora</span>
            </button>

            <div className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1">
              <span>Sua doação possui rastreabilidade criptográfica direta.</span>
            </div>
          </div>

          {/* Saque History / Status */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs space-y-4">
            <h4 className="font-bold text-slate-900 text-sm">Fluxo de Retiradas para Compras</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Os organizadores locais solicitam saques parciais conforme o orçamento de cada obra é aprovado. Veja o histórico de retiradas:
            </p>

            {campaign.saques.length === 0 ? (
              <div className="text-center py-4 bg-slate-50 rounded-xl text-slate-400 text-[11px]">
                Nenhum saque efetuado ainda. Recursos protegidos.
              </div>
            ) : (
              <div className="space-y-3">
                {campaign.saques.map((saque) => (
                  <div key={saque.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs flex justify-between items-center">
                    <div className="space-y-0.5">
                      <span className="font-bold text-slate-900">R$ {saque.amount.toLocaleString('pt-BR')}</span>
                      <span className="text-[10px] text-slate-400 block font-mono">Solicitado em: {saque.date}</span>
                    </div>
                    <div>
                      {saque.status === 'Aprovado' ? (
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold text-[9px] uppercase border border-emerald-100">
                          Pago
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 font-bold text-[9px] uppercase border border-amber-100">
                          Pendente
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* POPUP: NOTA FISCAL DETAILS VIEWER */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border border-slate-200">
            
            <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
              <span className="font-bold text-xs font-mono uppercase tracking-wider text-slate-300">
                Visualizador de Prestação de Contas
              </span>
              <button 
                onClick={() => setSelectedInvoice(null)}
                className="text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                fechar [x]
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="text-center space-y-2">
                <FileSpreadsheet size={36} className="mx-auto text-orange-500" />
                <h4 className="font-extrabold text-slate-900 text-base">Comprovante de Despesa Auditada</h4>
                <p className="text-[10px] text-slate-400 font-mono">NOTA FISCAL HOMOLOGADA ELETRONICAMENTE</p>
              </div>

              <div className="divide-y divide-slate-100 text-xs">
                <div className="py-2 flex justify-between">
                  <span className="text-slate-400">Descrição do Item:</span>
                  <span className="font-bold text-slate-800 text-right max-w-[200px]">{selectedInvoice.description}</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-slate-400">Fornecedor:</span>
                  <span className="font-bold text-slate-800">{selectedInvoice.supplier}</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-slate-400">CNPJ:</span>
                  <span className="font-mono text-slate-800">{selectedInvoice.cnpj}</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-slate-400">Valor da Nota:</span>
                  <span className="font-mono font-bold text-orange-600">R$ {selectedInvoice.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-slate-400">Data de Emissão:</span>
                  <span className="font-bold text-slate-800">{selectedInvoice.date}</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-slate-400">Status Contábil:</span>
                  <span className="font-extrabold text-emerald-600 uppercase">{selectedInvoice.status}</span>
                </div>
                {selectedInvoice.auditNotes && (
                  <div className="py-3 text-[11px] text-slate-500 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100 mt-2">
                    <span className="font-bold block text-slate-700 text-xs mb-1">Parecer do Auditor:</span>
                    {selectedInvoice.auditNotes}
                  </div>
                )}
              </div>

              <div className="bg-slate-100 p-3 rounded-xl text-[10px] text-slate-500 font-mono text-center leading-relaxed">
                Verificado sob o código criptográfico <br />
                <span className="text-slate-700 font-bold">XML-SEFAZ-{selectedInvoice.id}</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 text-right">
              <button
                onClick={() => setSelectedInvoice(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Concluir Leitura
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
