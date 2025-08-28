import React from 'react'
import api from '../api'

export default function Login(){
  const [email,setEmail]=React.useState('')
  const [password,setPassword]=React.useState('')
  const [error,setError]=React.useState('')
  const submit=async(e)=>{
    e.preventDefault()
    setError('')
    try{
      const {data}=await api.post('/auth/login',{email,password})
      localStorage.setItem('token',data.token)
      localStorage.setItem('me',JSON.stringify(data.user))
      window.location.href='/dashboard'
    }catch(err){ setError(err.response?.data?.message || 'Login failed')}
  }
  return (
    <div style={{maxWidth:360, margin:'80px auto'}}>
      <h2>Login</h2>
      <form onSubmit={submit} style={{display:'grid', gap:8}}>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email"/>
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password"/>
        <button>Login</button>
        {error && <div style={{color:'red'}}>{error}</div>}
      </form>
    </div>
  )
}
