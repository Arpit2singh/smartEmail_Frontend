import { createContext } from "react";
import { useState } from "react";
import React from 'react'
import { useUser } from '@clerk/clerk-react'
export const MyContext = createContext() ;

const UserContext = ({children}) => {
  const { isSignedIn, user, isLoaded } = useUser()
  const [checkUSER, setcheckUSER] = useState(null)   


      const checkUser = async(email)=>{
        if (!email) return;
     try {
         //  if (!isLoaded || !user?.primaryEmailAddress?.emailAddress) return;
        const response = await fetch(`${import.meta.env.VITE_API_URL}/checkUser` , {
            method : 'POST' , 
            headers : {
                'Content-Type' : 'application/json' 
            } , 
            body : JSON.stringify({
                email : email || user.primaryEmailAddress?.emailAddress 
            })
        })
        const data = await response.json() ; 
    
        if(data.exists){
            setcheckUSER(true) ; 
        }
        else{
            setcheckUSER(false) ; 
        }
     } catch (error) {
      console.error("Check user error:", error);
      setcheckUSER(false);
     }
      }

 
  return (
   <MyContext.Provider value={{checkUSER , setcheckUSER , checkUser}}>
    {children}
   </MyContext.Provider>
  )
}

export default UserContext