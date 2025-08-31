import React from 'react'
import api from '../api'
import './PatientForm.css'

const required = [
  'name', 'age', 'sex', 'fatherOrHusbandName', 'department',
  'addressLine', 'state', 'mandalam', 'phoneNumber',
  'aadhar', 'maritalStatus', 'occupation', 'income', 'nearestPoliceStation'
]

export default function PatientForm() {
  const initialForm = {
    name: '', age: '', sex: 'F', fatherOrHusbandName: '',
    department: 'OBG', addressLine: '', state: '', mandalam: '',
    phoneNumber: '', aadhar: '', maritalStatus: 'YES', occupation: '', income: '',
    nearestPoliceStation: '',
    vitals: { heightCm: '', weightKg: '', bp: '', pulse: '', resp: '', temp: '', spo2: '', bmi: '' }
  }

  const [form, setForm] = React.useState(initialForm)
  const [saved, setSaved] = React.useState(null)
  const [error, setError] = React.useState('')
  const savedRef = React.useRef(null)
  React.useEffect(() => {
    if (saved && savedRef.current) {
      savedRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [saved])

  const setField = (k, v) => setForm(p => ({ ...p, [k]: v }))
  const setVitals = (k, v) => setForm(p => ({ ...p, vitals: { ...p.vitals, [k]: v } }))

  const nameRegex = /^[A-Za-z\s]+$/
  const phoneRegex = /^\d{10}$/
  const aadharRegex = /^\d{12}$/

  const validateInputs = () => {
    if (!nameRegex.test(form.name)) return 'Name must contain only letters and spaces'
    if (!nameRegex.test(form.fatherOrHusbandName)) return 'Father/Husband Name must contain only letters and spaces'
    if (!phoneRegex.test(form.phoneNumber)) return 'Phone Number must be exactly 10 digits'
    if (!aadharRegex.test(form.aadhar)) return 'Aadhar Number must be exactly 12 digits'
    return ''
  }

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    for (const f of required) {
      if (!form[f]) { setError('Missing: ' + f); return }
    }
    const validationError = validateInputs()
    if (validationError) { setError(validationError); return }
    try {
      const { data } = await api.post('/patients', {
        ...form,
        age: Number(form.age),
        income: Number(form.income)
      })
      setSaved(data)
      setForm(initialForm)
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed')
    }
  }

  // ...existing code...
  const printForm = () => {
    const p = saved;
    if (!p) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    const safe = (val) => val || '';

    printWindow.document.write(`
      <html>
        <head>
          <title>Patient Record - ${safe(p.name)}</title>
          <style>
        @page { size: A4; margin: 12mm; }
        body { 
          font-family: Arial, sans-serif; 
          margin: 0; 
          padding: 16px; 
          font-size: 13px; 
          line-height: 1.35; 
        }
        .header { 
          text-align: center; 
          font-size: 18px; 
          font-weight: bold; 
          text-transform: uppercase; 
          margin-bottom: 16px; 
          border: 1px solid #000; 
          padding: 10px; 
          background: #f0f0f0; 
        }
        .hospital-info { 
          text-align: center; 
          margin-bottom: 14px; 
          font-size: 15px; 
        }
        .form-table { 
          width: 100%; 
          border-collapse: collapse; 
          border: 1px solid #000; 
          margin-bottom: 14px; 
          max-width: 98%; 
          margin-left: auto; 
          margin-right: auto;
        }
        .form-table td { 
          border: 1px solid #000; 
          padding: 4px 4px; /* Reduced padding for less row height */
          vertical-align: middle; 
        }
        .label-cell { 
          font-weight: bold; 
          background-color: #f5f5f5; 
          width: 15%; 
          font-size: 13px; 
        }
        .value-cell { 
          width: 35%; 
          min-height: 18px; 
          font-size: 14px;
        }
        .section-header { 
          background-color: #d0d0d0; 
          font-weight: bold; 
          text-align: center; 
          text-transform: uppercase; 
          font-size: 14px; 
          padding: 8px; /* Slightly reduced */
        }
        .vitals-table { 
          width: 100%; 
          border-collapse: collapse; 
          border: 1px solid #000; 
          margin-bottom: 14px; 
          max-width: 98%; 
          margin-left: auto; 
          margin-right: auto;
        }
        .vitals-table td { 
          border: 1px solid #000; 
          padding: 4px 4px; 
          text-align: center; 
          width: 12.5%; 
          font-size: 12px; 
          height: 32px; 
        }
        .vitals-label { 
          background-color: #f5f5f5; 
          font-weight: bold; 
        }
        .signature-section { 
          margin-top: 24px; 
          display: flex; 
          justify-content: space-between; 
        }
        .signature-box { 
          width: 180px; 
          border-bottom: 1px solid #000; 
          text-align: center; 
          padding-top: 30px; 
          font-size: 13px; 
        }
        .date-time { 
          margin-top: 10px; 
          text-align: right; 
          font-size: 12px; 
          color: #666; 
        }
      </style>
        </head>
        <body>
          <div class="hospital-info">
            <div style="font-size:22px; font-weight:bold;">JIPMER Multi Speciality Consulting Unit</div>
            <div>YANAM - 533464</div>
            <div>Phone: 08842323246 | Email: yanammscu@jipmer.ac.in</div>
          </div>

          <div class="header">Out Patient Registration</div>

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
    `);
    printWindow.document.close();
    printWindow.print();
  }
  //

  return (
    <div className="patient-form-container">
      <h2>New Patient</h2>
      <form onSubmit={submit} className="patient-form">
        {/* Existing Fields */}
        <label>Name</label>
        <input value={form.name} onChange={e => setField('name', e.target.value)} />
        <label>Age</label>
        <input value={form.age} onChange={e => setField('age', e.target.value)} />
        <label>Sex</label>
        <select value={form.sex} onChange={e => setField('sex', e.target.value)}>
          <option value="F">Female</option>
          <option value="M">Male</option>
        </select>
        <label>Father / Husband Name</label>
        <input value={form.fatherOrHusbandName} onChange={e => setField('fatherOrHusbandName', e.target.value)} />
        <label>Department</label>
        <select value={form.department} onChange={e => setField('department', e.target.value)}>
          <option value="MEDICINE">MEDICINE</option>
          <option value="ORTHOPEDICS">ORTHOPEDICS</option>
          <option value="SURGERY">SURGERY</option>
          <option value="OBG">OBG</option>
          <option value="NEPHROLOGY">NEPHROLOGY</option>
        </select>
        <label>Address</label>
        <input value={form.addressLine} onChange={e => setField('addressLine', e.target.value)} />
        <label>State</label>
        <select value={form.state} onChange={e => setField('state', e.target.value)}>
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
          <option value="MP">OTHER STATE</option>
        </select>
        <label>Mandalam</label>
        <div className="mandalam-field">
          <select
            value={form.mandalam}
            onChange={e => setField('mandalam', e.target.value)}
          >
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
            <input
              className="mandalam-other-input"
              placeholder="Enter Mandalam"
              value={form.mandalamOther || ""}
              onChange={e => setField('mandalamOther', e.target.value)}
            />
          )}
        </div>
        <label>Phone</label>
        <input value={form.phoneNumber} onChange={e => setField('phoneNumber', e.target.value)} />
        <label>Aadhar</label>
        <input value={form.aadhar} onChange={e => setField('aadhar', e.target.value)} />
        <label>Marital Status</label>
        <select value={form.maritalStatus} onChange={e => setField('maritalStatus', e.target.value)}>
          <option value="YES">YES</option>
          <option value="NO">NO</option>
        </select>
        <label>Occupation</label>
        <input value={form.occupation} onChange={e => setField('occupation', e.target.value)} />
        <label>Income</label>
        <input value={form.income} onChange={e => setField('income', e.target.value)} />
        <label>Nearest Police Station</label>
        <input value={form.nearestPoliceStation} onChange={e => setField('nearestPoliceStation', e.target.value)} />

        <h3>Vitals</h3>
        <label>Height (cm)</label>
        <input value={form.vitals.heightCm} onChange={e => setVitals('heightCm', e.target.value)} />
        <label>Weight (kg)</label>
        <input value={form.vitals.weightKg} onChange={e => setVitals('weightKg', e.target.value)} />
        <label>BP</label>
        <input value={form.vitals.bp} onChange={e => setVitals('bp', e.target.value)} />
        <label>Pulse</label>
        <input value={form.vitals.pulse} onChange={e => setVitals('pulse', e.target.value)} />
        <label>Resp</label>
        <input value={form.vitals.resp} onChange={e => setVitals('resp', e.target.value)} />
        <label>Temp</label>
        <input value={form.vitals.temp} onChange={e => setVitals('temp', e.target.value)} />
        <label>SPO2</label>
        <input value={form.vitals.spo2} onChange={e => setVitals('spo2', e.target.value)} />
        <label>BMI</label>
        <input value={form.vitals.bmi} onChange={e => setVitals('bmi', e.target.value)} />

        <div className="form-actions">
          <button type="submit">Save</button>
        </div>
      </form>

      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}

      {saved && (
        <div ref={savedRef} style={{ marginTop: 16, padding: 12, border: '1px solid #ddd', borderRadius: 6 }}>
          <h3>Saved!</h3>
          <div>
            Hospital No: <b>{saved.hospitalNo}</b>
            <button onClick={printForm} style={{ marginLeft: 12, padding: '4px 10px' }}>Print</button>
          </div>
        </div>
      )}
    </div>
  )
}
