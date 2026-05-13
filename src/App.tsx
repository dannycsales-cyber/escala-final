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
import { Volunteer, ChurchEvent, Assignment, Ministry, MINISTRY_REQUIREMENTS } from './types';
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
        time: '19:00',
        arrivalTime: '18:00',
        type: 'recurrent',
        status: 'published',
        teamsNeeded: Object.keys(MINISTRY_REQUIREMENTS) as Ministry[]
      });
    } else if (day.getDay() === 3) { // Wednesday
      events.push({
        id: `e-wed-${index}`,
        title: 'Culto de Quarta-feira',
        date: dateStr,
        time: '20:00',
        arrivalTime: '19:30',
        type: 'recurrent',
        status: 'published',
        teamsNeeded: ['RECEPÇÃO', 'MÍDIA', 'APOIO TEMPLO', 'ESTACIONAMENTO', 'CAPITÃO', 'COZINHA']
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
    if (!loginName || !loginPhone) return;

    // Search for existing user by phone
    const existingUser = volunteers.find(v => v.phone === loginPhone);
    
    if (existingUser) {
      setCurrentUserId(existingUser.id);
    } else {
      // Create new volunteer
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
    }
    
    setIsAuthenticated(true);
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
    const requiredCount = MINISTRY_REQUIREMENTS[ministry] || 0;
    
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

  if (showAdminLogin) {
    return <AdminLogin onLogin={handleAdminLogin} error={adminError} />;
  }

  if (!isAuthenticated) {
    return (
      <React.Fragment>
        <SplashScreen isVisible={showSplash} />
        <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden font-sans">
          {/* CINEMATIC LOGIN BACKGROUND */}
          <div className="absolute inset-0 z-0">
             {/* Dynamic Ambient Glows */}
             <motion.div 
               animate={{ 
                 scale: [1, 1.3, 1],
                 opacity: [0.15, 0.3, 0.15]
               }}
               transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
               className="absolute top-[-10%] left-[-10%] w-full h-full bg-gold/5 rounded-full blur-[150px]"
             />
             <motion.div 
               animate={{ 
                 scale: [1, 1.1, 1],
                 opacity: [0.05, 0.15, 0.05]
               }}
               transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 3 }}
               className="absolute bottom-[-20%] right-[-10%] w-full h-full bg-gold/10 rounded-full blur-[180px]"
             />
             
             {/* Particles for Continuity */}
             {Array.from({ length: 20 }).map((_, i) => (
               <motion.div
                 key={i}
                 initial={{ x: Math.random() * 100 + "%", y: Math.random() * 100 + "%", opacity: 0 }}
                 animate={{ y: [null, "-15%"], opacity: [0, 0.4, 0] }}
                 transition={{ duration: Math.random() * 10 + 5, repeat: Infinity, delay: Math.random() * 5 }}
                 className="absolute w-[1.5px] h-[1.5px] bg-gold/30 rounded-full blur-[1px]"
               />
             ))}

             {/* Floor Reflection Gradient */}
             <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-gold/5 via-transparent to-transparent opacity-50" />
          </div>
          
          <div className="w-full max-w-sm space-y-16 relative z-10">
            {/* BRANDING SECTION - CINEMATIC BREATHING ROOM */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center gap-16"
            >
              <div className="w-32 h-32 md:w-40 md:h-40 relative group">
                <OfficialLogo className="w-full h-full relative z-10" glow={false} />
                <div className="absolute inset-0 bg-gold/5 rounded-full blur-[50px] -z-10" />
              </div>
              
              <div className="text-center space-y-6 sm:space-y-10">
                 <h2 className="text-xl sm:text-3xl md:text-4xl text-white font-serif font-light uppercase tracking-[0.4em] sm:tracking-[0.6em] ml-[0.4em] sm:ml-[0.6em] drop-shadow-[0_0_25px_rgba(212,175,55,0.5)]">
                   SERVINDO AO <span className="text-gold italic font-bold">REINO</span>
                 </h2>
                 <div className="flex flex-wrap items-center gap-4 sm:gap-8 justify-center opacity-90 ml-[0.3em]">
                    {['PROPÓSITO', 'EXCELÊNCIA', 'REINO'].map((t, i, a) => (
                      <React.Fragment key={t}>
                        <span className="text-[10px] sm:text-[12px] text-white brightness-110 font-bold uppercase tracking-[0.25em] sm:tracking-[0.4em] drop-shadow-[0_0_10px_rgba(212,175,55,0.4)]">{t}</span>
                        {i < a.length - 1 && <span className="text-gold opacity-50 text-[8px] sm:text-[10px]">◆</span>}
                      </React.Fragment>
                    ))}
                 </div>
              </div>
            </motion.div>

            {/* LOGIN CARD - MINIMALIST PREMIUM GLASS */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 2, ease: [0.16, 1, 0.3, 1] }}
              className="glass-premium p-6 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] border border-white/[0.05] relative overflow-hidden group shadow-2xl"
            >
              <div className="space-y-8 sm:space-y-12">
                <div className="text-center">
                   <h3 className="text-[9px] sm:text-[11px] font-black text-gold uppercase tracking-[0.4em] sm:tracking-[0.6em] ml-[0.4em] sm:ml-[0.6em] mb-4 drop-shadow-md">AUTENTICAÇÃO</h3>
                </div>

                <div className="space-y-8 sm:space-y-10">
                  {/* Name Input */}
                  <div className="relative group/input border-b border-white/30 focus-within:border-gold transition-all pb-3 sm:pb-4">
                    <User className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 sm:w-6 sm:h-6 text-gold group-focus-within/input:brightness-125 transition-all drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]" />
                    <input 
                      type="text" 
                      value={loginName}
                      onChange={(e) => setLoginName(e.target.value)}
                      placeholder="IDENTIFICADOR (SEU NOME)"
                      className="w-full bg-transparent py-3 sm:py-4 pl-10 sm:pl-14 pr-4 sm:pr-6 outline-none transition-all text-sm sm:text-lg text-white placeholder:text-white/40 font-bold tracking-widest"
                    />
                  </div>

                  {/* Phone Input */}
                  <div className="relative group/input border-b border-white/30 focus-within:border-gold transition-all pb-3 sm:pb-4">
                    <Lock className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 sm:w-6 sm:h-6 text-gold group-focus-within/input:brightness-125 transition-all drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]" />
                    <input 
                      type="tel" 
                      value={loginPhone}
                      onChange={(e) => setLoginPhone(e.target.value)}
                      placeholder="CHAVE DE ACESSO (TELEFONE)"
                      className="w-full bg-transparent py-3 sm:py-4 pl-10 sm:pl-14 pr-10 sm:pr-12 outline-none transition-all text-sm sm:text-lg text-white placeholder:text-white/40 font-bold tracking-widest"
                    />
                    <button className="absolute right-0 top-1/2 -translate-y-1/2 text-white/5 hover:text-white/20 transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-6 sm:space-y-8 pt-2 sm:pt-4">
                  <button 
                    onClick={handleLogin}
                    className="w-full py-4 sm:py-5 btn-premium-gold rounded-full text-[9px] sm:text-[10px] uppercase tracking-[0.4em] sm:tracking-[0.6em] ml-[0.3em] sm:ml-[0.6em] transition-all"
                  >
                    ENTRAR
                  </button>
                  
                  <div className="flex flex-col items-center gap-4 opacity-20">
                    <div className="w-8 h-[1px] bg-white/20" />
                    <button 
                      onClick={() => setShowAdminLogin(true)}
                      className="text-[8px] font-bold text-white uppercase tracking-[0.3em] hover:text-gold transition-colors"
                    >
                      Acesso Administrativo
                    </button>
                    <div className="w-8 h-[1px] bg-white/20" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* SECURITY BADGE - MINIMALIST */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="flex justify-center"
            >
              <div className="flex items-center gap-3 opacity-20 grayscale hover:grayscale-0 hover:opacity-40 transition-all cursor-default">
                <ShieldCheck className="w-4 h-4 text-gold" />
                <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white">Ambiente Seguro e Monitorado</span>
              </div>
            </motion.div>
          </div>
          
          {/* Edge Vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.4)_100%)] pointer-events-none" />
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
