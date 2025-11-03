import express from 'express';
import Patient from '../models/Patient.js';
import InPatient from '../models/inPatient.js';
import { addInPatientRow } from './googleSheetsInPatient.js';

const router = express.Router();

// 🔹 Get patient by hospital number
router.get('/:hospitalNo', async (req, res) => {
  try {
    const patient = await Patient.findOne({ hospitalNo: req.params.hospitalNo });
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🔹 Add to In-Patient collection
router.post('/', async (req, res) => {
  try {
    const { hospitalNo, ward, bedNo, refDoctor } = req.body;

    const patient = await Patient.findOne({ hospitalNo });
    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    const newInPatient = new InPatient({
      hospitalNo,
      patientId: patient._id,
      ward,
      bedNo,
      refDoctor,
    });

    await newInPatient.save();

    // ✅ Push data to Google Sheets
    await addInPatientRow(newInPatient, patient);

    res.status(201).json({ message: 'In-patient record created & added to Google Sheet', inPatient: newInPatient });
  } catch (error) {
    console.error('Error saving InPatient:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
