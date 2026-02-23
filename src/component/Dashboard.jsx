import React, { useState, useEffect, useContext } from 'react';
import { useUser } from '@clerk/clerk-react' 
import { MyContext } from '../UserContext';
import { EmptyDoodle } from './Doodles';
import { 
  Settings, Search, Filter, Mail, Eye, Clock, 
  RefreshCw, TrendingUp, HelpCircle, Lock, ShieldCheck 
} from 'lucide-react';
import { toast } from 'react-toastify';

export default function Dashboard() {
  const { isSignedIn, user, isLoaded } = useUser()
  const { checkUSER, setcheckUSER, emails, fetchEmail } = useContext(MyContext)
  
  const [flagger, setflagger] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all') // 'all' | 'opened' | 'unopened'
  const [loadingPass, setLoadingPass] = useState(false)

  const [preset, setPreset] = useState('gmail')
  const [host, setHost] = useState('smtp.gmail.com')
  const [port, setPort] = useState(465)
  const [secure, setSecure] = useState(true)
  const [smtpUser, setSmtpUser] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress && !smtpUser) {
      setSmtpUser(user.primaryEmailAddress.emailAddress);
    }
  }, [user]);

  const applyPreset = (p) => {
    setPreset(p);
    if (p === 'gmail') {
      setHost('smtp.gmail.com');
      setPort(465);
      setSecure(true);
      setSmtpUser(user?.primaryEmailAddress?.emailAddress || '');
    } else if (p === 'mailhog') {
      setHost('localhost');
      setPort(1025);
      setSecure(false);
      setSmtpUser('');
      setPassword('');
    } else {
      setHost('');
      setPort(587);
      setSecure(false);
      setSmtpUser(user?.primaryEmailAddress?.emailAddress || '');
      setPassword('');
    }
  };

  const HandleAppPass = async () => {
    if (!host.trim()) {
      toast.warning("Please enter SMTP Host.");
      return;
    }
    if (!port) {
      toast.warning("Please enter SMTP Port.");
      return;
    }
    if (preset !== 'mailhog') {
      if (!smtpUser.trim()) {
        toast.warning("Please enter SMTP Username/Email.");
        return;
      }
      if (!password.trim()) {
        toast.warning("Please enter SMTP Password.");
        return;
      }
    }

    setLoadingPass(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/passSet`, {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json' 
        }, 
        body: JSON.stringify({
          email: user?.primaryEmailAddress?.emailAddress, 
          host: host.trim(),
          port: parseInt(port),
          secure: secure,
          user: smtpUser.trim(),
          password: password.trim()
        })
      });
      
      const data = await response.json(); 
      if (data.flag) {
        toast.success("SMTP configuration updated successfully!");
        setcheckUSER(true);
        setflagger(false);
        setPassword('');
      } else {
        toast.error("Failed to update SMTP configuration. Try again.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Network error updating SMTP configuration.");
    } finally {
      setLoadingPass(false);
    }
  }

  useEffect(() => {
    fetchEmail();
    const interval = setInterval(fetchEmail, 5000);
    return () => clearInterval(interval);
  }, [isLoaded, user, isSignedIn]);

  if (!isLoaded) return null;
  if (!isSignedIn) return null;

  // Stats Counters
  const totalSent = emails.length;
  const openedEmails = emails.filter(e => e.count >= 1).length;
  const pendingEmails = emails.filter(e => e.count === 0 || e.count === -1).length;
  const openRate = totalSent ? Math.round((openedEmails / totalSent) * 100) : 0;

  // Filter & Search logic
  const filteredEmails = emails.filter(email => {
    const matchesSearch = 
      (email.recipient?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
      (email.subject?.toLowerCase().includes(searchQuery.toLowerCase()) || false);
    
    const matchesFilter = 
      statusFilter === 'all' || 
      (statusFilter === 'opened' && email.count >= 1) ||
      (statusFilter === 'unopened' && (email.count === 0 || email.count === -1));

    // Exclude instances that are just provider initializations (no recipient details)
    const isRealEmail = email.recipient !== null;

    return matchesSearch && matchesFilter && isRealEmail;
  });

  // Circular gauge calculations
  // circumference = 2 * PI * r = 2 * 3.14 * 24 = 150.72
  const circ = 150.72;
  const strokeDashoffset = circ - (circ * openRate) / 100;

  return (
    <div className="space-y-8 pb-16">
      
      {/* 📊 Top Stats Panel Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Card 1: Total Sent */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-md shadow-lg flex items-center justify-between group hover:border-indigo-500/30 transition-all duration-300">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Tracked</p>
            <h3 className="text-3xl font-extrabold text-white font-mono">{totalSent}</h3>
            <p className="text-[10px] text-slate-500">Emails dispatched via server</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Mail className="w-5 h-5" />
          </div>
        </div>

        {/* Card 2: Opened */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-md shadow-lg flex items-center justify-between group hover:border-emerald-500/30 transition-all duration-300">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Opened</p>
            <h3 className="text-3xl font-extrabold text-emerald-400 font-mono">{openedEmails}</h3>
            <p className="text-[10px] text-slate-500">Verified pixel triggers</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Eye className="w-5 h-5" />
          </div>
        </div>

        {/* Card 3: Pending */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-md shadow-lg flex items-center justify-between group hover:border-amber-500/30 transition-all duration-300">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Unopened</p>
            <h3 className="text-3xl font-extrabold text-amber-400 font-mono">{pendingEmails}</h3>
            <p className="text-[10px] text-slate-500">Awaiting recipient activity</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        {/* Card 4: Open Rate Circle */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-md shadow-lg flex items-center justify-between group hover:border-indigo-500/30 transition-all duration-300">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Open Rate</p>
            <h3 className="text-3xl font-extrabold text-white font-mono">{openRate}%</h3>
            <div className="flex items-center gap-1 text-[10px] text-indigo-300">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Conversion performance</span>
            </div>
          </div>

          {/* Circle ring visual representation */}
          <div className="relative flex items-center justify-center w-14 h-14">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 60 60">
              {/* Back Circle */}
              <circle
                cx="30"
                cy="30"
                r="24"
                className="stroke-slate-800"
                strokeWidth="4"
                fill="none"
              />
              {/* Progress Circle */}
              <circle
                cx="30"
                cy="30"
                r="24"
                className="stroke-indigo-500 transition-all duration-500"
                strokeWidth="4"
                strokeDasharray={circ}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="none"
              />
            </svg>
            <span className="absolute text-[10px] font-bold text-slate-300">{openRate}%</span>
          </div>
        </div>

      </div>

      {/* 🔍 Search & Filters Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md">
        
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
            <Search className="w-4 h-4" />
          </span>
          <input
            onChange={(e) => setSearchQuery(e.target.value)}
            value={searchQuery}
            type="text"
            placeholder="Search recipient address or subject..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-600 outline-none focus:border-indigo-500 transition-all text-sm"
          />
        </div>

        {/* Filter Toggle Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-600/10'
                : 'bg-slate-900 border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setStatusFilter('opened')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              statusFilter === 'opened'
                ? 'bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-600/10'
                : 'bg-slate-900 border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            Opened
          </button>
          <button
            onClick={() => setStatusFilter('unopened')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              statusFilter === 'unopened'
                ? 'bg-amber-600 border-amber-600 text-white shadow-md shadow-amber-600/10'
                : 'bg-slate-900 border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            Unopened
          </button>

          {/* Settings Trigger Icon */}
          <button
            onClick={() => setflagger(!flagger)}
            className={`ml-2 p-2.5 rounded-xl border transition-all cursor-pointer ${
              flagger 
                ? 'bg-pink-600 border-pink-600 text-white animate-spin-slow'
                : 'bg-slate-900 border-white/10 text-slate-400 hover:text-white hover:border-white/20'
            }`}
            title="Configure Credentials"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* ⚙️ SMTP Credentials Settings Drawer */}
      {flagger && (
        <div className="bg-slate-950/80 border border-white/10 rounded-2xl p-6 backdrop-blur-lg shadow-xl max-w-xl mx-auto space-y-4 animate-[fadeIn_0.25s_ease-out]">
          <div className="flex items-center gap-3 border-b border-white/5 pb-3">
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
              <Settings className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Update SMTP Configuration</h3>
              <p className="text-xs text-slate-400">Modify your SMTP server settings and credentials.</p>
            </div>
          </div>

          {/* Preset Selector */}
          <div className="grid grid-cols-3 p-1 bg-slate-900/60 rounded-xl border border-white/5 gap-1">
            <button
              onClick={() => applyPreset('gmail')}
              className={`py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                preset === 'gmail'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Gmail
            </button>
            <button
              onClick={() => applyPreset('mailhog')}
              className={`py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                preset === 'mailhog'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Mailhog
            </button>
            <button
              onClick={() => applyPreset('custom')}
              className={`py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                preset === 'custom'
                  ? 'bg-purple-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Custom
            </button>
          </div>

          {/* Configuration Inputs */}
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase text-slate-400">Host</label>
                <input
                  type="text"
                  value={host}
                  onChange={(e) => setHost(e.target.value)}
                  placeholder="smtp.gmail.com"
                  disabled={preset === 'gmail' || preset === 'mailhog'}
                  className="px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-white text-xs disabled:opacity-50"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase text-slate-400">Port</label>
                <input
                  type="number"
                  value={port}
                  onChange={(e) => setPort(e.target.value)}
                  placeholder="465"
                  disabled={preset === 'gmail' || preset === 'mailhog'}
                  className="px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-white text-xs disabled:opacity-50"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 bg-slate-900/30 p-2 rounded-lg border border-white/5">
              <input
                type="checkbox"
                id="drawer-secure"
                checked={secure}
                onChange={(e) => setSecure(e.target.checked)}
                disabled={preset === 'gmail' || preset === 'mailhog'}
                className="w-3.5 h-3.5 accent-indigo-500 rounded cursor-pointer"
              />
              <label htmlFor="drawer-secure" className="text-[10px] text-slate-300 font-semibold cursor-pointer select-none">
                Use SSL/TLS (Secure Connection)
              </label>
            </div>

            {preset !== 'mailhog' && (
              <>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase text-slate-400">Username / Email</label>
                  <input
                    type="email"
                    value={smtpUser}
                    onChange={(e) => setSmtpUser(e.target.value)}
                    placeholder="sender@arpitcode.me"
                    className="px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-white text-xs"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase text-slate-400">Password / App Key</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-white font-mono text-xs"
                  />
                </div>
              </>
            )}

            <button 
              onClick={HandleAppPass}
              disabled={loadingPass}
              className="w-full mt-2 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold transition shadow-lg shadow-pink-600/25 cursor-pointer active:scale-95 disabled:opacity-50 text-xs flex items-center justify-center gap-2"
            >
              {loadingPass ? (
                <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              ) : (
                "Save Configuration"
              )}
            </button>
          </div>
        </div>
      )}

      {/* 📊 Tracking Grid Table */}
      <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          {filteredEmails.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/60 border-b border-white/10 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="p-4 pl-6">Recipient</th>
                  <th className="p-4">Subject</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4">Opened At</th>
                  <th className="p-4 text-center">Open Count</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm text-slate-300">
                {filteredEmails.map((email, key) => (
                  <tr key={key} className="hover:bg-white/5 transition-colors group">
                    <td className="p-4 pl-6 font-medium text-white truncate max-w-[220px]">
                      {email.recipient}
                    </td>
                    <td className="p-4 truncate max-w-[280px]" title={email.subject}>
                      {email.subject || <span className="text-slate-500 italic">No Subject</span>}
                    </td>
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                        email.count >= 1 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${email.count >= 1 ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                        {email.count >= 1 ? 'Opened' : 'Sent (Pending)'}
                      </span>
                    </td>
                    <td className="p-4 text-slate-400">
                      {email.openedAt ? (
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-500" />
                          <span>{new Date(email.openedAt).toLocaleString()}</span>
                        </div>
                      ) : (
                        <span className="text-slate-600 italic">Not Opened Yet</span>
                      )}
                    </td>
                    <td className="p-4 text-center font-bold text-white font-mono">
                      {email.count >= 0 ? email.count : 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            /* Empty state tracker view */
            <div className="flex flex-col items-center justify-center py-16 text-center text-slate-500 px-4">
              <div className="mb-6">
                <EmptyDoodle />
              </div>
              <h3 className="text-lg font-bold text-slate-400 mb-2">No Tracking Results Found</h3>
              <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
                {searchQuery || statusFilter !== 'all' 
                  ? "We couldn't find any results matching your search query or status filter. Try clearing filters."
                  : "Draft your first mail using the composer card above to activate real-time tracking pixels."}
              </p>
              
              {(searchQuery || statusFilter !== 'all') && (
                <button 
                  onClick={() => { setSearchQuery(''); setStatusFilter('all'); }}
                  className="mt-4 px-4 py-2 bg-slate-900 border border-white/10 hover:border-white/20 text-slate-300 hover:text-white rounded-xl text-xs transition font-semibold cursor-pointer"
                >
                  Clear Filters & Search
                </button>
              )}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}