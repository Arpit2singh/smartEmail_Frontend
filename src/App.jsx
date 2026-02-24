import React, { useContext, useEffect, useState } from 'react'
import Dashboard from './component/Dashboard'
import SendEmailForm from './component/SendEmailForm'
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import { MyContext } from './UserContext';
import { useUser } from '@clerk/clerk-react' 
import Poper from './component/Poper';
import { ToastContainer } from 'react-toastify';
import LandingPage from './component/LandingPage';
import { Mail } from 'lucide-react';

const App = () => {
  const { checkUSER, setcheckUSER, checkUser } = useContext(MyContext);
  const { isSignedIn, user, isLoaded } = useUser();
  const [viewMode, setViewMode] = useState('workspace'); // 'workspace' | 'landing'

  const createInstance = async (email) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/instance`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email 
        })
      });

      const data = await response.json(); 
      if (data) {
        console.log(data.message);
      }
    } catch (error) {
      console.log("error while creating the instance", error);
    }
  }

  useEffect(() => {
    const initializeUser = async () => {
      if (user?.primaryEmailAddress?.emailAddress) {
        const userEmail = user.primaryEmailAddress.emailAddress;
        await createInstance(userEmail); 
        await checkUser(userEmail);
      }
    }
    if (isLoaded && isSignedIn) {
      initializeUser();
    }
  }, [user, isLoaded, isSignedIn]);

  return (
    <div className='relative min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white overflow-x-hidden'>
      {/* 1. SignedOut View: Landing Page */}
      <SignedOut>
        <LandingPage setViewMode={setViewMode} />
      </SignedOut>

      {/* 2. SignedIn View */}
      <SignedIn>
        {viewMode === 'landing' ? (
          <LandingPage setViewMode={setViewMode} />
        ) : (
          <div className="min-h-screen flex flex-col animate-fade-in">
            {/* Main App Navbar */}
            <header className="glass-panel border-b border-white/10 px-6 py-4 flex justify-between items-center z-30 sticky top-0 bg-slate-950/80 backdrop-blur-md">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 font-bold text-lg text-white">
                  <span className="p-1.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
                    <Mail className="w-4 h-4 text-white" />
                  </span>
                  <span>SmartEmail Workspace</span>
                </div>
                {user?.primaryEmailAddress?.emailAddress && (
                  <div className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-400 text-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Connected: <span className="font-semibold text-slate-300">{user.primaryEmailAddress.emailAddress}</span>
                  </div>
                )}
              </div>

              {/* Navigation Tabs for Toggle */}
              <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-xl border border-white/10">
                <button
                  onClick={() => setViewMode('landing')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    viewMode === 'landing'
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Front Page
                </button>
                <button
                  onClick={() => setViewMode('workspace')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    viewMode === 'workspace'
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Workspace
                </button>
              </div>

              <div className="flex items-center gap-3">
                <UserButton 
                  afterSignOutUrl="/" 
                  appearance={{
                    elements: {
                      userButtonAvatarBox: 'w-9 h-9 border border-indigo-500/40 hover:scale-105 transition',
                    }
                  }}
                />
              </div>
            </header>

            {/* Main workspace view */}
            <main className="flex-1 p-6 max-w-7xl mx-auto w-full z-10">
              {checkUSER === null ? (
                <div className="flex flex-col justify-center items-center h-[60vh] gap-4">
                  <div className="w-12 h-12 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin" />
                  <h2 className="text-slate-400 text-lg font-medium animate-pulse">Synchronizing workspace details...</h2>
                </div>
              ) : checkUSER === true ? (
                <div className="space-y-8 animate-[fadeIn_0.5s_ease-out]">
                  <SendEmailForm />
                  <Dashboard />
                </div>
              ) : (
                <div className="animate-[fadeIn_0.5s_ease-out]">
                  <Poper />
                </div>
              )}
            </main>
            
            <ToastContainer theme="dark" position="bottom-right" />
          </div>
        )}
      </SignedIn>
    </div>
  )
}

export default App;