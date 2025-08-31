import React from 'react'
import api from '../api'

export default function Analytics() {
  const [field, setField] = React.useState('state')
  const [value, setValue] = React.useState('')
  const [data, setData] = React.useState({ total: 0, summary: [] })
  const [patients, setPatients] = React.useState([])
  const [page, setPage] = React.useState(1)
  const [pages, setPages] = React.useState(1)
  const [selected, setSelected] = React.useState(null)

  // For editing popup
  const [editing, setEditing] = React.useState(null)
  const [form, setForm] = React.useState({})

  const load = () => {
    api.get('/patients/analytics/summary', { params: { field, value: value || undefined } })
      .then(({ data }) => setData(data))
  }
  React.useEffect(load, [field, value])

  const loadPatients = (f, v, p = 1) => {
    api.get('/patients/analytics/list', { params: { field: f, value: v, page: p, limit: 20 } })
      .then(({ data }) => {
        setPatients(data.items)
        setPage(p)
        setPages(data.pages)
        setSelected({ field: f, value: v })
      })
  }

  // ...existing code...
  const handlePrint = (p) => {
    const w = window.open('', '_blank');
    if (!w) return;
    const safe = (val) => val || '';

    const html = `
  <html>
    <head>
      <title>Patient Record - ${safe(p.name)}</title>
      <style>
      @page { size: A4; margin: 12mm; }
      body { font-family: Arial, sans-serif; margin: 0; padding: 16px; font-size: 13px; line-height: 1.35; }
      .header { text-align: center; font-size: 18px; font-weight: bold; text-transform: uppercase; margin-bottom: 16px; border: 1px solid #000; padding: 10px; background: #f0f0f0; }
      .hospital-info { text-align: center; margin-bottom: 14px; font-size: 15px; }
      .form-table { width: 100%; border-collapse: collapse; border: 1px solid #000; margin-bottom: 14px; max-width: 98%; margin-left: auto; margin-right: auto;}
      .form-table td { border: 1px solid #000; padding: 4px 4px; vertical-align: middle; }
      .label-cell { font-weight: bold; background-color: #f5f5f5; width: 15%; font-size: 13px; }
      .value-cell { width: 35%; min-height: 18px; font-size: 14px;}
      .section-header { background-color: #d0d0d0; font-weight: bold; text-align: center; text-transform: uppercase; font-size: 14px; padding: 8px; }
      .vitals-table { width: 100%; border-collapse: collapse; border: 1px solid #000; margin-bottom: 14px; max-width: 98%; margin-left: auto; margin-right: auto;}
      .vitals-table td { border: 1px solid #000; padding: 4px 4px; text-align: center; width: 12.5%; font-size: 12px; height: 32px; }
      .vitals-label { background-color: #f5f5f5; font-weight: bold; }
      .signature-section { margin-top: 24px; display: flex; justify-content: space-between; }
      .signature-box { width: 180px; border-bottom: 1px solid #000; text-align: center; padding-top: 30px; font-size: 13px; }
      .date-time { margin-top: 10px; text-align: right; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="hospital-info">
        <div style="font-size:22px; font-weight:bold;">JIPMER Multi Speciality Consulting Unit</div>
        <div>YANAM - 533464</div>
        <div>Phone: 08842323246 | Email: yanammscu@jipmer.ac.in</div>
      </div>
      <div class="header">Patient Medical Record</div>
      <div class="date-time">
        Print Date: ${new Date().toLocaleDateString('en-GB')} ${new Date().toLocaleTimeString('en-GB')}
      </div>
      <table class="form-table">
        <tr>
          <td class="label-cell">Reg. No:</td>
          <td class="value-cell">${safe(p.hospitalNo)}</td>
          <td class="label-cell">Date:</td>
          <td class="value-cell">${p.createdAt ? new Date(p.createdAt).toLocaleDateString('en-GB') : new Date().toLocaleDateString('en-GB')}</td>
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
          <td class="value-cell">${safe(p.mandalam)}${p.mandalam === "OTHERS" && p.mandalamOther ? " (" + safe(p.mandalamOther) + ")" : ""}</td>
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
          <td class="value-cell">₹ ${safe(p.income)}</td>
          <td class="label-cell">Nearest Police Station:</td>
          <td class="value-cell">${safe(p.nearestPoliceStation)}</td>
        </tr>
      </table>
      <table class="vitals-table">
        <tr>
          <td colspan="8" class="section-header">Vital Signs</td>
        </tr>
        <tr class="vitals-label">
          <td>Height</td>
          <td>Weight</td>
          <td>BP</td>
          <td>Pulse</td>
          <td>Resp</td>
          <td>Temp</td>
          <td>SPO₂</td>
          <td>BMI</td>
        </tr>
        <tr>
          <td>${safe(p.vitals?.heightCm)}${p.vitals?.heightCm ? ' cm' : ''}</td>
          <td>${safe(p.vitals?.weightKg)}${p.vitals?.weightKg ? ' kg' : ''}</td>
          <td>${safe(p.vitals?.bp)}</td>
          <td>${safe(p.vitals?.pulse)}</td>
          <td>${safe(p.vitals?.resp)}</td>
          <td>${safe(p.vitals?.temp)}${p.vitals?.temp ? '°F' : ''}</td>
          <td>${safe(p.vitals?.spo2)}${p.vitals?.spo2 ? '%' : ''}</td>
          <td>${safe(p.vitals?.bmi)}</td>
        </tr>
      </table>
    </body>
  </html>
  `;
    w.document.write(html);
    w.document.close();
    w.print();
  };
  // ...existing code...

  // Open popup for editing
  const openEdit = (patient) => {
    setEditing(patient)
    setForm(patient)
  }

  // Handle save edit
  const saveEdit = () => {
    api.put(`/patients/${editing._id}`, form).then(() => {
      alert('Patient updated successfully')
      setEditing(null)
      loadPatients(selected.field, selected.value, page) // refresh list
    })
  }

  return (
    <div>
      <h2>Analytics</h2>
      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <select value={field} onChange={e => setField(e.target.value)}>
          <option value="state">State</option>
          <option value="department">Department</option>
          <option value="sex">Sex</option>
          <option value="mandalam">Mandalam</option>
          <option value="maritalStatus">Marital Status</option>
          <option value="age">Age</option> {/* Added Age option */}
        </select>

        {/* Special case for age filter */}
        {field === 'age' ? (
          <>
            <input
              type="number"
              placeholder="Enter Age"
              value={value}
              onChange={e => setValue(e.target.value)}
            />
            <button onClick={() => loadPatients('age', value)}>Filter</button>
          </>
        ) : (
          <input
            placeholder="Filter value (optional)"
            value={value}
            onChange={e => setValue(e.target.value)}
          />
        )}
      </div>

      <div>Total patients{value ? ` for ${field}=${value}` : ''}: <b>{data.total}</b></div>
      <ul>
        {data.summary.map(row => (
          <li key={row._id || 'unknown'}>
            <button
              style={{ cursor: 'pointer' }}
              onClick={() => loadPatients(field, row._id)}>
              {String(row._id || 'Unknown')}: {row.count}
            </button>
          </li>
        ))}
      </ul>

      {selected && (
        <div style={{ marginTop: 20 }}>
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
              {patients.map(p => (
                <tr key={p._id}>
                  <td>{p.hospitalNo}</td>
                  <td>{p.name}</td>
                  <td>{p.age}/{p.sex}</td>
                  <td>{p.phoneNumber}</td>
                  <td>{p.state}</td>
                  <td>{p.department}</td>
                  <td>
                    <button onClick={() => openEdit(p)}>Edit</button>
                    <button onClick={() => handlePrint(p)}>Print</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: 8 }}>Total: {patients.length} (page {page} of {pages})</div>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <button disabled={page <= 1} onClick={() => loadPatients(selected.field, selected.value, page - 1)}>Prev</button>
            <div>Page {page} / {pages}</div>
            <button disabled={page >= pages} onClick={() => loadPatients(selected.field, selected.value, page + 1)}>Next</button>
          </div>
        </div>
      )}

      {/* ---- Edit Popup Modal ---- */}

      {editing && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999
        }}>
          <div style={{ background: '#fff', padding: 20, borderRadius: 8, minWidth: 350, maxWidth: 600 }}>
            <h3>Edit Patient</h3>
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ flex: 1 }}>
                <label>Name</label>
                <input value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div style={{ flex: 1 }}>
                <label>Age</label>
                <input type="number" value={form.age || ''} onChange={e => setForm({ ...form, age: e.target.value })} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <div style={{ flex: 1 }}>
                <label>Sex</label>
                <select value={form.sex || ''} onChange={e => setForm({ ...form, sex: e.target.value })}>
                  <option value="F">Female</option>
                  <option value="M">Male</option>
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label>Department</label>
                <select value={form.department || ''} onChange={e => setForm({ ...form, department: e.target.value })}>
                  <option value="MEDICINE">MEDICINE</option>
                  <option value="ORTHOPEDICS">ORTHOPEDICS</option>
                  <option value="SURGERY">SURGERY</option>
                  <option value="OBG">OBG</option>
                  <option value="NEPHROLOGY">NEPHROLOGY</option>
                </select>
              </div>
            </div>
            <label>Father / Husband Name</label>
            <input value={form.fatherOrHusbandName || ''} onChange={e => setForm({ ...form, fatherOrHusbandName: e.target.value })} />
            <label>Address</label>
            <input value={form.addressLine || ''} onChange={e => setForm({ ...form, addressLine: e.target.value })} />
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <div style={{ flex: 1 }}>
                <label>State</label>
                <select value={form.state || ''} onChange={e => setForm({ ...form, state: e.target.value })}>
                  <option value="">Select State</option>
                  <option value="PUDUCHERRY">PUDUCHERRY</option>
                  <option value="ANDHRA PRADESH">ANDHRA PRADESH</option>
                  <option value="KARNATAKA">KARNATAKA</option>
                  <option value="KERALA">KERALA</option>
                  <option value="TELANGANA">TELANGANA</option>
                  <option value="TAMIL NADU">TAMIL NADU</option>
                  <option value="DELHI">DELHI</option>
                  <option value="UP">UP</option>
                  <option value="MP">MP</option>
                  <option value="OTHER STATE">OTHER STATE</option>
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label>Mandalam</label>
                <select value={form.mandalam || ''} onChange={e => setForm({ ...form, mandalam: e.target.value })}>
                  <option value="">Select Mandalam</option>
                  <option value="THALLAREVU">THALLAREVU</option>
                  <option value="KAJULURU">KAJULURU</option>
                  <option value="K.GANGAVARAM">K.GANGAVARAM</option>
                  <option value="I.POLAVARAM">I.POLAVARAM</option>
                  <option value="KATRENIKONA">KATRENIKONA</option>
                  <option value="UPPAGUPTHAM">UPPAGUPTHAM</option>
                  <option value="OTHERS">OTHERS</option>
                </select>
                {form.mandalam === "OTHERS" && (
                  <>
                    <label>Other Mandalam</label>
                    <input value={form.mandalamOther || ""} onChange={e => setForm({ ...form, mandalamOther: e.target.value })} />
                  </>
                )}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <div style={{ flex: 1 }}>
                <label>Phone</label>
                <input value={form.phoneNumber || ''} onChange={e => setForm({ ...form, phoneNumber: e.target.value })} />
              </div>
              <div style={{ flex: 1 }}>
                <label>Aadhar</label>
                <input value={form.aadhar || ''} onChange={e => setForm({ ...form, aadhar: e.target.value })} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <div style={{ flex: 1 }}>
                <label>Marital Status</label>
                <select value={form.maritalStatus || ''} onChange={e => setForm({ ...form, maritalStatus: e.target.value })}>
                  <option value="YES">YES</option>
                  <option value="NO">NO</option>
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label>Occupation</label>
                <input value={form.occupation || ''} onChange={e => setForm({ ...form, occupation: e.target.value })} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <div style={{ flex: 1 }}>
                <label>Income</label>
                <input value={form.income || ''} onChange={e => setForm({ ...form, income: e.target.value })} />
              </div>
              <div style={{ flex: 1 }}>
                <label>Nearest Police Station</label>
                <input value={form.nearestPoliceStation || ''} onChange={e => setForm({ ...form, nearestPoliceStation: e.target.value })} />
              </div>
            </div>
            <div style={{ marginTop: 12, borderTop: '1px solid #eee', paddingTop: 8 }}>
              <h4>Vitals</h4>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <div>
                  <label>Height (cm)</label>
                  <input value={form.vitals?.heightCm || ''} onChange={e => setForm({ ...form, vitals: { ...form.vitals, heightCm: e.target.value } })} />
                </div>
                <div>
                  <label>Weight (kg)</label>
                  <input value={form.vitals?.weightKg || ''} onChange={e => setForm({ ...form, vitals: { ...form.vitals, weightKg: e.target.value } })} />
                </div>
                <div>
                  <label>BP</label>
                  <input value={form.vitals?.bp || ''} onChange={e => setForm({ ...form, vitals: { ...form.vitals, bp: e.target.value } })} />
                </div>
                <div>
                  <label>Pulse</label>
                  <input value={form.vitals?.pulse || ''} onChange={e => setForm({ ...form, vitals: { ...form.vitals, pulse: e.target.value } })} />
                </div>
                <div>
                  <label>Resp</label>
                  <input value={form.vitals?.resp || ''} onChange={e => setForm({ ...form, vitals: { ...form.vitals, resp: e.target.value } })} />
                </div>
                <div>
                  <label>Temp</label>
                  <input value={form.vitals?.temp || ''} onChange={e => setForm({ ...form, vitals: { ...form.vitals, temp: e.target.value } })} />
                </div>
                <div>
                  <label>SPO2</label>
                  <input value={form.vitals?.spo2 || ''} onChange={e => setForm({ ...form, vitals: { ...form.vitals, spo2: e.target.value } })} />
                </div>
                <div>
                  <label>BMI</label>
                  <input value={form.vitals?.bmi || ''} onChange={e => setForm({ ...form, vitals: { ...form.vitals, bmi: e.target.value } })} />
                </div>
              </div>
            </div>
            <div style={{ marginTop: 10 }}>
              <button onClick={saveEdit}>Save</button>
              <button onClick={() => setEditing(null)} style={{ marginLeft: 8 }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
