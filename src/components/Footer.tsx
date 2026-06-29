import React from 'react';
import { ShieldCheck, Heart, Mail, Phone, Landmark, Lock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 py-12 border-t border-slate-900 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Col 1: Brand & Purpose */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-white font-extrabold text-base">
                R
              </div>
              <span className="font-extrabold text-lg text-white tracking-tight uppercase">RECONSTRÓI</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Arrecadação ágil e 100% auditável para desastres e crises humanitárias. Unimos tecnologia e prestação de contas documental em tempo real.
            </p>
            <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
              <Lock size={12} className="text-emerald-500" />
              <span>Conexão SSL Segura • Gateway Criptografado</span>
            </div>
          </div>

          {/* Col 2: Institucional */}
          <div>
            <h3 className="text-xs font-semibold text-white tracking-wider uppercase mb-4">Sobre Nós</h3>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#como-funciona" className="hover:text-orange-400 transition-colors">Como funciona a auditoria</a></li>
              <li><a href="#estatisticas" className="hover:text-orange-400 transition-colors">Estatísticas globais</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Termos de Uso e Privacidade</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Perguntas Frequentes (FAQ)</a></li>
            </ul>
          </div>

          {/* Col 3: Transparência & Certificação */}
          <div>
            <h3 className="text-xs font-semibold text-white tracking-wider uppercase mb-4">Metas e Auditoria</h3>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-emerald-500" />
                <span>Selo "Campanha Verificada"</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Landmark size={14} className="text-orange-500" />
                <span>Integração PIX Instantâneo</span>
              </li>
              <li>
                <span className="text-[11px] block text-slate-500 mt-1">
                  Todos os repasses exigem nota fiscal homologada anexada publicamente para consulta direta do doador.
                </span>
              </li>
            </ul>
          </div>

          {/* Col 4: Contato & Urgência */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-white tracking-wider uppercase">Fale Conosco</h3>
            <p className="text-xs text-slate-400">
              Para parcerias governamentais, Defesa Civil Estadual ou ONGs registradas:
            </p>
            <div className="space-y-1.5 text-xs text-slate-300 font-mono">
              <div className="flex items-center gap-2">
                <Mail size={12} className="text-slate-400" />
                <span>emergencia@reconstroi.com.br</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={12} className="text-slate-400" />
                <span>0800 591 0422 (24/7)</span>
              </div>
            </div>
          </div>
        </div>

        <hr className="border-slate-900 my-6" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 Reconstrói Plataforma de Impacto Social Ltda. CNPJ: 45.102.394/0001-09</p>
          <p className="flex items-center gap-1">
            Feito com <Heart size={12} className="text-red-500 fill-red-500" /> para mitigar impactos climáticos no Brasil.
          </p>
        </div>
      </div>
    </footer>
  );
}
