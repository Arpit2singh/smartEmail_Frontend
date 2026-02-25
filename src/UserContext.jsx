import { createContext } from "react";
import { useState } from "react";
import React from 'react'
import { useUser } from '@clerk/clerk-react'

export const MyContext = createContext() ;

const UserContext = ({children}) => {
  const { isSignedIn, user, isLoaded } = useUser()
  const [checkUSER, setcheckUSER] = useState(null)   
  const [emails, setEmails] = useState([])

  const checkUser = async (email) => {
    if (!email) return;
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/checkUser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email || user.primaryEmailAddress?.emailAddress 
        })
      });
      const data = await response.json();
  
      if (data.exists) {
        setcheckUSER(true); 
      } else {
        setcheckUSER(false); 
      }
    } catch (error) {
      console.error("Check user error:", error);
      setcheckUSER(false);
    }
  }

  const fetchEmail = async () => {
    const activeEmail = user?.primaryEmailAddress?.emailAddress;
    if (!activeEmail) return;
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/emails`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: activeEmail
        })
      });
      const data = await response.json();
      if (Array.isArray(data)) {
        setEmails(data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  return (
    <MyContext.Provider value={{ checkUSER, setcheckUSER, checkUser, emails, setEmails, fetchEmail }}>
      {children}
    </MyContext.Provider>
  )
}

export default UserContext;