import express from 'express';
import cors from 'cors';
import { ZodError, z } from 'zod';
import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

// Google Sheets configuration
const g_sheets_client_email = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
const g_sheets_private_key = process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, "\n");

export const SHEET_ID = "13Sq_S52noOgbO3MqNjpHHeLG-rGHW9pQwbFq3Mqa_Bs";
const client = new google.auth.JWT(g_sheets_client_email, null, g_sheets_private_key, [
    'https://www.googleapis.com/auth/spreadsheets'
]);

const sheets = google.sheets({ version: "v4", auth: client });

// Express server setup
const app = express();
app.use(cors());
app.use(express.json());

// Zod schema for contact form validation
const contactFormSchema = z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    email: z.string().email(),
    status: z.string().min(1, { message: 'Message is required' })
});

// Endpoint to handle form submissions
app.post('/send-message', async (req, res) => {
    try {
        const body = contactFormSchema.parse(req.body);
        const rows = Object.values(body);
        
        await sheets.spreadsheets.values.append({
            spreadsheetId: SHEET_ID,
            range: 'Data!A2:C2',
            insertDataOption: 'INSERT_ROWS',
            valueInputOption: 'RAW',
            requestBody: {
                values: [rows],
            }
        });
        
        res.status(200).send("true");
    } catch (error) {
        if (error instanceof ZodError) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});
app.get("/", (req, res) => {
    res.send("Hello from Express on Vercel!");
});
// Start the server
const PORT = process.env.PORT || 6999; // Use environment variable for port or default to 6999
app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`);
});