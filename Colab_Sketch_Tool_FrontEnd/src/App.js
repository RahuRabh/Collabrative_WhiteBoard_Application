import './App.css';
import './index.css'
import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import Auth from './Auth'
import Account from './Account'

export default function App() {
  const [session, setSession] = useState(null);

  const [title, setTitle] = useState("Collab. WB 👩🏻‍🎨 👨🏽‍🎨");


  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      document.title = title;
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  return (
    <div className="container">
      {!session ? (
        <Auth />
      ) : (
        <Account key={session.user.id} session={session} />
      )}
      .
    </div>
  )
}
