import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { toast } from 'react-toastify';

export default function SendEmailForm() {
  const [formData, setFormData] = useState({ to: '', subject: '', body: '' });
  const [loading, setLoading] = useState(false);
  const { isSignedIn, user, isLoaded } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const sendEmail = await fetch(`${import.meta.env.VITE_API_URL}/send` , {
        method : 'POST' ,
        headers : {
            'Content-Type' :'application/json',
        } ,
      body : JSON.stringify({
      from : user.primaryEmailAddress?.emailAddress ,    
      to: formData.to,
      subject: formData.subject,
      body: formData.body,
    }), 
      })

      console.log("Email Payload:", formData);
      if(sendEmail.ok){
        console.log("Success! Email and Tracking Info:", await sendEmail.json());
      toast.success("Email sent successfully!");
      }
      else{
        console.error("Failed to send email:", await sendEmail.text());
        toast.error("Failed to send email check App password. Please try again.");
      }
      setFormData({ to: '', subject: '', body: '' });
    
    } catch (error) {
      console.error("Error sending email", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex justify-around w-screen h-full px-10 bg-black min-h-screen'>
      
      {/* 📝 Left Side: Email Form */}
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md mt-10 h-fit">
        <h2 className="text-2xl font-bold mb-4">Send Tracked Email</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input 
            type="email" 
            placeholder="To (e.g., person@gmail.com)" 
            className="border p-2 rounded"
            value={formData.to}
            onChange={(e) => setFormData({...formData, to: e.target.value})}
            required 
          />
          <input 
            type="text" 
            placeholder="Subject" 
            className="border p-2 rounded"
            value={formData.subject}
            onChange={(e) => setFormData({...formData, subject: e.target.value})}
            required 
          />
          <textarea 
            placeholder="Your message here..." 
            className="border p-2 rounded h-32"
            value={formData.body}
            onChange={(e) => setFormData({...formData, body: e.target.value})}
            required 
          ></textarea>
          <button 
            type="submit" 
            className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Email'}
          </button>
        </form>
      </div>
      

      <div className="w-full max-w-sm mt-10 flex flex-col gap-4">
        <h2 className="text-xl font-bold text-gray-50 px-2">Live Activity Feed</h2>
        
        {/* The Live Card Component */}
        <div className="relative bg-white rounded-2xl shadow-sm border border-gray-100 p-5 w-full font-sans transition-all hover:shadow-md cursor-default">
          
          {/* 🔴 Live Pulsing Indicator */}
          <div className="absolute top-5 right-5 flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-xs font-bold text-green-600 uppercase tracking-wider">Live</span>
          </div>

          <div className="flex items-start gap-4">
            {/* 👤 Icon Area */}
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>

            {/* 📝 Main Content */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 pr-12">User is viewing your link</h3>
              <p className="text-xs text-gray-500 mt-1">
                Target: <span className="font-medium text-gray-700">shyam@yahoo.com</span>
              </p>

              {/* ⏱️ Timer Box */}
              <div className="mt-3 flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
                <svg className="w-4 h-4 text-gray-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-semibold text-gray-600">
                  Time Spent: <span className="text-blue-600 font-mono text-base">00:45s</span>
                </span>
              </div>
            </div>
            
          </div>
        </div>
      </div>

    </div>
  );
}