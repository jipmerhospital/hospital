import { Router } from 'express';
import Patient from '../models/Patient.js';
import Counter from '../models/Counter.js';
import { auth } from '../middleware/auth.js';
// ...existing code...
import { addPatientRow, updatePatientRow } from "./googlesheets.js";
// ...existing code...
const router = Router();

function formatHospitalNo(seq) {
  return 'YA' + String(seq).padStart(5, '0'); // YA00001
}

async function getNextHospitalNo() {
  const upd = await Counter.findOneAndUpdate(
    { key: 'hospitalNo' },
    { $inc: { seq: 1 } },
    { upsert: true, new: true }
  );
  return formatHospitalNo(upd.seq);
}

// // Create patient (clerk)
// router.post('/', auth, async (req, res) => {
//   try {
//     const data = req.body;
//     // Validate required fields
//     const required = ['name','age','sex','fatherOrHusbandName','department','addressLine','state','mandalam','phoneNumber','aadhar','maritalStatus','occupation','income'];
//     for (const f of required) {
//       if (data[f] === undefined || data[f] === null || data[f] === '') {
//         return res.status(400).json({ message: `Missing field: ${f}` });
//       }
//     }
//     const hospitalNo = await getNextHospitalNo();
//     const patient = await Patient.create({ ...data, hospitalNo, createdBy: req.user._id });
//     res.status(201).json(patient);
//   } catch (e) {
//     res.status(400).json({ message: e.message });
//   }
// });

// Create patient (clerk)
router.post('/', auth, async (req, res) => {
  try {
    const data = req.body;
    const required = ['name','age','sex','fatherOrHusbandName','department','addressLine','state','mandalam','phoneNumber','aadhar','maritalStatus','occupation','income'];
    for (const f of required) {
      if (!data[f]) return res.status(400).json({ message: `Missing field: ${f}` });
    }

    const hospitalNo = await getNextHospitalNo();
    const patient = await Patient.create({ ...data, hospitalNo, createdBy: req.user._id });

    // ✅ Sync to Google Sheet
    await addPatientRow(patient);

    res.status(201).json(patient);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// List + filter + pagination
router.get('/', auth, async (req, res) => {
  const { state, department, sex, q, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (state) filter.state = state;
  if (department) filter.department = department;
  if (sex) filter.sex = sex;
  if (q) {
    filter.$or = [
      { name: new RegExp(q, 'i') },
      { hospitalNo: new RegExp(q, 'i') },
      { phoneNumber: new RegExp(q, 'i') },
      { aadhar: new RegExp(q, 'i') }
    ];
  }
  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Patient.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Patient.countDocuments(filter)
  ]);
  res.json({ items, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
});

router.get('/analytics/list', async (req, res) => {
  try {
    console.log("heool")
    const { field, value, page = 1, limit = 20 } = req.query
    if (!field || !value) {
      return res.status(400).json({ error: 'field and value are required' })
    }

    const query = { [field]: value }
    const skip = (parseInt(page) - 1) * parseInt(limit)

    const patients = await Patient.find(query)
      .skip(skip)
      .limit(parseInt(limit))

    const total = await Patient.countDocuments(query)
    const pages = Math.ceil(total / parseInt(limit))

    res.json({ items: patients, total, pages })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})




// Analytics: counts by any field (state, department, sex, etc.)
router.get('/analytics/summary', auth, async (req, res) => {
  const { field = 'state', value } = req.query; // default group by state
  let match = {};
  if (value) match[field] = value;
  const pipeline = [
    { $match: match },
    { $group: { _id: `$${field}`, count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ];
  const summary = await Patient.aggregate(pipeline);
  const total = await Patient.countDocuments(value ? { [field]: value } : {});
  res.json({ field, total, summary });
});

// Get single
router.get('/:id', auth, async (req, res) => {
  const p = await Patient.findById(req.params.id);
  if (!p) return res.status(404).json({ message: 'Not found' });
  res.json(p);
});

// // Update
// router.put('/:id', auth, async (req, res) => {
//   try {
//     const p = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     res.json(p);
//   } catch (e) {
//     res.status(400).json({ message: e.message });
//   }
// });

// Update patient
router.put('/:id', auth, async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });

    // ✅ Sync update to Google Sheet
    await updatePatientRow(patient);

    res.json(patient);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// Delete
router.delete('/:id', auth, async (req, res) => {
  await Patient.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

// Update
router.put('/:id', auth, async (req, res) => {
  try {
    const p = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(p);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});



export default router;
