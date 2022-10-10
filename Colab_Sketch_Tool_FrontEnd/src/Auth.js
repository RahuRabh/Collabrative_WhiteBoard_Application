import React, { useState } from 'react'
import { supabase } from './supabaseClient'

export default function Auth() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)
      const { error } = await supabase.auth.signInWithOtp({ email })
      if (error) throw error
      alert('Check your email for the login link!')
    } catch (error) {
      alert(error.error_description || error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <React.Fragment>
      <div className='centeredLoginForm'>

    <div className="row flex-center flex">
      <div className="col-6 form-widget" aria-live="polite">
      <center>
        <h1>Collabrative Whiteboarding <br/> Application 👩🏻‍🎨 👨🏽‍🎨</h1>
      </center>
        <p className="description">
          Sign in via magic link with your email below
        </p>
        {loading ? (
          '🕣 Sending magic link...'
        ) : (
          <form onSubmit={handleLogin}>
            <label htmlFor="email">Enter Your Email:</label>
            <input
              id="email"
              className="inputField"
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            /><br/>
            <button className="button block button_Login" aria-live="polite">
              Send magic link ✨
            </button>
          </form>
        )}
      </div>
    </div>

    </div>
    </React.Fragment>
  )
}



