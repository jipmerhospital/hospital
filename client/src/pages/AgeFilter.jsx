import React from 'react'
import api from '../api'
import { Link } from 'react-router-dom'
import './PatientsList.css'

export default function PatientsAge() {
  const [items, setItems] = React.useState([])
  const [q, setQ] = React.useState('')
  const [state, setState] = React.useState('')
  const [ageRange, setAgeRange] = React.useState('') // ✅ new state for age filter
  const [page, setPage] = React.useState(1)
  const [total, setTotal] = React.useState(0)
  const [pages, setPages] = React.useState(1)

  const [editing, setEditing] = React.useState(null)
  const [form, setForm] = React.useState({})

  const load = () => {
    api
      .get('/patients/analytics/age', {
        params: { q, state, ageRange, page, limit: 20 },
      })
      .then(({ data }) => {
        setItems(data.items)
        setTotal(data.total)
        setPages(data.pages)
      })
  }

  React.useEffect(load, [q, state, ageRange, page])

  // ✅ Age Range Options
  const ageRanges = [
    { label: 'All Ages', value: '' },
    { label: '0-13', value: '0-13' },
    { label: '14-20', value: '14-20' },
    { label: '21-30', value: '21-30' },
    { label: '31-40', value: '31-40' },
    { label: '41-50', value: '41-50' },
    { label: '51-60', value: '51-60' },
    { label: '61-70', value: '61-70' },
    { label: '70+', value: '70+' },
  ]

  const printRecord = (p) => {
    const w = window.open('', '_blank');
    if (!w) return;
    const safe = (val) => val || '';

    const html = `
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
  // ...existing

  // Start editing
  const startEdit = (p) => {
    setEditing(p)
    setForm({
      name: p.name || '',
      age: p.age || '',
      sex: p.sex || '',
      fatherOrHusbandName: p.fatherOrHusbandName || '',
      department: p.department || '',
      addressLine: p.addressLine || '',
      state: p.state || '',
      mandalam: p.mandalam || '',
      mandalamOther: p.mandalamOther || '',
      phoneNumber: p.phoneNumber || '',
      stateOther: p.stateOther || '',
      aadhar: p.aadhar || '',
      maritalStatus: p.maritalStatus || '',
      occupation: p.occupation || '',
      income: p.income || '',
      nearestPoliceStation: p.nearestPoliceStation || '',
      vitals: {
        heightCm: p.vitals?.heightCm || '',
        weightKg: p.vitals?.weightKg || '',
        bp: p.vitals?.bp || '',
        pulse: p.vitals?.pulse || '',
        resp: p.vitals?.resp || '',
        temp: p.vitals?.temp || '',
        spo2: p.vitals?.spo2 || '',
        bmi: p.vitals?.bmi || ''
      }
    })
  }

  // Save update
  // ...existing code...
  const saveEdit = async () => {
    // Fix: Use mandalamOther if mandalam is "OTHERS"
      let mandalamValue = form.mandalam === "OTHERS" ? (form.mandalamOther || "OTHERS") : form.mandalam;
      let stateValue = form.state === "OTHER STATE" ? (form.stateOther || "OTHER STATE") : form.state;
    try {
      await api.put(`/patients/${editing._id}`, {
        ...form,
        mandalam: mandalamValue,
        state: stateValue
      })
      setEditing(null)
      load() // reload list
    } catch (e) {
      alert("Update failed: " + e.message)
    }
  }

  return (
    <div className="patients-container">
      <h2 className="page-title">Patients</h2>

      {/* ✅ Search, State and Age Filter */}
      <div className="search-filters">
        <input
          className="search-input"
          placeholder="Search name/phone/aadhar/hospNo"
          value={q}
          onChange={(e) => {
            setPage(1)
            setQ(e.target.value)
          }}
        />

        <input
          className="filter-input"
          placeholder="Filter by state"
          value={state}
          onChange={(e) => {
            setPage(1)
            setState(e.target.value)
          }}
        />

        {/* ✅ Age Range Dropdown */}
        <select
          className="filter-input"
          value={ageRange}
          onChange={(e) => {
            setPage(1)
            setAgeRange(e.target.value)
          }}
        >
          {ageRanges.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
      </div>

      {/* ✅ Existing Patients Table */}
      <div className="table-container">
        <table className="patients-table">
          <thead>
            <tr className="table-header">
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
            {items.map((p) => (
              <tr key={p._id} className="table-row">
                <td>{p.hospitalNo}</td>
                <td>{p.name}</td>
                <td>{p.age}/{p.sex}</td>
                <td>{p.phoneNumber}</td>
                <td>{p.state}</td>
                <td>{p.department}</td>
                <td>
                  <button className="btn btn-print" onClick={() => printRecord(p)}>
                    Print
                  </button>
                  <button className="btn btn-edit" onClick={() => startEdit(p)}>
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="table-info">
        <span>Total: {total}</span>
      </div>

      <div className="pagination">
        <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
          Prev
        </button>
        <span>
          Page {page} / {pages}
        </span>
        <button disabled={page >= pages} onClick={() => setPage((p) => p + 1)}>
          Next
        </button>
      </div>

      {/* ✅ Edit Modal - unchanged */}
      {editing && (
        <div className="modal-overlay">
          {/* same edit modal as your current one */}
        </div>
      )}
    </div>
  )
}
