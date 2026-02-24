import React, { useContext } from 'react'
import Dashboard from './component/Dashboard'
import SendEmailForm from './component/SendEmailForm'
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/clerk-react';
import { MyContext } from './UserContext';
import { useUser } from '@clerk/clerk-react' 
import { useEffect } from 'react';
import Poper from './component/Poper';
 import { ToastContainer, toast } from 'react-toastify';

const App = () => {
   const {checkUSER , setcheckUSER ,checkUser} = useContext(MyContext)
   const { isSignedIn, user, isLoaded } = useUser()
  

      const createInstance = async(email)=>{
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/instance` , {
            method : 'POST' ,
            headers : { 
              'Content-Type' : 'application/json'
            },
            body :JSON.stringify ({
              email : email 
            })
          })

          const data =await response.json() ; 
          if(data){
            console.log(data.message)
          }
        } catch (error) {
              console.log("error while creating the instance" , error)           
        }
      }

   useEffect(() => {
    // if (user) {
   
    //   createInstance() ;
    //    checkUser();
    // }

    const initializeUser = async()=>{
      const userEmail = user.primaryEmailAddress.emailAddress;
        await createInstance(userEmail); 
        await checkUser(userEmail);
    }
    if (isLoaded) {
      initializeUser();
    }
  }, [user , isLoaded]);

  return (
    <div className='bg-black p-3 h-full'>
      <header>
      {/* Show the sign-in and sign-up buttons when the user is signed out */}
        <SignedOut>
        <h1 className='font-bold bg-gradient-to-br from-red-400 via-blue-400 to-black text-8xl bg-clip-text text-transparent '>Please sign in to access dashboard</h1>
      </SignedOut>
      <SignedOut>
        <div className='flex p-2 gap-5 justify-center items-center h-screen '>
        <button className='bg-red-400 p-3 w-[250px] rounded-2xl font-bold hover:scale-95 '>  <SignInButton /></button>
        <button className='bg-red-400 p-3 w-[250px] rounded-2xl font-bold hover:scale-95 '>  <SignUpButton /></button>
        </div>
      </SignedOut>
      {/* Show the user button when the user is signed in */}
      <SignedIn>
        <UserButton />
      </SignedIn>
    </header>

      <SignedIn>
        <div className='p-2 '>
       
          { checkUSER === null ? (
            <div className="flex justify-center items-center h-[50vh]">
               <h2 className="text-white text-2xl font-bold animate-pulse">Loading workspace...</h2>
            </div>
          ) 
          
        
          : checkUSER === true ? (
            <div>
              <SendEmailForm/>
              <Dashboard/>
            </div>
          ) 
          
        
          : (
            <Poper/>
          )} 

          <ToastContainer position='top-right'/>
       </div>
      </SignedIn>
    
    </div>
  )
}

export default App