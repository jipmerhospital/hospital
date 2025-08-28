import React from 'react'
import api from '../api'

export default function Analytics(){
  const [field,setField]=React.useState('state')
  const [value,setValue]=React.useState('')
  const [data,setData]=React.useState({ total:0, summary:[] })
  const [patients,setPatients]=React.useState([])
  const [page,setPage]=React.useState(1)
  const [pages,setPages]=React.useState(1)
  const [selected,setSelected]=React.useState(null)  

  // For editing popup
  const [editing,setEditing]=React.useState(null) 
  const [form,setForm]=React.useState({})

  const load=()=>{
    api.get('/patients/analytics/summary',{ params:{ field, value: value||undefined } })
       .then(({data})=>setData(data))
  }
  React.useEffect(load,[field,value])

  const loadPatients = (f, v, p=1) => {
    api.get('/patients/analytics/list',{ params:{ field:f, value:v, page:p, limit:20 } })
       .then(({data})=>{
         setPatients(data.items)
         setPage(p)
         setPages(data.pages)
         setSelected({ field:f, value:v })   
       })
  }

  // Print only selected patient
  const handlePrint = (patient) => {
    const w = window.open('', '', 'width=800,height=600')
    w.document.write(`
      <html>
        <head><title>Print</title></head>
        <body>
          <h2>Patient Details</h2>
          <p><b>Hospital No:</b> ${patient.hospitalNo}</p>
          <p><b>Name:</b> ${patient.name}</p>
          <p><b>Age/Sex:</b> ${patient.age}/${patient.sex}</p>
          <p><b>Phone:</b> ${patient.phoneNumber}</p>
          <p><b>State:</b> ${patient.state}</p>
          <p><b>Department:</b> ${patient.department}</p>
        </body>
      </html>
    `)
    w.document.close()
    w.print()
  }

  // Open popup for editing
  const openEdit = (patient) => {
    setEditing(patient)
    setForm(patient)
  }

  // Handle save edit
  const saveEdit = () => {
    api.put(`/patients/${editing._id}`, form).then(()=>{
      alert('Patient updated successfully')
      setEditing(null)
      loadPatients(selected.field, selected.value, page) // refresh list
    })
  }

  return (
    <div>
      <h2>Analytics</h2>
      <div style={{display:'flex', gap:8, marginBottom:8}}>
        <select value={field} onChange={e=>setField(e.target.value)}>
          <option value="state">State</option>
          <option value="department">Department</option>
          <option value="sex">Sex</option>
          <option value="mandalam">Mandalam</option>
          <option value="maritalStatus">Marital Status</option>
        </select>
        <input placeholder="Filter value (optional)" value={value} onChange={e=>setValue(e.target.value)} />
      </div>
      <div>Total patients{value?` for ${field}=${value}`:''}: <b>{data.total}</b></div>
      <ul>
        {data.summary.map(row=>(
          <li key={row._id || 'unknown'}>
            <button 
              style={{cursor:'pointer'}} 
              onClick={()=>loadPatients(field, row._id)}>
              {String(row._id || 'Unknown')}: {row.count}
            </button>
          </li>
        ))}
      </ul>

      {selected && (
        <div style={{marginTop:20}}>
          <h3>Patients for {selected.field}={selected.value || '(all)'}</h3>
          <table border="1" cellPadding="6">
            <thead>
              <tr>
                <th>Hospital No</th>
                <th>Name</th>
                <th>Age/Sex</th>
                <th>Phone</th>
                <th>State</th>
                <th>Department</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.map(p=>(
                <tr key={p._id}>
                  <td>{p.hospitalNo}</td>
                  <td>{p.name}</td>
                  <td>{p.age}/{p.sex}</td>
                  <td>{p.phoneNumber}</td>
                  <td>{p.state}</td>
                  <td>{p.department}</td>
                  <td>
                    <button onClick={()=>openEdit(p)}>Edit</button>
                    <button onClick={()=>handlePrint(p)}>Print</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{marginTop:8}}>Total: {patients.length} (page {page} of {pages})</div>
          <div style={{display:'flex', gap:8, marginTop:8}}>
            <button disabled={page<=1} onClick={()=>loadPatients(selected.field,selected.value,page-1)}>Prev</button>
            <div>Page {page} / {pages}</div>
            <button disabled={page>=pages} onClick={()=>loadPatients(selected.field,selected.value,page+1)}>Next</button>
          </div>
        </div>
      )}

      {/* ---- Edit Popup Modal ---- */}
      {editing && (
        <div style={{
          position:'fixed', top:0, left:0, width:'100%', height:'100%',
          background:'rgba(0,0,0,0.5)', display:'flex', justifyContent:'center', alignItems:'center'
        }}>
          <div style={{background:'#fff', padding:20, borderRadius:8, minWidth:300}}>
            <h3>Edit Patient</h3>
            <label>Hospital No:
              <input value={form.hospitalNo||''} onChange={e=>setForm({...form, hospitalNo:e.target.value})}/>
            </label><br/>
            <label>Name:
              <input value={form.name||''} onChange={e=>setForm({...form, name:e.target.value})}/>
            </label><br/>
            <label>Age:
              <input type="number" value={form.age||''} onChange={e=>setForm({...form, age:e.target.value})}/>
            </label><br/>
            <label>Sex:
              <input value={form.sex||''} onChange={e=>setForm({...form, sex:e.target.value})}/>
            </label><br/>
            <label>Phone:
              <input value={form.phoneNumber||''} onChange={e=>setForm({...form, phoneNumber:e.target.value})}/>
            </label><br/>
            <label>State:
              <input value={form.state||''} onChange={e=>setForm({...form, state:e.target.value})}/>
            </label><br/>
            <label>Department:
              <input value={form.department||''} onChange={e=>setForm({...form, department:e.target.value})}/>
            </label><br/>
            <div style={{marginTop:10}}>
              <button onClick={saveEdit}>Save</button>
              <button onClick={()=>setEditing(null)} style={{marginLeft:8}}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
