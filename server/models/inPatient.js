import mongoose from 'mongoose';

const inPatientSchema = new mongoose.Schema({
  hospitalNo: { type: String, required: true, unique: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  ward: { type: String, required: true },
  bedNo: { type: String, required: true },
  refDoctor: { type: String, required: true },
  admittedAt: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model('InPatient', inPatientSchema);
