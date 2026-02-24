import React, { useState, useEffect, useContext } from 'react';
import { useUser } from '@clerk/clerk-react' 
import { MyContext } from '../UserContext';
import { RotateCcwKey } from 'lucide-react';


export default function Dashboard() {
  const [emails, setEmails] = useState([]);
   const { isSignedIn, user, isLoaded } = useUser()
  
   const {checkUSER , setcheckUSER , checkUser} = useContext(MyContext)
   const [flagger, setflagger] = useState(false)
   const [AppPass, setAppPass] = useState('') ; 
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
       setflagger(false) ;
    }
    else{
        console.log("app password not set causing error")
    }
  }



  const changePassHandler = async()=>{
    try {
      
    } catch (error) {
      
    }
  }
  // Backend connect hone ke baad hum yahan API se data fetch karenge
  const fetchEmail = async()=>{
     if (!user?.primaryEmailAddress?.emailAddress) return; 
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/emails` , {
        method : 'POST' , 
        headers : {
            'Content-Type' : 'application/json' 
        } , 
        body : JSON.stringify({
            email : user.primaryEmailAddress?.emailAddress 
        })
        }) ; 
        const data = await response.json() ; 
        setEmails(data) ;
        console.log(emails)
    } catch (error) {
        console.error("Error fetching data:", error);
    }
  }
  useEffect(() => {
    // Dummy Data for now
    
    fetchEmail() ;
  // Handle loading state
   const interval = setInterval(fetchEmail , 5000) ; 
   return ()=>clearInterval(interval) 
  }, [isLoaded , user , isSignedIn]);
 if (!isLoaded) return <div>Loading...</div>
  // Protect the page from unauthenticated users
  if (!isSignedIn) return <div>Sign in to view this page</div>

  return (
    <div className='flex flex-wrap justify-between h-screen min-w-full overflow-y-auto ' >

        <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg min-w-[80vw]  ">
      <h2 className="text-2xl font-bold mb-6">Tracking Dashboard , Hey! {user.firstName} </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="p-3">Recipient</th>
              <th className="p-3">Subject</th>
              <th className="p-3">Status</th>
              <th className="p-3">Opened At</th>
              <th className="p-3">Count</th>
            </tr>
          </thead>
          <tbody  >
            {emails.map((email , key) => (
              <tr key={key} className="border-b hover:bg-gray-50">
                <td className="p-3">{email.recipient}</td>
                <td className="p-3">{email.subject}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-sm ${email.count >=1  ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {email.count >= 1 ? 'Opened' : 'Not Opened'}
                  </span>
                </td>
                <td className="p-3">{email.openedAt ? new Date(email.openedAt).toLocaleString() : 'Not Opened Yet'}</td>
                 <td className="p-3">{email.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    
     <div className="absolute z-20 bottom-0 top-2 right-5 cursor-pointer " >
      <div className="cursor-pointer w-max ml-auto" onClick={() => setflagger(!flagger)}>
            {flagger ? <RotateCcwKey  color='blue' size={30} className='animate-spin'/> : <RotateCcwKey color='white' size={30} />}
         </div>
  
      {flagger && ( <div className="w-full h-60 bg-blue-400/10 border border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-lg flex flex-col justify-between">
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
        </div> ) } 
      </div>
      </div>
     );
}