import React, { useContext, useEffect } from 'react'
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton, useUser } from '@clerk/clerk-react';
import { MyContext } from './UserContext';
import Poper from './component/Poper';

const App = () => {
  const { checkUSER, setcheckUSER, checkUser } = useContext(MyContext);
  const { isSignedIn, user, isLoaded } = useUser();

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
    <div className='min-h-screen bg-slate-950 text-white'>
      <SignedOut>
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
          <h1 className="text-3xl font-bold">SmartEmail</h1>
          <p className="text-slate-400">Please sign in to access your workspace</p>
          <div className="flex gap-4">
            <SignInButton mode="modal">
              <button className="px-4 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-500 cursor-pointer">Sign In</button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="px-4 py-2 bg-slate-800 rounded-lg hover:bg-slate-700 cursor-pointer">Sign Up</button>
            </SignUpButton>
          </div>
        </div>
      </SignedOut>

      <SignedIn>
        <header className="border-b border-white/10 px-6 py-4 flex justify-between items-center">
          <h1 className="font-bold text-lg">SmartEmail Workspace</h1>
          <UserButton afterSignOutUrl="/" />
        </header>
        <main className="p-6 max-w-7xl mx-auto">
          {checkUSER === null ? (
            <p className="text-slate-400">Loading workspace...</p>
          ) : checkUSER ? (
            <p className="text-emerald-400">SMTP Configured & Ready</p>
          ) : (
            <Poper />
          )}
        </main>
      </SignedIn>
    </div>
  );
}

export default App;