import mongoose from 'mongoose';

const vitalsSchema = new mongoose.Schema({
  heightCm: String,
  weightKg: String,
  bp: String,
  pulse: String,
  resp: String,
  temp: String,
  spo2: String,
  bmi: String,
}, { _id: false });

const patientSchema = new mongoose.Schema({
  hospitalNo: { type: String, unique: true }, // like YA00001
  name: { type: String, required: true },
  age: { type: Number, required: true },
  sex: { type: String, enum: ['M','F','O'], required: true },
  fatherOrHusbandName: { type: String, required: true },
  department: { type: String, required: true },
  addressLine: { type: String, required: true },
  state: { type: String, required: true },
  mandalam: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  aadhar: { type: String, required: true },
  maritalStatus: { type: String, enum: ['YES','NO','OTHER'], required: true },
  occupation: { type: String, required: true },
  income: { type: Number, required: true },
  nearestPoliceStation: { type: String, required: true }, // ✅ Added field
  vitals: vitalsSchema,
  registeredAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export default mongoose.model('Patient', patientSchema);
