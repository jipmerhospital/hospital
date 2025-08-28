import React from 'react'
import api from '../api'
import './dashboard.css'

export default function Dashboard(){
  const [stats,setStats]=React.useState({total:0})
  React.useEffect(()=>{
    api.get('/patients?limit=1').then(({data})=>{
      setStats({ total: data.total })
    })
  },[])
  return (
    <div>
      <h2>Dashboard</h2>
      <div>Total Patients: {stats.total}</div>
      <p>Use the sidebar to add patients, view history, edit, print and see analytics.</p>
    </div>
  )
}
