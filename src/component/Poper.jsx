import React, { useContext, useState, useEffect } from 'react';
import { MyContext } from '../UserContext';
import { useUser } from '@clerk/clerk-react';
import { LockKeyDoodle, SparkleDoodle } from './Doodles';
import { Key, Globe, Info, CheckCircle, ChevronDown, ChevronUp, Mail, Terminal, Settings, Lock } from 'lucide-react';
import { toast } from 'react-toastify';

const Poper = () => {
  const { checkUSER, setcheckUSER } = useContext(MyContext);
  const { user, isLoaded } = useUser();
  
  const [preset, setPreset] = useState('gmail'); // 'gmail' | 'mailhog' | 'custom'
  const [host, setHost] = useState('smtp.gmail.com');
  const [port, setPort] = useState(465);
  const [secure, setSecure] = useState(true);
  const [smtpUser, setSmtpUser] = useState('');
  const [password, setPassword] = useState('');
  const [showGuide, setShowGuide] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const HandleSmtpConfig = async () => {
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

    setLoading(true);
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
        toast.success("SMTP configuration successful! Workspace activated.");
        setcheckUSER(true);
      } else {
        toast.error(data.message || "Failed to configure SMTP. Please try again.");
      }
    } catch (error) {
      console.error("Error setting SMTP config:", error);
      toast.error("Network error. Unable to configure SMTP.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-[80vh] px-4 py-8 animate-[fadeIn_0.5s_ease-out]">
      <div className="w-full max-w-2xl bg-slate-900/40 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl relative">
        {/* Floating Sparkle doodle */}
        <div className="absolute -top-6 -right-6">
          <SparkleDoodle className="text-pink-400 opacity-80" />
        </div>

        {/* Heading */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-white tracking-tight mb-2">
            Configure Email Dispatcher
          </h2>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Set up your SMTP credentials for tracking. We route emails and embed high-security tracking pixels.
          </p>
        </div>

        {/* Preset Tab Buttons */}
        <div className="grid grid-cols-3 p-1 bg-slate-950/60 rounded-2xl border border-white/5 mb-8 gap-1">
          <button
            onClick={() => applyPreset('gmail')}
            className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
              preset === 'gmail'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Mail className="w-4 h-4" />
            Gmail Presets
          </button>
          <button
            onClick={() => applyPreset('mailhog')}
            className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
              preset === 'mailhog'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Terminal className="w-4 h-4" />
            Mailhog (Local)
          </button>
          <button
            onClick={() => applyPreset('custom')}
            className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
              preset === 'custom'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Settings className="w-4 h-4" />
            Custom SMTP
          </button>
        </div>

        {/* Unified Config Form */}
        <div className="space-y-5">
          {/* Informative alerts */}
          {preset === 'gmail' && (
            <div className="flex items-start gap-3 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-indigo-300 text-sm">
              <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Gmail Note:</span> Gmail requires 2-Step Verification and a <strong>16-character App Password</strong> (not your normal account password).
              </div>
            </div>
          )}

          {preset === 'mailhog' && (
            <div className="flex items-start gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-300 text-sm">
              <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Mailhog Note:</span> Useful for offline/local testing. Sends test emails locally without credentials. Set your local Mailhog server to run on port `1025`.
              </div>
            </div>
          )}

          {preset === 'custom' && (
            <div className="flex items-start gap-3 p-4 bg-purple-500/10 border border-purple-500/20 rounded-2xl text-purple-300 text-sm">
              <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Custom SMTP Note:</span> Connect to any third-party SMTP server (e.g. Zoho, Hostinger for your domain `arpitcode.me`). Credentials are encrypted using AES-256 before storage.
              </div>
            </div>
          )}

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">SMTP Host</label>
              <input
                type="text"
                value={host}
                onChange={(e) => setHost(e.target.value)}
                placeholder="smtp.example.com"
                disabled={preset === 'gmail' || preset === 'mailhog'}
                className="px-4 py-3 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-slate-600 outline-none focus:border-indigo-500 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">SMTP Port</label>
              <input
                type="number"
                value={port}
                onChange={(e) => setPort(e.target.value)}
                placeholder="465"
                disabled={preset === 'gmail' || preset === 'mailhog'}
                className="px-4 py-3 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-slate-600 outline-none focus:border-indigo-500 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 bg-slate-950/40 p-3 rounded-xl border border-white/5">
            <input
              type="checkbox"
              id="secure-conn"
              checked={secure}
              onChange={(e) => setSecure(e.target.checked)}
              disabled={preset === 'gmail' || preset === 'mailhog'}
              className="w-4 h-4 accent-indigo-500 rounded cursor-pointer disabled:opacity-50"
            />
            <label htmlFor="secure-conn" className="text-xs text-slate-300 font-medium cursor-pointer select-none">
              Use SSL/TLS Connection (Requires secure port, e.g. 465)
            </label>
          </div>

          {preset !== 'mailhog' && (
            <>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">SMTP Username / Email</label>
                <input
                  type="email"
                  value={smtpUser}
                  onChange={(e) => setSmtpUser(e.target.value)}
                  placeholder="sender@arpitcode.me"
                  className="px-4 py-3 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-slate-600 outline-none focus:border-indigo-500 transition-all text-sm"
                />
              </div>

              <div className="flex flex-col gap-1.5 relative">
                <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">SMTP Password</label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter SMTP / App Password"
                    className="w-full pl-4 pr-12 py-3.5 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-slate-600 outline-none focus:border-indigo-500 transition-all font-mono text-sm"
                  />
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                    <Lock className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Gmail Guide Accordion */}
          {preset === 'gmail' && (
            <div className="bg-slate-950/40 border border-white/5 rounded-2xl overflow-hidden">
              <button
                onClick={() => setShowGuide(!showGuide)}
                className="w-full flex justify-between items-center px-4 py-3 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white transition cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-indigo-400" />
                  How to generate a Gmail App Password?
                </span>
                {showGuide ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showGuide && (
                <div className="px-4 pb-4 pt-1 text-xs text-slate-400 space-y-2.5 border-t border-white/5 leading-relaxed bg-slate-950/20 animate-[slideDown_0.2s_ease-out]">
                  <p>1. Open your <a href="https://myaccount.google.com" target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">Google Account Settings</a>.</p>
                  <p>2. Enable <strong>2-Step Verification</strong> under the Security tab.</p>
                  <p>3. Search for <strong>App Passwords</strong> in Google Account Search.</p>
                  <p>4. Select App <strong>Other (Custom name)</strong> and enter <em>SmartEmail Tracker</em>.</p>
                  <p>5. Copy the yellow 16-character passcode and paste it into the field above.</p>
                </div>
              )}
            </div>
          )}

          <button
            onClick={HandleSmtpConfig}
            disabled={loading}
            className="w-full py-4 mt-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all duration-200 shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <span className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                Activate SMTP Configuration
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Poper;