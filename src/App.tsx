import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import LandingPage from './components/LandingPage';
import LoginScreen from './components/LoginScreen';
import DonorDashboard from './components/DonorDashboard';
import CampaignDetails from './components/CampaignDetails';
import DonationFlow from './components/DonationFlow';
import OrganizerDashboard from './components/OrganizerDashboard';
import AuditorDashboard from './components/AuditorDashboard';
import AdminDashboard from './components/AdminDashboard';

import { Campaign, Donation, SupportTicket, PlatformConfig, User, UserRole } from './types';
import { mockCampaigns, mockDonations, mockTickets, mockUsers, mockPlatformConfig } from './mockData';
import { HelpCircle, Sparkles, X, ShieldAlert } from 'lucide-react';

export default function App() {
  // Centralized persistent states
  const [campaigns, setCampaigns] = useState<Campaign[]>(() => {
    const saved = localStorage.getItem('reconstroi_campaigns');
    return saved ? JSON.parse(saved) : mockCampaigns;
  });

  const [donations, setDonations] = useState<Donation[]>(() => {
    const saved = localStorage.getItem('reconstroi_donations');
    return saved ? JSON.parse(saved) : mockDonations;
  });

  const [tickets, setTickets] = useState<SupportTicket[]>(() => {
    const saved = localStorage.getItem('reconstroi_tickets');
    return saved ? JSON.parse(saved) : mockTickets;
  });

  const [config, setConfig] = useState<PlatformConfig>(() => {
    const saved = localStorage.getItem('reconstroi_config');
    return saved ? JSON.parse(saved) : mockPlatformConfig;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('reconstroi_users');
    return saved ? JSON.parse(saved) : mockUsers;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('reconstroi_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Navigation router screen state
  const [activeScreen, setActiveScreen] = useState<string>(() => {
    const saved = localStorage.getItem('reconstroi_active_screen');
    return saved ? saved : 'landing';
  });

  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(() => {
    return localStorage.getItem('reconstroi_selected_campaign_id');
  });

  // Synchronize to localStorage
  useEffect(() => {
    localStorage.setItem('reconstroi_campaigns', JSON.stringify(campaigns));
  }, [campaigns]);

  useEffect(() => {
    localStorage.setItem('reconstroi_donations', JSON.stringify(donations));
  }, [donations]);

  useEffect(() => {
    localStorage.setItem('reconstroi_tickets', JSON.stringify(tickets));
  }, [tickets]);

  useEffect(() => {
    localStorage.setItem('reconstroi_config', JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    localStorage.setItem('reconstroi_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('reconstroi_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('reconstroi_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('reconstroi_active_screen', activeScreen);
  }, [activeScreen]);

  useEffect(() => {
    if (selectedCampaignId) {
      localStorage.setItem('reconstroi_selected_campaign_id', selectedCampaignId);
    } else {
      localStorage.removeItem('reconstroi_selected_campaign_id');
    }
  }, [selectedCampaignId]);

  // Handle Login & Redirect correctly to corresponding user role dashboard
  const handleLoginSuccess = (email: string, role: UserRole) => {
    const userMatch = users.find(u => u.email === email) || {
      id: 'usr-' + Date.now(),
      name: email.split('@')[0].toUpperCase(),
      email: email,
      role: role,
      verified: true
    };

    setCurrentUser(userMatch);

    // Redirect corresponding dashboard
    if (role === 'Doador') {
      setActiveScreen('donor-panel');
    } else if (role === 'Organizador') {
      setActiveScreen('organizer-panel');
    } else if (role === 'Suporte') {
      setActiveScreen('auditor-panel');
    } else if (role === 'Administrador') {
      setActiveScreen('admin-panel');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveScreen('landing');
  };

  // Donation Complete callback - updates campaign amount & global stats
  const handleDonationComplete = (amount: number, method: 'PIX' | 'Cartão de Crédito' | 'Boleto') => {
    if (!selectedCampaignId) return;

    // Create donation
    const newDonation: Donation = {
      id: 'don-' + Math.floor(Math.random() * 900000 + 100000),
      campaignId: selectedCampaignId,
      campaignTitle: campaigns.find(c => c.id === selectedCampaignId)?.title || 'Campanha',
      donorName: currentUser ? currentUser.name : 'Doador Anônimo',
      donorEmail: currentUser ? currentUser.email : 'anonimo@reconstroi.com',
      amount: amount,
      paymentMethod: method,
      date: new Date().toISOString(),
      status: 'Confirmada'
    };

    // Update donations
    setDonations(prev => [newDonation, ...prev]);

    // Update campaign metrics
    setCampaigns(prevCampaigns => prevCampaigns.map(c => {
      if (c.id === selectedCampaignId) {
        return {
          ...c,
          collectedAmount: c.collectedAmount + amount,
          donorsCount: c.donorsCount + 1
        };
      }
      return c;
    }));

    // Update global config total numbers
    setConfig(prevConfig => ({
      ...prevConfig,
      totalDonatedGlobal: prevConfig.totalDonatedGlobal + amount,
      totalPeopleHelped: prevConfig.totalPeopleHelped + 2 // Assume 2 more helped per donation average
    }));
  };

  const navigateToScreen = (screen: string, campaignId?: string) => {
    if (campaignId) {
      setSelectedCampaignId(campaignId);
    }
    setActiveScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Helper reset demo
  const handleResetDemoData = () => {
    const conf = window.confirm('Deseja realmente redefinir todos os dados fictícios para os valores iniciais da demonstração?');
    if (!conf) return;
    localStorage.clear();
    setCampaigns(mockCampaigns);
    setDonations(mockDonations);
    setTickets(mockTickets);
    setConfig(mockPlatformConfig);
    setUsers(mockUsers);
    setCurrentUser(null);
    setActiveScreen('landing');
    setSelectedCampaignId(null);
  };

  const activeCampaignDetails = campaigns.find(c => c.id === selectedCampaignId) || campaigns[0];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-orange-200">
      
      {/* Floating Demo Reset Indicator */}
      <div className="bg-slate-900 text-slate-300 px-4 py-2 text-xs flex justify-between items-center border-b border-slate-800">
        <div className="flex items-center gap-1.5 truncate">
          <span className="w-2.5 h-2.5 bg-orange-500 rounded-full animate-ping"></span>
          <span><strong>Ambiente Demonstrativo (Auditável):</strong> Sinta-se livre para simular e doar nas abas!</span>
        </div>
        <button
          onClick={handleResetDemoData}
          className="text-[10px] font-bold text-orange-400 hover:text-orange-300 underline shrink-0 cursor-pointer pl-2"
        >
          Resetar Banco de Dados Fictício
        </button>
      </div>

      {/* Global Header Navigation */}
      <Header 
        currentUser={currentUser}
        onLogout={handleLogout}
        onNavigate={navigateToScreen}
        onOpenLogin={() => navigateToScreen('login')}
      />

      {/* Primary Workspace Stage wrapper */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* LANDING SCREEN */}
        {activeScreen === 'landing' && (
          <LandingPage 
            campaigns={campaigns}
            onSelectCampaign={(id) => navigateToScreen('campaign-detail', id)}
            onDonateDirect={(id) => navigateToScreen('donation-flow', id)}
            globalStats={config}
          />
        )}

        {/* LOGIN SCREEN */}
        {activeScreen === 'login' && (
          <LoginScreen 
            onLoginSuccess={handleLoginSuccess}
            onNavigateHome={() => navigateToScreen('landing')}
          />
        )}

        {/* CAMPAIGN DETAILS */}
        {activeScreen === 'campaign-detail' && activeCampaignDetails && (
          <CampaignDetails 
            campaign={activeCampaignDetails}
            onGoBack={() => navigateToScreen('landing')}
            onDonate={(id) => navigateToScreen('donation-flow', id)}
          />
        )}

        {/* CHECKOUT DONATION FLOW */}
        {activeScreen === 'donation-flow' && activeCampaignDetails && (
          <DonationFlow 
            campaign={activeCampaignDetails}
            onCancel={() => navigateToScreen('campaign-detail', selectedCampaignId || undefined)}
            onDonationComplete={handleDonationComplete}
          />
        )}

        {/* DONOR DASHBOARD */}
        {activeScreen === 'donor-panel' && currentUser && (
          <DonorDashboard 
            donations={donations}
            campaigns={campaigns}
            donorEmail={currentUser.email}
            donorName={currentUser.name}
            onNavigateToCampaign={(id) => navigateToScreen('campaign-detail', id)}
          />
        )}

        {/* ORGANIZER DASHBOARD */}
        {activeScreen === 'organizer-panel' && currentUser && (
          <OrganizerDashboard 
            campaigns={campaigns}
            organizerName={currentUser.name}
            organizerId={currentUser.id}
            onUpdateCampaigns={setCampaigns}
          />
        )}

        {/* AUDITOR / SUPPORT DASHBOARD */}
        {activeScreen === 'auditor-panel' && currentUser && (
          <AuditorDashboard 
            campaigns={campaigns}
            tickets={tickets}
            onUpdateCampaigns={setCampaigns}
            onUpdateTickets={setTickets}
          />
        )}

        {/* ADMIN ROOT DASHBOARD */}
        {activeScreen === 'admin-panel' && currentUser && (
          <AdminDashboard 
            campaigns={campaigns}
            donations={donations}
            config={config}
            users={users}
            onUpdateCampaigns={setCampaigns}
            onUpdateDonations={setDonations}
            onUpdateConfig={setConfig}
            onUpdateUsers={setUsers}
          />
        )}

      </main>

      {/* Global Footer */}
      <Footer />

    </div>
  );
}
