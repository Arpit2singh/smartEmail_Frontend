import React, { useContext, useState } from 'react'
import { MyContext } from '../UserContext'
import { useUser } from '@clerk/clerk-react' 
const Poper = () => {
  const { checkUSER, setcheckUSER , checkUser } = useContext(MyContext);
  const [AppPass, setAppPass] = useState('')
  const [party, setparty] = useState('')
  const { isSignedIn, user, isLoaded } = useUser()
  const HandleAppPass = async()=>{
   
        const response = await fetch(`${import.meta.env.VITE_API_URL}/passSet` , {
        method : 'POST' , 
        headers : {
            'Content-Type' : 'application/json' 
        } , 
        body : JSON.stringify({
            email : user.primaryEmailAddress?.emailAddress , 
            password : AppPass 
        })
    })
    
    const data = await response.json()  ; 
    if(data.flag) {
        console.log("App password set") ; 
        setcheckUSER(true) ;
       
    }
    else{
        console.log("app password not set causing error")
    }
  }


  const HandleParty = async()=>{
       console.log(party) ;
       
  }
  return (
    <div className="flex justify-center items-center min-h-[90vh] px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        
        {/* Card 1: App Password */}
        <div className="w-full h-60 bg-white/20 border border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-lg flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">
              Activate App Password
            </h2>
            <p className="text-sm text-white/80">
              Enter your app password to activate email functionality and enable secure access.
            </p>
          </div>

          <div className="mt-4">
            <input
              onChange={(e)=>setAppPass(e.target.value)}
              type="password"
              placeholder="Enter App Password"
              className="w-full px-3 py-2 rounded-lg bg-white/30 text-white placeholder-white/70 outline-none border border-white/20"
            />
            <button onClick={HandleAppPass} className="mt-3 w-full py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition">
              Activate
            </button>
          </div>
        </div>

        {/* Card 2: Third Party Domain */}
        <div className="w-full h-60 bg-white/20 border border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-lg flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">
              Enable Third-Party Domain
            </h2>
            <p className="text-sm text-white/80">
              Configure and verify your third-party domain to use external email services.
            </p>
          </div>

          <div className="mt-4">
            <input
              onChange={(e)=>setparty(e.target.value)}
              type="text"
              placeholder="Enter Domain (e.g. example.com)"
              className="w-full px-3 py-2 rounded-lg bg-white/30 text-white placeholder-white/70 outline-none border border-white/20"
            />
            <button onClick={HandleParty} className="mt-3 w-full py-2 rounded-lg bg-purple-500 hover:bg-purple-600 text-white font-medium transition">
              Verify Domain
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Poper;