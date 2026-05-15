/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import VolunteerList from './components/VolunteerList';
import CalendarView from './components/CalendarView';
import AvailabilityForm from './components/AvailabilityForm';
import Reports from './components/Reports';
import Home from './components/Home';
import MyScales from './components/MyScales';
import BottomNav from './components/BottomNav';
import { Volunteer, ChurchEvent, Assignment, Ministry, MINISTRY_REQUIREMENTS, getMinistryRequirement } from './types';
import { autoSchedule } from './services/schedulingService';
import { subDays, subHours, addDays, format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { 
  Home as HomeIcon, 
  Calendar, 
  Users, 
  LayoutDashboard, 
  User, 
  Church, 
  Star, 
  Bell, 
  X,
  PlusCircle,
  Clock,
  Lock,
  Eye,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import NotificationCenter from './components/NotificationCenter';
import { Notification } from './types';
import SplashScreen from './components/SplashScreen';
import OfficialLogo from './components/OfficialLogo';

const INITIAL_VOLUNTEERS: Volunteer[] = [
  { id: '1', name: 'João Silva', phone: '11999999999', ministries: ['MÍDIA', 'CAPITÃO'], primaryRole: 'Líder', availableDates: [], lastServedAt: subDays(new Date(), 5).toISOString() },
  { id: '2', name: 'Maria Santos', phone: '11888888888', ministries: ['KIDS', 'COZINHA'], primaryRole: 'Monitora', availableDates: [], lastServedAt: subDays(new Date(), 45).toISOString() },
  { id: '3', name: 'Pedro Souza', phone: '11777777777', ministries: ['MÍDIA'], primaryRole: 'Som', availableDates: [], lastServedAt: subDays(new Date(), 10).toISOString() },
  { id: '4', name: 'Ana Oliveira', phone: '11666666666', ministries: ['APOIO TEMPLO'], primaryRole: 'Recepção', availableDates: [], lastServedAt: subDays(new Date(), 60).toISOString() },
  { id: '5', name: 'Marcos Lima', phone: '11555555555', ministries: ['ESTACIONAMENTO'], primaryRole: 'Equipe', availableDates: [], lastServedAt: undefined },
  { id: '6', name: 'Dani Sales', phone: '11988887777', ministries: ['RECEPÇÃO', 'MÍDIA'], primaryRole: 'Líder', availableDates: [], lastServedAt: subDays(new Date(), 2).toISOString() },
  { id: '7', name: 'Clara Nunes', phone: '11333333333', ministries: ['KIDS'], primaryRole: 'Professora', availableDates: [], lastServedAt: subDays(new Date(), 15).toISOString() },
];

const generateInitialEvents = (): ChurchEvent[] => {
  const events: ChurchEvent[] = [];
  const start = startOfMonth(new Date());
  const end = endOfMonth(new Date());
  
  const days = eachDayOfInterval({ start, end });
  
  days.forEach((day, index) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    const isFirstSun = day.getDay() === 0 && day.getDate() <= 7;
    
    if (day.getDay() === 0) { // Sunday
      events.push({
        id: `e-sun-${index}`,
        title: isFirstSun ? 'Santa Ceia' : 'Culto de Domingo',
        date: dateStr,
        time: '18:00',
        arrivalTime: '17:00',
        type: 'recurrent',
        status: 'published',
        teamsNeeded: Object.keys(MINISTRY_REQUIREMENTS).sort((a, b) => {
          if (a === 'CAPITÃO') return -1;
          if (b === 'CAPITÃO') return 1;
          return 0;
        }) as Ministry[]
      });
    } else if (day.getDay() === 3) { // Wednesday
      events.push({
        id: `e-wed-${index}`,
        title: 'Culto de Quarta-feira',
        date: dateStr,
        time: '20:00',
        arrivalTime: '19:00',
        type: 'recurrent',
        status: 'published',
        teamsNeeded: Object.keys(MINISTRY_REQUIREMENTS).sort((a, b) => {
          if (a === 'CAPITÃO') return -1;
          if (b === 'CAPITÃO') return 1;
          return 0;
        }) as Ministry[]
      });
    }
  });

  // Add special events
  const specialEvents: ChurchEvent[] = [
    {
      id: `e-special-1`,
      title: 'Conferência de Impacto',
      date: format(addDays(new Date(), 10), 'yyyy-MM-dd'),
      time: '19:00',
      arrivalTime: '18:00',
      type: 'special',
      status: 'published',
      description: 'Grande conferência anual da igreja.',
      teamsNeeded: Object.keys(MINISTRY_REQUIREMENTS) as Ministry[]
    },
    {
      id: `e-special-2`,
      title: 'Vigília dos Adoradores',
      date: format(addDays(new Date(), 3), 'yyyy-MM-dd'),
      time: '23:00',
      arrivalTime: '22:00',
      type: 'special',
      status: 'published',
      description: 'Uma noite de clamor e adoração profunda.',
      teamsNeeded: ['RECEPÇÃO', 'CAPITÃO', 'MÍDIA', 'ESTACIONAMENTO']
    },
    {
      id: `e-special-3`,
      title: 'Chá de Mulheres',
      date: format(addDays(new Date(), 15), 'yyyy-MM-dd'),
      time: '16:00',
      arrivalTime: '15:00',
      type: 'special',
      status: 'published',
      description: 'Encontro trimestral das mulheres CJPP.',
      teamsNeeded: ['RECEPÇÃO', 'COZINHA', 'MÍDIA', 'KIDS']
    }
  ];

  events.push(...specialEvents);

  return events;
}

const INITIAL_EVENTS: ChurchEvent[] = generateInitialEvents();

import AdminLogin from './components/admin/AdminLogin';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminMinistryView from './components/admin/AdminMinistryView';
import AdminScaleView from './components/admin/AdminScaleView';
import AdminVolunteersView from './components/admin/AdminVolunteersView';
import AdminNotificationsView from './components/admin/AdminNotificationsView';
import AdminReportsView from './components/admin/AdminReportsView';
import { AdminUser } from './types';

export default function App() {
  const [activeTab, setActiveTab] = React.useState('home');
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = React.useState(false);
  const [showAdminLogin, setShowAdminLogin] = React.useState(false);
  const [adminActiveTab, setAdminActiveTab] = React.useState('dashboard');
  const [loginName, setLoginName] = React.useState('');
  const [loginPhone, setLoginPhone] = React.useState('');
  const [currentUserId, setCurrentUserId] = React.useState<string | null>(null);
  const [showSplash, setShowSplash] = React.useState(true);
  const [adminError, setAdminError] = React.useState('');

  const [currentAdmin, setCurrentAdmin] = React.useState<AdminUser | null>(null);

  React.useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const [notifications, setNotifications] = React.useState<Notification[]>([
    {
      id: 'n1',
      title: 'Você está escalado amanhã!',
      message: 'Olá Dani, lembre de chegar às 18:00 para o Culto de Celebração.',
      date: new Date().toISOString(),
      read: false,
      type: 'reminder'
    },
    {
      id: 'n2',
      title: 'Equipe em 3 horas',
      message: 'Sua equipe de Recepção deve chegar em 3 horas para o início das atividades.',
      date: subHours(new Date(), 1).toISOString(),
      read: false,
      type: 'reminder'
    },
    {
      id: 'n3',
      title: 'Escala Confirmada',
      message: 'Obrigado por confirmar sua presença no Culto de Domingo. Deus abençoe!',
      date: subDays(new Date(), 1).toISOString(),
      read: true,
      type: 'confirmation'
    }
  ]);
  const [isNotificationsOpen, setIsNotificationsOpen] = React.useState(false);

  // App State
  const [volunteers, setVolunteers] = React.useState<Volunteer[]>(INITIAL_VOLUNTEERS);
  const [events, setEvents] = React.useState<ChurchEvent[]>(INITIAL_EVENTS);
  const [assignments, setAssignments] = React.useState<Assignment[]>([
    {
      id: 'initial-a1',
      eventId: INITIAL_EVENTS.find(e => e.title === 'Culto de Quarta-feira')?.id || 'e-wed-1',
      volunteerId: '6', // Dani Sales
      ministry: 'MÍDIA',
      role: 'Voluntário',
      status: 'confirmed'
    }
  ]);

  // Simulated Current User
  const currentUser = volunteers.find(v => v.id === currentUserId) || volunteers.find(v => v.name === 'Dani Sales') || volunteers[0];

  const handleLogin = () => {
    if (!loginPhone || !loginName) return;

    // Search for existing user by phone
    const existingUser = volunteers.find(v => v.phone === loginPhone);
    
    if (existingUser) {
      setCurrentUserId(existingUser.id);
      setIsAuthenticated(true);
    } else {
      // If user is not found, we create a generic volunteer profile
      const newVolunteer: Volunteer = {
        id: `v-${Date.now()}`,
        name: loginName,
        phone: loginPhone,
        ministries: [],
        primaryRole: 'Voluntário',
        availableDates: []
      };
      setVolunteers(prev => [...prev, newVolunteer]);
      setCurrentUserId(newVolunteer.id);
      setIsAuthenticated(true);
    }
  };

  const handleUpdateAvailability = (volunteerId: string, dates: string[], activeMinistries: Ministry[]) => {
    setVolunteers(prev => prev.map(v => 
      v.id === volunteerId 
        ? { ...v, availableDates: dates, ministries: activeMinistries }
        : v
    ));
    setActiveTab('calendar');
  };

  const handleAutoSchedule = () => {
    const newAssignments = autoSchedule(volunteers, events, assignments);
    setAssignments(newAssignments);
  };

  const handleJoinEvent = (eventId: string, ministry: Ministry) => {
    // Check if already assigned
    const alreadyAssigned = assignments.some(a => a.eventId === eventId && a.volunteerId === currentUser.id);
    if (alreadyAssigned) return;

    // Check if team is full
    const event = events.find(e => e.id === eventId);
    if (!event) return;
    
    const assignedCount = assignments.filter(a => a.eventId === eventId && a.ministry === ministry).length;
    const requiredCount = getMinistryRequirement(ministry, event.date);
    
    if (assignedCount >= requiredCount) {
      return;
    }

    const newAssignment: Assignment = {
      id: `a-${Date.now()}`,
      eventId,
      volunteerId: currentUser.id,
      ministry,
      role: 'Voluntário',
      status: 'confirmed'
    };

    setAssignments(prev => [...prev, newAssignment]);
  };

  const handleCancelAssignment = (assignmentId: string) => {
    setAssignments(prev => prev.filter(a => a.id !== assignmentId));
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleClearNotifications = () => {
    setNotifications([]);
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  const [toast, setToast] = React.useState<Notification | null>(null);

  const handleAcceptOpenSlot = (assignmentId: string) => {
    const assignment = assignments.find(a => a.id === assignmentId);
    if (!assignment || assignment.status !== 'open') {
      return;
    }

    setAssignments(prev => prev.map(a => 
      a.id === assignmentId 
        ? { ...a, volunteerId: currentUser.id, status: 'confirmed' } 
        : a
    ));

    // Notify user of success
    const newNotification: Notification = {
      id: `n-${Date.now()}`,
      title: 'Vaga preenchida com sucesso!',
      message: `Você assumiu a escala para ${assignment.ministry}. Deus abençoe!`,
      date: new Date().toISOString(),
      read: false,
      type: 'confirmation'
    };
    setNotifications(prev => [newNotification, ...prev]);
    setToast(newNotification);
    setTimeout(() => setToast(null), 5000);
    
    // Remove the 'open-slot' notifications for this assignmentId
    setNotifications(prev => prev.filter(n => n.assignmentId !== assignmentId || n.type !== 'open-slot'));
  };

  const handleUpdateAssignmentStatus = (id: string, status: 'assigned' | 'confirmed' | 'declined' | 'open') => {
    if (status === 'declined') {
      const assignment = assignments.find(a => a.id === id);
      const event = events.find(e => e.id === assignment?.eventId);
      
      if (assignment && event) {
        // 1. Mark as open
        setAssignments(prev => prev.map(a => 
          a.id === id ? { ...a, status: 'open', volunteerId: '' } : a
        ));

        // 2. Broadcast to relevant volunteers
        const broadcastNotification: Notification = {
          id: `broadcast-${Date.now()}`,
          title: '🚨 Vaga Disponível',
          message: `Vaga para ${assignment.ministry} no ${event.title} disponível.`,
          date: new Date().toISOString(),
          read: false,
          type: 'open-slot',
          assignmentId: id,
          eventId: event.id
        };
        setNotifications(prev => [broadcastNotification, ...prev]);
        setToast(broadcastNotification);
        setTimeout(() => setToast(null), 5000);
      }
      return;
    }

    setAssignments(prev => prev.map(a => 
      a.id === id ? { ...a, status } : a
    ));

    // Add internal notification on confirmation
    if (status === 'confirmed') {
      const assignment = assignments.find(a => a.id === id);
      const event = events.find(e => e.id === assignment?.eventId);
      if (assignment && event) {
        const newNotification: Notification = {
          id: `n-${Date.now()}`,
          title: 'Escala Confirmada',
          message: `Sua participação no ${event.title} (${assignment.ministry}) foi confirmada.`,
          date: new Date().toISOString(),
          read: false,
          type: 'confirmation'
        };
        setNotifications(prev => [newNotification, ...prev]);
        setToast(newNotification);
        setTimeout(() => setToast(null), 5000);
      }
    }
  };

  const handleAdminLogin = (email: string, pass: string) => {
    // Super secure admin login mock
    if (email === 'admin@cjpp.org' && pass === '123456') {
      setCurrentAdmin({
        id: 'admin-1',
        email: 'admin@cjpp.org',
        name: 'Administrador CJPP',
        role: 'superadmin'
      });
      setIsAdminAuthenticated(true);
      setShowAdminLogin(false);
      setAdminError('');
    } else {
      setAdminError('Credenciais administrativas inválidas.');
    }
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    setCurrentAdmin(null);
    setShowAdminLogin(false);
  };

  const handleAddEvent = (event: ChurchEvent) => {
    setEvents(prev => [...prev, event]);
  };

  const handleUpdateEvent = (event: ChurchEvent) => {
    setEvents(prev => prev.map(e => e.id === event.id ? event : e));
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  const handleAdminAutoSchedule = (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    if (!event) return;
    const newAssignments = autoSchedule(volunteers, [event], assignments);
    setAssignments(prev => {
      const filtered = prev.filter(a => a.eventId !== eventId);
      return [...filtered, ...newAssignments];
    });
  };

  const handleSendNotification = (n: Partial<Notification>, target: string | string[]) => {
    const newNotif: Notification = {
      id: `admin-n-${Date.now()}`,
      title: n.title || 'Informativo Ministerial',
      message: n.message || '',
      date: new Date().toISOString(),
      read: false,
      type: n.type || 'reminder',
    };
    setNotifications(prev => [newNotif, ...prev]);
    setToast(newNotif);
    setTimeout(() => setToast(null), 5000);
  };

  // Priority 1: Admin Interface (Authenticated)
  if (isAdminAuthenticated && currentAdmin) {
    const renderAdminView = () => {
      switch (adminActiveTab) {
        case 'dashboard':
          return <AdminDashboard onNavigate={setAdminActiveTab} events={events} assignments={assignments} volunteers={volunteers} />;
        case 'scales':
          return <AdminScaleView 
            events={events} 
            assignments={assignments} 
            volunteers={volunteers}
            onAddEvent={handleAddEvent}
            onUpdateEvent={handleUpdateEvent}
            onDeleteEvent={handleDeleteEvent}
            onAutoSchedule={handleAdminAutoSchedule}
          />;
        case 'ministries':
          return <AdminMinistryView volunteers={volunteers} />;
        case 'volunteers':
          return <AdminVolunteersView volunteers={volunteers} assignments={assignments} />;
        case 'notifications':
          return <AdminNotificationsView onSendNotification={handleSendNotification} />;
        case 'reports':
          return <AdminReportsView volunteers={volunteers} assignments={assignments} />;
        default:
          return <AdminDashboard onNavigate={setAdminActiveTab} events={events} assignments={assignments} volunteers={volunteers} />;
      }
    };

    return (
      <AdminLayout 
        activeView={adminActiveTab} 
        onViewChange={setAdminActiveTab} 
        onLogout={handleAdminLogout}
        adminName={currentAdmin.name}
      >
        {renderAdminView()}
      </AdminLayout>
    );
  }

  // Priority 2: Admin Login Screen
  if (showAdminLogin) {
    return (
      <div className="relative min-h-screen bg-black">
        <button 
          onClick={() => setShowAdminLogin(false)}
          className="fixed top-8 left-8 z-[100] flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-gold hover:bg-gold/10 transition-all"
        >
          <X className="w-4 h-4" /> Voltar
        </button>
        <AdminLogin onLogin={handleAdminLogin} error={adminError} />
      </div>
    );
  }

  // Priority 3: Volunteer Login screen
  if (!isAuthenticated) {
    return (
      <React.Fragment>
        <SplashScreen isVisible={showSplash} />
        <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden font-sans">
          {/* CINEMATIC LOGIN BACKGROUND */}
          <div className="absolute inset-0 z-0">
             {/* Blurred Worship Background */}
             <div 
               className="absolute inset-0 bg-cover bg-center brightness-[0.3] scale-110"
               style={{ 
                 backgroundImage: 'url("https://images.unsplash.com/photo-1510531551670-6815c48ab504?auto=format&fit=crop&q=80&w=2000")',
                 filter: 'blur(8px)'
               }}
             />
             
             {/* Gradient Overlay for Depth */}
             <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black" />
             
             {/* Dynamic Ambient Glows */}
             <motion.div 
               animate={{ 
                 scale: [1, 1.3, 1],
                 opacity: [0.1, 0.2, 0.1]
               }}
               transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
               className="absolute top-[-20%] left-[-10%] w-full h-full bg-gold/10 rounded-full blur-[180px]"
             />
             
             {/* Floating Premium Dust Particles */}
             {Array.from({ length: 15 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ x: Math.random() * 100 + "%", y: Math.random() * 100 + "%", opacity: 0 }}
                  animate={{ y: [null, "-20%"], opacity: [0, 0.3, 0] }}
                  transition={{ duration: Math.random() * 15 + 10, repeat: Infinity, delay: Math.random() * 5 }}
                  className="absolute w-[2px] h-[2px] bg-gold/40 rounded-full blur-[1px]"
                />
             ))}
          </div>
          
          <div className="w-full max-w-sm space-y-6 sm:space-y-12 relative z-10 flex flex-col items-center">
            {/* BRANDING SECTION - CINEMATIC PRECISION */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center gap-4 sm:gap-8 w-full"
            >
              <div className="w-20 h-20 sm:w-28 sm:h-28 relative group">
                <OfficialLogo className="w-full h-full relative z-10" glow={true} />
                <div className="absolute inset-0 bg-gold/5 rounded-full blur-[40px] -z-10" />
              </div>
              
              <div className="text-center space-y-4 sm:space-y-6 px-4">
                 <h2 className="text-xl sm:text-2xl text-white font-serif font-light uppercase tracking-[0.3em] sm:tracking-[0.4em] drop-shadow-2xl">
                   VOLUNTÁRIOS <span className="text-gold font-bold">CJPP</span>
                 </h2>
                 
                 <div className="hidden sm:flex flex-col items-center gap-4">
                    <div className="flex items-center gap-6">
                       <div className="flex flex-col items-center gap-2">
                          <div className="w-8 h-8 rounded-full border border-gold/40 flex items-center justify-center">
                             <div className="w-4 h-4 text-gold"><Star className="w-full h-full" /></div>
                          </div>
                          <span className="text-[10px] text-gold font-black uppercase tracking-[0.2em] ml-[0.2em]">PROPÓSITO</span>
                       </div>
                       <div className="flex flex-col items-center gap-2">
                          <div className="w-8 h-8 rounded-full border border-gold/40 flex items-center justify-center">
                             <div className="w-4 h-4 text-gold"><ShieldCheck className="w-full h-full" /></div>
                          </div>
                          <span className="text-[10px] text-gold font-black uppercase tracking-[0.2em] ml-[0.2em]">EXCELÊNCIA</span>
                       </div>
                    </div>
                    
                    <div className="w-full max-w-[200px] h-[1px] bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
                    <p className="text-[11px] text-white/60 font-medium uppercase tracking-[0.5em] ml-[0.5em]">QUALIDADE EM SERVIR</p>
                    <div className="w-full max-w-[200px] h-[1px] bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
                 </div>
              </div>
            </motion.div>
            
            {/* LOGIN CARD - MINIMALIST PREMIUM GLASSMorphism */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              className="w-full bg-black/40 backdrop-blur-xl p-6 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] border border-white/[0.08] shadow-[0_45px_70px_rgba(0,0,0,0.7)] relative overflow-hidden group mx-4"
            >
              {/* Inner Decorative Glow */}
              <div className="absolute top-0 left-1/4 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
              
              <div className="space-y-8 sm:space-y-10 relative z-10">
                <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 border-b border-white/5 pb-6">
                   <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center group-hover:bg-gold/20 transition-all border border-gold/20">
                      <Users className="w-6 h-6 text-gold" />
                   </div>
                   <div className="flex-1">
                      <h2 className="text-lg sm:text-2xl font-serif text-white/40 uppercase tracking-[0.2em] mb-1">Bem-vindo ao Portal</h2>
                      <h4 className="text-xl sm:text-2xl font-black text-white uppercase tracking-[0.1em]">Voluntários CJPP</h4>
                      <div className="space-y-2 mt-3 block sm:mt-4">
                        <p className="text-[10px] sm:text-[11px] text-white/90 uppercase tracking-[0.15em] leading-relaxed font-black">
                          “Sozinhos somos fortes. Juntos somos imbatíveis.”
                        </p>
                      </div>
                   </div>
                </div>

                <div className="space-y-5 sm:space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between px-1">
                      <label className="text-[9px] font-black text-gold/50 uppercase tracking-[0.3em]">NOME COMPLETO</label>
                    </div>
                    <div className="relative group/input bg-white/[0.02] border border-white/10 rounded-2xl p-1 transition-all focus-within:border-gold/40 focus-within:bg-white/[0.05] focus-within:scale-[1.01]">
                      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gold/40 group-focus-within/input:text-gold transition-colors">
                        <User className="w-5 h-5" />
                      </div>
                      <input 
                        type="text" 
                        value={loginName}
                        onChange={(e) => setLoginName(e.target.value)}
                        placeholder="Ex: João da Silva"
                        className="w-full bg-transparent py-4 sm:py-5 pl-14 pr-6 outline-none text-sm text-white placeholder:text-white/10 font-bold tracking-[0.05em] uppercase"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between px-1">
                      <label className="text-[9px] font-black text-gold/50 uppercase tracking-[0.3em]">CONTATO OFICIAL</label>
                    </div>
                    <div className="relative group/input bg-white/[0.02] border border-white/10 rounded-2xl p-1 transition-all focus-within:border-gold/40 focus-within:bg-white/[0.05] focus-within:scale-[1.01]">
                      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gold/40 group-focus-within/input:text-gold transition-colors">
                        <Users className="w-5 h-5" />
                      </div>
                      <input 
                        type="tel" 
                        value={loginPhone}
                        onChange={(e) => setLoginPhone(e.target.value)}
                        placeholder="(00) 00000-0000"
                        className="w-full bg-transparent py-4 sm:py-5 pl-14 pr-6 outline-none text-sm text-white placeholder:text-white/10 font-bold tracking-[0.05em] uppercase"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  <button 
                    onClick={handleLogin}
                    className="w-full py-5 sm:py-6 btn-premium-gold rounded-full text-xs uppercase tracking-[0.4em] font-black shadow-[0_20px_40px_rgba(212,175,55,0.2)] hover:shadow-[0_20px_50px_rgba(212,175,55,0.3)] transition-all active:scale-[0.98] relative overflow-hidden group/btn"
                  >
                    <span className="relative z-10">ACESSAR PORTAL</span>
                    <motion.div 
                      className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700 ease-in-out -skew-x-12"
                    />
                  </button>
                  
                  <button 
                    onClick={() => setShowAdminLogin(true)}
                    className="w-full text-center text-[9px] font-black text-white/30 uppercase tracking-[0.4em] hover:text-gold hover:bg-white/[0.02] transition-all py-4 rounded-2xl border border-transparent hover:border-white/5 active:scale-[0.98]"
                  >
                    ⚙️ Gestão Administrativa
                  </button>
                </div>
              </div>
            </motion.div>


            {/* ENVIRONMENT BADGE */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="flex items-center gap-3 opacity-20"
            >
              <ShieldCheck className="w-4 h-4 text-gold" />
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white">Ambiente Seguro e Monitorado</span>
            </motion.div>
          </div>
          
          {/* Deep Cinematic Overlay / Vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.6)_100%)] pointer-events-none" />
        </div>
      </React.Fragment>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Home 
          currentUser={currentUser} 
          assignments={assignments} 
          events={events}
          onNavigate={(tab) => setActiveTab(tab)}
          onUpdateAssignmentStatus={handleUpdateAssignmentStatus}
          onAcceptOpenSlot={handleAcceptOpenSlot}
        />;
      case 'dashboard':
        return <Dashboard 
          volunteers={volunteers} 
          assignments={assignments} 
          events={events}
          onAutoSchedule={handleAutoSchedule}
          currentUser={currentUser}
        />;
      case 'volunteers':
        return <VolunteerList volunteers={volunteers} />;
      case 'calendar':
        return <CalendarView 
          events={events} 
          assignments={assignments} 
          volunteers={volunteers}
          onAutoSchedule={handleAutoSchedule}
          onJoinEvent={handleJoinEvent}
          onCancelAssignment={handleCancelAssignment}
          currentUser={currentUser}
          onAddEvent={(e) => setEvents(prev => [...prev, e])}
        />;
      case 'my-scales':
        return <MyScales 
          currentUser={currentUser}
          assignments={assignments}
          events={events}
          onCancelAssignment={handleCancelAssignment}
          onUpdateAssignmentStatus={handleUpdateAssignmentStatus}
        />;
      case 'scales':
        return <AvailabilityForm 
          currentVolunteer={volunteers[0]} 
          onSave={handleUpdateAvailability} 
        />;
      case 'reports':
        return <Reports volunteers={volunteers} />;
      case 'profile':
        return (
          <div className="max-w-md mx-auto space-y-8 pb-20 pt-10 text-center">
            <div className="w-24 h-24 rounded-full bg-gold mx-auto flex items-center justify-center shadow-[0_0_50px_rgba(212,175,55,0.4)] relative">
              <span className="text-3xl font-black text-black">{currentUser.name.split(' ').map(n => n[0]).join('')}</span>
            </div>
            <div>
              <h4 className="text-2xl font-serif gold-text">{currentUser.name}</h4>
              <p className="text-white/80 text-base mt-2 font-medium">{currentUser.primaryRole} • CJPP</p>
              <p className="text-gold text-xs mt-3 font-bold uppercase tracking-widest">{currentUser.phone}</p>
            </div>
            <div className="space-y-6 pt-4">
              <button className="w-full py-5 bg-white/10 border border-white/20 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] text-white hover:bg-white/20 transition-all">Editar Perfil</button>
              <button 
                onClick={() => setIsAuthenticated(false)}
                className="w-full py-5 bg-red-500/20 border border-red-500/40 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] text-red-500 hover:bg-red-500/30 transition-all shadow-lg"
              >
                Sair do Aplicativo
              </button>
            </div>
          </div>
        );
      default:
        return <Dashboard 
          volunteers={volunteers} 
          assignments={assignments} 
          events={events}
          onAutoSchedule={handleAutoSchedule}
          currentUser={currentUser}
        />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col md:flex-row">
      <Layout 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        unreadNotificationsCount={unreadNotificationsCount}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
      >
        {renderContent()}
      </Layout>
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      
      <NotificationCenter 
        notifications={notifications}
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onMarkAsRead={handleMarkAsRead}
        onDelete={handleDeleteNotification}
        onClearAll={handleClearNotifications}
        onAcceptSlot={handleAcceptOpenSlot}
      />

      {/* Toast Notification Popup */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={() => setIsNotificationsOpen(true)}
            className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-[90%] bg-gold border border-black/10 rounded-2xl p-4 shadow-2xl z-[200] flex items-center gap-4 cursor-pointer"
          >
            <div className="w-10 h-10 bg-black/10 rounded-xl flex items-center justify-center shrink-0">
              <Bell className="w-5 h-5 text-black" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-black/40">Novo Aviso</p>
              <p className="text-xs font-bold text-black">{toast.title}</p>
            </div>
            <button onClick={(e) => { e.stopPropagation(); setToast(null); }} className="p-2 text-black/40">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
