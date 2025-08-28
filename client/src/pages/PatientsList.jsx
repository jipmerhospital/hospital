import React from 'react'
import api from '../api'
import { Link } from 'react-router-dom'

export default function PatientsList(){
  const [items,setItems]=React.useState([])
  const [q,setQ]=React.useState('')
  const [state,setState]=React.useState('')
  const [page,setPage]=React.useState(1)
  const [total,setTotal]=React.useState(0)
  const [pages,setPages]=React.useState(1)

  // Edit state
  const [editing,setEditing] = React.useState(null)   // patient being edited
  const [form,setForm] = React.useState({})

  const load=()=>{
    api.get('/patients',{ params:{ q, state, page, limit:20 }}).then(({data})=>{
      setItems(data.items); setTotal(data.total); setPages(data.pages)
    })
  }
  React.useEffect(load,[q,state,page])

  const printRecord = (p) => {
  const w = window.open('', '_blank')
  const safe = (val) => val || '' 

  const html = `
    <html>
      <head>
        <title>Patient Record - ${safe(p.name)}</title>
        <style>
          @page {
            size: A4;
            margin: 15mm;
          }
          
          body { 
            font-family: Arial, sans-serif; 
            margin: 0;
            padding: 15px;
            background: white;
            font-size: 12px;
            line-height: 1.4;
          }
          
          .header {
            text-align: center;
            font-size: 16px;
            font-weight: bold;
            text-transform: uppercase;
            margin-bottom: 20px;
            border: 2px solid #000;
            padding: 10px;
            background: #f0f0f0;
          }
          
          .hospital-info {
            text-align: center;
            margin-bottom: 15px;
            font-size: 14px;
          }
          
          .form-table {
            width: 100%;
            border-collapse: collapse;
            border: 2px solid #000;
            margin-bottom: 15px;
          }
          
          .form-table td {
            border: 1px solid #000;
            padding: 8px 6px;
            vertical-align: middle;
          }
          
          .label-cell {
            font-weight: bold;
            background-color: #f5f5f5;
            width: 15%;
            font-size: 11px;
          }
          
          .value-cell {
            width: 35%;
            min-height: 18px;
            font-weight: bold;
          }
          
          .section-header {
            background-color: #d0d0d0;
            font-weight: bold;
            text-align: center;
            text-transform: uppercase;
            font-size: 12px;
            padding: 8px;
          }
          
          .vitals-table {
            width: 100%;
            border-collapse: collapse;
            border: 2px solid #000;
          }
          
          .vitals-table td {
            border: 1px solid #000;
            padding: 6px 4px;
            text-align: center;
            width: 12.5%;
            font-size: 10px;
          }
          
          .vitals-label {
            background-color: #f5f5f5;
            font-weight: bold;
          }
          
          .signature-section {
            margin-top: 30px;
            display: flex;
            justify-content: space-between;
          }
          
          .signature-box {
            width: 200px;
            border-bottom: 1px solid #000;
            text-align: center;
            padding-top: 40px;
            font-size: 11px;
          }
          
          .date-time {
            margin-top: 10px;
            text-align: right;
            font-size: 10px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="hospital-info">
          <div style="font-size: 18px; font-weight: bold;">JIPMER Multi Speciality Consulting Unit</div>
          <div>YANAM - 533464</div>
          <div>Phone: 08842323246 | Email: yanammscu@jipmer.ac.in</div>
        </div>
        
        <div class="header">
          Patient Medical Record
        </div>
        
        <div class="date-time">
          Print Date: ${new Date().toLocaleDateString('en-GB')} ${new Date().toLocaleTimeString('en-GB')}
        </div>
        
        <table class="form-table">
          <tr>
            <td class="label-cell">Reg. No:</td>
            <td class="value-cell">${safe(p.hospitalNo)}</td>
            <td class="label-cell">Date:</td>
            <td class="value-cell">${p.createdAt ? new Date(p.createdAt).toLocaleDateString('en-GB') : ''}</td>
          </tr>
          <tr>
            <td class="label-cell">Patient Name:</td>
            <td class="value-cell">${safe(p.name)}</td>
            <td class="label-cell">Age:</td>
            <td class="value-cell">${safe(p.age)}</td>
          </tr>
          <tr>
            <td class="label-cell">Sex:</td>
            <td class="value-cell">${safe(p.sex)}</td>
            <td class="label-cell">Department:</td>
            <td class="value-cell">${safe(p.department)}</td>
          </tr>
          <tr>
            <td class="label-cell">Father/Husband:</td>
            <td class="value-cell" colspan="3">${safe(p.fatherOrHusbandName)}</td>
          </tr>
          <tr>
            <td class="label-cell">Address:</td>
            <td class="value-cell" colspan="3">${safe(p.addressLine)}</td>
          </tr>
          <tr>
            <td class="label-cell">State:</td>
            <td class="value-cell">${safe(p.state)}</td>
            <td class="label-cell">Mandalam:</td>
            <td class="value-cell">${safe(p.mandalam)}</td>
          </tr>
          <tr>
            <td class="label-cell">Phone No:</td>
            <td class="value-cell">${safe(p.phoneNumber)}</td>
            <td class="label-cell">Aadhar No:</td>
            <td class="value-cell">${safe(p.aadhar)}</td>
          </tr>
          <tr>
            <td class="label-cell">Marital Status:</td>
            <td class="value-cell">${p.maritalStatus === 'YES' ? 'Married' : p.maritalStatus === 'NO' ? 'Single' : safe(p.maritalStatus)}</td>
            <td class="label-cell">Occupation:</td>
            <td class="value-cell">${safe(p.occupation)}</td>
          </tr>
          <tr>
            <td class="label-cell">Income:</td>
            <td class="value-cell" colspan="3">₹ ${safe(p.income)}</td>
          </tr>
        </table>
        
        <table class="vitals-table">
          <tr>
            <td colspan="8" class="section-header">Vital Signs</td>
          </tr>
          <tr class="vitals-label">
            <td>BP</td>
            <td>Pulse</td>
            <td>SPO2</td>
            <td>Height</td>
            <td>Weight</td>
            <td>Resp</td>
            <td>Temp</td>
            <td>BMI</td>
          </tr>
          <tr>
            <td>${safe(p.vitals?.bp)}</td>
            <td>${safe(p.vitals?.pulse)}</td>
            <td>${safe(p.vitals?.spo2)}${p.vitals?.spo2 ? '%' : ''}</td>
            <td>${safe(p.vitals?.heightCm)}${p.vitals?.heightCm ? ' cm' : ''}</td>
            <td>${safe(p.vitals?.weightKg)}${p.vitals?.weightKg ? ' kg' : ''}</td>
            <td>${safe(p.vitals?.resp)}</td>
            <td>${safe(p.vitals?.temp)}${p.vitals?.temp ? '°F' : ''}</td>
            <td>${safe(p.vitals?.bmi)}</td>
          </tr>
        </table>
        
        <div style="margin-top: 20px;">
          <table class="form-table">
            <tr>
              <td colspan="4" class="section-header">Additional Information</td>
            </tr>
            <tr>
              <td class="label-cell">Last Updated:</td>
              <td class="value-cell" colspan="3">${p.updatedAt ? new Date(p.updatedAt).toLocaleDateString('en-GB') + ' ' + new Date(p.updatedAt).toLocaleTimeString('en-GB') : 'N/A'}</td>
            </tr>
            <tr>
              <td class="label-cell">Status:</td>
              <td class="value-cell">Active</td>
              <td class="label-cell">Record ID:</td>
              <td class="value-cell">${safe(p._id).substring(0, 12)}...</td>
            </tr>
          </table>
        </div>
        
        <div class="signature-section">
          <div class="signature-box">
            Patient Signature
          </div>
          <div class="signature-box">
            Doctor Signature
          </div>
          <div class="signature-box">
            Date & Time
          </div>
        </div>
        
        <div style="margin-top: 20px; font-size: 10px; text-align: center; color: #666;">
          This is a computer generated document. No signature required.<br>
          Printed on: ${new Date().toLocaleDateString('en-GB')} at ${new Date().toLocaleTimeString('en-GB')}
        </div>
      </body>
    </html>
  `
  w.document.write(html)
  w.document.close()
  w.print()
}

  // Start editing
  const startEdit = (p) => {
    setEditing(p)
    setForm({
      name: p.name || '',
      age: p.age || '',
      sex: p.sex || '',
      phoneNumber: p.phoneNumber || '',
      state: p.state || '',
      department: p.department || ''
    })
  }

  // Save update
  const saveEdit = async () => {
    try {
      await api.put(`/patients/${editing._id}`, form)
      setEditing(null)
      load() // reload list
    } catch(e) {
      alert("Update failed: " + e.message)
    }
  }

  return (
    <div>
      <h2>Patients</h2>
      <div style={{display:'flex', gap:8, marginBottom:8}}>
        <input placeholder="Search name/phone/aadhar/hospNo" value={q} onChange={e=>{setPage(1); setQ(e.target.value)}}/>
        <input placeholder="Filter by state" value={state} onChange={e=>{setPage(1); setState(e.target.value)}}/>
      </div>
      <table border="1" cellPadding="6">
        <thead><tr><th>Hospital No</th><th>Name</th><th>Age/Sex</th><th>Phone</th><th>State</th><th>Department</th><th>Actions</th></tr></thead>
        <tbody>
          {items.map(p=>(
            <tr key={p._id}>
              <td>{p.hospitalNo}</td>
              <td>{p.name}</td>
              <td>{p.age}/{p.sex}</td>
              <td>{p.phoneNumber}</td>
              <td>{p.state}</td>
              <td>{p.department}</td>
              <td>
                <button onClick={()=>printRecord(p)}>Print</button>{' '}
                <button onClick={()=>startEdit(p)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{marginTop:8}}>Total: {total}</div>
      <div style={{display:'flex', gap:8, marginTop:8}}>
        <button disabled={page<=1} onClick={()=>setPage(p=>p-1)}>Prev</button>
        <div>Page {page} / {pages}</div>
        <button disabled={page>=pages} onClick={()=>setPage(p=>p+1)}>Next</button>
      </div>

      {/* Edit Modal */}
      {editing && (
        <div style={{
          position:'fixed', top:0,left:0,right:0,bottom:0,
          background:'rgba(0,0,0,0.5)', display:'flex', justifyContent:'center', alignItems:'center'
        }}>
          <div style={{background:'#fff', padding:20, borderRadius:8, width:400}}>
            <h3>Edit Patient</h3>
            <div style={{display:'flex', flexDirection:'column', gap:8}}>
              <input placeholder="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})}/>
              <input placeholder="Age" value={form.age} onChange={e=>setForm({...form, age:e.target.value})}/>
              <input placeholder="Sex" value={form.sex} onChange={e=>setForm({...form, sex:e.target.value})}/>
              <input placeholder="Phone" value={form.phoneNumber} onChange={e=>setForm({...form, phoneNumber:e.target.value})}/>
              <input placeholder="State" value={form.state} onChange={e=>setForm({...form, state:e.target.value})}/>
              <input placeholder="Department" value={form.department} onChange={e=>setForm({...form, department:e.target.value})}/>
            </div>
            <div style={{marginTop:12, display:'flex', gap:8}}>
              <button onClick={saveEdit}>Save</button>
              <button onClick={()=>setEditing(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
