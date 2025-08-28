// import React from 'react'
// import { Link, Outlet, useNavigate } from 'react-router-dom'

// function useAuth() {
//   const token = localStorage.getItem('token')
//   return { token }
// }

// export default function App(){
//   const nav = useNavigate()
//   const { token } = useAuth()
//   React.useEffect(() => {
//     if (!token) nav('/login')
//   }, [token])
//   const logout = () => { localStorage.clear(); nav('/login') }
//   return (
//     <div style={{display:'flex', minHeight:'100vh', fontFamily:'sans-serif'}}>
//       <aside style={{width:220, borderRight:'1px solid #ddd', padding:16}}>
//         <h3>Hospital Reg</h3>
//         <nav style={{display:'grid', gap:8}}>
//           <Link to="/dashboard">Dashboard</Link>
//           <Link to="/new">Add Patient</Link>
//           <Link to="/patients">Patients</Link>
//           <Link to="/analytics">Analytics</Link>
//           <button onClick={logout}>Logout</button>
//         </nav>
//       </aside>
//       <main style={{flex:1, padding:24}}>
//         <Outlet/>
//       </main>
//     </div>
//   )
// }


import React from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import './app.css'

function useAuth() {
  const token = localStorage.getItem('token')
  return { token }
}

export default function App(){
  const nav = useNavigate()
  const { token } = useAuth()
  React.useEffect(() => {
    if (!token) nav('/login')
  }, [token])
  const logout = () => { localStorage.clear(); nav('/login') }

  return (
    <div className="app">
      {/* 🔹 Top Nav Bar with Hospital Info */}
      <header className="topbar">
        <div className="hospital-name">JIPMER Multi Speciality Consulting Unit</div>
        <div className="hospital-info">
          <span>YANAM - 533464</span>
          <span>📞 08842323246</span>
          <span>✉️ yanammscu@jipmer.ac.in</span>
        </div>
      </header>

      <div className="layout">
        {/* 🔹 Sidebar */}
        <aside className="sidebar">
          <h3>Hospital Reg</h3>
          <nav>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/new">Add Patient</Link>
            <Link to="/patients">Patients</Link>
            <Link to="/analytics">Analytics</Link>
            <button onClick={logout} className="logout-btn">Logout</button>
          </nav>
        </aside>

        {/* 🔹 Main Content */}
        <main className="content">
          <Outlet/>
        </main>
      </div>
    </div>
  )
}
