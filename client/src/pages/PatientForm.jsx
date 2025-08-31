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

  const printForm = () => {
    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    printWindow.document.write(`
      <html>
        <head>
          <title>Patient Registration Form</title>
          <style>
  @page { size: A4; margin: 12mm; }
  body { 
    font-family: Arial, sans-serif; 
    margin: 0; 
    padding: 12px; 
    font-size: 10px; 
    line-height: 1.2; 
  }
  .header { 
    text-align: center; 
    font-size: 13px; 
    font-weight: bold; 
    text-transform: uppercase; 
    margin-bottom: 12px; 
    border: 1px solid #000; 
    padding: 6px; 
    background: #f0f0f0; 
  }
  .hospital-info { 
    text-align: center; 
    margin-bottom: 10px; 
    font-size: 11px; 
  }
  .form-table { 
    width: 100%; 
    border-collapse: collapse; 
    border: 1px solid #000; 
    margin-bottom: 10px; 
    max-width: 95%; 
    margin-left: auto; 
    margin-right: auto;
  }
  .form-table td { 
    border: 1px solid #000; 
    padding: 4px 3px;  /* smaller padding */
    vertical-align: middle; 
  }
  .label-cell { 
    font-weight: bold; 
    background-color: #f5f5f5; 
    width: 15%; 
    font-size: 9px; 
  }
  .value-cell { 
    width: 35%; 
    min-height: 14px; 
    font-size: 9.5px;
  }
  .section-header { 
    background-color: #d0d0d0; 
    font-weight: bold; 
    text-align: center; 
    text-transform: uppercase; 
    font-size: 10px; 
    padding: 6px; 
  }
  .vitals-table { 
    width: 100%; 
    border-collapse: collapse; 
    border: 1px solid #000; 
    max-width: 95%; 
    margin-left: auto; 
    margin-right: auto;
  }
  .vitals-table td { 
    border: 1px solid #000; 
    padding: 4px 3px; 
    text-align: center; 
    width: 12.5%; 
    font-size: 8.5px; 
  }
  .vitals-label { 
    background-color: #f5f5f5; 
    font-weight: bold; 
  }
  .signature-section { 
    margin-top: 20px; 
    display: flex; 
    justify-content: space-between; 
  }
  .signature-box { 
    width: 150px; 
    border-bottom: 1px solid #000; 
    text-align: center; 
    padding-top: 25px; 
    font-size: 9px; 
  }
</style>

        </head>
        <body>
          <div class="hospital-info">
            <div style="font-size:18px; font-weight:bold;">JIPMER Multi Speciality Consulting Unit</div>
            <div>YANAM - 533464</div>
            <div>Phone: 08842323246 | Email: yanammscu@jipmer.ac.in</div>
          </div>

          <div class="header">Out Patient Registration</div>

          <table class="form-table">
            <tr>
              <td class="label-cell">Reg. No:</td>
              <td class="value-cell">${saved?.hospitalNo || ''}</td>
              <td class="label-cell">Date:</td>
              <td class="value-cell">${new Date().toLocaleDateString('en-GB')}</td>
            </tr>
            <tr>
              <td class="label-cell">Patient Name:</td>
              <td class="value-cell">${saved?.name || ''}</td>
              <td class="label-cell">Age:</td>
              <td class="value-cell">${saved?.age || ''}</td>
            </tr>
            <tr>
              <td class="label-cell">Sex:</td>
              <td class="value-cell">${saved?.sex || ''}</td>
              <td class="label-cell">Department:</td>
              <td class="value-cell">${saved?.department || ''}</td>
            </tr>
            <tr>
              <td class="label-cell">Father/Husband:</td>
              <td class="value-cell" colspan="3">${saved?.fatherOrHusbandName || ''}</td>
            </tr>
            <tr>
              <td class="label-cell">Address:</td>
              <td class="value-cell" colspan="3">${saved?.addressLine || ''}</td>
            </tr>
            <tr>
              <td class="label-cell">State:</td>
              <td class="value-cell">${saved?.state || ''}</td>
              <td class="label-cell">Mandalam:</td>
              <td class="value-cell">${saved?.mandalam || ''}</td>
            </tr>
            <tr>
              <td class="label-cell">Phone No:</td>
              <td class="value-cell">${saved?.phoneNumber || ''}</td>
              <td class="label-cell">Aadhar No:</td>
              <td class="value-cell">${saved?.aadhar || ''}</td>
            </tr>
            <tr>
              <td class="label-cell">Marital Status:</td>
              <td class="value-cell">${saved?.maritalStatus === 'YES' ? 'Married' : 'Single'}</td>
              <td class="label-cell">Occupation:</td>
              <td class="value-cell">${saved?.occupation || ''}</td>
            </tr>
            <tr>
              <td class="label-cell">Income:</td>
              <td class="value-cell" colspan="3">₹ ${saved?.income || ''}</td>
            </tr>
            <tr>
              <td class="label-cell">Nearest Police Station:</td>
              <td class="value-cell" colspan="3">${saved?.nearestPoliceStation || ''}</td>
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
              <td>SPO2</td>
              <td>BMI</td>
            </tr>
            <tr>
              <td>${saved?.vitals?.heightCm || ''} cm</td>
              <td>${saved?.vitals?.weightKg || ''} kg</td>
              <td>${saved?.vitals?.bp || ''}</td>
              <td>${saved?.vitals?.pulse || ''}</td>
              <td>${saved?.vitals?.resp || ''}</td>
              <td>${saved?.vitals?.temp || ''}°F</td>
              <td>${saved?.vitals?.spo2 || ''}%</td>
              <td>${saved?.vitals?.bmi || ''}</td>
            </tr>
          </table>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

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
          <option value="Medicine">Medicine</option>
          <option value="Orthopedics">Orthopedics</option>
          <option value="Surgery">Surgery</option>
          <option value="OBG">OBG</option>
        </select>
        <label>Address</label>
        <input value={form.addressLine} onChange={e => setField('addressLine', e.target.value)} />
        <label>State</label>
        <input value={form.state} onChange={e => setField('state', e.target.value)} />
        <label>Mandalam</label>
        <input value={form.mandalam} onChange={e => setField('mandalam', e.target.value)} />
        <label>Phone</label>
        <input value={form.phoneNumber} onChange={e => setField('phoneNumber', e.target.value)} />
        <label>Aadhar</label>
        <input value={form.aadhar} onChange={e => setField('aadhar', e.target.value)} />
        <label>Marital Status</label>
        <select value={form.maritalStatus} onChange={e => setField('maritalStatus', e.target.value)}>
          <option value="YES">Married</option>
          <option value="NO">Single</option>
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
        <div style={{ marginTop: 16, padding: 12, border: '1px solid #ddd', borderRadius: 6 }}>
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
