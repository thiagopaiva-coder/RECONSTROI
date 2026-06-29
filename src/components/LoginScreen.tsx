import React, { useState } from 'react';
import { ShieldCheck, User, ShieldAlert, Key, Sparkles, AlertCircle } from 'lucide-react';
import { UserRole } from '../types';

interface LoginScreenProps {
  onLoginSuccess: (email: string, role: UserRole) => void;
  onNavigateHome: () => void;
}

export default function LoginScreen({ onLoginSuccess, onNavigateHome }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Por favor, informe seu e-mail.');
      return;
    }
    if (!password) {
      setError('Por favor, informe sua senha.');
      return;
    }

    setLoading(true);
    
    // Simulate slight loading delay for premium feel
    setTimeout(() => {
      setLoading(false);
      const normalizedEmail = email.toLowerCase().trim();
      
      if (normalizedEmail === 'doador@reconstroi.com' && password === '123456') {
        onLoginSuccess(normalizedEmail, 'Doador');
      } else if (normalizedEmail === 'organizador@reconstroi.com' && password === '123456') {
        onLoginSuccess(normalizedEmail, 'Organizador');
      } else if (normalizedEmail === 'suporte@reconstroi.com' && password === '123456') {
        onLoginSuccess(normalizedEmail, 'Suporte');
      } else if (normalizedEmail === 'admin@reconstroi.com' && password === '123456') {
        onLoginSuccess(normalizedEmail, 'Administrador');
      } else {
        // Fallback or custom users
        if (password === '123456') {
          // If they typed something else but used the test password, let them enter as Doador by default
          onLoginSuccess(normalizedEmail, 'Doador');
        } else {
          setError('Credenciais incorretas para demonstração. Use o card de Acesso Rápido abaixo!');
        }
      }
    }, 500);
  };

  const handleQuickAccess = (demoEmail: string, role: UserRole) => {
    setEmail(demoEmail);
    setPassword('123456');
    setError('');
    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess(demoEmail, role);
    }, 400);
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4 space-y-8">
      
      {/* FORM CARD */}
      <div className="glass-card border border-white/60 p-8 rounded-3xl shadow-xl space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white font-extrabold text-2xl flex items-center justify-center mx-auto shadow-md">
            R
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Entrar no Reconstrói</h2>
          <p className="text-xs text-slate-500">Insira suas credenciais para gerenciar suas atividades</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 text-xs p-3 rounded-xl border border-red-200 flex items-start gap-2">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 block">Endereço de E-mail</label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                placeholder="exemplo@reconstroi.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white/80 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-slate-700">Senha de Acesso</label>
              <a 
                href="#forgot" 
                onClick={(e) => { e.preventDefault(); alert('Em ambiente de demonstração, use a senha padrão: 123456'); }}
                className="text-[11px] text-orange-600 hover:underline font-semibold"
              >
                Esqueci minha senha
              </a>
            </div>
            <div className="relative">
              <Key size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white/80 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm tracking-wide shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <span>Entrar na Plataforma</span>
            )}
          </button>
        </form>

        <div className="text-center">
          <button 
            type="button"
            onClick={onNavigateHome}
            className="text-xs text-slate-500 hover:text-slate-800 transition-colors"
          >
            ← Voltar para a página inicial
          </button>
        </div>

      </div>

      {/* QUICK ACCESS / SHORTCUTS DEMO CARD */}
      <div className="bg-slate-900 text-slate-100 p-6 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center gap-2 text-orange-500">
          <Sparkles size={18} className="animate-pulse" />
          <h3 className="font-bold text-sm uppercase tracking-wider text-slate-200">
            Acesso Rápido (ambiente de demo)
          </h3>
        </div>
        
        <p className="text-xs text-slate-400 leading-relaxed">
          Para facilitar a sua avaliação de todos os perfis e funcionalidades, clique em um dos botões abaixo para realizar o login instantâneo:
        </p>

        <div className="grid grid-cols-2 gap-2 pt-2">
          
          <button
            onClick={() => handleQuickAccess('doador@reconstroi.com', 'Doador')}
            className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700/60 transition-all text-left space-y-1 group"
          >
            <span className="text-xs font-bold text-white block group-hover:text-orange-400 transition-colors">1. Doador</span>
            <span className="text-[10px] text-slate-400 block truncate">doador@reconstroi.com</span>
            <span className="text-[9px] font-mono text-slate-500 block">Senha: 123456</span>
          </button>

          <button
            onClick={() => handleQuickAccess('organizador@reconstroi.com', 'Organizador')}
            className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700/60 transition-all text-left space-y-1 group"
          >
            <span className="text-xs font-bold text-white block group-hover:text-orange-400 transition-colors">2. Organizador</span>
            <span className="text-[10px] text-slate-400 block truncate">organizador@reconstroi.com</span>
            <span className="text-[9px] font-mono text-slate-500 block">Senha: 123456</span>
          </button>

          <button
            onClick={() => handleQuickAccess('suporte@reconstroi.com', 'Suporte')}
            className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700/60 transition-all text-left space-y-1 group"
          >
            <span className="text-xs font-bold text-white block group-hover:text-orange-400 transition-colors">3. Auditoria</span>
            <span className="text-[10px] text-slate-400 block truncate">suporte@reconstroi.com</span>
            <span className="text-[9px] font-mono text-slate-500 block">Senha: 123456</span>
          </button>

          <button
            onClick={() => handleQuickAccess('admin@reconstroi.com', 'Administrador')}
            className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700/60 transition-all text-left space-y-1 group"
          >
            <span className="text-xs font-bold text-white block group-hover:text-orange-400 transition-colors">4. Administrador</span>
            <span className="text-[10px] text-slate-400 block truncate">admin@reconstroi.com</span>
            <span className="text-[9px] font-mono text-slate-500 block">Senha: 123456</span>
          </button>

        </div>

        <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 text-[10px] text-center text-slate-500 font-mono">
          🔓 Senha universal para todos os perfis: <span className="text-white font-bold">123456</span>
        </div>
      </div>

    </div>
  );
}
