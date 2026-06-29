import React, { useState } from 'react';
import { User, LogIn, LogOut, Shield, LayoutDashboard, Menu, X, Landmark } from 'lucide-react';
import { UserRole, User as UserType } from '../types';

interface HeaderProps {
  currentUser: UserType | null;
  onLogout: () => void;
  onNavigate: (screen: string, campaignId?: string) => void;
  onOpenLogin: () => void;
}

export default function Header({ currentUser, onLogout, onNavigate, onOpenLogin }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (screen: string, arg?: string) => {
    onNavigate(screen, arg);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-slate-200/50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleNav('landing')}>
            <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-orange-500/20">
              R
            </div>
            <div>
              <span className="font-extrabold text-xl text-slate-900 tracking-tight block leading-none">RECONSTRÓI</span>
              <span className="text-[10px] text-slate-500 font-mono tracking-wider block uppercase">Apoio Auditável</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => handleNav('landing')}
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Campanhas
            </button>
            <button
              onClick={() => {
                // Scroll or direct
                const el = document.getElementById('como-funciona');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' });
                } else {
                  handleNav('landing');
                }
              }}
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Como Funciona
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('estatisticas');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' });
                } else {
                  handleNav('landing');
                }
              }}
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Auditoria & Selos
            </button>
          </nav>

          {/* Right Controls */}
          <div className="hidden md:flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-3">
                {/* Dashboard Shortcut button */}
                <button
                  onClick={() => {
                    if (currentUser.role === 'Doador') handleNav('donor-panel');
                    else if (currentUser.role === 'Organizador') handleNav('organizer-panel');
                    else if (currentUser.role === 'Suporte') handleNav('auditor-panel');
                    else if (currentUser.role === 'Administrador') handleNav('admin-panel');
                  }}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition-all"
                >
                  <LayoutDashboard size={14} />
                  <span>Painel ({currentUser.role})</span>
                </button>

                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium">
                  <User size={14} className="text-slate-500" />
                  <span>{currentUser.name.split(' ')[0]}</span>
                </div>

                <button
                  onClick={onLogout}
                  title="Sair"
                  className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-red-600 transition-colors"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenLogin}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all"
                >
                  <LogIn size={16} />
                  <span>Entrar</span>
                </button>
                <button
                  onClick={() => handleNav('login', 'root-admin')}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-500 border border-slate-300 hover:text-slate-900 hover:border-slate-500 rounded-xl transition-all"
                  id="admin-btn-header"
                >
                  <Shield size={14} className="text-slate-400" />
                  <span>Painel Administrativo</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Hamburguer Menu */}
          <div className="flex md:hidden items-center gap-2">
            {currentUser && (
              <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-700 font-medium">
                {currentUser.name.split(' ')[0]}
              </span>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl hover:bg-slate-100 text-slate-700 transition-colors"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-b border-slate-200/50 p-4 space-y-4">
          <nav className="flex flex-col gap-3">
            <button
              onClick={() => handleNav('landing')}
              className="text-left py-2 text-sm font-medium text-slate-700 hover:text-slate-900"
            >
              Campanhas
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                const el = document.getElementById('como-funciona');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-left py-2 text-sm font-medium text-slate-700 hover:text-slate-900"
            >
              Como Funciona
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                const el = document.getElementById('estatisticas');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-left py-2 text-sm font-medium text-slate-700 hover:text-slate-900"
            >
              Auditoria & Selos
            </button>
          </nav>

          <hr className="border-slate-200" />

          <div className="flex flex-col gap-2 pt-2">
            {currentUser ? (
              <>
                <button
                  onClick={() => {
                    if (currentUser.role === 'Doador') handleNav('donor-panel');
                    else if (currentUser.role === 'Organizador') handleNav('organizer-panel');
                    else if (currentUser.role === 'Suporte') handleNav('auditor-panel');
                    else if (currentUser.role === 'Administrador') handleNav('admin-panel');
                  }}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold"
                >
                  <LayoutDashboard size={16} />
                  <span>Ir para o Painel ({currentUser.role})</span>
                </button>
                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50"
                >
                  <LogOut size={16} />
                  <span>Sair da Conta</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    onOpenLogin();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 transition-all"
                >
                  <LogIn size={16} />
                  <span>Entrar / Login</span>
                </button>
                <button
                  onClick={() => {
                    handleNav('login', 'root-admin');
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50"
                >
                  <Shield size={16} className="text-slate-500" />
                  <span>Painel Administrativo</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
