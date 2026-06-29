import React, { useState } from 'react';
import { Campaign, Donation } from '../types';
import { CreditCard, Landmark, QrCode, Clipboard, CheckCircle2, Heart, Copy, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';

interface DonationFlowProps {
  campaign: Campaign;
  onDonationComplete: (amount: number, method: 'PIX' | 'Cartão de Crédito' | 'Boleto') => void;
  onCancel: () => void;
}

export default function DonationFlow({ campaign, onDonationComplete, onCancel }: DonationFlowProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [amount, setAmount] = useState<number>(100);
  const [customAmountInput, setCustomAmountInput] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'PIX' | 'Cartão de Crédito' | 'Boleto'>('PIX');
  
  // Credit card fields
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  
  // Copy feedback
  const [copied, setCopied] = useState(false);

  const suggestedAmounts = [30, 50, 100, 250];

  const handleSelectSuggested = (val: number) => {
    setAmount(val);
    setCustomAmountInput('');
  };

  const handleCustomAmountChange = (val: string) => {
    setCustomAmountInput(val);
    const numeric = parseFloat(val.replace(/\D/g, ''));
    if (!isNaN(numeric)) {
      setAmount(numeric);
    } else {
      setAmount(0);
    }
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (amount <= 0) {
        alert('Por favor, informe um valor válido para doação (mínimo R$ 1,00).');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (paymentMethod === 'Cartão de Crédito') {
        if (!cardNumber || !cardName || !cardExpiry || !cardCvv) {
          alert('Por favor, preencha todos os campos do cartão de crédito fictício para prosseguir.');
          return;
        }
      }
      
      // Complete donation
      onDonationComplete(amount, paymentMethod);
      setStep(3);
    }
  };

  const handleCopyPix = () => {
    setCopied(true);
    navigator.clipboard.writeText('00020126580014BR.GOV.BCB.PIX0136reconstroi-f97316-vale-taquari-rs5204000053039865405' + amount.toFixed(2));
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-xl mx-auto py-8 px-4">
      
      {/* Header and steps indicator */}
      <div className="text-center space-y-4 mb-8">
        <h2 className="text-2xl font-extrabold text-slate-900">Apoiar Campanha Emergencial</h2>
        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider truncate">
          {campaign.title}
        </p>

        {/* Dynamic visual step bubbles */}
        <div className="flex items-center justify-center gap-4 pt-2">
          <div className="flex items-center gap-1.5">
            <span className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
              step >= 1 ? 'bg-orange-500 text-white' : 'bg-slate-200 text-slate-600'
            }`}>1</span>
            <span className="text-xs font-semibold text-slate-800 hidden sm:inline">Valor</span>
          </div>
          <div className="w-10 h-0.5 bg-slate-200" />
          <div className="flex items-center gap-1.5">
            <span className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
              step >= 2 ? 'bg-orange-500 text-white' : 'bg-slate-200 text-slate-600'
            }`}>2</span>
            <span className="text-xs font-semibold text-slate-800 hidden sm:inline">Pagamento</span>
          </div>
          <div className="w-10 h-0.5 bg-slate-200" />
          <div className="flex items-center gap-1.5">
            <span className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
              step >= 3 ? 'bg-orange-500 text-white' : 'bg-slate-200 text-slate-600'
            }`}>3</span>
            <span className="text-xs font-semibold text-slate-800 hidden sm:inline">Confirmação</span>
          </div>
        </div>
      </div>

      {/* CORE FLOW BODY */}
      <div className="glass-card border border-white/60 p-6 sm:p-8 rounded-3xl shadow-xl space-y-6">
        
        {/* STEP 1: VALUE SELECT */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="space-y-3 text-center">
              <span className="text-xs font-bold text-orange-500 uppercase block tracking-wider">Quanto deseja doar?</span>
              <p className="text-xs text-slate-500">Cada contribuição ajuda a adquirir suprimentos vitais auditados.</p>
            </div>

            {/* Suggested Buttons Grid */}
            <div className="grid grid-cols-2 gap-3">
              {suggestedAmounts.map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleSelectSuggested(val)}
                  className={`p-4 rounded-xl text-center font-bold font-mono transition-all border cursor-pointer flex flex-col items-center justify-center gap-1 ${
                    amount === val && !customAmountInput
                      ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/10'
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                >
                  <span className="text-lg">R$ {val}</span>
                  <span className="text-[9px] font-sans font-medium text-slate-400">
                    {val === 30 ? 'Kit Higiene' : val === 50 ? 'Cesta Básica' : val === 100 ? 'Cobertores de Lã' : 'Telhas de Apoio'}
                  </span>
                </button>
              ))}
            </div>

            {/* Custom Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">Outro Valor (R$)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400 font-mono text-sm">R$</span>
                <input
                  type="text"
                  placeholder="Informe o valor customizado"
                  value={customAmountInput}
                  onChange={(e) => handleCustomAmountChange(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-300 bg-white text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                />
              </div>
              <span className="text-[10px] text-slate-400 block leading-tight">
                Seu repasse será integralmente depositado na conta de garantia para compras comprovadas de insumos emergenciais.
              </span>
            </div>

            {/* Navigation buttons */}
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 py-3 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all text-center cursor-pointer"
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                className="flex-1 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-orange-500/10"
              >
                <span>Escolher Pagamento</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: METHOD SELECTION & INPUT FIELDS */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center space-y-1">
              <span className="text-xs font-bold text-orange-500 uppercase block tracking-wider">Forma de Pagamento</span>
              <span className="text-sm font-mono font-black text-slate-900 block">
                Valor Escolhido: R$ {amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>

            {/* Payment Method selector buttons */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('PIX')}
                className={`py-3 px-2 rounded-xl border text-center font-bold text-xs transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                  paymentMethod === 'PIX'
                    ? 'border-orange-500 bg-orange-50 text-orange-600'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                }`}
              >
                <QrCode size={18} />
                <span>PIX</span>
              </button>
              
              <button
                type="button"
                onClick={() => setPaymentMethod('Cartão de Crédito')}
                className={`py-3 px-2 rounded-xl border text-center font-bold text-xs transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                  paymentMethod === 'Cartão de Crédito'
                    ? 'border-orange-500 bg-orange-50 text-orange-600'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                }`}
              >
                <CreditCard size={18} />
                <span>Cartão</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('Boleto')}
                className={`py-3 px-2 rounded-xl border text-center font-bold text-xs transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                  paymentMethod === 'Boleto'
                    ? 'border-orange-500 bg-orange-50 text-orange-600'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                }`}
              >
                <Landmark size={18} />
                <span>Boleto</span>
              </button>
            </div>

            {/* METHOD DETAILS CONTAINER */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 min-h-[180px] flex flex-col justify-center">
              
              {/* PIX AREA */}
              {paymentMethod === 'PIX' && (
                <div className="space-y-4 text-center">
                  <div className="w-32 h-32 bg-white p-2 rounded-xl border border-slate-200 mx-auto flex items-center justify-center">
                    {/* SVG generated mockup QR code */}
                    <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900">
                      <rect width="100" height="100" fill="white" />
                      <path d="M5,5 h20 v20 h-20 z M55,5 h20 v20 h-20 z M5,55 h20 v20 h-20 z" fill="currentColor" />
                      <path d="M10,10 h10 v10 h-10 z M60,10 h10 v10 h-10 z M10,60 h10 v10 h-10 z" fill="white" />
                      <path d="M35,15 h10 v10 h-10 z M35,45 h20 v10 h-20 z M15,35 h15 v10 h-15 z M65,45 h15 v10 h-15 z" fill="currentColor" />
                      <path d="M45,65 h15 v15 h-15 z M65,65 h15 v15 h-15 z M5,35 h5 v5 h-5 z" fill="currentColor" />
                    </svg>
                  </div>
                  
                  <div className="space-y-1.5">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold leading-none">Chave PIX Copia e Cola</span>
                    <button
                      type="button"
                      onClick={handleCopyPix}
                      className="inline-flex items-center justify-between w-full max-w-xs gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-mono text-slate-600 hover:text-slate-900 transition-colors mx-auto"
                    >
                      <span className="truncate">reconstroi.pix.vale-taquari-rs-{amount.toFixed(0)}</span>
                      {copied ? (
                        <span className="text-emerald-600 font-bold text-[10px]">Copiado!</span>
                      ) : (
                        <Clipboard size={14} className="text-slate-400" />
                      )}
                    </button>
                    <span className="text-[10px] text-slate-400 block leading-normal">
                      Aponte a câmera do seu banco ou copie a chave. Pagamento simulado com confirmação imediata.
                    </span>
                  </div>
                </div>
              )}

              {/* CREDIT CARD AREA */}
              {paymentMethod === 'Cartão de Crédito' && (
                <div className="space-y-3">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Dados do Cartão (Simulação)</span>
                  
                  <div className="space-y-2 text-xs">
                    <input
                      type="text"
                      placeholder="Nome Impresso no Cartão"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                    />

                    <input
                      type="text"
                      placeholder="Número do Cartão: 0000 0000 0000 0000"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white font-mono"
                    />

                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Validade: MM/AA"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="px-3 py-2 rounded-lg border border-slate-200 bg-white font-mono"
                      />
                      <input
                        type="text"
                        placeholder="CVV"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="px-3 py-2 rounded-lg border border-slate-200 bg-white font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* BOLETO AREA */}
              {paymentMethod === 'Boleto' && (
                <div className="space-y-3 text-center">
                  <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 mx-auto">
                    <Landmark size={24} />
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-800 block">Boleto Bancário Fictício</span>
                    <span className="text-[10px] text-slate-400 block max-w-xs mx-auto font-mono">
                      Código de Barras: <br />
                      34191.79001 01043.513184 91020.150008 7 90000000{amount.toFixed(0)}
                    </span>
                    <span className="text-[10px] text-emerald-600 block font-semibold">
                      Disponível para emissão imediata pós-clique.
                    </span>
                  </div>
                </div>
              )}

            </div>

            {/* Navigation buttons */}
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 py-3 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all text-center cursor-pointer"
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                className="flex-1 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
              >
                <span>Confirmar & Gerar Recibo</span>
                <CheckCircle2 size={14} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: SUCCESS CONFIRMATION */}
        {step === 3 && (
          <div className="space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 size={36} />
            </div>

            <div className="space-y-2">
              <h3 className="font-extrabold text-slate-900 text-xl leading-tight">Doação Confirmada com Sucesso!</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                Excelente! A equipe do <strong>Reconstrói</strong> homologou seu repasse fictício de <strong>R$ {amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong> para a campanha.
              </p>
            </div>

            {/* Simulated instant certificate snippet */}
            <div className="p-4 bg-slate-900 text-slate-100 rounded-2xl border border-slate-800 text-left font-mono space-y-2 text-[10px]">
              <div className="flex justify-between text-orange-400 font-bold border-b border-slate-800 pb-1.5">
                <span>RECONSTRÓI LEDGER</span>
                <span>ID: CONF-{Math.floor(Math.random() * 90000 + 10000)}</span>
              </div>
              <div className="grid grid-cols-2 gap-1 text-slate-300">
                <span>Beneficiário:</span>
                <span className="text-right font-bold truncate">{campaign.title}</span>
                <span>Doador:</span>
                <span className="text-right">Apoiador(a) Voluntário</span>
                <span>Validação:</span>
                <span className="text-right text-emerald-400 font-bold">100% AUDITADO</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={onCancel}
                className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs tracking-wider transition-all uppercase cursor-pointer"
              >
                Voltar às Campanhas
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
