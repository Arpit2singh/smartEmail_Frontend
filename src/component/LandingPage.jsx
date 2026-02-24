import React, { useState, useEffect, useRef } from 'react';
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/clerk-react';
import { 
  Mail, 
  Shield, 
  Zap, 
  Sparkles, 
  Play, 
  X, 
  ChevronRight, 
  Globe, 
  Activity, 
  CheckCircle, 
  MousePointerClick, 
  Laptop, 
  MapPin, 
  ArrowRight,
  Eye,
  Server
} from 'lucide-react';
import { HighlightDoodle, EyeScannerDoodle, LockKeyDoodle, MailPlaneDoodle, SparkleDoodle } from './Doodles';

const LandingPage = ({ setViewMode }) => {
  const [scrollY, setScrollY] = useState(0);
  const [scrollPercent, setScrollPercent] = useState(0);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  
  // Simulation states
  const [simEmails, setSimEmails] = useState([
    { id: 1, to: 'client@company.com', subject: 'Q2 Partnership Agreement', status: 'delivered', time: '10m ago', opens: 0 },
    { id: 2, to: 'hr@techcorp.com', subject: 'Resume & Portfolio Submission', status: 'read', time: '1h ago', opens: 3 },
    { id: 3, to: 'investor@ventures.co', subject: 'SmartEmail Pitch Deck v2', status: 'clicked', time: '3h ago', opens: 5 }
  ]);
  const [simAlert, setSimAlert] = useState(null);

  const mockupContainerRef = useRef(null);
  const timelineRef = useRef(null);

  // Monitor scroll for 3D tilt & parallax floating cards
  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      setScrollY(currentScroll);

      if (mockupContainerRef.current) {
        const rect = mockupContainerRef.current.getBoundingClientRect();
        const elemTop = rect.top;
        const windowHeight = window.innerHeight;
        
        // Element scroll ratio: 0 is just entering bottom viewport, 1 is scrolled past
        const start = windowHeight;
        const end = 0;
        const range = start - end;
        const relativeTop = Math.min(start, Math.max(end, elemTop));
        const pct = 1 - (relativeTop - end) / range;
        
        // Smooth interpolation
        setScrollPercent(pct);
      }

      // Timeline active step highlight
      if (timelineRef.current) {
        const rect = timelineRef.current.getBoundingClientRect();
        const elementHeight = rect.height;
        const scrolledIntoElement = window.innerHeight - rect.top;
        
        if (scrolledIntoElement > 0 && rect.top < window.innerHeight) {
          const rawPct = scrolledIntoElement / (elementHeight + window.innerHeight * 0.4);
          const step = Math.min(2, Math.max(0, Math.floor(rawPct * 3)));
          setActiveStep(step);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Trigger initial sizing
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handler for simulator activity trigger
  const triggerSimulationOpen = () => {
    if (simAlert) return; // Prevent spamming
    
    // Play subtle visual alert
    setSimAlert({
      to: 'client@company.com',
      message: 'Email opened just now in San Francisco, CA!',
      ip: '64.233.160.1',
      device: 'Chrome Desktop / macOS'
    });

    // Update client email status in mock list
    setSimEmails(prev => prev.map(email => {
      if (email.id === 1) {
        return { ...email, status: 'read', opens: email.opens + 1, time: 'Just now' };
      }
      return email;
    }));

    setTimeout(() => {
      setSimAlert(null);
    }, 5000);
  };

  // 3D mock calculations based on scroll percent
  // We want the container to tilt forward when it enters view (rotateX), and flatten out as we scroll down
  const tiltAngle = Math.max(0, 14 - (scrollPercent * 18)); // Starts at 14deg, flattens down to 0
  const mockupScale = Math.min(1, 0.9 + (scrollPercent * 0.12)); // Zooms from 0.9 to 1.02
  const mockupOpacity = Math.min(1, 0.3 + (scrollPercent * 0.7)); // Fades in on scroll

  // Badges scroll movement calculations (Parallax)
  const badgeParallax1 = (scrollPercent - 0.5) * -75; // floats up
  const badgeParallax2 = (scrollPercent - 0.5) * -110; // floats faster
  const badgeParallax3 = (scrollPercent - 0.5) * -50;  // floats slower

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white relative tech-grid overflow-x-hidden">
      
      {/* Background Decorative Mesh Gradients */}
      <div className="absolute top-0 left-1/4 -translate-x-1/2 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute top-1/4 right-1/4 translate-x-1/2 w-[400px] h-[400px] bg-purple-500/8 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute top-2/3 left-1/3 w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-3xl pointer-events-none z-0" />

      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-slate-950/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2.5 font-bold text-xl tracking-tight text-white group cursor-pointer">
            <span className="p-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-all duration-300">
              <Mail className="w-5 h-5 text-white" />
            </span>
            <span className="font-extrabold tracking-wide">SmartEmail<span className="text-indigo-400">.</span></span>
          </div>

          <div className="flex items-center gap-4">
            <SignedIn>
              <button 
                onClick={() => setViewMode('workspace')}
                className="px-4 py-2 text-sm font-bold text-white bg-white/5 hover:bg-white/10 border border-white/15 rounded-xl shadow-sm transition hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                Go to Workspace
              </button>
              <UserButton 
                afterSignOutUrl="/" 
                appearance={{
                  elements: {
                    userButtonAvatarBox: 'w-9 h-9 border border-indigo-500/40 hover:scale-105 transition duration-200',
                  }
                }}
              />
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="px-4.5 py-2 text-sm font-semibold text-slate-300 hover:text-white transition cursor-pointer">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/35 transition hover:-translate-y-0.5 cursor-pointer active:translate-y-0">
                  Get Started
                </button>
              </SignUpButton>
            </SignedOut>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-6 pt-24 pb-16 flex flex-col items-center justify-center text-center z-10">
        
        {/* Decorative Floating Doodles */}
        <div className="hidden lg:block absolute left-10 top-32 pointer-events-none opacity-40 animate-float" style={{ animationDuration: '6s' }}>
          <SparkleDoodle className="text-amber-400" />
        </div>
        <div className="hidden lg:block absolute right-16 top-40 pointer-events-none opacity-30 animate-float" style={{ animationDuration: '8s' }}>
          <MailPlaneDoodle className="text-indigo-400" />
        </div>

        {/* Real-time Tracking Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-6 shadow-inner animate-pulse">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Real-time Tracking Pixel Technology</span>
        </div>

        {/* Big Bold Headline */}
        <h1 className="text-5xl md:text-8xl font-black tracking-tight text-white max-w-5xl leading-[1.1] mb-8">
          Track Your Emails, <br className="hidden md:inline" />
          <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-300 px-3 py-1">
            Instantly
            <HighlightDoodle className="text-rose-500" />
          </span>
        </h1>

        {/* Description Paragraph */}
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl leading-relaxed mb-12">
          Know the exact millisecond your emails are read. View open counts, location-based timestamps, and live target activities without integrations.
        </p>

        {/* Call-to-actions */}
        <div className="flex flex-col sm:flex-row gap-5 justify-center items-center mb-16 w-full max-w-md">
          <SignedIn>
            <button 
              onClick={() => setViewMode('workspace')}
              className="w-full sm:w-auto px-8 py-4.5 text-base font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-2xl shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/40 transition hover:-translate-y-1 active:translate-y-0 cursor-pointer flex items-center justify-center gap-2"
            >
              Enter Workspace <ArrowRight className="w-5 h-5" />
            </button>
          </SignedIn>
          <SignedOut>
            <SignUpButton mode="modal">
              <button className="w-full sm:w-auto px-8 py-4.5 text-base font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-2xl shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/40 transition hover:-translate-y-1 active:translate-y-0 cursor-pointer flex items-center justify-center gap-2">
                Start Tracking Free <ChevronRight className="w-5 h-5" />
              </button>
            </SignUpButton>
          </SignedOut>
          <button 
            onClick={() => setShowDemoModal(true)}
            className="w-full sm:w-auto px-8 py-4.5 text-base font-bold text-slate-300 hover:text-white bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 rounded-2xl transition hover:-translate-y-1 active:translate-y-0 cursor-pointer flex items-center justify-center gap-2"
          >
            <Play className="w-4.5 h-4.5 text-indigo-400 fill-indigo-400" /> Watch Demo
          </button>
        </div>

        {/* Dynamic Scroll-Down Mouse Indicator */}
        <div className="flex flex-col items-center gap-2 text-slate-500 opacity-60 animate-bounce mt-4 cursor-pointer" onClick={() => window.scrollTo({ top: window.innerHeight * 0.8, behavior: 'smooth' })}>
          <span className="text-[10px] uppercase font-bold tracking-widest">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-slate-500 rounded-full flex justify-center p-1">
            <span className="w-1.5 h-2 bg-indigo-400 rounded-full animate-[pulse_1.5s_infinite]" />
          </div>
        </div>
      </section>

      {/* 3D SCROLL PERSPECTIVE VIEWPORT (HERO VIDEO SHOWCASE) */}
      <section className="relative w-full max-w-6xl mx-auto px-6 pb-28 z-20" ref={mockupContainerRef}>
        <div className="perspective-container relative w-full flex justify-center items-center">
          
          {/* Animated Glowing Light Ring behind the browser */}
          <div 
            className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-indigo-500/10 rounded-3xl blur-3xl pointer-events-none transition-transform-slow"
            style={{
              transform: `scale(${mockupScale * 1.05})`,
              opacity: mockupOpacity
            }}
          />

          {/* PARALLAX FLOATING CARDS - Floating around the browser frame */}
          
          {/* Floater 1: Email opened in SF (Left Side) */}
          <div 
            className="absolute left-[-2%], md:left-[-12%] top-[10%] z-30 w-[240px] md:w-[280px] p-4 glass-panel rounded-2xl shadow-2xl transition-transform-slow flex items-start gap-3 border-l-4 border-l-emerald-500 pointer-events-none"
            style={{
              transform: `translateY(${badgeParallax1}px) translateZ(30px)`,
              opacity: mockupOpacity
            }}
          >
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Recipient Opened Email</p>
              <h4 className="text-sm font-bold text-white mt-0.5">San Francisco, CA</h4>
              <div className="flex items-center gap-1.5 mt-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] text-slate-500 font-mono">Chrome / macOS • Just now</span>
              </div>
            </div>
          </div>

          {/* Floater 2: Link Clicked (Right Side bottom) */}
          <div 
            className="absolute right-[-2%], md:right-[-10%] bottom-[15%] z-30 w-[240px] md:w-[280px] p-4 glass-panel rounded-2xl shadow-2xl transition-transform-slow flex items-start gap-3 border-l-4 border-l-indigo-500 pointer-events-none"
            style={{
              transform: `translateY(${badgeParallax2}px) translateZ(50px)`,
              opacity: mockupOpacity
            }}
          >
            <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
              <MousePointerClick className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Link Clicked (100% Match)</p>
              <h4 className="text-sm font-bold text-indigo-300 mt-0.5">proposal_pricing.pdf</h4>
              <div className="flex items-center gap-1.5 mt-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                <span className="text-[10px] text-slate-500 font-mono">2 reads • 1 click • 4s ago</span>
              </div>
            </div>
          </div>

          {/* Floater 3: Encryption secure token (Right Side top) */}
          <div 
            className="hidden md:flex absolute right-[-5%] top-[15%] z-30 w-[210px] p-3 glass-panel rounded-xl shadow-2xl transition-transform-slow items-center gap-2.5 border border-white/10 pointer-events-none"
            style={{
              transform: `translateY(${badgeParallax3}px) translateZ(10px)`,
              opacity: mockupOpacity
            }}
          >
            <div className="p-1.5 bg-purple-500/15 rounded-md text-purple-400">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-medium">SMTP Connection</p>
              <p className="text-xs font-bold text-white">AES-256 Encrypted</p>
            </div>
          </div>

          {/* MAIN BROWSER CONTAINER (Tilted with scroll) */}
          <div 
            className="w-full relative glass-panel rounded-2xl md:rounded-3xl border border-white/10 overflow-hidden shadow-[0_50px_100px_-20px_rgba(99,102,241,0.15)] animate-glow-flow transition-transform-slow preserve-3d"
            style={{
              transform: `rotateX(${tiltAngle}deg) scale(${mockupScale})`,
              opacity: mockupOpacity
            }}
          >
            {/* Mac Browser Header Chrome */}
            <div className="bg-slate-900/80 border-b border-white/10 px-4 py-3 flex items-center gap-3">
              {/* Window dots */}
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              
              {/* Address bar URL */}
              <div className="mx-auto w-[60%] max-w-md bg-slate-950/60 border border-white/5 py-1 px-3.5 rounded-lg text-center text-[10px] text-slate-400 font-mono tracking-wide truncate flex items-center justify-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                <span>smartemail.io/workspace</span>
              </div>

              {/* Status Indicator */}
              <div className="flex items-center gap-1.5 text-emerald-400 text-[10px] font-bold tracking-wider uppercase">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="hidden sm:inline">Active Tracker</span>
              </div>
            </div>

            {/* Video Body Content Container */}
            <div className="relative aspect-[16/9] w-full bg-slate-950 flex items-center justify-center group/video">
              
              {/* Subtle mesh background under video */}
              <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-indigo-950/10 to-slate-950 z-0" />
              
              {/* Autoplaying loop stock video */}
              <video 
                className="w-full h-full object-cover z-10 opacity-70 group-hover/video:opacity-85 transition duration-500 pointer-events-none"
                src="https://cdn.pixabay.com/video/2021/04/12/70796-536166412_large.mp4"
                autoPlay 
                loop 
                muted 
                playsInline
                poster="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80"
              />

              {/* Glowing overlay filter for cinematic look */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-15 pointer-events-none" />
              <div className="absolute inset-0 bg-indigo-500/5 mix-blend-overlay z-15 pointer-events-none" />

              {/* Inside Player HUD overlays */}
              <div className="absolute bottom-6 left-6 z-20 flex items-center gap-3 bg-slate-950/80 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/10 text-white pointer-events-none">
                <div className="w-7 h-7 bg-indigo-600 rounded-full flex items-center justify-center">
                  <Activity className="w-4 h-4 text-white animate-[pulse_1s_infinite]" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Live System Logs</p>
                  <p className="text-xs font-bold font-mono text-indigo-300">Listening for webhooks...</p>
                </div>
              </div>

              {/* Large central play trigger button */}
              <button 
                onClick={() => setShowDemoModal(true)}
                className="absolute z-20 p-5 bg-indigo-600/90 hover:bg-indigo-500 text-white rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 backdrop-blur-sm border border-indigo-400/20 cursor-pointer shadow-indigo-600/30"
              >
                <Play className="w-7 h-7 fill-white translate-x-0.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS / DYNAMIC TIMELINE SECTION */}
      <section className="py-24 border-t border-b border-white/5 bg-slate-950/40 relative" ref={timelineRef}>
        <div className="absolute inset-0 bg-slate-900/10 pointer-events-none" />
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
              Real-time tracking, simplified
            </h2>
            <p className="text-slate-400 text-base md:text-lg">
              Set up in less than 2 minutes. Watch how emails fly and read updates land in your dashboard instantly.
            </p>
          </div>

          {/* Timeline Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative mt-12">
            
            {/* Step 1 */}
            <div 
              className={`p-8 rounded-2xl border transition-all-smooth duration-500 ${
                activeStep === 0 
                  ? 'glass-panel border-indigo-500/30 shadow-[0_15px_30px_-10px_rgba(99,102,241,0.15)] bg-slate-900/40' 
                  : 'bg-white/2 border-white/5 opacity-50'
              }`}
            >
              <div className="flex justify-between items-start mb-6">
                <span className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold font-mono">
                  01
                </span>
                {activeStep === 0 && <span className="text-[10px] px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 font-bold uppercase tracking-wider animate-pulse">active step</span>}
              </div>
              <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                <EyeScannerDoodle className="w-7 h-7 text-indigo-400 inline-block shrink-0" />
                Compose & Insert
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Compose emails in our editor. We automatically generate a unique, non-intrusive transparent tracking pixel embedded into your mail code.
              </p>
            </div>

            {/* Step 2 */}
            <div 
              className={`p-8 rounded-2xl border transition-all-smooth duration-500 ${
                activeStep === 1 
                  ? 'glass-panel border-purple-500/30 shadow-[0_15px_30px_-10px_rgba(168,85,247,0.15)] bg-slate-900/40' 
                  : 'bg-white/2 border-white/5 opacity-50'
              }`}
            >
              <div className="flex justify-between items-start mb-6">
                <span className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center font-bold font-mono">
                  02
                </span>
                {activeStep === 1 && <span className="text-[10px] px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 font-bold uppercase tracking-wider animate-pulse">active step</span>}
              </div>
              <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                <MailPlaneDoodle className="w-7 h-7 text-purple-400 inline-block shrink-0" />
                Secure Send
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Send instantly through our local dashboard. Configuration credentials are fully encrypted and stored securely within your workspace.
              </p>
            </div>

            {/* Step 3 */}
            <div 
              className={`p-8 rounded-2xl border transition-all-smooth duration-500 ${
                activeStep === 2 
                  ? 'glass-panel border-pink-500/30 shadow-[0_15px_30px_-10px_rgba(236,72,153,0.15)] bg-slate-900/40' 
                  : 'bg-white/2 border-white/5 opacity-50'
              }`}
            >
              <div className="flex justify-between items-start mb-6">
                <span className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400 flex items-center justify-center font-bold font-mono">
                  03
                </span>
                {activeStep === 2 && <span className="text-[10px] px-2.5 py-1 rounded-full bg-pink-500/20 text-pink-300 font-bold uppercase tracking-wider animate-pulse">active step</span>}
              </div>
              <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                <SparkleDoodle className="w-7 h-7 text-pink-400 inline-block shrink-0" />
                Live Tracking
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                The instant they open the email or click a link, receive a webhook alert. Complete device, OS, and timestamp reports are posted live.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* DYNAMIC LIVE ANALYTICS PREVIEW SIMULATOR */}
      <section className="py-24 max-w-6xl mx-auto px-6 z-10 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
              Interactive sandbox
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">
              See the analytics update in real time
            </h2>
            <p className="text-slate-400 leading-relaxed">
              Don't take our word for it. Click the button to simulate a recipient opening the sent email and watch how the dashboard feed reacts.
            </p>
            <div className="pt-2">
              <button 
                onClick={triggerSimulationOpen}
                disabled={simAlert !== null}
                className={`px-6 py-3.5 rounded-xl font-bold transition-all duration-300 text-white flex items-center gap-2.5 cursor-pointer shadow-lg ${
                  simAlert !== null 
                    ? 'bg-emerald-600/50 cursor-not-allowed border border-emerald-500/30' 
                    : 'bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 border border-indigo-500/20 shadow-indigo-600/15'
                }`}
              >
                {simAlert !== null ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                    Open Recorded!
                  </>
                ) : (
                  <>
                    <Eye className="w-5 h-5 text-white" /> Simulate Email Open
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 relative">
            {/* Simulation alert popover overlay */}
            {simAlert && (
              <div className="absolute top-6 left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-sm glass-panel border-emerald-500/30 rounded-xl p-4 shadow-[0_20px_40px_-5px_rgba(16,185,129,0.3)] flex items-start gap-3 animate-[fadeIn_0.3s_cubic-bezier(0.16,1,0.3,1)]">
                <div className="p-2 bg-emerald-500/15 rounded-lg text-emerald-400">
                  <Activity className="w-5 h-5 animate-bounce" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-emerald-400 uppercase tracking-widest">LIVE OPEN DETECTED</h5>
                  <p className="text-xs text-white font-semibold mt-0.5">{simAlert.message}</p>
                  <p className="text-[10px] text-slate-400 mt-1 font-mono">{simAlert.device} • IP: {simAlert.ip}</p>
                </div>
              </div>
            )}

            {/* Simulated Live Panel */}
            <div className="glass-panel rounded-2xl border border-white/10 p-6 shadow-2xl relative overflow-hidden bg-slate-900/60 backdrop-blur-md">
              <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                  <span className="text-sm font-bold text-white">Live Tracking Board</span>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-bold">
                  24h ACTIVE
                </div>
              </div>

              {/* Mini-Stats cards grid */}
              <div className="grid grid-cols-3 gap-3.5 mb-5">
                <div className="p-3 bg-white/2 border border-white/5 rounded-xl text-center">
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">Total Sent</span>
                  <span className="text-base font-bold text-white">3</span>
                </div>
                <div className="p-3 bg-white/2 border border-white/5 rounded-xl text-center">
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">Total Reads</span>
                  <span className="text-base font-bold text-indigo-400 font-mono">
                    {simEmails.reduce((acc, curr) => acc + curr.opens, 0)}
                  </span>
                </div>
                <div className="p-3 bg-white/2 border border-white/5 rounded-xl text-center">
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">Click Rate</span>
                  <span className="text-base font-bold text-purple-400 font-mono">33.3%</span>
                </div>
              </div>

              {/* Email lists */}
              <div className="space-y-3">
                {simEmails.map((email) => (
                  <div 
                    key={email.id} 
                    className={`p-3.5 rounded-xl border flex items-center justify-between transition-all duration-300 ${
                      email.status === 'read' && email.time === 'Just now'
                        ? 'bg-indigo-500/5 border-indigo-500/30'
                        : 'bg-white/2 border-white/5 hover:border-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        email.status === 'read' 
                          ? 'bg-emerald-500/10 text-emerald-400' 
                          : email.status === 'clicked'
                          ? 'bg-indigo-500/10 text-indigo-400'
                          : 'bg-slate-500/15 text-slate-400'
                      }`}>
                        {email.status === 'read' ? <Eye className="w-4 h-4" /> : email.status === 'clicked' ? <MousePointerClick className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                      </div>
                      <div className="text-left">
                        <h4 className="text-xs font-bold text-white max-w-[150px] sm:max-w-none truncate">{email.to}</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5 truncate max-w-[150px] sm:max-w-[200px]">{email.subject}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center gap-1.5 justify-end">
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          email.status === 'read' ? 'bg-emerald-500' : email.status === 'clicked' ? 'bg-indigo-400' : 'bg-slate-500'
                        }`} />
                        <span className="text-[10px] font-bold text-slate-300 capitalize">{email.status}</span>
                      </div>
                      <p className="text-[9px] text-slate-500 mt-1 font-mono">{email.time} • {email.opens} opens</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CORE FEATURES GRID */}
      <section className="py-20 border-t border-white/5 relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            
            {/* Feature 1 */}
            <div className="glass-panel glass-panel-hover rounded-3xl p-8 flex flex-col items-center text-center relative group">
              <div className="mb-6 text-indigo-400 group-hover:scale-110 transition duration-300">
                <EyeScannerDoodle />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                <Zap className="w-5 h-5 text-indigo-400 animate-pulse" />
                Live Activity Feed
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Instant visual indicators alert you the second your target reads or clicks the hidden tracking pixel.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="glass-panel glass-panel-hover rounded-3xl p-8 flex flex-col items-center text-center relative group">
              <div className="mb-6 text-pink-400 group-hover:scale-110 transition duration-300">
                <LockKeyDoodle />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5 text-pink-400" />
                Secure Encryption
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Safeguards your configuration credentials locally. Encrypted with high-grade industrial AES-256 standards.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="glass-panel glass-panel-hover rounded-3xl p-8 flex flex-col items-center text-center relative group">
              <div className="mb-6 text-indigo-400 group-hover:scale-110 transition duration-300">
                <MailPlaneDoodle />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                <Mail className="w-5 h-5 text-purple-400" />
                One-Click Delivery
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Compose emails in our sleek editor, hit send, and watch the custom plane animation tracking your emails fly off.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="py-24 border-t border-white/5 relative overflow-hidden z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-6xl font-black text-white leading-[1.15] mb-6">
            Take control of your <br />
            email communication today
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-base md:text-lg mb-10 leading-relaxed">
            Join developers, sales professionals, and writers who trust SmartEmail to track reads, deliver on-time responses, and protect client relations.
          </p>

          <SignedOut>
            <SignUpButton mode="modal">
              <button className="px-10 py-5 text-lg font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-2xl shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/45 transition hover:-translate-y-1 active:translate-y-0 cursor-pointer">
                Start Tracking Free
              </button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <button 
              onClick={() => setViewMode('workspace')}
              className="px-10 py-5 text-lg font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-2xl shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/45 transition hover:-translate-y-1 active:translate-y-0 cursor-pointer"
            >
              Enter Workspace
            </button>
          </SignedIn>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-white/5 text-center text-slate-500 text-xs mt-auto relative z-10 bg-slate-950/80">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 font-bold text-sm text-slate-400">
            <span className="p-1 bg-indigo-500 rounded-md">
              <Mail className="w-3.5 h-3.5 text-white" />
            </span>
            <span>SmartEmail</span>
          </div>
          <p>© {new Date().getFullYear()} SmartEmail Tracker. Engineered with state-of-the-art aesthetics.</p>
          <div className="flex gap-4 text-slate-400">
            <span className="hover:text-indigo-400 transition cursor-pointer">Privacy</span>
            <span>•</span>
            <span className="hover:text-indigo-400 transition cursor-pointer">Terms</span>
          </div>
        </div>
      </footer>

      {/* WATCH DEMO POPUP MODAL */}
      {showDemoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Blur overlay */}
          <div 
            onClick={() => setShowDemoModal(false)}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md cursor-pointer animate-[fadeIn_0.2s_ease-out]"
          />
          
          {/* Modal Container */}
          <div className="relative w-full max-w-4xl bg-slate-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-10 animate-[fadeIn_0.3s_cubic-bezier(0.16,1,0.3,1)]">
            
            {/* Header / Title */}
            <div className="px-5 py-4 border-b border-white/5 bg-slate-950/40 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-indigo-600/20 text-indigo-400 rounded-lg">
                  <Play className="w-4 h-4 fill-indigo-400" />
                </span>
                <span className="text-sm font-bold text-white">SmartEmail Demo Showcase</span>
              </div>
              <button 
                onClick={() => setShowDemoModal(false)}
                className="p-1.5 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Content */}
            <div className="aspect-[16/9] w-full bg-black relative">
              <video 
                className="w-full h-full object-contain"
                src="https://cdn.pixabay.com/video/2021/04/12/70796-536166412_large.mp4"
                controls
                autoPlay 
                playsInline
              />
            </div>
            
            {/* Footer */}
            <div className="px-6 py-4 bg-slate-950/40 border-t border-white/5 flex justify-between items-center text-xs text-slate-500">
              <span>Abstract network loop (visualizing track queries)</span>
              <button 
                onClick={() => setShowDemoModal(false)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition cursor-pointer"
              >
                Close Player
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default LandingPage;
