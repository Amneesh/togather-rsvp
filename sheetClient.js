import {google} from 'googleapis'
import dotenv from 'dotenv';
dotenv.config();


// import  key from "./spiritual-tiger-437707-j0-fe5f14368f44.json";


const g_sheets_client_email = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
const g_sheets_private_key = process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, "\n");

export const SHEET_ID = "13Sq_S52noOgbO3MqNjpHHeLG-rGHW9pQwbFq3Mqa_Bs";
const client = new google.auth.JWT(g_sheets_client_email, null, g_sheets_private_key, [
    'https://www.googleapis.com/auth/spreadsheets'
]);

const sheets = google.sheets({version:"v4", auth:client});

export default sheets;