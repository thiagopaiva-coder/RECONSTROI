import React, { useState } from 'react';
import { Campaign, PlatformConfig } from '../types';
import { ShieldCheck, Heart, MapPin, Target, Sparkles, FileSpreadsheet, Landmark, ArrowRight, ShieldAlert, BadgeHelp, Search } from 'lucide-react';

interface LandingPageProps {
  campaigns: Campaign[];
  onSelectCampaign: (id: string) => void;
  onDonateDirect: (campaignId: string) => void;
  globalStats: PlatformConfig;
}

export default function LandingPage({ campaigns, onSelectCampaign, onDonateDirect, globalStats }: LandingPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Only display active campaigns on the public landing page
  const activeCampaigns = campaigns.filter(c => c.status === 'Ativa');

  const filteredCampaigns = activeCampaigns.filter(c => {
    const matchesCategory = selectedCategory === 'Todas' || c.category === selectedCategory;
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.organizerName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = ['Todas', 'Enchentes', 'Deslizamentos', 'Incêndios', 'Frio Extremo'];

  return (
    <div className="space-y-16 pb-20">
      
      {/* SECTION 1: HERO */}
      <section className="relative overflow-hidden pt-12 md:pt-20 pb-16 bg-gradient-to-b from-slate-50 via-white to-slate-50">
        <div className="absolute inset-0 bg-[radial-gradient(#f97316_0.1px,transparent_1px)] [background-size:16px_16px] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left text */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-100 border border-orange-200/50 text-orange-700 text-xs font-semibold uppercase tracking-wider">
                <Sparkles size={14} className="animate-pulse" />
                <span>Transparência auditável em tempo real</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
                Sua ajuda chega onde importa. <br />
                <span className="text-orange-500 underline decoration-slate-900/10 decoration-wavy">Comprovado, nota por nota.</span>
              </h1>
              
              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                A <strong>Reconstrói</strong> elimina intermediários e a burocracia do repasse emergencial. Aqui, cada centavo doado é vinculado a notas fiscais auditadas e a uma linha do tempo aberta ao público.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <button
                  onClick={() => {
                    const el = document.getElementById('campanhas-urgentes');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-lg shadow-orange-500/30 hover:shadow-orange-500/40 transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <span>Apoiar uma Campanha</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => {
                    const el = document.getElementById('como-funciona');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-semibold border border-slate-300 shadow-sm transition-all text-center"
                >
                  Como Auditamos?
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0 text-left border-t border-slate-200">
                <div>
                  <span className="block text-2xl font-bold text-slate-900">100%</span>
                  <span className="text-xs text-slate-500 font-medium">Notas Fiscais Públicas</span>
                </div>
                <div>
                  <span className="block text-2xl font-bold text-slate-900">R$ 0</span>
                  <span className="text-xs text-slate-500 font-medium">Taxas abusivas</span>
                </div>
                <div>
                  <span className="block text-2xl font-bold text-slate-900">Auditado</span>
                  <span className="text-xs text-slate-500 font-medium">Por especialistas</span>
                </div>
              </div>
            </div>

            {/* Right Interactive Mockup (Glassmorphism design card) */}
            <div className="lg:col-span-5 relative">
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-orange-400 to-amber-600 opacity-25 blur-xl"></div>
              
              <div className="relative glass-card border border-white p-6 rounded-3xl shadow-2xl space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    AUDITORIA ATIVA
                  </span>
                  <span className="text-xs text-slate-400 font-mono">ID: {activeCampaigns[0]?.id || 'camp-1'}</span>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] uppercase tracking-wider font-extrabold text-orange-600 block">Destaque do Dia</span>
                  <h3 className="text-xl font-bold text-slate-900 leading-tight">
                    {activeCampaigns[0]?.title || 'Reconstrução no Sul'}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2">
                    {activeCampaigns[0]?.description || 'Apoio imediato às famílias necessitadas de material habitacional.'}
                  </p>
                </div>

                {/* Progress Mini Card */}
                <div className="bg-slate-900/5 p-4 rounded-2xl space-y-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500 font-medium">Arrecadado</span>
                    <span className="font-mono font-bold text-slate-950">
                      R$ {activeCampaigns[0]?.collectedAmount.toLocaleString('pt-BR')} de R$ {activeCampaigns[0]?.targetAmount.toLocaleString('pt-BR')}
                    </span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-orange-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, ((activeCampaigns[0]?.collectedAmount || 1) / (activeCampaigns[0]?.targetAmount || 1)) * 100)}%` }}
                    />
                  </div>

                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-500 font-medium">✨ {activeCampaigns[0]?.donorsCount || 0} doadores apoiaram</span>
                    <span className="font-bold text-orange-600">
                      {Math.round(((activeCampaigns[0]?.collectedAmount || 0) / (activeCampaigns[0]?.targetAmount || 1)) * 100)}% batido
                    </span>
                  </div>
                </div>

                {/* Simulated Invoice Badge */}
                <div className="flex items-center gap-3 bg-white/80 p-3 rounded-xl border border-slate-200">
                  <div className="w-9 h-9 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
                    <FileSpreadsheet size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] block text-slate-400 font-mono leading-none">NOTA FISCAL HOMOLOGADA</span>
                    <span className="text-xs block font-semibold text-slate-800 truncate">NF-e #10492 - Telhas de Fibrocimento</span>
                  </div>
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100 flex items-center gap-1">
                    <ShieldCheck size={12} />
                    <span>Ok</span>
                  </span>
                </div>

                <button 
                  onClick={() => activeCampaigns[0] && onSelectCampaign(activeCampaigns[0].id)}
                  className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs tracking-wide transition-all uppercase flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Analisar Linha do Tempo & Notas</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 2: GLOBAL STATS (White / Light Gray) */}
      <section id="estatisticas" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 sm:p-12 relative overflow-hidden">
          <div className="absolute right-0 bottom-0 w-96 h-96 bg-slate-50 rounded-full -mr-20 -mb-20 -z-0 opacity-40"></div>
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Explanatory text */}
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-bold text-orange-500 uppercase tracking-wider block">Impacto Mensurável</span>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Transparência não é promessa, é matemática.
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Auditamos transações financeiras em conformidade com as diretrizes do Marco de Transparência Social. Todos os dados abaixo são atualizados no instante em que as doações entram e as notas fiscais são verificadas.
              </p>
            </div>

            {/* Core Counter Grid */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-6">
              
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 text-center space-y-1">
                <span className="text-xs text-slate-500 font-medium block uppercase tracking-wider">Total Arrecadado</span>
                <span className="text-3xl font-black text-slate-900 block font-mono">
                  R$ {globalStats.totalDonatedGlobal.toLocaleString('pt-BR')}
                </span>
                <span className="text-[10px] text-slate-400 block font-mono">Sem intermediários</span>
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 text-center space-y-1">
                <span className="text-xs text-slate-500 font-medium block uppercase tracking-wider">Campanhas Verificadas</span>
                <span className="text-3xl font-black text-slate-900 block font-mono">
                  {activeCampaigns.length} Ativas
                </span>
                <span className="text-[10px] text-slate-400 block font-mono">100% monitoradas</span>
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 text-center space-y-1">
                <span className="text-xs text-slate-500 font-medium block uppercase tracking-wider">Famílias Apoiadas</span>
                <span className="text-3xl font-black text-slate-900 block font-mono">
                  +{globalStats.totalPeopleHelped}
                </span>
                <span className="text-[10px] text-slate-400 block font-mono">Direto nas comunidades</span>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: CAMPANHAS EM DESTAQUE */}
      <section id="campanhas-urgentes" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="text-xs font-bold text-orange-500 uppercase tracking-wider block">Ajuda Humanitária</span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Campanhas Emergenciais Ativas</h2>
            <p className="text-sm text-slate-600 max-w-xl">
              Navegue pelas campanhas validadas pela Defesa Civil e lideranças locais. Clique em apoiar para doar e acompanhar o uso dos recursos.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por local ou causa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all shadow-xs"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === cat 
                  ? 'bg-orange-500 text-white shadow-sm' 
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Campaigns Grid */}
        {filteredCampaigns.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-100 p-8">
            <ShieldAlert size={48} className="mx-auto text-slate-300 mb-3" />
            <p className="text-slate-500 font-medium">Nenhuma campanha encontrada para os filtros selecionados.</p>
            <button 
              onClick={() => { setSelectedCategory('Todas'); setSearchQuery(''); }}
              className="mt-2 text-sm text-orange-500 font-semibold hover:underline"
            >
              Limpar filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCampaigns.map((camp) => {
              const progressPct = Math.round((camp.collectedAmount / camp.targetAmount) * 100);
              return (
                <div 
                  key={camp.id} 
                  className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-xs hover:shadow-lg hover:scale-[1.01] transition-all duration-300 flex flex-col group h-full"
                >
                  
                  {/* Capa */}
                  <div className="relative h-48 overflow-hidden bg-slate-100">
                    <img 
                      src={camp.imageUrl} 
                      alt={camp.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Tags */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold uppercase tracking-wider">
                        {camp.category}
                      </span>
                      {camp.isVerified && (
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-500 text-white text-[10px] font-bold tracking-wider flex items-center gap-1 shadow-sm">
                          <ShieldCheck size={11} />
                          <span>CAMPANHA VERIFICADA</span>
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-lg text-[10px] font-semibold text-slate-700 flex items-center gap-1 border border-white">
                      <MapPin size={11} className="text-orange-500" />
                      <span>{camp.location.split(' - ')[1] || camp.location}</span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-bold text-slate-900 text-lg leading-snug group-hover:text-orange-600 transition-colors">
                        {camp.title}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-3">
                        {camp.description}
                      </p>
                    </div>

                    <div className="space-y-3 pt-2">
                      {/* Meta stats */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-slate-500">
                          <span>Progresso</span>
                          <span className="font-bold font-mono text-slate-900">{progressPct}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-orange-500 rounded-full" 
                            style={{ width: `${Math.min(100, progressPct)}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[11px] font-mono pt-1">
                          <span className="text-slate-600 font-bold">R$ {camp.collectedAmount.toLocaleString('pt-BR')}</span>
                          <span className="text-slate-400">Meta: R$ {camp.targetAmount.toLocaleString('pt-BR')}</span>
                        </div>
                      </div>

                      {/* Organizer summary */}
                      <div className="text-[11px] text-slate-400 flex items-center gap-1.5 border-t border-slate-100 pt-3">
                        <span className="font-medium text-slate-500">Org:</span>
                        <span className="text-slate-600 font-semibold truncate">{camp.organizerName}</span>
                      </div>
                    </div>

                    {/* Footer Buttons */}
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <button
                        onClick={() => onSelectCampaign(camp.id)}
                        className="py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 transition-all text-center cursor-pointer"
                      >
                        Prestação & Notas
                      </button>
                      <button
                        onClick={() => onDonateDirect(camp.id)}
                        className="py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all text-center flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Heart size={12} className="fill-white" />
                        <span>Doar Agora</span>
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* SECTION 4: COMO FUNCIONA (A Escola da Transparência) */}
      <section id="como-funciona" className="bg-slate-900 text-slate-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold text-orange-500 uppercase tracking-wider block">Fluxo da Confiança</span>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Como funciona a Reconstrói?</h2>
            <p className="text-sm text-slate-400">
              Garantimos rastreabilidade ponta a ponta. Saiba como cuidamos do dinheiro da sua doação do início ao fim do resgate.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            <div className="bg-slate-800/50 border border-slate-700/50 p-6 rounded-2xl space-y-3 relative">
              <div className="absolute top-4 right-4 text-3xl font-black text-slate-800">01</div>
              <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white font-bold">
                <Target size={20} />
              </div>
              <h3 className="font-bold text-base text-white">Escolha a Causa</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Navegue pelas campanhas ativas validadas pelas lideranças regionais e Defesa Civil. Identifique as necessidades de cada comunidade.
              </p>
            </div>

            <div className="bg-slate-800/50 border border-slate-700/50 p-6 rounded-2xl space-y-3 relative">
              <div className="absolute top-4 right-4 text-3xl font-black text-slate-800">02</div>
              <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white font-bold">
                <Landmark size={20} />
              </div>
              <h3 className="font-bold text-base text-white">Doe sem Burocracia</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Faça o repasse rápido via PIX, Cartão ou Boleto. Seu saldo fica retido na conta de garantia da plataforma até a auditoria liberar o saque.
              </p>
            </div>

            <div className="bg-slate-800/50 border border-slate-700/50 p-6 rounded-2xl space-y-3 relative">
              <div className="absolute top-4 right-4 text-3xl font-black text-slate-800">03</div>
              <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white font-bold">
                <Heart size={20} />
              </div>
              <h3 className="font-bold text-base text-white">Siga o Trabalho</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Acompanhe o mural de atualizações da campanha: fotos, entregas de mantimentos e progresso das obras postadas pelas ONGs locais.
              </p>
            </div>

            <div className="bg-slate-800/50 border border-slate-700/50 p-6 rounded-2xl space-y-3 relative">
              <div className="absolute top-4 right-4 text-3xl font-black text-slate-800">04</div>
              <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white font-bold">
                <ShieldCheck size={20} />
              </div>
              <h3 className="font-bold text-base text-white">Veja a Nota Fiscal</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Nossos auditores revisam as notas fiscais enviadas pelos organizadores. Se houver divergência, o repasse é bloqueado na hora.
              </p>
            </div>

          </div>

          <div className="bg-slate-800/30 p-6 rounded-3xl border border-slate-800 text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/50 border border-emerald-900/50 px-3 py-1 rounded-full">
              ★ COMPROMISSO DE TAXA ZERO DE ADMINISTRAÇÃO
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">
              Diferente de vaquinhas tradicionais que cobram até 10% do arrecadado, a Reconstrói não retém taxas das doações destinadas às vítimas. Cobramos apenas o custo operacional do gateway de pagamento (1.2%).
            </p>
          </div>

        </div>
      </section>

      {/* SECTION 5: TRANSPARÊNCIA E AUDITORIA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-6">
            <div className="inline-block bg-slate-100 text-slate-800 text-[10px] font-bold font-mono px-3 py-1 rounded-full">
              SISTEMA DE PRESTAÇÃO DE CONTAS
            </div>
            
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Prevenimos a dispersão e o desvio de recursos.
            </h2>
            
            <p className="text-sm text-slate-600 leading-relaxed">
              Historicamente, doações de desastres acabam dispersas em contas pessoais e de difícil fiscalização. A Reconstrói centraliza campanhas e exige transparência por meio de um fluxo rígido:
            </p>

            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="mt-1 p-1 rounded-lg bg-orange-50 text-orange-600">
                  <ShieldCheck size={16} />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-800">CNPJ e CPF Pré-Verificados</h4>
                  <p className="text-xs text-slate-500">Apenas organizadores com documentação validada junto ao suporte técnico podem requerer novos saques.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 p-1 rounded-lg bg-orange-50 text-orange-600">
                  <ShieldCheck size={16} />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-800">Contabilidade Compartilhada</h4>
                  <p className="text-xs text-slate-500">O total arrecadado é público. Qualquer pessoa pode consultar as notas fiscais anexadas no portal antes mesmo do saque ser homologado.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 p-1 rounded-lg bg-orange-50 text-orange-600">
                  <ShieldCheck size={16} />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-800">Auditoria Colaborativa</h4>
                  <p className="text-xs text-slate-500">Auditores independentes e agentes revisam a integridade de dados e notas fiscais de compras de insumos para dar o selo de segurança.</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-slate-100 p-8 rounded-3xl border border-slate-200/60 space-y-6 relative">
            <h3 className="font-bold text-slate-900 text-lg">Perguntas Rápidas sobre nossa Auditoria</h3>
            
            <div className="space-y-4 text-xs text-slate-600">
              <div className="bg-white p-4 rounded-xl border border-slate-200/50 space-y-1">
                <span className="font-bold text-slate-800 block">Como posso ter certeza de que o material foi entregue?</span>
                <p className="text-slate-500">Cada nota fiscal vem acompanhada do status de entrega na linha do tempo, com fotos e registros dos mantimentos chegando à comunidade beneficiária.</p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200/50 space-y-1">
                <span className="font-bold text-slate-800 block">E se o organizador tentar enviar uma nota fiscal falsa?</span>
                <p className="text-slate-500">Nosso painel de auditoria verifica a validade do XML da Nota Fiscal Eletrônica diretamente com a SEFAZ. Notas duplicadas ou rasuradas são sinalizadas na hora e bloqueiam o organizador.</p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200/50 space-y-1">
                <span className="font-bold text-slate-800 block">Onde vejo os recibos das minhas doações?</span>
                <p className="text-slate-500">Ao logar com o perfil de Doador, você tem acesso ao painel para emitir o PDF/recibo oficial contendo o código de rastreabilidade do lote financeiro.</p>
              </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
