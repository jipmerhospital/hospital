import { Router } from 'express';
import Patient from '../models/Patient.js';
import Counter from '../models/Counter.js';
import { auth } from '../middleware/auth.js';
// ...existing code...
import { addPatientRow, updatePatientRow } from "./googlesheets.js";
// ...existing code...
const router = Router();

function formatHospitalNo(seq) {
  return 'JY' + String(seq).padStart(5, '0'); // JY00001
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

router.post('/', auth, async (req, res) => {
  try {
    const data = req.body;
    const required = [
      'name','age','sex','fatherOrHusbandName','department','addressLine',
      'state','mandalam','phoneNumber','aadhar','maritalStatus','occupation',
      'income','nearestPoliceStation'
    ];
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

// router.get('/analytics/age', async (req, res) => {
//   try {
//     const { q, state, ageRange, page = 1, limit = 20 } = req.query
//     const query = {}

//     // 🔍 Text Search
//     if (q) {
//       query.$or = [
//         { name: new RegExp(q, 'i') },
//         { phoneNumber: new RegExp(q, 'i') },
//         { aadhar: new RegExp(q, 'i') },
//         { hospitalNo: new RegExp(q, 'i') },
//       ]
//     }

//     // 🏙️ State Filter
//     if (state) query.state = new RegExp(state, 'i')

//     // 🧮 Age Range Filter
//     if (ageRange) {
//       const ranges = {
//         '0-13': { $gte: 0, $lte: 13 },
//         '14-20': { $gte: 14, $lte: 20 },
//         '21-30': { $gte: 21, $lte: 30 },
//         '31-40': { $gte: 31, $lte: 40 },
//         '41-50': { $gte: 41, $lte: 50 },
//         '51-60': { $gte: 51, $lte: 60 },
//         '61-70': { $gte: 61, $lte: 70 },
//         '70+': { $gte: 71 },
//       }

//       if (ranges[ageRange]) query.age = ranges[ageRange]
//     }

//     // 🧾 Pagination
//     const skip = (Number(page) - 1) * Number(limit)
//     const total = await Patient.countDocuments(query)
//     const items = await Patient.find(query)
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(Number(limit))

//     const pages = Math.ceil(total / Number(limit))

//     res.json({ items, total, pages })
//   } catch (err) {
//     res.status(500).json({ message: err.message })
//   }
// })

router.get('/analytics/age', async (req, res) => {
  try {
    const { q, state, ageRange, startDate, endDate, page = 1, limit = 20 } = req.query
    const query = {}

    if (q) {
      query.$or = [
        { name: new RegExp(q, 'i') },
        { phoneNumber: new RegExp(q, 'i') },
        { aadhar: new RegExp(q, 'i') },
        { hospitalNo: new RegExp(q, 'i') },
      ]
    }

    if (state) query.state = new RegExp(state, 'i')

    if (ageRange) {
      const ranges = {
        '0-13': { $gte: 0, $lte: 13 },
        '14-20': { $gte: 14, $lte: 20 },
        '21-30': { $gte: 21, $lte: 30 },
        '31-40': { $gte: 31, $lte: 40 },
        '41-50': { $gte: 41, $lte: 50 },
        '51-60': { $gte: 51, $lte: 60 },
        '61-70': { $gte: 61, $lte: 70 },
        '70+': { $gte: 71 },
      }
      query.age = ranges[ageRange]
    }

    // ⏳ DATE RANGE FILTER
    if (startDate && endDate) {
      const start = new Date(startDate)
      const end = new Date(endDate)
      end.setHours(23, 59, 59)

      query.createdAt = { $gte: start, $lte: end }
    } else if (startDate) {
      const start = new Date(startDate)
      const end = new Date(startDate)
      end.setHours(23, 59, 59)
      query.createdAt = { $gte: start, $lte: end }
    } else if (endDate) {
      const start = new Date(endDate)
      const end = new Date(endDate)
      end.setHours(23, 59, 59)
      query.createdAt = { $gte: start, $lte: end }
    }

    const skip = (Number(page) - 1) * Number(limit)
    const total = await Patient.countDocuments(query)
    const items = await Patient.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))

    res.json({ items, total, pages: Math.ceil(total / Number(limit)) })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})


router.get('/analytics/list', async (req, res) => {
  try {
    const { field, value, page = 1, limit = 20, date } = req.query
    if (!field || !value) {
      return res.status(400).json({ error: 'field and value are required' })
    }

    let query = field === 'age' ? { age: parseInt(value) } : { [field]: value }

    // 🔹 Add date filter if provided
    if (date) {
      const start = new Date(date)
      start.setHours(0,0,0,0)
      const end = new Date(date)
      end.setHours(23,59,59,999)
      query.createdAt = { $gte: start, $lte: end }
    }

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
  const { field = 'state', value, date } = req.query
  let match = {}

  if (value) match[field] = value

  // 🔹 Add date filter
  if (date) {
    const start = new Date(date)
    start.setHours(0,0,0,0)
    const end = new Date(date)
    end.setHours(23,59,59,999)
    match.createdAt = { $gte: start, $lte: end }
  }

  const pipeline = [
    { $match: match },
    { $group: { _id: `$${field}`, count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]
  const summary = await Patient.aggregate(pipeline)
  const total = await Patient.countDocuments(match)
  res.json({ field, total, summary })
})


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
