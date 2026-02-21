import React, { useState, useContext, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { toast } from 'react-toastify';
import { MyContext } from '../UserContext';
import { MailPlaneDoodle } from './Doodles';
import { Send, Activity, Eye, Mail, Clock, MessageSquare, AlertCircle, Sparkles, Wand2 } from 'lucide-react';

export default function SendEmailForm() {
  const { emails, fetchEmail } = useContext(MyContext);
  const [formData, setFormData] = useState({ to: '', subject: '', body: '' });
  const [loading, setLoading] = useState(false);
  const [showPlane, setShowPlane] = useState(false);
  const { isSignedIn, user, isLoaded } = useUser();

  // AI Copilot States
  const [showAiCopilot, setShowAiCopilot] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiTone, setAiTone] = useState('professional');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSubjects, setAiSubjects] = useState([]);

  // AI Operations Handlers
  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setAiLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/ai/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'generate',
          prompt: aiPrompt.trim()
        })
      });

      const data = await response.json();
      if (data.success && data.result) {
        setFormData(prev => ({ ...prev, body: data.result }));
        toast.success("AI draft generated successfully!");
      } else {
        toast.error(data.message || "Failed to generate AI draft.");
      }
    } catch (error) {
      console.error("AI Generate Error:", error);
      toast.error("Network error. Unable to connect to AI backend.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleAiAction = async (action) => {
    if (!formData.body.trim()) {
      toast.warning("Please enter some text in the email body first.");
      return;
    }
    setAiLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/ai/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: action,
          text: formData.body.trim(),
          tone: aiTone
        })
      });

      const data = await response.json();
      if (data.success && data.result) {
        if (action === 'subject') {
          // Parse list into clean subject lines
          const subjects = data.result
            .split('\n')
            .map(line => line.replace(/^\d+\.\s*/, '').trim())
            .filter(line => line.length > 0)
            .slice(0, 3);
          setAiSubjects(subjects);
          toast.success("AI Subject suggestions ready!");
        } else {
          setFormData(prev => ({ ...prev, body: data.result }));
          toast.success(`Email content optimized!`);
        }
      } else {
        toast.error(data.message || "Failed to process request.");
      }
    } catch (error) {
      console.error("AI Action Error:", error);
      toast.error("Network error. Unable to connect to AI backend.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.to.trim() || !formData.subject.trim() || !formData.body.trim()) {
      toast.warning("Please fill out all fields.");
      return;
    }

    setLoading(true);
    try {
      const sendEmail = await fetch(`${import.meta.env.VITE_API_URL}/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: user?.primaryEmailAddress?.emailAddress,
          to: formData.to.trim(),
          subject: formData.subject.trim(),
          body: formData.body.trim(),
        }),
      });

      if (sendEmail.ok) {
        toast.success("Tracked email sent successfully!");
        // Clear form and AI suggestions
        setFormData({ to: '', subject: '', body: '' });
        setAiSubjects([]);
        setAiPrompt('');
        
        // Trigger plane fly-off animation
        setShowPlane(true);
        setTimeout(() => setShowPlane(false), 2200);

        // Fetch emails to refresh lists instantly
        await fetchEmail();
      } else {
        const errorText = await sendEmail.text();
        console.error("Failed to send email:", errorText);
        toast.error("Failed to send email. Check if your App Password is valid.");
      }
    } catch (error) {
      console.error("Error sending email", error);
      toast.error("Network error. Unable to send tracked email.");
    } finally {
      setLoading(false);
    }
  };

  // Get recently opened emails (sorted by openedAt desc)
  const openedActivities = emails
    .filter(email => email.count >= 1 && email.recipient && email.openedAt)
    .sort((a, b) => new Date(b.openedAt) - new Date(a.openedAt))
    .slice(0, 3);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full items-start relative">
      
      {/* 🚀 Paper Plane Fly-off Overlay Animation */}
      {showPlane && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm pointer-events-none animate-[fadeIn_0.2s_ease-out]">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="animate-[bounce_1s_infinite] text-indigo-400">
              <MailPlaneDoodle className="w-40 h-40 scale-125" />
            </div>
            <h3 className="text-2xl font-bold text-white tracking-wide animate-pulse">Launching tracking pixel...</h3>
          </div>
        </div>
      )}

      {/* 📝 Left Side: Compose Email Form */}
      <div className="lg:col-span-7 bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md shadow-xl flex flex-col justify-between relative overflow-hidden group">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none group-focus-within:bg-indigo-500/25 transition-all duration-500" />
        
        <div>
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-indigo-500/10 rounded-xl text-indigo-400">
                <Mail className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-white">Compose Tracked Mail</h2>
            </div>
            
            <button
              type="button"
              onClick={() => setShowAiCopilot(!showAiCopilot)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                showAiCopilot 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
                  : 'bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-300 animate-pulse" />
              <span>AI Copilot</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            
            {/* AI COPILOT INTERACTIVE DRAWER */}
            {showAiCopilot && (
              <div className="bg-slate-900/60 border border-indigo-500/20 rounded-2xl p-4.5 mb-2 animate-[fadeIn_0.3s_ease-out] relative">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
                  <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">AI Email Co-pilot</span>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex gap-2">
                    <input 
                      type="text"
                      placeholder="Prompt (e.g. Write a polite proposal follow-up)"
                      className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-white/5 text-xs text-white placeholder-slate-600 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={handleAiGenerate}
                      disabled={aiLoading || !aiPrompt.trim()}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {aiLoading ? (
                        <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      ) : (
                        <Wand2 className="w-3.5 h-3.5" />
                      )}
                      <span>Draft</span>
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-white/5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] uppercase font-bold text-slate-500">Tone:</span>
                      {['professional', 'friendly', 'casual', 'urgent'].map((tone) => (
                        <button
                          key={tone}
                          type="button"
                          onClick={() => setAiTone(tone)}
                          className={`px-2.5 py-1 rounded-lg text-[9px] font-bold capitalize transition-all cursor-pointer ${
                            aiTone === tone
                              ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/35'
                              : 'bg-white/2 border border-white/5 text-slate-400 hover:text-white'
                          }`}
                        >
                          {tone}
                        </button>
                      ))}
                    </div>

                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleAiAction('tone')}
                        disabled={aiLoading || !formData.body.trim()}
                        className="px-2.5 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[9px] font-bold text-slate-300 hover:text-white transition cursor-pointer disabled:opacity-40"
                      >
                        Apply Tone
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAiAction('improve')}
                        disabled={aiLoading || !formData.body.trim()}
                        className="px-2.5 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[9px] font-bold text-slate-300 hover:text-white transition cursor-pointer disabled:opacity-40"
                      >
                        Polish
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAiAction('subject')}
                        disabled={aiLoading || !formData.body.trim()}
                        className="px-2.5 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[9px] font-bold text-slate-300 hover:text-white transition cursor-pointer disabled:opacity-40"
                      >
                        Suggest Subjects
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Recipient Address</label>
              <input 
                type="email" 
                placeholder="target-recipient@gmail.com" 
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-600 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm"
                value={formData.to}
                onChange={(e) => setFormData({...formData, to: e.target.value})}
                required 
              />
            </div>

            {/* AI SUGGESTED SUBJECT RECOM Pills */}
            {aiSubjects.length > 0 && (
              <div className="flex flex-col gap-1.5 mt-1.5 animate-[fadeIn_0.2s_ease-out]">
                <label className="text-[9px] font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 animate-pulse" />
                  <span>AI Suggested Subjects (Click to apply)</span>
                </label>
                <div className="flex flex-col gap-1.5">
                  {aiSubjects.map((subj, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, subject: subj }));
                        toast.info("Subject applied!");
                      }}
                      className="text-left w-full px-3 py-2 text-xs text-slate-300 bg-indigo-500/5 hover:bg-indigo-500/10 border border-indigo-500/15 hover:border-indigo-500/30 rounded-xl transition cursor-pointer flex items-center justify-between group/subj"
                    >
                      <span className="truncate pr-4">{subj}</span>
                      <span className="text-[9px] text-indigo-400 font-medium shrink-0">Use Subject →</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Subject</label>
              <input 
                type="text" 
                placeholder="Important: Proposal Review" 
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-600 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm"
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                required 
              />
            </div>


            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Email Body</label>
              <textarea 
                placeholder="Type your message here. The hidden tracking pixel (1x1 transparent png) will automatically append to the bottom." 
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-600 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all h-36 resize-none text-sm leading-relaxed"
                value={formData.body}
                onChange={(e) => setFormData({...formData, body: e.target.value})}
                required 
              ></textarea>
            </div>

            <button 
              type="submit" 
              className="w-full mt-2 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all duration-200 shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send Tracked Email
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* 📊 Right Side: Live Activity Feed */}
      <div className="lg:col-span-5 bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md shadow-xl flex flex-col justify-between h-full min-h-[440px] relative">
        <div className="w-full flex-1">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400">
                <Activity className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-white">Live Activity Feed</h2>
            </div>
            
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>LIVE</span>
            </div>
          </div>

          <div className="space-y-4">
            {openedActivities.length > 0 ? (
              openedActivities.map((email, key) => (
                <div 
                  key={key} 
                  className="relative bg-slate-900/60 rounded-2xl border border-white/5 p-4 transition-all hover:bg-slate-900/80 cursor-default animate-[fadeIn_0.3s_ease-out]"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 text-indigo-400">
                      <Eye className="w-4 h-4" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs font-bold text-slate-300 truncate">
                        Email read by Recipient
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 truncate">
                        To: <span className="font-semibold text-slate-200">{email.recipient}</span>
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5 truncate">
                        Subject: <span className="italic text-slate-400">"{email.subject || 'No Subject'}"</span>
                      </p>

                      <div className="mt-2.5 flex items-center gap-4 text-xs text-slate-400">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-500" />
                          <span>{new Date(email.openedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                          <span>Count: <span className="font-bold text-indigo-400 font-mono text-sm">{email.count}</span></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              /* Empty state feed */
              <div className="flex flex-col items-center justify-center text-center py-10 text-slate-500">
                <div className="relative mb-4">
                  <div className="absolute inset-0 bg-indigo-500/5 rounded-full blur-xl animate-pulse" />
                  <Activity className="w-12 h-12 text-slate-600 animate-pulse" style={{ animationDuration: '3s' }} />
                </div>
                <h3 className="text-sm font-bold text-slate-400 mb-1">Awaiting interaction...</h3>
                <p className="text-xs text-slate-500 max-w-[240px] leading-relaxed">
                  Send a tracked email. The moment the recipient views it, live updates will stream here.
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* Footnote warning details */}
        <div className="mt-6 flex items-start gap-2 text-[10px] text-slate-500 border-t border-white/5 pt-4">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 text-slate-600" />
          <span>Tracking relies on image loads. Some mail clients may block images by default.</span>
        </div>
      </div>

    </div>
  );
}