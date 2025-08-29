// googleSheets.js
import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config();

// Construct credentials object from .env
const credentials = {
  type: process.env.GOOGLE_TYPE,
  project_id: process.env.GOOGLE_PROJECT_ID,
  private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
  private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"), // fix newlines
  client_email: process.env.GOOGLE_CLIENT_EMAIL,
  client_id: process.env.GOOGLE_CLIENT_ID,
  auth_uri: process.env.GOOGLE_AUTH_URI,
  token_uri: process.env.GOOGLE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.GOOGLE_AUTH_PROVIDER_CERT_URL,
  client_x509_cert_url: process.env.GOOGLE_CLIENT_CERT_URL,
  universe_domain: process.env.GOOGLE_UNIVERSE_DOMAIN,
};

// Authenticate with service account
const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

// Create authenticated client
const authClient = await auth.getClient();

// Create Sheets API instance
const sheets = google.sheets({ version: "v4", auth: authClient });

// Your Spreadsheet ID (from sheet URL)
const SPREADSHEET_ID = "1B0MYfNH9WP6zAdmJTznGtRGAzKPJPNfs4MIG29pOrxM";
const RANGE = "Sheet1!A:Z";

// ✅ Append new row
export async function addPatientRow(patient) {
  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: RANGE,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [[
        patient.hospitalNo,
        patient.name,
        patient.age,
        patient.sex,
        patient.fatherOrHusbandName,
        patient.department,
        patient.addressLine,
        patient.state,
        patient.mandalam,
        patient.phoneNumber,
        patient.aadhar,
        patient.maritalStatus,
        patient.occupation,
        patient.income,
        patient.nearestPoliceStation || "",  // ✅ Added police station
        patient.vitals?.bp || "",
        patient.vitals?.pulse || "",
        patient.vitals?.spo2 || "",
        patient.vitals?.heightCm || "",
        patient.vitals?.weightKg || "",
        patient.vitals?.resp || "",
        patient.vitals?.temp || "",
        patient.vitals?.bmi || "",
        
        new Date().toLocaleString(),
      ]],
    },
  });
}

// ✅ Update row (find by hospitalNo)
export async function updatePatientRow(patient) {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: RANGE,
  });

  const rows = res.data.values || [];
  const rowIndex = rows.findIndex(r => r[0] === patient.hospitalNo);

  if (rowIndex === -1) {
    console.log("HospitalNo not found in sheet, appending instead");
    return addPatientRow(patient);
  }

  const updateRange = `Sheet1!A${rowIndex + 1}:X${rowIndex + 1}`; // ✅ extended one column
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: updateRange,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [[
        patient.hospitalNo,
        patient.name,
        patient.age,
        patient.sex,
        patient.fatherOrHusbandName,
        patient.department,
        patient.addressLine,
        patient.state,
        patient.mandalam,
        patient.phoneNumber,
        patient.aadhar,
        patient.maritalStatus,
        patient.occupation,
        patient.income,
        patient.nearestPoliceStation || "",  // ✅ Added police station
        patient.vitals?.bp || "",
        patient.vitals?.pulse || "",
        patient.vitals?.spo2 || "",
        patient.vitals?.heightCm || "",
        patient.vitals?.weightKg || "",
        patient.vitals?.resp || "",
        patient.vitals?.temp || "",
        patient.vitals?.bmi || "",
        
        new Date().toLocaleString(),
      ]],
    },
  });
}
