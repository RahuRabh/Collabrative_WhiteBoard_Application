import React, { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'

import Board from './Board.js';
import './styles/styles.css';



const Account = ({ session }) => {

  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState(null)
  const [website, setWebsite] = useState(null)
  const [avatar_url, setAvatarUrl] = useState(null)
  


  useEffect(() => {
    getProfile()

  }, [session])




  const getProfile = async () => {
    try {
      setLoading(true)
      const { user } = session

      let { data, error, status } = await supabase
        .from('profiles')
        .select(`username, website, avatar_url`)
        .eq('id', user.id)
        .single()

      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setUsername(data.username)
        setWebsite(data.website)
        setAvatarUrl(data.avatar_url)
      }
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }



  const updateProfile = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)
      const { user } = session

      const updates = {
        id: user.id,
        username,
        website,
        avatar_url,
        updated_at: new Date(),
      }

      let { error } = await supabase.from('profiles').upsert(updates)

      if (error) {
        throw error
      }
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }







  return (
    <React.Fragment>
      <center>
        <h1>Collabrative Whiteboarding Application 👩🏻‍🎨 👨🏽‍🎨</h1>
      </center>
      <Board userEmailAddress={session.user.email}/>

      <div aria-live="polite" className='bottomStroke'>
      <button
        type="button"
        className="button_Logout"
        onClick={() => supabase.auth.signOut()}
      >
        Sign Out
      </button>
    </div>
    </React.Fragment>
    
  )
}

export default Account